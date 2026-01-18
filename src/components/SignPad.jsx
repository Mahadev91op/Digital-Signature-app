"use client";
import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function SignPad({ onSave }) {
  const sigRef = useRef({});
  const [isEmpty, setIsEmpty] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clear = () => {
    sigRef.current.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigRef.current.isEmpty()) return alert("Please sign first!");
    // Black signature, transparent background PNG
    const data = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
    onSave(data);
  };

  if (!isMounted) return <div className="text-white animate-pulse">Loading Signature Pad...</div>;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Canvas Area with White Background for contrast */}
      <div className="border-2 border-dashed border-gray-600 rounded-xl bg-white w-full max-w-lg overflow-hidden relative">
        <SignatureCanvas 
          ref={sigRef}
          // CHANGE: penColor ko 'black' kar diya gaya hai
          penColor="black" 
          // Optional: Thoda mota pen chahiye to minWidth/maxWidth use karein
          minWidth={1.5}
          maxWidth={3.5}
          onBegin={() => setIsEmpty(false)}
          // Canvas ka background white rakha hai taki black ink dikhe
          canvasProps={{ className: 'w-full h-64 cursor-crosshair bg-white' }} 
        />
        {isEmpty && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none font-sans">
                Sign Here (Black Ink)
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
          className="px-8 py-2 rounded-full bg-gradient-to-r from-neonPurple to-neonBlue text-black font-bold hover:scale-105 transition-all shadow-lg"
        >
          Submit Signature
        </button>
      </div>
    </div>
  );
}