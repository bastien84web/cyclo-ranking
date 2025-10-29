import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    const { initProduction } = require('../../../scripts/init-production')
    await initProduction()
    
    return NextResponse.json({
      message: 'Initialisation terminée',
      status: 'success',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erreur setup-db:', error)
    return NextResponse.json({
      error: 'Erreur lors de l\'initialisation',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
