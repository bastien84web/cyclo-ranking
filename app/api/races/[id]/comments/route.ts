import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer tous les votes avec commentaires pour cette course
    const votes = await prisma.vote.findMany({
      where: {
        raceId: params.id,
        AND: [
          { comment: { not: null } },
          { comment: { not: '' } }
        ]
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formater les données pour l'affichage
    const comments = votes.map(vote => ({
      id: vote.id,
      comment: vote.comment,
      createdAt: vote.createdAt,
      user: {
        name: vote.user.name,
        // Masquer l'email complet pour la confidentialité
        email: vote.user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      },
      ratings: {
        logistics: Math.round((vote.accommodationAvailability + vote.parkingAvailability + vote.startFinishDistance) / 3 * 10) / 10,
        food: Math.round((vote.foodQuality + vote.foodQuantity + vote.foodConviviality) / 3 * 10) / 10,
        route: Math.round((vote.safety + vote.signage + vote.traffic + vote.scenery) / 4 * 10) / 10,
        sports: vote.routeVariety,
        price: vote.priceValue,
        overall: Math.round(((vote.accommodationAvailability + vote.parkingAvailability + vote.startFinishDistance + 
                            vote.foodQuality + vote.foodQuantity + vote.foodConviviality +
                            vote.safety + vote.signage + vote.traffic + vote.scenery +
                            vote.routeVariety + vote.priceValue) / 12) * 10) / 10
      }
    }))

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
