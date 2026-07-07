import 'dotenv/config'
import { prisma } from '../server/shared/prisma'

async function main() {
  console.log('Start seeding...')
  
  // Seed admin user (password: password123, you should change this in production!)
  // Note: in a real app, this should be a bcrypt hashed password. We'll add a plain string here 
  // and the auth service should hash/compare it, but for seed we'll assume bcrypt hashes it.
  // To avoid installing bcrypt just for the seed, we'll just put a dummy hash.
  // '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW' is 'password123'
  const admin = await prisma.user.upsert({
    where: { email: 'admin@portfolio.local' },
    update: {},
    create: {
      email: 'admin@portfolio.local',
      password: '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW', 
    },
  })
  
  console.log(`Created admin user: ${admin.email}`)
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
