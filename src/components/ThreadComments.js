import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import "./ThreadComments.css";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress'
// import EditIcon from '@material-ui/icons/Edit';


const ThreadComments = ({ postId, commentId, user }) => {
  const [threadComments, setthreadComments] = useState([]);
  const [loading,setLoading] = useState(false);

  const deleteComment=(id)=>{
    db.collection('posts').doc(postId).collection("comments").
    doc(commentId).collection("comment_thread").doc(id).delete();
  }

  // const editComment=(id,comment)=>{
  //   db.collection('posts').doc(postId).collection("comments").
  //   doc(commentId).collection("comment_thread").doc(id).update(comment);
  // }

  useEffect(() => {
    let unsubscribe;
    setLoading(true)
    if (commentId && postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId)
        .collection("comment_thread")
        .orderBy('timestamp','asc')
        .onSnapshot((snapshot) => {
          setthreadComments(
            snapshot.docs.map((doc) => ({ id: doc.id, comment: doc.data() }))
          );
          setLoading(false)
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId, commentId]);


  return (
    <div >
      {loading && <CircularProgress className="spinner" color="secondary"/>}

      {threadComments.map(({ id, comment }) => {
        return (
          <div key={id} className="post_threadcommentBox">
          <p  className="post_threadcommenttext">
            <strong>{comment.username} </strong>
            {comment.text} 
          </p>
          {user?.displayName==comment.username && 
          (<>
          <Button className="post_mesgbutton" onClick={()=>deleteComment(id)}><DeleteIcon/></Button>
          {/* <Button className="post_mesgbutton" onClick={()=>editComment(id,comment)}><EditIcon/></Button>
   */}
          </>)}  
   
          </div>
        );
      })}

    </div>
  );
};

export default ThreadComments;
