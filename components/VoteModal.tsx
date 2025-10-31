'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Star, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

// Fonction utilitaire debounce
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

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
  const [moderationResult, setModerationResult] = useState<{
    isApproved: boolean
    score: number
    reasons: string[]
    suggestions: string[]
    requiresManualReview: boolean
  } | null>(null)
  const [moderationLoading, setModerationLoading] = useState(false)

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

  const moderateCommentDebounced = useCallback(
    debounce(async (comment: string) => {
      if (!comment || comment.trim().length === 0) {
        setModerationResult(null)
        return
      }

      setModerationLoading(true)
      try {
        const response = await fetch('/api/moderate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment }),
        })

        if (response.ok) {
          const result = await response.json()
          setModerationResult(result)
        }
      } catch (err) {
        console.error('Error moderating comment:', err)
      } finally {
        setModerationLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    moderateCommentDebounced(voteData.comment)
  }, [voteData.comment, moderateCommentDebounced])

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
        if (errorData.reasons && errorData.suggestions) {
          // Erreur de modération
          setError(`${errorData.error}\n\nRaisons: ${errorData.reasons.join(', ')}\n\nSuggestions: ${errorData.suggestions.join(', ')}`)
        } else {
          setError(errorData.error || 'Erreur lors du vote')
        }
        return
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
                <div className="relative">
                  <textarea
                    value={voteData.comment}
                    onChange={(e) => setVoteData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Partagez votre expérience, vos conseils ou remarques sur cette cyclosportive..."
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none ${
                      moderationResult && !moderationResult.isApproved
                        ? 'border-red-300 focus:ring-red-500'
                        : moderationResult && moderationResult.isApproved
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-primary-500'
                    }`}
                    rows={4}
                    maxLength={500}
                  />
                  {moderationLoading && (
                    <div className="absolute top-2 right-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-start mt-2">
                  <div className="flex-1">
                    {moderationResult && voteData.comment.trim().length > 0 && (
                      <div className="text-sm">
                        {moderationResult.isApproved ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Commentaire approuvé (Score: {moderationResult.score}/100)</span>
                          </div>
                        ) : (
                          <div className="text-red-600">
                            <div className="flex items-center mb-1">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span>Commentaire refusé (Score: {moderationResult.score}/100)</span>
                            </div>
                            {moderationResult.reasons.length > 0 && (
                              <div className="ml-5 mb-2">
                                <p className="font-medium">Raisons:</p>
                                <ul className="list-disc list-inside">
                                  {moderationResult.reasons.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {moderationResult.suggestions.length > 0 && (
                              <div className="ml-5">
                                <p className="font-medium">Suggestions:</p>
                                <ul className="list-disc list-inside">
                                  {moderationResult.suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        {moderationResult.requiresManualReview && (
                          <div className="flex items-center text-yellow-600 mt-1">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Ce commentaire nécessitera une révision manuelle</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 ml-4">
                    {voteData.comment.length}/500 caractères
                  </p>
                </div>
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
                disabled={loading || (moderationResult !== null && !moderationResult.isApproved && voteData.comment.trim().length > 0)}
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
