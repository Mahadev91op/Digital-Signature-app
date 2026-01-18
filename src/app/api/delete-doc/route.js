import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Document from '@/models/Document';

export async function POST(req) {
  try {
    await dbConnect();
    const { id } = await req.json();
    
    // Document ko hamesha ke liye delete karo
    await Document.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}