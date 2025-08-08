import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { db } from '@/lib/database';
import { users } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      );
    }

    // Get the body
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

    let evt: any;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Error verifying webhook' },
        { status: 400 }
      );
    }

    // Handle the webhook
    const eventType = evt.type;

    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleUserCreated(userData: any) {
  try {
    const { id, email_addresses, first_name, last_name, created_at } = userData;

    // Get primary email
    const primaryEmail = email_addresses?.find((email: any) => email.id === userData.primary_email_address_id);
    const email = primaryEmail?.email_address || '';

    // Create user in database
    await db.insert(users).values({
      clerkId: id,
      email,
      name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
      role: 'free',
      subscriptionStatus: 'active',
      createdAt: new Date(created_at * 1000),
      updatedAt: new Date(created_at * 1000),
      lastLogin: new Date(created_at * 1000)
    });

    console.log(`User created: ${id}`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function handleUserUpdated(userData: any) {
  try {
    const { id, email_addresses, first_name, last_name, updated_at } = userData;

    // Get primary email
    const primaryEmail = email_addresses?.find((email: any) => email.id === userData.primary_email_address_id);
    const email = primaryEmail?.email_address || '';

    // Update user in database
    await db.update(users)
      .set({
        email,
        name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
        updatedAt: new Date(updated_at * 1000)
      })
      .where(eq(users.clerkId, id));

    console.log(`User updated: ${id}`);
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

async function handleUserDeleted(userData: any) {
  try {
    const { id } = userData;

    // Delete user from database (cascade will handle related records)
    await db.delete(users)
      .where(eq(users.clerkId, id));

    console.log(`User deleted: ${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
} 