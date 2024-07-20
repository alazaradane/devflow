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
  const url = new URL(request.url);

  console.log(`Middleware triggered for request: ${url.pathname}`);

  if (isIgnoredRoute(request)) {
    console.log(`Request ignored by middleware: ${url.pathname}`);
    return;
  }

  if (!isPublicRoute(request)) {
    console.log(`Request requires authentication: ${url.pathname}`);
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
