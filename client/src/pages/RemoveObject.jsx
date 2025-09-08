import React, { useState } from "react";
import { Sparkles, Scissors } from "lucide-react";

function RemoveObject() {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
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
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        {/* topic */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          value={input}
          type="file"
          accept="image/*"
          required
          className="w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
        />

        <p className="text-xs textgray-500 font-light mt-1">
          Supports JPG, PNG and othser image formats
        </p>

        <p className="mt-6 text-sm font-medium">
          Descript bbject name to Remove
        </p>

        {/* object */}
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          type="text"
          placeholder="e.g. Remove the person on the left"
          rows={4}
          required
          className="w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
        />

        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <Scissors className="w-5" />
          Remove Object
        </button>
      </form>

      {/* right column */}
      <div className="w-full mb-14 md:mb-0 max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {/* actual response */}
        <div className="flex-1 flex justify-center items-center gap-5 text-gray-400">
          <Scissors className="w-9 h-9" />
          <p>
            Upload an image, Describe object to remove than click "Remove
            Object" to get started
          </p>
        </div>
      </div>
    </div>
  );
}

export default RemoveObject;
