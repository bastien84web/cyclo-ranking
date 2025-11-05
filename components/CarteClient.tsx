'use client'

import { useState } from 'react'
import FranceMapWrapper from './france-map-wrapper'
import { CommentsModal } from './CommentsModal'
import Link from 'next/link'

interface Race {
  id: string
  name: string
  location: string
  date: Date
  distance: string
  averageRating: number
  voteCount: number
}

interface CarteClientProps {
  races: Race[]
}

export default function CarteClient({ races }: CarteClientProps) {
  const [selectedRace, setSelectedRace] = useState<{ id: string; name: string; location: string } | null>(null)

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Carte des Cyclosportives 2025
                </h1>
                <p className="text-gray-600 mt-2">
                  Découvrez les {races.length} cyclosportives réparties sur tout le territoire
                </p>
              </div>
              <Link
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Retour à la liste
              </Link>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Carte interactive
              </h2>
              <p className="text-gray-600 text-sm">
                Cliquez sur un marqueur pour voir les détails de la cyclosportive
              </p>
            </div>
            
            <FranceMapWrapper races={races} />
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{races.length}</p>
                <p className="text-sm text-gray-600">Cyclosportives</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {races.reduce((sum, race) => sum + race.voteCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Votes totaux</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {(races.reduce((sum, race) => sum + race.averageRating, 0) / races.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(races.map(r => r.location.split(',')[1]?.trim())).size}
                </p>
                <p className="text-sm text-gray-600">Régions</p>
              </div>
            </div>
          </div>

          {/* Légende */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Légende</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📍</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Marqueur</p>
                  <p className="text-sm text-gray-600">Emplacement de la cyclosportive</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔍</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Zoom</p>
                  <p className="text-sm text-gray-600">Molette ou boutons +/-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste rapide */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Toutes les cyclosportives
            </h3>
            <div className="grid md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {races.map((race) => (
                <button
                  key={race.id}
                  onClick={() => setSelectedRace({
                    id: race.id,
                    name: race.name,
                    location: race.location
                  })}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
                >
                  <p className="font-medium text-gray-900 text-sm">{race.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{race.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">
                      ⭐ {race.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {race.voteCount} votes
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedRace && (
        <CommentsModal
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
        />
      )}
    </>
  )
}
