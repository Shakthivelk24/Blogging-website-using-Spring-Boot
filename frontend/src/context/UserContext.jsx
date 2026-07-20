import { useState } from "react";
import { userDataContext } from "./DataContext";



function UserContext({ children }) {
  const serverUrl = "http://localhost:8083/api/posts";
  const [post, setPost] = useState(null);
  const value = {
    serverUrl,
    post,
    setPost,
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;