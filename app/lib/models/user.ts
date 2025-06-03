import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import clientPromise from '../mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise;
  const collection = client.db().collection<User>('users');
  return collection.findOne({ email });
}

export async function validatePassword(user: User, inputPassword: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, user.password);
}

export async function initializeAdminUser() {
  const client = await clientPromise;
  const db = client.db();
  const usersCollection = db.collection<User>('users');
  
  // Check if admin user already exists
  const adminUser = await usersCollection.findOne({ email: 'admin@ddmrp.com' });
  
  if (!adminUser) {
    // Create admin user if it doesn't exist
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await usersCollection.insertOne({
      email: 'admin@ddmrp.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
} 