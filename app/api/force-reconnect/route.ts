import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Forcer la déconnexion de toutes les instances Prisma
    const { PrismaClient } = require('@prisma/client')
    
    // Créer une nouvelle instance propre
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })

    // Test de connexion
    await prisma.$connect()
    
    // Test simple
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Compter les données
    const userCount = await prisma.user.count()
    const raceCount = await prisma.race.count()
    
    // Vérifier l'admin
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@cycloranking.com' }
    })
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Reconnexion forcée réussie',
      data: {
        userCount,
        raceCount,
        adminExists: !!admin,
        adminEmail: admin?.email
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
