import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET() {
  try {
    // Client connects to the server
    const client = await clientPromise;
    // Make a test call to the server to confirm connection
    await client.db('admin').command({ ping: 1 });
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Connected to MongoDB!',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to MongoDB', 
      error: error.message 
    }, { status: 500 });
  }
} 