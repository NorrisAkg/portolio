import 'dotenv/config'
import { prisma } from '../server/shared/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Start seeding...')
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123'
  const adminHash = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminHash,
    },
    create: {
      email: adminEmail,
      password: adminHash,
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

  // Seed Technologies
  const techNuxt = await prisma.technology.upsert({ where: { slug: 'nuxt' }, update: {}, create: { name: 'Nuxt 3', slug: 'nuxt' } })
  const techNest = await prisma.technology.upsert({ where: { slug: 'nest' }, update: {}, create: { name: 'NestJS', slug: 'nest' } })
  const techPg = await prisma.technology.upsert({ where: { slug: 'pg' }, update: {}, create: { name: 'PostgreSQL', slug: 'pg' } })
  const techStripe = await prisma.technology.upsert({ where: { slug: 'stripe' }, update: {}, create: { name: 'Stripe', slug: 'stripe' } })
  const techReact = await prisma.technology.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React Native', slug: 'react' } })
  const techFirebase = await prisma.technology.upsert({ where: { slug: 'firebase' }, update: {}, create: { name: 'Firebase', slug: 'firebase' } })
  const techSolidity = await prisma.technology.upsert({ where: { slug: 'solidity' }, update: {}, create: { name: 'Solidity', slug: 'solidity' } })
  const techEthers = await prisma.technology.upsert({ where: { slug: 'ethers' }, update: {}, create: { name: 'Ethers.js', slug: 'ethers' } })
  const techPolygon = await prisma.technology.upsert({ where: { slug: 'polygon' }, update: {}, create: { name: 'Polygon', slug: 'polygon' } })
  const techMapbox = await prisma.technology.upsert({ where: { slug: 'mapbox' }, update: {}, create: { name: 'Mapbox', slug: 'mapbox' } })
  const techTimescale = await prisma.technology.upsert({ where: { slug: 'timescaledb' }, update: {}, create: { name: 'TimescaleDB', slug: 'timescaledb' } })
  const techGrafana = await prisma.technology.upsert({ where: { slug: 'grafana' }, update: {}, create: { name: 'Grafana', slug: 'grafana' } })

  // Seed Projects with translations
  await prisma.project.upsert({
    where: { id: 'seed-project-1' },
    update: {},
    create: {
      id: 'seed-project-1',
      image: 'MARKETPLACE_AGRO_BJ_2025.PNG',
      tone: 'warm',
      year: '2025',
      dur: '8w',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      technologies: {
        connect: [{ id: techNuxt.id }, { id: techNest.id }, { id: techPg.id }, { id: techStripe.id }]
      },
      translations: {
        createMany: {
          data: [
            {
              locale: 'fr',
              title: 'Marketplace agricole — Bénin',
              slug: 'agricultural-marketplace-bj',
              description: 'Connecter plus de 400 producteurs directement aux acheteurs urbains, sans intermédiaire.',
              content: 'Description détaillée du projet...',
              outcome: '+38% de marge moyenne pour les producteurs',
              durationLabel: '8 semaines · MVP → production'
            },
            {
              locale: 'en',
              title: 'Agricultural marketplace — Benin',
              slug: 'agricultural-marketplace-en',
              description: 'Connecting 400+ producers directly to urban buyers, no middlemen.',
              content: 'Detailed project description...',
              outcome: '+38% average margin for producers',
              durationLabel: '8 weeks · MVP → production'
            }
          ]
        }
      }
    }
  })

  await prisma.project.upsert({
    where: { id: 'seed-project-2' },
    update: {},
    create: {
      id: 'seed-project-2',
      image: 'APP_FIDELITE_COT_2024.PNG',
      tone: 'cool',
      year: '2024',
      dur: '5w',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      technologies: {
        connect: [{ id: techReact.id }, { id: techNest.id }, { id: techFirebase.id }]
      },
      translations: {
        createMany: {
          data: [
            {
              locale: 'fr',
              title: 'App de fidélité mobile — Cotonou',
              slug: 'mobile-loyalty-app-bj',
              description: 'Remplacer un système de cartes papier illisible par une application simple et rapide.',
              content: 'Description détaillée...',
              outcome: '+62% de rétention en 3 mois',
              durationLabel: '5 semaines · 8 commerces partenaires'
            },
            {
              locale: 'en',
              title: 'Mobile loyalty app — Cotonou',
              slug: 'mobile-loyalty-app-en',
              description: 'Replacing an unreadable paper-card system with a simple, fast app.',
              content: 'Detailed description...',
              outcome: '+62% retention in 3 months',
              durationLabel: '5 weeks · 8 partner stores'
            }
          ]
        }
      }
    }
  })

  await prisma.project.upsert({
    where: { id: 'seed-project-3' },
    update: {},
    create: {
      id: 'seed-project-3',
      image: 'TOKENISATION_RWA_2025.PNG',
      tone: 'navy',
      year: '2025',
      dur: '12w',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      technologies: {
        connect: [{ id: techSolidity.id }, { id: techNuxt.id }, { id: techEthers.id }, { id: techPolygon.id }]
      },
      translations: {
        createMany: {
          data: [
            {
              locale: 'fr',
              title: 'Plateforme de tokenisation — Web3',
              slug: 'tokenization-platform-web3',
              description: 'Fractionner la propriété immobilière pour la diaspora.',
              content: 'Description détaillée...',
              outcome: '4 actifs tokenisés · 312 k€ levés',
              durationLabel: '12 semaines · audit externe inclus'
            },
            {
              locale: 'en',
              title: 'Tokenization platform — Web3',
              slug: 'tokenization-platform-en',
              description: 'Fractionalising real-estate ownership for the diaspora.',
              content: 'Detailed description...',
              outcome: '4 assets tokenised · €312K raised',
              durationLabel: '12 weeks · external audit included'
            }
          ]
        }
      }
    }
  })

  await prisma.project.upsert({
    where: { id: 'seed-project-4' },
    update: {},
    create: {
      id: 'seed-project-4',
      image: 'BACKOFFICE_SAAS_LYO_2024.PNG',
      tone: 'cool',
      year: '2024',
      dur: '6w',
      featured: false,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      technologies: {
        connect: [{ id: techNuxt.id }, { id: techNest.id }, { id: techPg.id }]
      },
      translations: {
        createMany: {
          data: [
            {
              locale: 'fr',
              title: 'Back-office B2B SaaS — Lyon',
              slug: 'b2b-saas-back-office-lyon',
              description: 'Outil interne pour traiter 12 000 commandes/mois avec 4 opérateurs.',
              content: 'Description détaillée...',
              outcome: '-45% de temps de traitement par commande',
              durationLabel: '6 semaines · réécriture progressive'
            },
            {
              locale: 'en',
              title: 'B2B SaaS back-office — Lyon',
              slug: 'b2b-saas-back-office-en',
              description: 'Internal tool to run 12K orders/month with 4 operators.',
              content: 'Detailed description...',
              outcome: '−45% processing time per order',
              durationLabel: '6 weeks · progressive rewrite'
            }
          ]
        }
      }
    }
  })

  await prisma.project.upsert({
    where: { id: 'seed-project-5' },
    update: {},
    create: {
      id: 'seed-project-5',
      image: 'LIVRAISON_DKR_2023.PNG',
      tone: 'warm',
      year: '2023',
      dur: '10w',
      featured: false,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      technologies: {
        connect: [{ id: techReact.id }, { id: techNest.id }, { id: techMapbox.id }]
      },
      translations: {
        createMany: {
          data: [
            {
              locale: 'fr',
              title: 'App de livraison locale — Dakar',
              slug: 'local-delivery-app-dakar',
              description: 'Application iOS/Android pour coursiers et restaurants indépendants.',
              content: 'Description détaillée...',
              outcome: '1 200 livraisons/mois · 3 villes',
              durationLabel: '10 semaines · MVP financé'
            },
            {
              locale: 'en',
              title: 'Local delivery app — Dakar',
              slug: 'local-delivery-app-en',
              description: 'iOS/Android app for independent couriers and restaurants.',
              content: 'Detailed description...',
              outcome: '1,200 deliveries/month · 3 cities',
              durationLabel: '10 weeks · MVP funded'
            }
          ]
        }
      }
    }
  })

  await prisma.project.upsert({
    where: { id: 'seed-project-6' },
    update: {},
    create: {
      id: 'seed-project-6',
      image: 'FINTECH_API_2023.PNG',
      tone: 'navy',
      year: '2023',
      dur: '4w',
      featured: false,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      technologies: {
        connect: [{ id: techNest.id }, { id: techTimescale.id }, { id: techGrafana.id }]
      },
      translations: {
        createMany: {
          data: [
            {
              locale: 'fr',
              title: 'API & dashboard analytique — Fintech',
              slug: 'api-analytics-dashboard-fintech',
              description: 'Agrégation des transactions multicanaux pour une néobanque africaine.',
              content: 'Description détaillée...',
              outcome: 'Rapports en temps réel · prêts pour audit',
              durationLabel: '4 semaines · livraison interne'
            },
            {
              locale: 'en',
              title: 'API & analytics dashboard — fintech',
              slug: 'api-analytics-dashboard-en',
              description: 'Aggregating multi-channel transactions for an African neobank.',
              content: 'Detailed description...',
              outcome: 'Real-time reporting · audit-ready',
              durationLabel: '4 weeks · in-house delivery'
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
