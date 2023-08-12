import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Menu = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/posts");
        const filteredPosts = res.data.filter(
          (post) => post._id !== props.postId
        );
        setPosts(filteredPosts.slice(0, 5));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [props.postId]);

  return (
    <div className="menu">
      {posts.length > 0 && <h1>Other posts you may like</h1>}
      {posts.map((post) => (
        <div className="post" key={post._id}>
          <img src={`../upload/${post?.img}`} alt="" />
          <Link className="link" to={`/post/${post._id}`}>
            <h2>{post.title}</h2>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;
