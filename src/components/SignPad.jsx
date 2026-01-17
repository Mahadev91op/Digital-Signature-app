"use client";
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function SignPad({ onSave }) {
  const sigRef = useRef({});
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigRef.current.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigRef.current.isEmpty()) return alert("Please sign first!");
    // Convert signature to Image URL
    const data = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
    onSave(data);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Canvas Area */}
      <div className="border-2 border-dashed border-gray-600 rounded-xl bg-white/5 w-full max-w-lg overflow-hidden relative">
        <SignatureCanvas 
          ref={sigRef}
          penColor="#00E5FF" // Neon Blue Pen
          onBegin={() => setIsEmpty(false)}
          canvasProps={{ className: 'w-full h-64 cursor-crosshair' }} 
        />
        {isEmpty && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                Draw Signature Here
            </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={clear} className="px-6 py-2 rounded-full text-gray-400 hover:text-white border border-transparent hover:border-white transition-all">
          Clear
        </button>
        <button 
          onClick={save} 
          className="px-8 py-2 rounded-full bg-gradient-to-r from-neonPurple to-neonBlue text-black font-bold hover:scale-105 hover-neon transition-all"
        >
          Sign Document
        </button>
      </div>
    </div>
  );
}