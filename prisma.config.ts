import { defineConfig } from '@prisma/config'
import { config } from 'dotenv'

// Charge les variables du fichier .env
config()

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL,
  }
})
