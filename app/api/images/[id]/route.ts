import { NextRequest, NextResponse } from 'next/server';
import { getImageById } from '@/app/lib/models/image';

export const dynamic = 'force-dynamic'; // Ensure the route is not cached

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    
    // Get the image from MongoDB
    const image = await getImageById(id);
    
    if (!image) {
      console.error(`Image not found: ${id}`);
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Create a response with the image data and appropriate content type
    // Convert Buffer to ArrayBuffer for the response
    const buffer = image.data;
    
    // Create a response with the image data and appropriate content type
    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', image.contentType);
    response.headers.set('Content-Length', buffer.length.toString());
    response.headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    return response;
  } catch (error) {
    console.error('Error retrieving image:', error);
    return new NextResponse(`Error retrieving image: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
} 