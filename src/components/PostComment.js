import React from 'react'

const PostComment = ({comment,setComment,postComment,placeholder,post}) => {
    return (
        <div>
            <form className="post_commentBox">
        <input
          className="post_input"
          type="text"
          placeholder={placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="post_button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
         {post}
        </button>
      </form>
        </div>
    )
}

export default PostComment
