'use client'

import { useState, useEffect } from 'react'
import { X, Star } from 'lucide-react'

interface Race {
  id: string
  name: string
  location: string
}

interface VoteModalProps {
  race: Race
  onClose: () => void
  onVoteSubmitted: () => void
}

interface VoteData {
  accommodationAvailability: number
  parkingAvailability: number
  startFinishDistance: number
  foodQuality: number
  foodQuantity: number
  foodConviviality: number
  safety: number
  signage: number
  traffic: number
  scenery: number
  routeVariety: number
  priceValue: number
  comment: string
}

export function VoteModal({ race, onClose, onVoteSubmitted }: VoteModalProps) {
  const [voteData, setVoteData] = useState<VoteData>({
    accommodationAvailability: 3,
    parkingAvailability: 3,
    startFinishDistance: 3,
    foodQuality: 3,
    foodQuantity: 3,
    foodConviviality: 3,
    safety: 3,
    signage: 3,
    traffic: 3,
    scenery: 3,
    routeVariety: 3,
    priceValue: 3,
    comment: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    checkIfVoted()
  }, [race.id])

  const checkIfVoted = async () => {
    try {
      const response = await fetch(`/api/votes?raceId=${race.id}`)
      if (response.ok) {
        const data = await response.json()
        setHasVoted(data.hasVoted)
      }
    } catch (err) {
      console.error('Error checking vote status:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceId: race.id,
          ...voteData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors du vote')
      }

      onVoteSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const updateRating = (field: keyof VoteData, value: number) => {
    setVoteData(prev => ({ ...prev, [field]: value }))
  }

  const StarRating = ({ value, onChange, label }: {
    value: number
    onChange: (value: number) => void
    label: string
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 hover:text-yellow-200'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  if (hasVoted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Vote déjà enregistré</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Vous avez déjà voté pour cette course. Chaque utilisateur ne peut voter qu'une seule fois par course.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Voter pour</h2>
              <p className="text-gray-600">{race.name} - {race.location}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Logistique */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Logistique</h3>
                <StarRating
                  value={voteData.accommodationAvailability}
                  onChange={(value) => updateRating('accommodationAvailability', value)}
                  label="Disponibilité d'hébergement à proximité du départ"
                />
                <StarRating
                  value={voteData.parkingAvailability}
                  onChange={(value) => updateRating('parkingAvailability', value)}
                  label="Parkings à proximité du départ"
                />
                <StarRating
                  value={voteData.startFinishDistance}
                  onChange={(value) => updateRating('startFinishDistance', value)}
                  label="Distance entre le départ et l'arrivée"
                />
              </div>

              {/* Ravitaillement et repas */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ravitaillement et repas</h3>
                <StarRating
                  value={voteData.foodQuality}
                  onChange={(value) => updateRating('foodQuality', value)}
                  label="Qualité"
                />
                <StarRating
                  value={voteData.foodQuantity}
                  onChange={(value) => updateRating('foodQuantity', value)}
                  label="Quantité"
                />
                <StarRating
                  value={voteData.foodConviviality}
                  onChange={(value) => updateRating('foodConviviality', value)}
                  label="Convivialité"
                />
              </div>

              {/* Parcours */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Parcours</h3>
                <StarRating
                  value={voteData.safety}
                  onChange={(value) => updateRating('safety', value)}
                  label="Sécurité"
                />
                <StarRating
                  value={voteData.signage}
                  onChange={(value) => updateRating('signage', value)}
                  label="Fléchage"
                />
                <StarRating
                  value={voteData.traffic}
                  onChange={(value) => updateRating('traffic', value)}
                  label="Circulation"
                />
                <StarRating
                  value={voteData.scenery}
                  onChange={(value) => updateRating('scenery', value)}
                  label="Beauté du parcours"
                />
              </div>

              {/* Défis sportifs */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Défis sportifs</h3>
                <StarRating
                  value={voteData.routeVariety}
                  onChange={(value) => updateRating('routeVariety', value)}
                  label="Différents parcours adaptés à chaque niveau"
                />
              </div>

              {/* Prix */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Prix</h3>
                <StarRating
                  value={voteData.priceValue}
                  onChange={(value) => updateRating('priceValue', value)}
                  label="Rapport qualité-prix"
                />
              </div>

              {/* Commentaire */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Commentaire (optionnel)</h3>
                <textarea
                  value={voteData.comment}
                  onChange={(e) => setVoteData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Partagez votre expérience, vos conseils ou remarques sur cette cyclosportive..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {voteData.comment.length}/500 caractères
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Envoi...' : 'Soumettre le vote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
