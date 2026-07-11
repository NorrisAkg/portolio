import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/prisma';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-12345';

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants invalides',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
    if (!isPasswordCorrect) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants invalides',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: error.issues,
      });
    }
    throw error;
  }
});
