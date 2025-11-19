'use client'

import { useEffect, useState } from 'react'
import { Search, Calendar, MapPin, Users, Star, ExternalLink, Route, MessageCircle, Edit } from 'lucide-react'
import { VoteModal } from './VoteModal'
import { CommentsModal } from './CommentsModal'
import { EditRaceModal } from './EditRaceModal'
import { SafeImage } from './SafeImage'
import { LoadingSpinner } from './LoadingSpinner'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getClosestSunday2026, formatDateFrench } from '@/lib/calendar-utils'

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

interface EnhancedRaceCalendarProps {
  showCalendar2026?: boolean
}

export function EnhancedRaceCalendar({ showCalendar2026 = false }: EnhancedRaceCalendarProps) {
  const { data: session } = useSession()
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'date' | 'votes' | 'name'>('date')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [showVoteModal, setShowVoteModal] = useState<string | null>(null)
  const [showCommentsModal, setShowCommentsModal] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState<string | null>(null)

  useEffect(() => {
    fetchRaces()
  }, [])

  const fetchRaces = async () => {
    try {
      const response = await fetch('/api/races')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des courses')
      }
      const data = await response.json()
      setRaces(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les courses par terme de recherche
  const filteredRaces = races.filter(race => 
    race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    race.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    race.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Trier les courses filtrées
  const sortedRaces = [...filteredRaces].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.averageRating - a.averageRating
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'votes':
        return b._count.votes - a._count.votes
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Grouper par mois pour l'affichage calendrier
  const groupRacesByMonth = (races: Race[]) => {
    const grouped = races.reduce((acc, race) => {
      let raceDate = new Date(race.date)
      
      // Si c'est le mode calendrier 2026, calculer la date 2026
      if (showCalendar2026) {
        raceDate = getClosestSunday2026(raceDate)
      }
      
      const month = raceDate.toLocaleDateString('fr-FR', { 
        month: 'long', 
        year: 'numeric' 
      })
      
      if (!acc[month]) {
        acc[month] = []
      }
      acc[month].push({
        ...race,
        displayDate: raceDate
      })
      return acc
    }, {} as Record<string, Array<Race & { displayDate: Date }>>)
    
    // Trier les courses dans chaque mois par date
    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => a.displayDate.getTime() - b.displayDate.getTime())
    })
    
    return grouped
  }

  const racesByMonth = groupRacesByMonth(sortedRaces)
  const months = Object.keys(racesByMonth).sort((a, b) => {
    const dateA = new Date(racesByMonth[a][0].displayDate)
    const dateB = new Date(racesByMonth[b][0].displayDate)
    return dateA.getTime() - dateB.getTime()
  })

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
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchRaces}
          className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* En-tête avec titre et contrôles */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                {showCalendar2026 ? 'Calendrier Prévisionnel 2026' : 'Calendrier des Cyclosportives 2025'}
              </h2>
            </div>
            
            {showCalendar2026 && (
              <p className="text-gray-600 max-w-2xl mx-auto text-center mb-6">
                Dates estimées basées sur les cyclosportives 2025. 
                Les dates correspondent au dimanche le plus proche de la date 2025.
              </p>
            )}

            {/* Contrôles de recherche et tri */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {filteredRaces.length} / {races.length} courses
                </span>
                
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                    Trier par:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'rating' | 'date' | 'votes' | 'name')}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Date</option>
                    <option value="rating">Note moyenne</option>
                    <option value="votes">Nombre de votes</option>
                    <option value="name">Nom</option>
                  </select>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="relative max-w-md w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une course, lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Affichage des résultats */}
          {sortedRaces.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <>
                  <p className="text-gray-600 text-lg">Aucune course trouvée pour "{searchTerm}"</p>
                  <p className="text-gray-500 mt-2">Essayez avec d'autres mots-clés ou effacez la recherche.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Effacer la recherche
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-lg">Aucune course disponible pour le moment.</p>
                  <p className="text-gray-500 mt-2">Soyez le premier à ajouter une course !</p>
                </>
              )}
            </div>
          ) : (
            /* Affichage par mois */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {months.map(month => (
                <div key={month} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                    {month}
                  </h3>
                  <div className="space-y-4">
                    {racesByMonth[month].map(race => (
                      <div key={race.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
                        {/* Image d'événement en haut à droite - Plus grande */}
                        {race.imageUrl && (
                          <div className="absolute top-3 right-3 w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white z-10">
                            <SafeImage
                              src={race.imageUrl}
                              alt={`Image de ${race.name}`}
                              fill
                              className="object-cover"
                              fallbackSrc="/images/placeholder.svg"
                            />
                          </div>
                        )}
                        
                        <div className="p-4">
                          {/* En-tête avec logo et actions */}
                          <div className="flex justify-between items-start mb-3 pr-24">
                            <div className="flex items-center gap-2 flex-1">
                              {race.logoUrl && (
                                <div className="flex-shrink-0">
                                  <SafeImage
                                    src={race.logoUrl}
                                    alt={`Logo de ${race.name}`}
                                    width={30}
                                    height={15}
                                    className="object-contain"
                                    fallbackSrc="/logos/placeholder.svg"
                                  />
                                </div>
                              )}
                              <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                {race.name}
                              </h4>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              {session && (
                                <button
                                  onClick={() => setShowEditModal(race.id)}
                                  className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                  title="Modifier"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                              )}
                              {race.website && (
                                <a
                                  href={race.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                  title="Site web"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>

                        {/* Informations de base */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-xs text-gray-600">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>
                              {showCalendar2026 
                                ? formatDateFrench(race.displayDate) 
                                : formatDate(race.date)
                              }
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{race.location}</span>
                          </div>
                          {race.distance && (
                            <div className="flex items-center text-xs text-gray-600">
                              <Route className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{race.distance}</span>
                            </div>
                          )}
                          <div className="flex items-center text-xs text-gray-600">
                            <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{race._count.votes} vote{race._count.votes !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        {/* Notation */}
                        {race._count.votes > 0 && (
                          <div className="mb-3 p-2 bg-gray-50 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <div className="flex">
                                  {getRatingStars(race.averageRating)}
                                </div>
                                <span className={`ml-1 text-xs font-semibold ${getRatingColor(race.averageRating)}`}>
                                  {race.averageRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                              <div>Logistique: {race.ratings.logistics.toFixed(1)}</div>
                              <div>Ravitaillement: {race.ratings.food.toFixed(1)}</div>
                              <div>Parcours: {race.ratings.route.toFixed(1)}</div>
                              <div>Prix: {race.ratings.price.toFixed(1)}</div>
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {race.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {race.description}
                          </p>
                        )}

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">Par {race.creator.name}</span>
                            </div>
                            
                            <div className="flex gap-2">
                              {session ? (
                                <button
                                  onClick={() => setShowVoteModal(race.id)}
                                  className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                                >
                                  Voter
                                </button>
                              ) : (
                                <Link
                                  href="/auth/signin"
                                  className="flex-1 bg-gray-300 text-gray-600 px-2 py-1 rounded text-xs text-center"
                                >
                                  Se connecter
                                </Link>
                              )}
                              
                              <button
                                onClick={() => setShowCommentsModal(race.id)}
                                className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
                              >
                                <MessageCircle className="h-3 w-3" />
                                <span>Avis</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note pour le calendrier 2026 */}
          {showCalendar2026 && sortedRaces.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                <strong>Note :</strong> Ces dates sont des estimations basées sur les cyclosportives 2025. 
                Les organisateurs peuvent modifier les dates réelles. Consultez les sites officiels pour confirmation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showVoteModal && (
        <VoteModal
          race={races.find(r => r.id === showVoteModal)!}
          onClose={() => setShowVoteModal(null)}
          onVoteSubmitted={() => {
            setShowVoteModal(null)
            fetchRaces()
          }}
        />
      )}

      {showCommentsModal && (
        <CommentsModal
          race={{
            id: showCommentsModal,
            name: races.find(r => r.id === showCommentsModal)?.name || '',
            location: races.find(r => r.id === showCommentsModal)?.location || ''
          }}
          onClose={() => setShowCommentsModal(null)}
        />
      )}

      {showEditModal && (
        <EditRaceModal
          race={races.find(r => r.id === showEditModal)!}
          onClose={() => setShowEditModal(null)}
          onRaceUpdated={() => {
            setShowEditModal(null)
            fetchRaces()
          }}
        />
      )}
    </div>
  )
}
