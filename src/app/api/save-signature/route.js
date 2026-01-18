import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Document from '@/models/Document';

export async function POST(req) {
  try {
    await dbConnect();
    const { docId, signatureData } = await req.json();

    if (!docId) {
      return NextResponse.json({ success: false, error: "Document ID is missing" });
    }

    // Legal Audit Info
    const signedAt = new Date();
    
    // Update Document in DB
    const updatedDoc = await Document.findByIdAndUpdate(docId, {
      status: 'signed',
      signatureData,
      signedAt,
    }, { new: true });

    // FIX: Agar document nahi mila (Invalid ID), to error bhejo
    if (!updatedDoc) {
      return NextResponse.json({ success: false, error: "Document not found in Database" });
    }

    return NextResponse.json({ success: true, doc: updatedDoc });
  } catch (error) {
    console.error("Signature Save Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}