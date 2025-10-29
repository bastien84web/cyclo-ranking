import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()
  
  try {
    // Test simple de connexion
    await prisma.$queryRaw`SELECT 1 as test`
    
    // Test de comptage avec conversion en nombre
    const usersResult = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM users` as any[]
    const racesResult = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM races` as any[]
    
    // Test admin
    const adminResult = await prisma.$queryRaw`SELECT email FROM users WHERE email = 'admin@cycloranking.com' LIMIT 1` as any[]
    
    return NextResponse.json({
      status: 'success',
      connection: 'ok',
      users: usersResult[0]?.count || 0,
      races: racesResult[0]?.count || 0,
      admin: adminResult.length > 0 ? adminResult[0].email : null,
      adminExists: adminResult.length > 0,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 })
    
  } finally {
    await prisma.$disconnect()
  }
}
