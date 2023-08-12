import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const cat = useLocation().search;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/posts${cat}`);

        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
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
          await axios.delete(`/posts/${postId}`).then((response) => {
            setPosts(response.data)
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            navigate("/dashboard");
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard">
      {/* <h2>Blog Posts</h2> */}
      <table>
        <thead>
          <tr>
            <th>NO</th>
            <th>Title</th>
            <th>Image</th>
            <th>Category</th>
            <th>Published Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr
              key={post._id}
              onClick={(event) => {
                if (
                  !event.target.classList.contains("editButton") &&
                  !event.target.classList.contains("deleteButton")
                ) {
                  navigate(`/post/${post._id}`);
                }
              }}>
              <td>{index + 1}</td>
              {/* <Link className="link" to={`/post/${post._id}`}> */}
              <td>{post.title}</td>
              {/* </Link> */}

              <td>
                <img
                  style={{ width: "40px", height: "40px" }}
                  src={`../upload/${post?.img}`}
                  alt=""
                />
              </td>
              <td>{post.cat}</td>
              <td>{moment(post.createdAt).format("MMMM Do YYYY")} </td>
              <td>
                <Link to={`/write?edit=2`} state={post}>
                  <button className="editButton">Edit</button>
                </Link>
                <button className="deleteButton" onClick={() => handleDelete(post._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
