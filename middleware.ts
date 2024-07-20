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

const isIgnoredRoute = createRouteMatcher([
  '/api/webhook',
  '/api/chatgpt'
]);

export default clerkMiddleware((auth, request) => {
  console.log('Middleware triggered for request:', request.url);

  if (isIgnoredRoute(request)) {
    console.log('Request ignored by middleware:', request.url);
    return; 
  }

  if (!isPublicRoute(request)) {
    console.log('Request requires authentication:', request.url);
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
