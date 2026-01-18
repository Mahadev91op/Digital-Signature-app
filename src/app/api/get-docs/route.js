import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Document from '@/models/Document';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    
    // URL se parameters nikalo
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10; // Ek page par 10 dikhenge
    const search = searchParams.get('search') || '';

    // Search Query (Naam ya Title se dhundo)
    const query = search 
      ? {
          $or: [
            { clientName: { $regex: search, $options: 'i' } }, // 'i' matlab case-insensitive
            { title: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // Database se data nikalo (Pagination ke sath)
    const docs = await Document.find(query)
      .sort({ createdAt: -1 }) // Latest uper
      .skip((page - 1) * limit) // Kitne chhodne hain
      .limit(limit); // Kitne dikhane hain

    // Total count pata karo (Pagination buttons ke liye)
    const totalDocs = await Document.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      docs, 
      pagination: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}