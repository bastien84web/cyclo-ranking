import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const checkSchema = z.object({
  email: z.string().email('Email invalide'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = checkSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        emailVerified: true,
        verificationToken: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      isVerified: !!user.emailVerified,
      hasToken: !!user.verificationToken
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
