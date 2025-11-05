'use client'

import { useState } from 'react'
import FranceMapWrapper from './france-map-wrapper'
import { CommentsModal } from './CommentsModal'
import Link from 'next/link'
import { Map as MapIcon } from 'lucide-react'

interface Race {
  id: string
  name: string
  location: string
  date: Date
  distance: string
  averageRating: number
  voteCount: number
}

interface HomeMapSectionProps {
  races: Race[]
}

export function HomeMapSection({ races }: HomeMapSectionProps) {
  const [selectedRace, setSelectedRace] = useState<{ id: string; name: string; location: string } | null>(null)

  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <MapIcon className="h-10 w-10 text-blue-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Carte Interactive des Cyclosportives
              </h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explorez les {races.length} cyclosportives réparties dans toute la France
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
              <p className="text-white text-center font-medium">
                🗺️ Cliquez sur un marqueur pour voir les détails et commentaires
              </p>
            </div>
            
            <div className="p-6">
              <FranceMapWrapper races={races} />
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-blue-600">{races.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Cyclosportives</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {races.reduce((sum, race) => sum + race.voteCount, 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Votes</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {(races.reduce((sum, race) => sum + race.averageRating, 0) / races.length).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Note moyenne</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {new Set(races.map(r => r.location.split(',')[1]?.trim())).size}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Régions</p>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/carte"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  <MapIcon className="h-5 w-5" />
                  <span>Voir la carte en plein écran</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedRace && (
        <CommentsModal
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
        />
      )}
    </>
  )
}
