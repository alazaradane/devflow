/* eslint-disable camelcase */
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, updateuser, deleteUser } from '@/lib/actions/user.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;
  if (!process.env.NEXT_CLERK_WEBHOOK_SECRET) {
    console.error('Missing WEBHOOK_SECRET');
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers', { svix_id, svix_timestamp, svix_signature });
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  const eventType = evt.type;

  console.log('Event Type:', eventType); // Detailed logging
  console.log('Function triggered');
  console.log('Headers received', { svix_id, svix_timestamp, svix_signature });
  console.log('Payload received', payload);

  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;

    try {
      const mongoUser = await createUser({
        clerkId: id,
        name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
        username: username!,
        email: email_addresses[0].email_address,
        picture: image_url
      });

      return NextResponse.json({ message: 'Ok', user: mongoUser });
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error occurred', {
        status: 500
      });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;

    try {
      const mongoUser = await updateuser({
        clerkId: id,
        updateData: {
          name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
          username: username!,
          email: email_addresses[0].email_address,
          picture: image_url
        },
        path: `/profile/${id}`
      });

      return NextResponse.json({ message: 'OK', user: mongoUser });
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error occurred', {
        status: 500
      });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      const deletedUser = await deleteUser({
        clerkId: id!,
      });

      return NextResponse.json({ message: 'OK', user: deletedUser });
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error occurred', {
        status: 500
      });
    }
  }

  console.log('Unhandled event type:', eventType);

  return new Response('', { status: 200 });
}
