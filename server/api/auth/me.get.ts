import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-12345';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    return {
      id: decoded.id,
      email: decoded.email,
    };
  } catch {
    deleteCookie(event, 'auth_token');
    return null;
  }
});
