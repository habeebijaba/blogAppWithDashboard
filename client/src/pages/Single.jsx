import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Edit from "../images/edit.png";
import Delete from "../images/delete.png";
import Avatar from "../images/avatar1.png";
import Badge from "../images/quality.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import Menu from "../components/Menu";
import { AuthContext } from "../context/authContext";
import Swal from "sweetalert2";

const Single = () => {
  const [post, setPost] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser?._id;

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post ? post.comments : []);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post?.likes?.includes(userId));
  const likeCount = post?.likes?.length || 0;
  const commentCount = post?.comments?.length || 0;

  const toggleLike = async () => {
    try {
      const res = await axios.patch(`/posts/${postId}/like`, { userId });
      setPost(res.data);
      setLiked(!liked);
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    try {
      const response = await axios.patch(`/posts/${postId}/comment`, {
        comment,
        userId,
      });
      setComment("");
      setComments([...comments, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
        setComments(res.data.comments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`/posts/${postId}`).then(() => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            navigate("/");
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="single">
      <div className="content">
        <img className="content_image" src={`../upload/${post?.img}`} alt="" />
        <div className="user">
          <img className="profileimg" src={Avatar} alt="" />
          <div className="info">
            <span>
              {post?.author?.username}{" "}
              <img className="badge" src={Badge} alt="" />{" "}
            </span>
            <p>posted {moment(post?.createdAt).fromNow()}</p>
          </div>
          {currentUser?.username === post?.author?.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post?.title} </h1>
        {/* <p>{post.desc}</p> */}
        <div dangerouslySetInnerHTML={{ __html: post?.desc }}></div>
        <div className="interactions">
          <div className="buttons">
            <button onClick={toggleLike}>
              <FontAwesomeIcon
                icon={faHeart}
                style={{ color: liked ? "red" : "black" }}
              />
            </button>
            <span>{likeCount} likes</span>
            <button onClick={() => setShowComments(!showComments)}>
              <FontAwesomeIcon icon={faComment} />
            </button>
            <span>{commentCount} comments</span>

            {/* <button>
              <FontAwesomeIcon icon={faShare} />
            </button> */}
          </div>
          {showComments && (
            <div className="commentsSection">
              <div className="commentactions">
                <img className="profileimg" src={Avatar} alt="" />
                <input
                  className="commentInput"
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="commentButton" onClick={addComment}>
                  Comment
                </button>
              </div>
              <div className="existingComments">
                {comments.map((comment) => (
                  <div key={comment?._id} className="mapdiv">
                    <div className="details">
                      <div className="userDetails">
                        <img className="profileimg" src={Avatar} alt="" />
                        <span className="commentUser">
                          {comment?.author?.username}
                        </span>
                      </div>
                      <p> {moment(comment?.createdAt).fromNow()}</p>
                    </div>
                    <p className="commentContent">{comment?.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Menu postId={postId} />
    </div>
  );
};

export default Single;
