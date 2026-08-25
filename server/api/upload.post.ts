import fs from 'node:fs';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { handleDomainError } from '../utils/handle-errors';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-12345';
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default defineEventHandler(async (event) => {
  try {
    // 1. Check Authentication
    const token = getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '');
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Non authentifié',
        message: 'Vous devez être connecté pour téléverser des fichiers.',
      });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      throw createError({
        statusCode: 401,
        statusMessage: 'Session expirée ou invalide',
        message: 'Session expirée, veuillez vous reconnecter.',
      });
    }

    // 2. Read Multipart form data
    const files = await readMultipartFormData(event);
    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Aucun fichier reçu',
        message: 'Veuillez sélectionner un fichier à téléverser.',
      });
    }

    const file = files.find((f) => f.name === 'file' || f.filename);
    if (!file || !file.filename || !file.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Fichier invalide',
        message: 'Le fichier envoyé est manquant ou incomplet.',
      });
    }

    // 3. Validate MIME type
    const mimeType = file.type || '';
    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format de fichier non supporté',
        message: `Format "${mimeType}" non autorisé. Formats acceptés : JPG, PNG, WebP, GIF, SVG.`,
      });
    }

    // 4. Validate File Size
    if (file.data.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Fichier trop volumineux',
        message: 'La taille maximale autorisée est de 10 Mo.',
      });
    }

    // 5. Ensure upload directory exists in public/uploads
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 6. Generate safe unique filename
    const originalExt = path.extname(file.filename) || `.${mimeType.split('/')[1] || 'png'}`;
    const baseName = path
      .basename(file.filename, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40);

    const safeFilename = `${Date.now()}-${baseName || 'image'}${originalExt.toLowerCase()}`;
    const targetPath = path.join(uploadDir, safeFilename);

    // 7. Write file to disk
    fs.writeFileSync(targetPath, file.data);

    const publicUrl = `/uploads/${safeFilename}`;

    logger.info(`[Upload] Image téléversée avec succès: ${safeFilename} (${file.data.length} octets)`, {
      path: event.path,
      filename: safeFilename,
      size: file.data.length,
    });

    return {
      url: publicUrl,
      filename: safeFilename,
      size: file.data.length,
      mimeType,
    };
  } catch (error: any) {
    return handleDomainError(error, event);
  }
});
