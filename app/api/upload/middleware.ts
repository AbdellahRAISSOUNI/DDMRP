import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function ensureUploadsDirectory() {
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  
  if (!existsSync(uploadDir)) {
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('Created uploads directory:', uploadDir);
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }
  }
} 