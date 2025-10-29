'use client'

import { useState } from 'react'
import { MapPin, Calendar, Users, Star, ExternalLink, Route, MessageCircle } from 'lucide-react'
import { VoteModal } from './VoteModal'
import { CommentsModal } from './CommentsModal'
import { SafeImage } from './SafeImage'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Race {
  id: string
  name: string
  description?: string
  location: string
  date: string
  distance?: string
  website?: string
  logoUrl?: string
  imageUrl?: string
  creator: {
    name: string
    email: string
  }
  _count: {
    votes: number
  }
  averageRating: number
  ratings: {
    logistics: number
    food: number
    route: number
    sports: number
    price: number
    overall: number
  }
}

interface RaceCardProps {
  race: Race
}

export function RaceCard({ race }: RaceCardProps) {
  const { data: session } = useSession()
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        {/* Image de fond ou logo */}
        {race.imageUrl && (
          <div className="relative h-48 w-full">
            <SafeImage
              src={race.imageUrl}
              alt={`Image de ${race.name}`}
              fill
              className="object-cover"
              fallbackSrc="/images/placeholder.svg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {race.logoUrl && (
              <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2">
                <SafeImage
                  src={race.logoUrl}
                  alt={`Logo de ${race.name}`}
                  width={60}
                  height={30}
                  className="object-contain"
                  fallbackSrc="/logos/placeholder.svg"
                />
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {/* Logo seul si pas d'image de fond */}
              {!race.imageUrl && race.logoUrl && (
                <div className="flex-shrink-0">
                  <SafeImage
                    src={race.logoUrl}
                    alt={`Logo de ${race.name}`}
                    width={50}
                    height={25}
                    className="object-contain"
                    fallbackSrc="/logos/placeholder.svg"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                {race.name}
              </h3>
            </div>
            {race.website && (
              <a
                href={race.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>

        {race.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {race.description}
          </p>
        )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              {race.location}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(race.date)}
            </div>
            {race.distance && (
              <div className="flex items-center text-gray-600 text-sm">
                <Route className="h-4 w-4 mr-2" />
                {race.distance}
              </div>
            )}
            <div className="flex items-center text-gray-600 text-sm">
              <Users className="h-4 w-4 mr-2" />
              {race._count.votes} vote{race._count.votes !== 1 ? 's' : ''}
            </div>
          </div>

        {race._count.votes > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="flex">
                {getRatingStars(race.averageRating)}
              </div>
              <span className={`ml-2 font-semibold ${getRatingColor(race.averageRating)}`}>
                {race.averageRating.toFixed(1)}/5
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Logistique: {race.ratings.logistics.toFixed(1)}</div>
              <div>Ravitaillement: {race.ratings.food.toFixed(1)}</div>
              <div>Parcours: {race.ratings.route.toFixed(1)}</div>
              <div>Défis sportifs: {race.ratings.sports.toFixed(1)}</div>
              <div className="col-span-2">Prix: {race.ratings.price.toFixed(1)}</div>
            </div>
          </div>
        )}

          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Par {race.creator.name}
              </span>
              
              {session ? (
                <button
                  onClick={() => setShowVoteModal(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  Voter
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm"
                >
                  Connectez-vous pour voter
                </Link>
              )}
            </div>
            
            {/* Bouton pour voir les commentaires */}
            <button
              onClick={() => setShowCommentsModal(true)}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Voir les commentaires</span>
            </button>
          </div>
        </div>
      </div>

      {showVoteModal && (
        <VoteModal
          race={race}
          onClose={() => setShowVoteModal(false)}
          onVoteSubmitted={() => {
            setShowVoteModal(false)
            // Refresh the page to update ratings
            window.location.reload()
          }}
        />
      )}

      {showCommentsModal && (
        <CommentsModal
          race={{
            id: race.id,
            name: race.name,
            location: race.location
          }}
          onClose={() => setShowCommentsModal(false)}
        />
      )}
    </>
  )
}
