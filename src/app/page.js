"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from "next-auth/react"; // Logout ke liye import

// --- PROFESSIONAL ICONS ---
const Icons = {
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Link: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Left: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Right: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
};

export default function AdminDashboard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form States
  const [clientName, setClientName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // Pagination & Search
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  // Auto Refresh
  useEffect(() => {
    fetchDocs();
    const interval = setInterval(() => fetchDocs(true), 5000);
    return () => clearInterval(interval);
  }, [page, search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchDocs();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchDocs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/get-docs?page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setDocs(data.docs);
        setTotalPages(data.pagination.totalPages);
        setTotalDocs(data.pagination.totalDocs);
      }
    } catch (error) { console.error(error); }
    if (!silent) setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!clientName || !projectTitle) return alert("Please fill in all fields.");
    setCreating(true);
    try {
      await fetch('/api/create-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: projectTitle, clientName }),
      });
      setClientName('');
      setProjectTitle('');
      fetchDocs();
      setShowCreateModal(false);
      alert("Document created!");
    } catch (error) { alert("Error creating document."); }
    setCreating(false);
  };

  // --- ROBUST COPY LINK FUNCTION ---
  const copyLink = (id) => {
    const url = `${window.location.origin}/sign/${id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => alert("Link Copied!"))
        .catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert("Link Copied!");
    } catch (err) {
      prompt("Copy this link manually:", text);
    }
    document.body.removeChild(textArea);
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this document permanently?")) return;
    try {
        await fetch('/api/delete-doc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchDocs();
    } catch(e) { alert("Failed to delete."); }
  };

  const handleReset = async (id) => {
    if(!confirm("Reset signature status to Pending?")) return;
    try {
        await fetch('/api/reset-doc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchDocs();
    } catch(e) { alert("Failed to reset."); }
  };

  const downloadSignature = () => {
    if (!selectedDoc?.signatureData) return;
    const link = document.createElement('a');
    link.href = selectedDoc.signatureData;
    link.download = `${selectedDoc.clientName.replace(/\s+/g, '_')}_Signature.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen p-3 md:p-8 flex flex-col items-center relative text-gray-200 font-sans pb-28">
      
      {/* --- HEADER --- */}
      <div className="text-center mb-5 mt-3 md:mb-12 md:mt-8 w-full relative max-w-4xl">
        <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white mb-1 md:mb-2">
          DEV<span className="text-neonBlue">SAMP</span>
        </h1>
        <p className="text-[10px] md:text-sm tracking-[0.3em] text-gray-500 uppercase">Control Center</p>
        
        {/* LOGOUT BUTTON */}
        <button 
            onClick={() => signOut()}
            className="absolute top-1 right-1 md:top-4 md:right-0 flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all"
        >
            <Icons.Logout /> Logout
        </button>
      </div>

      {/* --- DESKTOP: CREATE FORM --- */}
      <div className="w-full max-w-4xl mb-10 hidden md:block">
        <div className="bg-[#0f0f0f] border border-gray-800 p-1.5 rounded-2xl shadow-xl">
          <form onSubmit={handleCreate} className="flex flex-row gap-4 bg-[#161616] p-3 rounded-xl items-center">
            <input type="text" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} className="flex-1 p-3 bg-transparent text-white outline-none placeholder-gray-600 font-medium text-lg" />
            <div className="w-px h-8 bg-gray-700"></div>
            <input type="text" placeholder="Project Title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="flex-1 p-3 bg-transparent text-white outline-none placeholder-gray-600 font-medium text-lg" />
            <button disabled={creating} className="bg-neonBlue text-black font-bold px-8 py-3 rounded-lg hover:bg-[#00cce6] transition-colors flex items-center gap-2 justify-center shadow-lg hover:scale-105 transform duration-200">
              <Icons.Plus /> {creating ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      </div>

      {/* --- SEARCH & PAGINATION --- */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <div className="relative w-full md:w-80">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><Icons.Search /></div>
          <input 
            type="text" 
            placeholder="Search clients..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl md:rounded-lg text-sm text-white focus:border-neonBlue outline-none transition-colors shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#0a0a0a] p-1 rounded-lg border border-gray-800 w-full md:w-auto justify-between">
           <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="p-2 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"><Icons.Left /></button>
           <span className="text-xs font-mono px-3 text-gray-400">Page {page}/{totalPages || 1}</span>
           <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"><Icons.Right /></button>
        </div>
      </div>

      {/* --- DOCUMENTS LIST --- */}
      <div className="w-full max-w-4xl space-y-2 md:space-y-3">
        <div className="flex justify-between items-center px-2 mb-1">
          <h3 className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">Total Records: {totalDocs}</h3>
          {loading && <span className="text-neonBlue text-[10px] animate-pulse">SYNCING...</span>}
        </div>
        
        {docs.map((doc) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={doc._id} 
            className="group bg-[#0a0a0a] border border-gray-800 hover:border-neonBlue/40 rounded-xl p-3 md:p-6 transition-all duration-300 relative overflow-hidden shadow-sm md:shadow-md"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${doc.status === 'signed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pl-3">
              
              {/* Doc Info */}
              <div className="w-full md:w-1/3">
                  <div className="flex items-center justify-between md:justify-start gap-3 mb-1">
                    <h4 className="text-base md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-none">{doc.title}</h4>
                    <span className={`md:hidden text-[9px] font-bold px-2 py-0.5 rounded border ${doc.status === 'signed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {doc.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400 font-medium">{doc.clientName}</p>
              </div>

              {/* Desktop Status */}
              <div className="hidden md:block md:flex-1 md:text-center">
                 <span className={`inline-block text-xs font-bold px-3 py-1 rounded border ${doc.status === 'signed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                    {doc.status.toUpperCase()}
                 </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto mt-1 md:mt-0 justify-end">
                  {doc.status === 'pending' ? (
                      <button onClick={() => copyLink(doc._id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-neonBlue hover:text-black text-gray-200 px-3 py-2 md:py-2 rounded-lg text-xs md:text-xs font-bold border border-white/5 transition-all">
                          <Icons.Link /> <span className="whitespace-nowrap">Copy Link</span>
                      </button>
                  ) : (
                      <div className="flex gap-2 w-full md:w-auto">
                          <button onClick={() => handleReset(doc._id)} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-2 md:py-2 rounded-lg text-xs font-bold transition-all" title="Retake">
                              <Icons.Refresh /> <span className="md:hidden">Retake</span>
                          </button>
                          <button onClick={() => setSelectedDoc(doc)} className="flex-[2] md:flex-none flex items-center justify-center gap-1.5 bg-neonBlue/5 hover:bg-neonBlue/10 text-neonBlue border border-neonBlue/20 px-4 py-2 md:py-2 rounded-lg text-xs font-bold transition-all shadow-sm">
                              <Icons.Eye /> View
                          </button>
                      </div>
                  )}
                  
                  <div className="w-px h-6 bg-gray-800 mx-1 hidden md:block"></div>
                  
                  <button onClick={() => handleDelete(doc._id)} className="ml-1 text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg" title="Delete">
                    <Icons.Trash />
                  </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {docs.length === 0 && !loading && (
             <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl text-gray-600">
                <p>No documents found.</p>
             </div>
        )}
      </div>

      {/* --- MOBILE FAB --- */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCreateModal(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-neonPurple to-neonBlue rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(210,0,255,0.5)] z-40"
      >
        <Icons.Plus />
      </motion.button>

      {/* --- MOBILE CREATE MODAL --- */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:hidden">
            <motion.div onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
            <motion.div 
              className="bg-[#111] border border-gray-800 p-6 rounded-t-2xl w-full relative z-10 shadow-2xl"
              initial={{y: "100%"}} animate={{y: 0}} exit={{y: "100%"}} transition={{type: "spring", damping: 25, stiffness: 500}}
            >
              <h3 className="text-xl font-bold text-white mb-4">New Document</h3>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <input autoFocus type="text" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} className="p-4 bg-[#1a1a1a] rounded-xl text-white outline-none border border-gray-700 focus:border-neonBlue" />
                <input type="text" placeholder="Project Title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="p-4 bg-[#1a1a1a] rounded-xl text-white outline-none border border-gray-700 focus:border-neonBlue" />
                <button disabled={creating} className="bg-neonBlue text-black font-bold p-4 rounded-xl mt-2">
                  {creating ? "Creating..." : "Create & Generate Link"}
                </button>
              </form>
              <button onClick={() => setShowCreateModal(false)} className="w-full text-center text-gray-500 mt-4 py-2">Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SIGNATURE VIEW MODAL --- */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div onClick={() => setSelectedDoc(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
            <motion.div 
              className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
              initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}}
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#161616]">
                <div>
                   <h3 className="text-lg font-bold text-white">Signature</h3>
                   <p className="text-xs text-gray-400">{selectedDoc.clientName}</p>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="text-gray-400 p-2 hover:text-white"><Icons.Close /></button>
              </div>
              
              <div className="p-8 bg-white flex justify-center items-center min-h-[160px]">
                 <img src={selectedDoc.signatureData} alt="Signature" className="max-h-40 object-contain" />
              </div>
              
              <div className="p-5 bg-[#161616] border-t border-gray-800">
                <button onClick={downloadSignature} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex justify-center items-center gap-2">
                  <Icons.Download /> Save PNG
                </button>
                <p className="text-[10px] text-center text-gray-500 mt-2">Transparent background for legal use.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}