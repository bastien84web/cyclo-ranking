'use client'

import { useEffect, useState } from 'react'
import { X, MessageCircle, Star, User, Calendar } from 'lucide-react'

interface Comment {
  id: string
  comment: string
  createdAt: string
  user: {
    name: string
    email: string
  }
  ratings: {
    logistics: number
    food: number
    route: number
    sports: number
    price: number
    overall: number
  }
}

interface Race {
  id: string
  name: string
  location: string
}

interface CommentsModalProps {
  race: Race
  onClose: () => void
}

export function CommentsModal({ race, onClose }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [race.id])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/races/${race.id}/comments`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commentaires')
      }
      
      const data = await response.json()
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-primary-600" />
              Commentaires
            </h2>
            <p className="text-gray-600 mt-1">
              {race.name} - {race.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Chargement des commentaires...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchComments}
                className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Aucun commentaire pour le moment</p>
              <p className="text-gray-500 mt-2">Soyez le premier à laisser un avis sur cette cyclosportive !</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {comments.length} commentaire{comments.length > 1 ? 's' : ''} trouvé{comments.length > 1 ? 's' : ''}
                </p>
              </div>

              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  {/* User info and date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-primary-100 rounded-full p-2 mr-3">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{comment.user.name}</p>
                        <p className="text-xs text-gray-500">{comment.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>

                  {/* Overall rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {getRatingStars(comment.ratings.overall)}
                    </div>
                    <span className={`font-semibold ${getRatingColor(comment.ratings.overall)}`}>
                      {comment.ratings.overall.toFixed(1)}/5
                    </span>
                  </div>

                  {/* Detailed ratings */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-gray-700">Logistique</div>
                      <div className={`font-semibold ${getRatingColor(comment.ratings.logistics)}`}>
                        {comment.ratings.logistics.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-700">Ravitaillement</div>
                      <div className={`font-semibold ${getRatingColor(comment.ratings.food)}`}>
                        {comment.ratings.food.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-700">Parcours</div>
                      <div className={`font-semibold ${getRatingColor(comment.ratings.route)}`}>
                        {comment.ratings.route.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-700">Défis sportifs</div>
                      <div className={`font-semibold ${getRatingColor(comment.ratings.sports)}`}>
                        {comment.ratings.sports.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-700">Prix</div>
                      <div className={`font-semibold ${getRatingColor(comment.ratings.price)}`}>
                        {comment.ratings.price.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Comment text */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
