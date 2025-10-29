import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://meilleures-cyclosportives.com'
  
  try {
    // Récupérer toutes les courses pour le sitemap
    const races = await prisma.race.findMany({
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Pages statiques
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/auth/signin`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.3,
      },
    ]

    // Pages dynamiques des courses
    const racePages = races.map((race) => ({
      url: `${baseUrl}/race/${race.id}`,
      lastModified: race.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...racePages]
    
  } catch (error) {
    console.error('Erreur génération sitemap:', error)
    
    // Sitemap minimal en cas d'erreur
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  } finally {
    await prisma.$disconnect()
  }
}
