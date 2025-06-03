import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export type InquiryStatus = 'new' | 'contacted' | 'completed' | 'archived';

export interface Inquiry {
  _id?: ObjectId;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  courseId: ObjectId;
  courseTitle: string; // Store the course title for quick reference
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const client = await clientPromise;
  const collection = client.db().collection<Inquiry>('inquiries');
  
  return collection.find().sort({ createdAt: -1 }).toArray();
}

export async function getInquiriesByCourse(courseId: string): Promise<Inquiry[]> {
  const client = await clientPromise;
  const collection = client.db().collection<Inquiry>('inquiries');
  
  try {
    return collection.find({ courseId: new ObjectId(courseId) }).sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error('Error fetching inquiries by course ID:', error);
    return [];
  }
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  const client = await clientPromise;
  const collection = client.db().collection<Inquiry>('inquiries');
  
  try {
    return collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error fetching inquiry by ID:', error);
    return null;
  }
}

export async function createInquiry(inquiryData: Omit<Inquiry, '_id' | 'createdAt' | 'updatedAt'>): Promise<Inquiry> {
  const client = await clientPromise;
  const collection = client.db().collection<Inquiry>('inquiries');
  
  const now = new Date();
  const newInquiry = {
    ...inquiryData,
    status: inquiryData.status || 'new',
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newInquiry);
  return {
    ...newInquiry,
    _id: result.insertedId
  };
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<boolean> {
  const client = await clientPromise;
  const collection = client.db().collection<Inquiry>('inquiries');
  
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    );
    return result.matchedCount > 0;
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return false;
  }
}

export async function getInquiriesStatistics() {
  const client = await clientPromise;
  const collection = client.db().collection<Inquiry>('inquiries');
  
  try {
    const total = await collection.countDocuments();
    const newCount = await collection.countDocuments({ status: 'new' });
    const contactedCount = await collection.countDocuments({ status: 'contacted' });
    const completedCount = await collection.countDocuments({ status: 'completed' });
    const archivedCount = await collection.countDocuments({ status: 'archived' });
    
    // Get counts by course
    const courseStats = await collection.aggregate([
      { 
        $group: { 
          _id: { courseId: "$courseId", courseTitle: "$courseTitle" }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    // Get counts by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await collection.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]).toArray();
    
    return {
      total,
      byStatus: {
        new: newCount,
        contacted: contactedCount,
        completed: completedCount,
        archived: archivedCount
      },
      byCourse: courseStats,
      byDate: dailyStats
    };
  } catch (error) {
    console.error('Error getting inquiry statistics:', error);
    return {
      total: 0,
      byStatus: { new: 0, contacted: 0, completed: 0, archived: 0 },
      byCourse: [],
      byDate: []
    };
  }
} 