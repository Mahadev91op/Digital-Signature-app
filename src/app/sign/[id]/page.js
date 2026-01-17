"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignPad from '@/components/SignPad';

export default function SignPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignatureSave = async (signatureData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/save-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: params.id, signatureData }),
      });
      
      if (res.ok) {
        alert("Document Signed Successfully! (Legal Audit Saved)");
        router.push('/'); // Wapis home page par bhejo
        router.refresh();
      }
    } catch (error) {
      alert("Error saving signature");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-darkBg to-black">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Review & Sign</h1>
        <p className="text-neonBlue">DevSamp Secure Document ID: {params.id}</p>
      </div>

      {/* Contract Area (Mock PDF) */}
      <div className="w-full max-w-3xl bg-white text-black p-8 rounded shadow-2xl mb-8 min-h-[300px] opacity-90">
        <h2 className="text-2xl font-bold border-b pb-4 mb-4">Service Agreement</h2>
        <p className="mb-4">This agreement is between <span className="font-bold">DevSamp Agency</span> and the Client.</p>
        <p className="text-gray-600 text-sm mb-10">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
        
        <div className="p-4 bg-gray-100 border border-gray-300 rounded text-xs text-gray-500">
          By signing below, you agree to the Terms & Conditions and acknowledge that this digital signature is legally binding.
        </div>
      </div>

      {/* Signature Component */}
      {loading ? (
        <p className="text-neonPurple animate-pulse">Encrypting & Saving Signature...</p>
      ) : (
        <SignPad onSave={handleSignatureSave} />
      )}

    </div>
  );
}