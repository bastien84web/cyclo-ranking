'use client'

import dynamic from 'next/dynamic'

// Import dynamique sans SSR pour éviter les erreurs
const FranceMap = dynamic(() => import('./france-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

interface Race {
  id: string
  name: string
  location: string
  date: Date
  distance: string
  averageRating: number
  voteCount: number
}

interface FranceMapWrapperProps {
  races: Race[]
}

export default function FranceMapWrapper({ races }: FranceMapWrapperProps) {
  return <FranceMap races={races} />
}
