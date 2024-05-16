import Footer from "./components/footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Blogs from "./pages/blogs";
import Forum from "./module/forum";
import Blog from "./pages/blog";
import PrivacyPolicy from "./pages/privacy";
import Terms from "./pages/terms";
import ScrollToTop from "./components/scrollToTop";
import NotFound from "./pages/notFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/landing" element={<Home />} />
        <Route exact path="/landing/blogs" element={<Blogs />} />
        <Route exact path="/landing/forum/*" element={<Forum />} />
        <Route exact path="/landing/blogs/:id" element={<Blog />} />
        <Route
          exact
          path="/landing/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route exact path="/landing/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default App;
