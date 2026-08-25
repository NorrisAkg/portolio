import { defineConfig } from '@prisma/config'
import { config } from 'dotenv'

// Charge les variables du fichier .env
config()

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (url && !url.includes('${')) {
    return url
  }
  const user = process.env.DATABASE_USER || 'postgres'
  const pass = process.env.DATABASE_PASSWORD ? `:${process.env.DATABASE_PASSWORD}` : ''
  const host = process.env.DATABASE_HOST || 'localhost'
  const port = process.env.DATABASE_PORT || '5432'
  const db = process.env.DATABASE_NAME || 'portfolio'
  return `postgresql://${user}${pass}@${host}:${port}/${db}?schema=public`
}

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: getDatabaseUrl(),
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
})
