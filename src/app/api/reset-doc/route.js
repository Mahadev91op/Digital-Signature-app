import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Document from '@/models/Document';

export async function POST(req) {
  try {
    await dbConnect();
    const { id } = await req.json();
    
    // Status wapis 'pending' karo aur purana data saaf karo
    await Document.findByIdAndUpdate(id, {
        status: 'pending',
        signatureData: null,
        signedAt: null
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}