"use client";
import { useState, use } from 'react'; // <--- 'use' import kiya
import { useRouter } from 'next/navigation';
import SignPad from '@/components/SignPad';

export default function SignPage({ params }) {
  // FIX: Next.js 15 me params ek Promise hai, isliye 'use()' se unwrap karna padega
  const { id } = use(params); 
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSignatureSave = async (signatureData) => {
    setLoading(true);
    try {
      console.log("Sending ID:", id); // Debugging ke liye check karein

      const res = await fetch('/api/save-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: id, signatureData }), // <--- Ab sahi ID jayegi
      });
      
      const data = await res.json();

      if (data.success) {
        setSigned(true);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Network Error saving signature");
    }
    setLoading(false);
  };

  if (signed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-4">
        <h1 className="text-4xl text-neonBlue mb-4">Success!</h1>
        <p className="text-xl">Document Signed & Secured.</p>
        <p className="text-gray-500 mt-2">You can close this window now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 cyber-bg">
      
      {/* Branding */}
      <div className="mb-8 text-center">
        <h2 className="text-gray-400 text-sm tracking-widest uppercase">Requested by</h2>
        <h1 className="text-2xl font-bold text-white">DevSamp Agency</h1>
      </div>

      {/* Contract Container */}
      <div className="w-full max-w-lg glass-card p-1 rounded-2xl overflow-hidden relative">
        <div className="bg-white/5 p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-2">Digital Signature Required</h2>
          <p className="text-gray-400 text-sm">
            ID: <span className="font-mono text-neonPurple">{id}</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Please sign below to accept the agreement. This signature will be securely recorded.
          </p>
        </div>

        {/* Signature Pad */}
        <div className="p-6 bg-[#0a0a0a]">
          {loading ? (
            <div className="text-center py-10 text-neonPurple animate-pulse">
              Securing Signature...
            </div>
          ) : (
            <SignPad onSave={handleSignatureSave} />
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-600">
        Powered by DevSamp Secure Sign
      </p>
    </div>
  );
}