// src/components/HootDetails/HootDetails.jsx
import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext  } from 'react'
import * as hootService from '../../services/hootService'
import Loading from '../Loading/Loading';
import CommentForm from '../CommentForm/CommentForm';
import { AuthedUserContext } from '../../App';
import { Link } from 'react-router-dom';
import styles from './HootDetails.module.css';

const HootDetails = (props) => {
    const { hootId } = useParams();
    const user = useContext(AuthedUserContext);
    const [hoot, setHoot] = useState(null);
   

    useEffect(() => {
        const fetchHoot = async () => {
          const hootData = await hootService.show(hootId)
          setHoot(hootData)
        }
        fetchHoot()
      }, [hootId])

      const handleAddComment = async (commentFormData) => {
        const newComment = await hootService.createComment(hootId, commentFormData);
        setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
      };
      
      if (!hoot) return <Loading />
    return (
        <main className={styles.container}>
          <section>
             <header>
                <p>{hoot.category.toUpperCase()}</p>
                <h1>{hoot.title}</h1>
                <p>
                  {hoot.author.username} posted on
                  {new Date(hoot.createdAt).toLocaleDateString()}
                </p>
           
                {hoot.author._id === user._id && (
                  <>
                   <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
                    <button onClick={() => props.handleDeleteHoot(hootId)}>Delete</button>

                  </>
                )}
              </header>
               <p>{hoot.text}</p>
           </section>
           
      
 
              <h2>Comments</h2>
               <CommentForm handleAddComment={handleAddComment} />
                {!hoot.comments.length && <p>There are no comments.</p>}
                {hoot.comments.map(comment => (

                <article key={comment._id}>
                <header>
                  <div>
                    <p>
                      {comment.author.username} posted on
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                    {comment.author._id === user._id && (
                      <>
                        <Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>Edit</Link>
                        <button onClick={() => handleDeleteComment(comment._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </header>
                <p>{comment.text}</p>
                </article>
                ))}
       
        </main>
    );
  };
  
  export default HootDetails;