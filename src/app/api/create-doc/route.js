import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db'; // Aapke pass ye file already fixed hai
import Document from '@/models/Document'; // Ye model bhi aapke pass hai

export async function POST(req) {
  try {
    await dbConnect();
    const { title, clientName } = await req.json();

    // Database me nayi entry banao (Status: Pending)
    const newDoc = await Document.create({
      title,
      clientName,
      status: 'pending',
    });

    return NextResponse.json({ success: true, doc: newDoc });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}