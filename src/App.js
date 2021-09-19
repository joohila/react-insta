import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import "./App.css";
import Post from "./components/Post";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Button, Input } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";
import CircularProgress from '@material-ui/core/CircularProgress'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [openSignIn, setOpenSignIn] = useState(false);
  const [lastpost,setLastPost]=useState();

  const [loading,setLoading] = useState(false);
  const [isfetchCollectionEmpty,setIsFetchCollectionEmpty] = useState(false)

  const fetchPosts = () => {
      setLoading(true)
      const unsubscribe = db
        .collection("posts")
        .orderBy("timestamp", "desc")
        .startAfter(lastpost)
        .limit(5).get().then((documentSnapshots) => {
        if(documentSnapshots.size == 0){
          setIsFetchCollectionEmpty(true);
          setLoading(false);
        }
        else{
        const newPosts = documentSnapshots.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        setPosts([...posts, ...newPosts]);
        setLoading(false);
        var lastVisible =documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastPost(lastVisible)
        }    
        });

    return () => {
      unsubscribe();
    };

  };

  // const handleScroll = () => {
  //   let userScrollHeight = window.innerHeight + window.scrollY;
  //   let windowBottomHeight = document.documentElement.offsetHeight;
  //   if (userScrollHeight >= windowBottomHeight) {
  //     fetchPosts();
  //   }
  // };

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message)); //backend email validation provided
    setOpen(false);
    setOpenSignIn(open);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  const classes = useStyles();

  useEffect(() => {
    //listener
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //it is preserved even when user refreshes session tokken / csrf for cookies
        //user loggin in
        setUser(authUser);
      } else {
        //user logged out
        setUser(null);
      }
    });

    return () => {
      //clean up before refire useeffect
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    //  db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
    //   setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))); //doc.id for doc id
    // });
    setLoading(true)
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .limit(5).get().then((snapshots) => {
      setPosts(snapshots.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
      setLoading(false)
      setLastPost(snapshots.docs[snapshots.docs.length - 1]);
      //console.log("value", lastpost,snapshots.docs[snapshots.docs.length - 1]);
    });
  }, []);

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll); 
  //   return ()=>{
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, []);

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              ></img>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              {" "}
              Sign Up{" "}
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              ></img>
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              {" "}
              Sign IN{" "}
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        ></img>

        {user ? (
          <Button onClick={() => auth.signOut()}> LogOut </Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
            <Button onClick={() => setOpen(true)}> Sign Up </Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        {loading && <CircularProgress className="spinner" color="secondary"/>}
        {posts.map(({ id, post }) => {
          return (
            <Post
              key={id}
              postId={id}
              user={user}
              userName={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          );
        })}
        
        {(!loading && !isfetchCollectionEmpty ) && (<Button onClick={fetchPosts} style={{color:"lightgray"}}> Load more </Button>)}
        {isfetchCollectionEmpty && <h3 style={{color:"lightgray",paddingBottom:'5px'}}>No more new posts</h3>}
        {user?.displayName ? (
          <div className="app_uploadposts">
            <ImageUpload username={user.displayName} />
          </div>
        ) : (
          <div className="app_uploadposts">
            {" "}
            <h3>Login to start posting</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
