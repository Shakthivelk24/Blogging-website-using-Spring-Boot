import { useState } from "react";
import { userDataContext } from "./DataContext";
import { useEffect } from "react";
import axios from "axios";



function UserContext({ children }) {
  const serverUrl = "";
  const [post, setPost] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      setLoadingUser(false);
      console.log("Current User Data:", result.data);
    } catch (error) {
      console.error("Error fetching current user data:", error);
      setLoadingUser(false);
    }
  };
  useEffect(() => {
    handleCurrentUser();
  }, []);
  
  const value = {
    serverUrl,
    post,
    setPost,
    userData,
    setUserData,
    loadingUser,
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