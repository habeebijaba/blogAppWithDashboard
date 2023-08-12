import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const cat = useLocation().search;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts${cat}`);
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [cat]);

  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post._id}>
            <div className="img">
              <img src={`../upload/${post?.img}`} alt="" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post._id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>
                {post?.author?.username} "{post.title}" on{" "}
                {moment(post.createdAt).format("MMMM Do YYYY")}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (💬₂.₂₄<sub>k</sub>)
              </p>
              {/* <p>{post.desc}</p>   */}
              <div className="limited-rows" dangerouslySetInnerHTML={{ __html: post.desc }}></div>

              <Link className="link" to={`/post/${post._id}`}>
                <button>Read more</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
