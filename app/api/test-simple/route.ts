import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()
  
  try {
    // Test simple de connexion
    await prisma.$queryRaw`SELECT 1 as test`
    
    // Test de comptage direct
    const users = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`
    const races = await prisma.$queryRaw`SELECT COUNT(*) as count FROM races`
    
    // Test admin
    const admin = await prisma.$queryRaw`SELECT email FROM users WHERE email = 'admin@cycloranking.com' LIMIT 1`
    
    return NextResponse.json({
      status: 'success',
      connection: 'ok',
      users: users,
      races: races,
      admin: admin,
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
