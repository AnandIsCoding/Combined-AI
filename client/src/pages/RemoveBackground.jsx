import React, { useState } from "react";
import { Sparkles, Hash, Eraser } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
import { useAuth } from "@clerk/clerk-react";

function RemoveBackground() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input);
      const { data } = await axios.post(
        "/ai/remove-image-background",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data?.success) {
        setContent(data?.content);
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Error is --> ", error);
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
          <h1 className="text-xl font-semibold">Background Remover</h1>
        </div>
        {/* topic */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          required
          className="w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
        />

        <p className="text-sm mt-2 text-gray-500">
          Supports JPG, PNG and othser image formats
        </p>

        <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>

      {/* right column */}
      <div className="w-full mb-14 md:mb-0 max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {/* actual response */}
        {!content ? (
          <div className="flex-1 flex justify-center items-center gap-5 text-gray-400">
            <Eraser className="w-9 h-9" />
            <p>Upload an image and click "Remove Background" to get started</p>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img
              src={content}
              alt="RemovedBackgroundImage"
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RemoveBackground;
