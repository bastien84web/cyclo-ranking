import { PrismaClient } from '@prisma/client'
import CarteClient from '@/components/CarteClient'

const prisma = new PrismaClient()

async function getRaces() {
  const races = await prisma.race.findMany({
    include: {
      votes: true
    },
    orderBy: {
      date: 'asc'
    }
  })

  return races.map(race => {
    const totalVotes = race.votes.length
    const averageRating = totalVotes > 0
      ? race.votes.reduce((sum, vote) => {
          const avg = (
            vote.accommodationAvailability +
            vote.parkingAvailability +
            vote.startFinishDistance +
            vote.foodQuality +
            vote.foodQuantity +
            vote.foodConviviality +
            vote.safety +
            vote.signage +
            vote.traffic +
            vote.scenery +
            vote.routeVariety +
            vote.priceValue
          ) / 12
          return sum + avg
        }, 0) / totalVotes
      : 0

    return {
      id: race.id,
      name: race.name,
      location: race.location,
      date: race.date,
      distance: race.distance || 'Distance non spécifiée',
      averageRating,
      voteCount: totalVotes
    }
  })
}

export default async function CartePage() {
  const races = await getRaces()
  return <CarteClient races={races} />
}
