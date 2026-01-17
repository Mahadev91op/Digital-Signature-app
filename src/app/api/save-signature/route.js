import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Document from '@/models/Document';

export async function POST(req) {
  try {
    await dbConnect();
    const { docId, signatureData } = await req.json();

    // Legal Audit Info
    const signedAt = new Date();
    
    // Update Document in DB
    const updatedDoc = await Document.findByIdAndUpdate(docId, {
      status: 'signed',
      signatureData,
      signedAt,
    }, { new: true });

    return NextResponse.json({ success: true, doc: updatedDoc });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}