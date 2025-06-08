import { ObjectId, Binary } from 'mongodb';
import clientPromise from '../mongodb';

export interface StoredImage {
  _id?: ObjectId;
  filename: string;
  contentType: string;
  data: Binary | Buffer;
  createdAt: Date;
}

/**
 * Stores an image in MongoDB
 */
export async function storeImage(
  filename: string,
  contentType: string,
  data: Buffer
): Promise<string> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<StoredImage>('images');

  // Convert Buffer to MongoDB Binary for proper storage
  const binary = new Binary(data);

  const result = await collection.insertOne({
    filename,
    contentType,
    data: binary,
    createdAt: new Date()
  });

  // Return the ID as a string to be used as a reference
  return result.insertedId.toString();
}

/**
 * Retrieves an image from MongoDB by ID
 */
export async function getImageById(id: string): Promise<StoredImage | null> {
  if (!ObjectId.isValid(id)) {
    console.error('Invalid ObjectId format for image:', id);
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<StoredImage>('images');

    const image = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!image) {
      console.error('Image not found in database:', id);
      return null;
    }
    
    // Convert MongoDB Binary back to Buffer if needed
    if (image.data instanceof Binary) {
      const buffer = Buffer.from(image.data.buffer);
      return {
        ...image,
        data: buffer
      };
    }
    
    return image;
  } catch (error) {
    console.error('Error retrieving image from database:', error);
    return null;
  }
}

/**
 * Deletes an image from MongoDB by ID
 */
export async function deleteImage(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<StoredImage>('images');

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
} 