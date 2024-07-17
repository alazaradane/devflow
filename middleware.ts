import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([ 
  '/',
  '/api/webhook',
  '/sign-in(.*)', 
  '/sign-up(.*)',
  'question/:id',
  '/tags',
  '/tags/:id',
  '/profile/:id',
  '/community',
  '/jobs'
]);

// Define the ignored routes
const isIgnoredRoute = createRouteMatcher([
  '/api/webhook',
  '/api/chatgpt'
]);

export default clerkMiddleware((auth, request) => {
  if (isIgnoredRoute(request)) {
    return; // Skip middleware logic for ignored routes
  }

  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
