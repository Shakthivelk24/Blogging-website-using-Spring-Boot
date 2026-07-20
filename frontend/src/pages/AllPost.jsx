import { useState, useEffect, useContext } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import Post from "../components/Post";

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(userDataContext);
  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${serverUrl}`,
        );
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching all posts:", error.message);
      }
    };
   
      fetchAllPosts();
  }, [serverUrl]);
    

  return (
    <>
      {loading ? (
        <p className="no-posts text-center mt-2">Loading...</p>
      ) : !posts || posts.length === 0 ? (
        <p className="no-posts text-center mt-2">No posts</p>
      ) : (
        posts.map((post) => <Post key={post._id} Post={post} />)
      )}
    </>
  );
}