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
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchUserPosts = async () => {

      try {

        setLoading(true);

        const res = await axios.get(
          `${serverUrl}/api/posts/user`,
          {
            withCredentials: true
          }
        );

        setPosts(res.data);

      } catch (error) {

        console.log(
          "Error loading user posts:",
          error.response?.data ||
          error.message
        );

      } finally {

        setLoading(false);
      }
    };


    fetchUserPosts();

  }, [serverUrl]);


  if (loading) {

    return (
      <p className="text-center mt-5">
        Loading...
      </p>
    );
  }


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