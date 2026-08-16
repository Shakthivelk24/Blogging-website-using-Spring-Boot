import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  userDataContext
} from "../context/DataContext.jsx";

import axios from "axios";

import UserPost from "../components/UserPost";


export default function MyPost() {

  const {
    serverUrl
  } = useContext(userDataContext);

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // FETCH USER POSTS
  // ========================================

  useEffect(() => {

    // No server URL
    if (!serverUrl) {

      setLoading(false);

      return;
    }


    const fetchUserPosts = async () => {

      try {

        setLoading(true);

        const res = await axios.get(
          `${serverUrl}/api/posts/user`,
          {
            withCredentials: true
          }
        );

        setPosts(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (error) {

        console.log(
          "Error loading user posts:",
          error.response?.data ||
          error.message
        );

        setPosts([]);

      } finally {

        setLoading(false);

      }
    };


    fetchUserPosts();

  }, [serverUrl]);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <p className="text-center mt-5">
        Loading...
      </p>
    );

  }


  // ========================================
  // POSTS
  // ========================================

  return (

    <div className="p-5">

      {posts.length > 0 ? (

        posts.map((post) => (

          <UserPost
            key={post.id}
            post={post}
            setPost={setPosts}
          />

        ))

      ) : (

        <p className="text-center">
          No posts found.
        </p>

      )}

    </div>

  );
}