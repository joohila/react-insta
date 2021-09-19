import React, { useState } from "react";
import { Button, LinearProgress } from "@material-ui/core";
import { db, storage } from "../firebase";
import firebase from "firebase";
import "./ImageUpload.css";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
// import PublishIcon from '@material-ui/icons/Publish';


const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(false);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        // const progress = Math.round(
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // );
        // setProgress(progress);
        setProgress(true);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
          });
        setProgress(false);
        setCaption("");
        setImage(null);
      }
    );
  };

  return (
    <>
      <div className="imageupload">
        {/* <progress className="imageupload_progress" value={progress} max="100"/> */}
        {/* <input className="imageupload_input"
          type="text"
          placeholder="Enter a caption..."
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        /> */}
        <div className="imageupload_Box">
        {progress && <LinearProgress  />}
        <TextField className="imageupload_input" color="secondary" style={{ color: '#00a8a8' }}
          id="standard-multiline-flexible"
          label="Start Posting..."
          multiline
          maxRows={4}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
        <Button className="imageupload_button" component="label">
        <input  type="file" hidden onChange={handleChange} />
        {image?(<AddAPhotoIcon style={{ color: '#00a8a8'}}/>):(<AddAPhotoIcon style={{ color:'lightgray'}}/>)} 
        {/* &nbsp;{image?image.name:('Choose Photo')} &nbsp;  */}
        </Button>
        <Button  disabled={!image} className="imageupload_button" onClick={handleUpload}>
          {image?(<SendIcon style={{ color: '#00a8a8' }} />):(<SendIcon />)}
        </Button>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
