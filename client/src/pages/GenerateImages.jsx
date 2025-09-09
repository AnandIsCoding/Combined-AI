import React, { useState } from "react";
import { Hash, Image, Sparkles, Download } from "lucide-react"; // added Download icon
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function GenerateImages() {
  const imageStyle = [
    "Realistic",
    "Anime style",
    "Ghibli style",
    "Cartoon",
    "3D render",
    "Pixel art",
    "Line art",
    "Low poly",
    "Isometric",
    "Vector art",
  ];

  const [selectedStyle, setSelectedstyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post(
        "/ai/generate-image",
        { prompt, publish },
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

  // handle download
  // ...
const handleDownload = async () => {
  try {
    // Fetch the image as a blob
    const response = await fetch(content, {
      mode: "cors", // ensure CORS if needed
    });
    const blob = await response.blob();

    // Create a local URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-generated-image.png"; // filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the URL after download
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed: ", err);
  }
};

  return (
    <div className="h-full overflow-y-scroll p-6 w-full flex items-start flex-wrap gap-4 text-slate-700">
      {/* left column */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3 ">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>
        {/* topic */}
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Describe what you want to see in the image"
          rows={4}
          required
          className="w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
        />

        <p className="mt-6 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {imageStyle?.map((item, index) => (
            <span
              onClick={() => setSelectedstyle(item)}
              key={index}
              className={`text-xs px-4 py-1 capitalize border rounded-full cursor-pointer ${
                item === selectedStyle
                  ? "bg-green-50 text-green-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* publishing */}
        <div className="my-6 flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="
        relative w-10 h-5 rounded-full bg-slate-300 
        transition-colors
        peer-focus:ring-4 peer-focus:ring-green-100
        peer-checked:bg-green-500
        after:content-[''] after:absolute after:top-0.5 after:left-0.5
        after:w-4 after:h-4 after:rounded-full after:bg-white
        after:transition-transform
        peer-checked:after:translate-x-5
      "
            />
          </label>
          <p className="text-sm">Make this image Public</p>
        </div>

        {/* generate btn */}
        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-[#00AD25] to-[#94FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* right column */}
      <div className="w-full mb-14 md:mb-0 max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {/* actual response */}
        {!content ? (
          <div className="flex-1 flex justify-center items-center gap-5 text-gray-400">
            <Image className="w-9 h-9" />
            <p>Enter a prompt and click "Generate Image" to get started</p>
          </div>
        ) : (
          <div className="mt-3 flex flex-col h-full">
            <img
              src={content}
              alt="ai_generated_image"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleDownload}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-green-600 to-green-400 text-white text-sm rounded-lg hover:opacity-90 transition"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateImages;
