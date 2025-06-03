import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Insert contact message into a 'contacts' collection
    const result = await db.collection('contacts').insertOne({
      ...data,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Return success response with the created contact ID
    return NextResponse.json({
      success: true,
      message: 'Contact message submitted successfully',
      contactId: result.insertedId
    });
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 