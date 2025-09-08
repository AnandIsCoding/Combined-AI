import { Edit, Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function BlogTitle() {
  const blogCategories = [
    "General",
    "technology",
    "health",
    "finance",
    "travel",
    "food",
    "lifestyle",
    "education",
    "entertainment",
    "sports",
  ];

  const [selectedCategory, setSelectedcategory] = useState("General");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;
      const { data } = await axios.post("/ai/generate-blog-title", {prompt}, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data?.success) {
        setContent(data?.content);
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log('Error is --> ',error)
      toast.error(error?.response.data.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 w-full flex items-start flex-wrap gap-4 text-slate-700">
      {/* left column1 */}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4  bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3 ">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Blog Title Generator</h1>
        </div>
        {/* topic */}
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Enter Keyword"
          required
          className="w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
        />

        <p className="mt-6 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories?.map((item, index) => (
            <span
              onClick={() => setSelectedcategory(item)}
              key={index}
              className={`text-xs px-4 py-1 capitalize border rounded-full cursor-pointer ${item === selectedCategory ? "bg-blue-50 text-blue-700" : "text-gray-500 border-gray-300"}`}
            >
              {item}
            </span>
          ))}
        </div>

        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Blog Titles
        </button>
      </form>

      {/* right column */}
      <div className="w-full mb-14 md:mb-0 max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated Blog Titles</h1>
        </div>

        {/* content */}
        {!content ? (
          <div className="flex-1 flex justify-center items-center gap-5 text-gray-400">
            <Hash className="w-9 h-9" />
            <p>Enter a topic and click "generate article" to get started</p>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}

        {/* actual response */}
      </div>
    </div>
  );
}

export default BlogTitle;
