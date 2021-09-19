import React, { useState, useEffect } from "react";
import "./post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase";
import ThreadComments from "./ThreadComments";
import PostComment from './PostComment';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import Button from "@material-ui/core/Button";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress'

const Post = ({ postId,user,userName, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState(null);
  const [addCommentBox, setAddCommentBox] = useState(false);

  const [loading,setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuopen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePostDelete=()=>{
    db.collection('posts').doc(postId).delete();
  }

  const deleteComment=(id)=>{
    db.collection('posts').doc(postId).collection("comments").doc(id).delete();
  }
  useEffect(() => {
    let unsubscribe;
    setLoading(true)
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','asc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => ({ id: doc.id, comment: doc.data() })));
          setLoading(false)
        });  

    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
      event.preventDefault();
      setLoading(true)
      db.collection('posts').doc(postId).collection("comments").add({
          text:comment,
          username:user.displayName,
          timestamp:firebase.firestore.FieldValue.serverTimestamp()
      })
      setLoading(false)
      setComment('');
  };

  
  const postThreadComment = (event) => {
    event.preventDefault();
    setLoading(true)
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .collection("comment_thread")
      .add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setLoading(false)
    setComment("");
    setCommentId(null);
  };

  return (
    <div className="post">
       {loading && <CircularProgress className="spinner" color="secondary"/>}
      <div className="post_header">
        {/* <div className="post_userInfo"> */}
        <Avatar className="post_avatar" alt="username" src={imageUrl} />
        <h3 className="post_userInfo">{userName}</h3>
        {/* </div> */}
        {user && (<IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
        >
        <MoreVertIcon />
        </IconButton>)}
        <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={menuopen}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: '30ch',
            width: '20ch',
          },
        }}
      >
       { user?.displayName==userName?(<MenuItem  onClick={handlePostDelete}>
           Delete
        </MenuItem>):null}
        <MenuItem  >
           Report
        </MenuItem>
        </Menu>
      </div>
      <img className="post_image" src={imageUrl} alt={'DP'} />
      <h4 className="post_captiontext">
        <strong>{userName} </strong> {caption}
      </h4>
      {comments?.length>0 && (
      <h4 className="post_viewComments" >
       View Comments
      </h4>)
      }

      <div >
        {comments.map(({id, comment }) => {
         return (<div key={id}>
          <div className="post_commenttxtBox">
         <p className="post_commenttext">
            <strong>{comment.username} </strong>
            {comment.text}
          </p>
          {user && (<Button className="post_mesgbutton" onClick={()=>{setCommentId(id);setAddCommentBox(!addCommentBox)}}><ModeCommentIcon/></Button>)}
          {user?.displayName==comment.username && (<Button className="post_mesgbutton" onClick={()=>deleteComment(id)}><DeleteIcon/></Button>)}  
          </div>
          <ThreadComments postId={postId} commentId={id} user={user} postComment={postComment}/>
          </div>);
        })}
      </div>
        
     {user && (!addCommentBox ? (<PostComment comment={comment} setComment={setComment} postComment={postComment} placeholder='Add Comment...' post="Post"/>)
     : (<PostComment comment={comment} setComment={setComment} postComment={postThreadComment} placeholder='Reply...' post="Reply"/>) 
     )}
    </div>
  );
};

//firabase machine learning , plugin

export default Post;
