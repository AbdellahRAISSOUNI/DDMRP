import NextAuth from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { initializeAdminUser } from '@/app/lib/models/user';

// Initialize the admin user when the auth API is first accessed
initializeAdminUser()
  .catch(error => console.error('Failed to initialize admin user:', error));

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 