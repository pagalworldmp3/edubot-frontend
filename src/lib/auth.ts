import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { users } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export async function requireRole(role: 'free' | 'pro' | 'enterprise') {
  const user = await requireAuth();
  
  const roleHierarchy = {
    'free': 0,
    'pro': 1,
    'enterprise': 2
  };
  
  if (roleHierarchy[user.role] < roleHierarchy[role]) {
    throw new Error(`Role ${role} required`);
  }
  
  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'enterprise';
}

export async function updateUserLastLogin(userId: string) {
  try {
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.clerkId, userId));
  } catch (error) {
    console.error('Error updating last login:', error);
  }
} 