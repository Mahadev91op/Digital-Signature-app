"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      setError("Invalid Credentials!");
    } else {
      router.push("/"); // Success hone par Dashboard par bhejo
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-4">
      <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-[0_0_50px_rgba(0,229,255,0.1)]">
        <h1 className="text-3xl font-bold text-center mb-6">
          DEV<span className="text-[#00E5FF]">SAMP</span> Admin
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-4 bg-black rounded-xl border border-gray-700 outline-none focus:border-[#00E5FF]"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 bg-black rounded-xl border border-gray-700 outline-none focus:border-[#00E5FF]"
          />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button className="bg-[#00E5FF] text-black font-bold p-4 rounded-xl mt-2 hover:bg-[#00cce6] transition-colors">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}