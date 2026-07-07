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

  // Seed tags
  const tagTech = await prisma.tag.upsert({
    where: { slug: 'tech' },
    update: {},
    create: { name: 'Tech', slug: 'tech' }
  })

  const tagStrategy = await prisma.tag.upsert({
    where: { slug: 'strategy' },
    update: {},
    create: { name: 'Strategy', slug: 'strategy' }
  })

  // Seed articles with translations
  await prisma.article.upsert({
    where: { id: 'seed-article-1' },
    update: {},
    create: {
      id: 'seed-article-1',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: {
        connect: [{ id: tagStrategy.id }]
      },
      translations: {
        createMany: {
          data: [
            {
              locale: 'fr',
              title: "Pourquoi votre MVP n'a pas besoin de blockchain",
              slug: 'mvp-blockchain-fr',
              description: "La majorité des projets Web3 que je refuse pourraient être résolus avec une base de données et un PDF.",
              content: "Contenu complet en français de l'article sur la blockchain..."
            },
            {
              locale: 'en',
              title: "Why your MVP doesn't need blockchain",
              slug: 'mvp-blockchain-en',
              description: "Most Web3 projects I turn down could ship with a database and a PDF.",
              content: "Full English content of the article about blockchain..."
            }
          ]
        }
      }
    }
  })

  await prisma.article.upsert({
    where: { id: 'seed-article-2' },
    update: {},
    create: {
      id: 'seed-article-2',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: {
        connect: [{ id: tagTech.id }]
      },
      translations: {
        createMany: {
          data: [
            {
              locale: 'fr',
              title: "Nuxt 3 + NestJS: le combo que je recommande aux PME",
              slug: 'nuxt-nestjs-combo-fr',
              description: "Un seul langage, un seul écosystème, une vélocité que peu de stacks offrent à ce niveau de maturité.",
              content: "Contenu complet en français de l'article sur Nuxt et NestJS..."
            },
            {
              locale: 'en',
              title: "Nuxt 3 + NestJS: the combo I recommend to SMEs",
              slug: 'nuxt-nestjs-combo-en',
              description: "One language, one ecosystem, a velocity few stacks match at this level of maturity.",
              content: "Full English content of the article about Nuxt and NestJS..."
            }
          ]
        }
      }
    }
  })

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
