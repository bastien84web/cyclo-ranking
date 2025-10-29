import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma: PrismaClient | null = null
  
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
      // Créer une nouvelle instance Prisma pour chaque requête
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      })
      
      await prisma.$connect()
      dbStatus = 'connected'
      
      // Compter les utilisateurs et courses avec requêtes SQL directes
      const usersResult = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM users` as any[]
      const racesResult = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM races` as any[]
      
      userCount = usersResult[0]?.count || 0
      raceCount = racesResult[0]?.count || 0
      
      // Vérifier si l'admin existe
      const adminResult = await prisma.$queryRaw`SELECT email FROM users WHERE email = 'admin@cycloranking.com' LIMIT 1` as any[]
      adminExists = adminResult.length > 0
      
    } catch (error) {
      dbStatus = `error: ${error instanceof Error ? error.message : 'unknown'}`
    } finally {
      if (prisma) {
        await prisma.$disconnect()
      }
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
