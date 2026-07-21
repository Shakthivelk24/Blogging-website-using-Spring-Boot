import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import IndexPage from "./pages/IndexPage";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
