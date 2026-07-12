import { z } from 'zod';
import nodemailer from 'nodemailer';

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_EMAIL || 'hello@norrisakogbede.com';
    const from = process.env.SMTP_FROM || '"Norris Portfolio" <noreply@portfolio.local>';

    console.log(`[Contact Form] Nouveau message de ${body.name} (${body.email})`);

    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from,
        to,
        replyTo: body.email,
        subject: `[Contact Portfolio] Message de ${body.name}`,
        text: `Nom: ${body.name}\nEmail: ${body.email}\n\nMessage:\n${body.message}`,
        html: `<p><strong>Nom:</strong> ${body.name}</p>
               <p><strong>Email:</strong> ${body.email}</p>
               <p><strong>Message:</strong></p>
               <p>${body.message.replace(/\n/g, '<br>')}</p>`,
      });
      return { success: true, sent: true };
    }

    return { success: true, sent: false, note: 'SMTP non configuré dans le .env' };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: error.issues,
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: error.message,
    });
  }
});
