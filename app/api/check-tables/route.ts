import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()
  
  try {
    // Vérifier si les tables existent
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `
    
    const tables = await prisma.$queryRawUnsafe(tablesQuery) as any[]
    
    return NextResponse.json({
      status: 'success',
      tables: tables.map(t => t.table_name),
      tableCount: tables.length,
      hasUsers: tables.some(t => t.table_name === 'users'),
      hasRaces: tables.some(t => t.table_name === 'races'),
      hasVotes: tables.some(t => t.table_name === 'votes'),
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
