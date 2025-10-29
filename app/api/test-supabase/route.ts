import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔄 Test connexion Supabase...')
    
    // Test de connexion simple
    const connectionTest = await prisma.$queryRaw`SELECT NOW() as current_time, version() as pg_version`
    console.log('✅ Connexion OK:', connectionTest)
    
    // Test de comptage sans prepared statements
    const userCount = await prisma.user.count()
    const raceCount = await prisma.race.count()
    
    console.log(`📊 Données: ${userCount} users, ${raceCount} races`)
    
    // Test admin
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@cycloranking.com' },
      select: { email: true, name: true }
    })
    
    console.log('👤 Admin:', admin)
    
    return NextResponse.json({
      success: true,
      connection: connectionTest,
      counts: {
        users: userCount,
        races: raceCount
      },
      admin: admin,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erreur Supabase:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'unknown',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
