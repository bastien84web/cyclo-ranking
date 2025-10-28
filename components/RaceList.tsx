'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { RaceCard } from './RaceCard'
import { LoadingSpinner } from './LoadingSpinner'

interface Race {
  id: string
  name: string
  description?: string
  location: string
  date: string
  website?: string
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

export function RaceList() {
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'date' | 'votes'>('rating')
  const [searchTerm, setSearchTerm] = useState('')

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
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'votes':
        return b._count.votes - a._count.votes
      default:
        return 0
    }
  })

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
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Courses Cyclosportives ({filteredRaces.length} / {races.length})
          </h2>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Trier par:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'date' | 'votes')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="rating">Note moyenne</option>
              <option value="date">Date</option>
              <option value="votes">Nombre de votes</option>
            </select>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une course, lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

      {sortedRaces.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <>
              <p className="text-gray-600 text-lg">Aucune course trouvée pour "{searchTerm}"</p>
              <p className="text-gray-500 mt-2">Essayez avec d'autres mots-clés ou effacez la recherche.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRaces.map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      )}
    </div>
  )
}
