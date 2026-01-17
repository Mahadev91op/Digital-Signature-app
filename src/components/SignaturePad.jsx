// path: components/SignaturePad.jsx
"use client"; // Bahut Important
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ onEnd }) => {
  const sigCanvas = useRef({});

  const clear = () => sigCanvas.current.clear();
  
  const save = () => {
    // Image data parent component ko bhejo
    onEnd(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
  };

  return (
    <div className="border border-neonBlue p-4 rounded bg-white">
      <SignatureCanvas 
        ref={sigCanvas}
        penColor="black"
        canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} 
      />
      <div className="flex gap-2 mt-2">
         <button onClick={clear} className="text-red-500 text-sm">Clear</button>
         <button onClick={save} className="text-green-500 font-bold text-sm">Save Signature</button>
      </div>
    </div>
  );
};

export default SignaturePad;