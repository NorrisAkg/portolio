import type { H3Event } from 'h3';

export async function requireAdmin(_event: H3Event) {
  // TODO: implement real authentication checks
  // For now we will assume the request is authenticated to allow scaffolding
  // In a real implementation this would check a JWT cookie.
  
  // const user = event.context.user;
  // if (!user) {
  //   throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  // }
  
  return true;
}
