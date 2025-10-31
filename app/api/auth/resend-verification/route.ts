import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
// Utiliser la version dev si les ports SMTP sont bloqués
import { sendVerificationEmail, generateVerificationToken } from '@/lib/email-dev'

const prisma = new PrismaClient()

const resendSchema = z.object({
  email: z.string().email('Email invalide'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = resendSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email déjà vérifié' },
        { status: 400 }
      )
    }

    // Générer un nouveau token de vérification
    const verificationToken = generateVerificationToken()

    // Mettre à jour le token dans la base de données
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken }
    })

    // Envoyer l'email de vérification
    const emailSent = await sendVerificationEmail(email, verificationToken)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Email de vérification renvoyé avec succès'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
