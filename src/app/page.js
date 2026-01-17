import Link from 'next/link';
import { dbConnect } from '@/lib/db';
import Document from '@/models/Document';

// Fake creation logic for demo (Normally you create this in a separate admin panel)
async function createDummyDoc() {
  await dbConnect();
  // Agar DB khali hai to ek dummy doc bana do
  const count = await Document.countDocuments();
  if (count === 0) {
    await Document.create({ title: "Web Dev Contract", clientName: "Client A" });
  }
}

export default async function Home() {
  await createDummyDoc();
  const docs = await Document.find({});

  return (
    <main className="min-h-screen p-10 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonBlue mb-10">
        DevSamp <span className="text-white text-2xl">Digital Sign</span>
      </h1>

      <div className="grid gap-6 w-full max-w-4xl">
        {docs.map((doc) => (
          <div key={doc._id} className="glass-panel p-6 rounded-2xl flex justify-between items-center hover:border-neonPurple transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">{doc.title}</h2>
              <p className="text-gray-400 text-sm">Client: {doc.clientName}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${doc.status === 'signed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {doc.status.toUpperCase()}
              </span>
              
              {doc.status === 'pending' ? (
                <Link href={`/sign/${doc._id}`} className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-neonBlue transition-colors">
                  Open to Sign
                </Link>
              ) : (
                <button className="text-gray-500 cursor-not-allowed">Completed</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}