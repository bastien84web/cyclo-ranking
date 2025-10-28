import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const raceSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  location: z.string().min(2, 'La localisation est requise'),
  date: z.string().transform((str) => new Date(str)),
  website: z.string().url().optional().or(z.literal('')),
})

export async function GET() {
  try {
    const races = await prisma.race.findMany({
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          }
        },
        votes: true,
        _count: {
          select: {
            votes: true,
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Calculate average ratings for each race
    const racesWithRatings = races.map(race => {
      const votes = race.votes
      const voteCount = votes.length

      if (voteCount === 0) {
        return {
          ...race,
          averageRating: 0,
          ratings: {
            logistics: 0,
            food: 0,
            route: 0,
            sports: 0,
            price: 0,
            overall: 0,
          }
        }
      }

      const totals = votes.reduce((acc, vote) => ({
        accommodationAvailability: acc.accommodationAvailability + vote.accommodationAvailability,
        parkingAvailability: acc.parkingAvailability + vote.parkingAvailability,
        startFinishDistance: acc.startFinishDistance + vote.startFinishDistance,
        foodQuality: acc.foodQuality + vote.foodQuality,
        foodQuantity: acc.foodQuantity + vote.foodQuantity,
        foodConviviality: acc.foodConviviality + vote.foodConviviality,
        safety: acc.safety + vote.safety,
        signage: acc.signage + vote.signage,
        traffic: acc.traffic + vote.traffic,
        scenery: acc.scenery + vote.scenery,
        routeVariety: acc.routeVariety + vote.routeVariety,
        priceValue: acc.priceValue + vote.priceValue,
      }), {
        accommodationAvailability: 0,
        parkingAvailability: 0,
        startFinishDistance: 0,
        foodQuality: 0,
        foodQuantity: 0,
        foodConviviality: 0,
        safety: 0,
        signage: 0,
        traffic: 0,
        scenery: 0,
        routeVariety: 0,
        priceValue: 0,
      })

      const logistics = (totals.accommodationAvailability + totals.parkingAvailability + totals.startFinishDistance) / (3 * voteCount)
      const food = (totals.foodQuality + totals.foodQuantity + totals.foodConviviality) / (3 * voteCount)
      const route = (totals.safety + totals.signage + totals.traffic + totals.scenery) / (4 * voteCount)
      const sports = totals.routeVariety / voteCount
      const price = totals.priceValue / voteCount
      const overall = (logistics + food + route + sports + price) / 5

      return {
        ...race,
        averageRating: overall,
        ratings: {
          logistics,
          food,
          route,
          sports,
          price,
          overall,
        }
      }
    })

    return NextResponse.json(racesWithRatings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des courses' },
      { status: 500 }
    )
  }
}

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
    const { name, description, location, date, website } = raceSchema.parse(body)

    const race = await prisma.race.create({
      data: {
        name,
        description: description || null,
        location,
        date,
        website: website || null,
        createdBy: user.id,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(race)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la course' },
      { status: 500 }
    )
  }
}
