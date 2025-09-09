import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import WriteArticle from "./pages/WriteArticle";
import RemoveBackground from "./pages/RemoveBackground";
import Layout from "./pages/Layout";
import ReviewResume from "./pages/ReviewResume";
import BlogTitle from "./pages/BlogTitle";
import GenerateImages from "./pages/GenerateImages";
import Home from "./pages/Home";
import RemoveObject from "./pages/RemoveObject";
import Community from "./pages/Community";

import { useAuth } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="blog-title" element={<BlogTitle />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
