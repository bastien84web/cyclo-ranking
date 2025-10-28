import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const voteSchema = z.object({
  raceId: z.string(),
  accommodationAvailability: z.number().min(1).max(5),
  parkingAvailability: z.number().min(1).max(5),
  startFinishDistance: z.number().min(1).max(5),
  foodQuality: z.number().min(1).max(5),
  foodQuantity: z.number().min(1).max(5),
  foodConviviality: z.number().min(1).max(5),
  safety: z.number().min(1).max(5),
  signage: z.number().min(1).max(5),
  traffic: z.number().min(1).max(5),
  scenery: z.number().min(1).max(5),
  routeVariety: z.number().min(1).max(5),
  priceValue: z.number().min(1).max(5),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const voteData = voteSchema.parse(body)

    // Check if user has already voted for this race
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_raceId: {
          userId: user.id,
          raceId: voteData.raceId,
        }
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'Vous avez déjà voté pour cette course' },
        { status: 400 }
      )
    }

    // Check if race exists
    const race = await prisma.race.findUnique({
      where: { id: voteData.raceId }
    })

    if (!race) {
      return NextResponse.json(
        { error: 'Course non trouvée' },
        { status: 404 }
      )
    }

    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        ...voteData,
      }
    })

    return NextResponse.json(vote)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du vote' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const raceId = searchParams.get('raceId')

    if (raceId) {
      const vote = await prisma.vote.findUnique({
        where: {
          userId_raceId: {
            userId: user.id,
            raceId: raceId,
          }
        }
      })
      return NextResponse.json({ hasVoted: !!vote, vote })
    }

    const votes = await prisma.vote.findMany({
      where: { userId: user.id },
      include: {
        race: true,
      }
    })

    return NextResponse.json(votes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des votes' },
      { status: 500 }
    )
  }
}
