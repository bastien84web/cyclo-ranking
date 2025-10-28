import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token de vérification manquant' },
        { status: 400 }
      )
    }

    // Chercher l'utilisateur avec ce token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        emailVerified: null, // Pas encore vérifié
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token de vérification invalide ou expiré' },
        { status: 400 }
      )
    }

    // Vérifier si le token n'est pas trop ancien (24h)
    const tokenAge = Date.now() - user.createdAt.getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 heures en millisecondes

    if (tokenAge > maxAge) {
      return NextResponse.json(
        { error: 'Token de vérification expiré' },
        { status: 400 }
      )
    }

    // Marquer l'email comme vérifié
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null, // Supprimer le token
      }
    })

    // Rediriger vers une page de succès
    return NextResponse.redirect(new URL('/auth/email-verified', request.url))
  } catch (error) {
    console.error('Erreur lors de la vérification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification de l\'email' },
      { status: 500 }
    )
  }
}
