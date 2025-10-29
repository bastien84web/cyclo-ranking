import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { StructuredData } from '@/components/StructuredData'
import { Metadata } from 'next'

const prisma = new PrismaClient()

interface PageProps {
  params: { id: string }
}

async function getRace(id: string) {
  const race = await prisma.race.findUnique({
    where: { id },
    include: {
      votes: true,
      creator: {
        select: { name: true }
      },
      _count: {
        select: { votes: true }
      }
    }
  })

  if (!race) return null

  // Calculer la note moyenne
  const votes = race.votes
  const voteCount = votes.length
  let averageRating = 0

  if (voteCount > 0) {
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
    averageRating = (logistics + food + route + sports + price) / 5
  }

  return { ...race, averageRating }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const race = await getRace(params.id)
  
  if (!race) {
    return {
      title: 'Cyclosportive non trouvée',
    }
  }

  const ratingText = race.averageRating > 0 
    ? ` - Note ${race.averageRating.toFixed(1)}/5 (${race._count.votes} avis)`
    : ''

  return {
    title: `${race.name} - Avis et Classement${ratingText}`,
    description: `Découvrez ${race.name} à ${race.location}. ${race.description || 'Cyclosportive'} - Avis des participants, notes détaillées et informations pratiques.`,
    keywords: `${race.name}, cyclosportive ${race.location}, avis ${race.name}, classement cyclosportive`,
    openGraph: {
      title: `${race.name} - Cyclosportive ${race.location}`,
      description: race.description || `Cyclosportive ${race.name} à ${race.location}`,
      url: `https://meilleures-cyclosportives.com/race/${race.id}`,
    },
    alternates: {
      canonical: `https://meilleures-cyclosportives.com/race/${race.id}`,
    },
  }
}

export default async function RacePage({ params }: PageProps) {
  const race = await getRace(params.id)

  if (!race) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StructuredData type="race" data={race} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête de la course */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {race.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
              <span className="flex items-center">
                📍 {race.location}
              </span>
              <span className="flex items-center">
                📅 {new Date(race.date).toLocaleDateString('fr-FR')}
              </span>
              {race.distance && (
                <span className="flex items-center">
                  🚴 {race.distance}
                </span>
              )}
              {race.averageRating > 0 && (
                <span className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                  ⭐ {race.averageRating.toFixed(1)}/5 ({race._count.votes} avis)
                </span>
              )}
            </div>

            {race.description && (
              <div className="prose prose-lg max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {race.description}
                </p>
              </div>
            )}

            {race.website && (
              <a
                href={race.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                🌐 Site officiel
              </a>
            )}
          </div>

          {/* Section SEO supplémentaire */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Pourquoi participer à {race.name} ?
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                <strong>{race.name}</strong> fait partie des cyclosportives incontournables 
                {race.location.includes('France') ? ' de France' : ` de la région ${race.location}`}. 
                Cette épreuve cycliste attire chaque année des centaines de participants 
                venus découvrir les paysages exceptionnels et relever le défi sportif.
              </p>
              
              {race._count.votes > 0 && (
                <p>
                  Avec une note moyenne de <strong>{race.averageRating.toFixed(1)}/5</strong> 
                  basée sur {race._count.votes} avis de participants, {race.name} se distingue 
                  par la qualité de son organisation et l'expérience qu'elle offre aux cyclistes.
                </p>
              )}
              
              <p>
                Que vous soyez cycliste amateur ou confirmé, cette cyclosportive vous permettra 
                de découvrir de nouveaux horizons tout en partageant votre passion avec 
                d'autres amoureux du vélo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
