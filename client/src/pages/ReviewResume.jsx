import React, { useState } from "react";
import { Sparkles, FileText } from "lucide-react";

function ReviewResume() {
  const [input, setInput] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="h-full overflow-y-scroll p-6 w-full flex items-start flex-wrap gap-4 text-slate-700">
      {/* left column1 */}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4  bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3 ">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Review Resume</h1>
        </div>
        {/* topic */}
        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          value={input}
          type="file"
          accept="application/pdf"
          required
          className="w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
        />

        <p className="text-sm mt-2 text-gray-500">
          Supports pdf format only
        </p>

        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <FileText className="w-5" />
          Review Resume
        </button>
      </form>

      {/* right column */}
      <div className="w-full mb-14 md:mb-0 max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Analysis Result</h1>
        </div>

        {/* actual response */}
        <div className="flex-1 flex justify-center items-center gap-5 text-gray-400">
          <FileText className="w-9 h-9" />
          <p>Upload your resume in pdf format and click "Review Resume" to get started</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewResume;
