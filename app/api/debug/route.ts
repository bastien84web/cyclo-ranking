import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Vérifier les variables d'environnement
    const envCheck = {
      nextauth_secret: !!process.env.NEXTAUTH_SECRET,
      nextauth_url: process.env.NEXTAUTH_URL,
      database_url: !!process.env.DATABASE_URL,
      node_env: process.env.NODE_ENV,
    }

    // Tester la connexion à la base de données
    let dbStatus = 'unknown'
    let userCount = 0
    let raceCount = 0
    let adminExists = false

    try {
      await prisma.$connect()
      dbStatus = 'connected'
      
      // Compter les utilisateurs et courses
      userCount = await prisma.user.count()
      raceCount = await prisma.race.count()
      
      // Vérifier si l'admin existe
      const admin = await prisma.user.findUnique({
        where: { email: 'admin@cycloranking.com' }
      })
      adminExists = !!admin
      
    } catch (error) {
      dbStatus = `error: ${error instanceof Error ? error.message : 'unknown'}`
    } finally {
      await prisma.$disconnect()
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        userCount,
        raceCount,
        adminExists
      },
      status: 'ok'
    })

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'unknown error',
      status: 'error'
    }, { status: 500 })
  }
}
