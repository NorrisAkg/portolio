import { logger } from '../utils/logger';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', async (error, { event }) => {
    logger.error(`[Server Error] ${event?.method || ''} ${event?.path || ''}`, error, {
      path: event?.path,
      method: event?.method,
    });
  });
});
