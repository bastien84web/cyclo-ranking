'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Image as ImageIcon, Upload, Save, X, Edit, Trash2, Calendar, MapPin, Route, Globe, FileText, AlertTriangle } from 'lucide-react'
import { SafeImage } from '@/components/SafeImage'

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
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRace, setEditingRace] = useState<Race | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    distance: '',
    website: '',
    logoUrl: '',
    imageUrl: ''
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const imageFileRef = useRef<HTMLInputElement>(null)

  // Vérifier si l'utilisateur est admin (email admin@cycloranking.com)
  const isAdmin = session?.user?.email === 'admin@cycloranking.com'

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    if (!isAdmin) {
      router.push('/')
      return
    }

    fetchRaces()
  }, [session, status, isAdmin, router])

  const fetchRaces = async () => {
    try {
      const response = await fetch('/api/races')
      if (response.ok) {
        const data = await response.json()
        setRaces(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (race: Race) => {
    setEditingRace(race)
    setFormData({
      name: race.name || '',
      description: race.description || '',
      location: race.location || '',
      date: race.date ? race.date.split('T')[0] : '',
      distance: race.distance || '',
      website: race.website || '',
      logoUrl: race.logoUrl || '',
      imageUrl: race.imageUrl || ''
    })
  }

  const handleSave = async () => {
    if (!editingRace) return

    setSaving(true)
    try {
      const response = await fetch(`/api/races/${editingRace.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedRace = await response.json()
        setRaces(races.map(race => 
          race.id === editingRace.id ? updatedRace : race
        ))
        handleCancel()
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (raceId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette cyclosportive ? Cette action est irréversible.')) {
      return
    }

    try {
      const response = await fetch(`/api/races/${raceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRaces(races.filter(race => race.id !== raceId))
        setDeleteConfirm(null)
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleFileUpload = async (file: File, type: 'logo' | 'image') => {
    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({
          ...prev,
          [type === 'logo' ? 'logoUrl' : 'imageUrl']: result.url
        }))
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setEditingRace(null)
    setFormData({
      name: '',
      description: '',
      location: '',
      date: '',
      distance: '',
      website: '',
      logoUrl: '',
      imageUrl: ''
    })
  }

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration - Gestion des Images</h1>
          <p className="text-gray-600">
            Ajoutez des logos et images pour les cyclosportives. 
            Utilisez des URLs d'images hébergées ou des chemins relatifs vers /public/
          </p>
        </div>

        {/* Modal d'édition complet */}
        {editingRace && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Edit className="h-6 w-6 mr-2 text-primary-600" />
                    Modifier la Cyclosportive
                  </h2>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      Nom de la cyclosportive *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Localisation *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateFormField('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateFormField('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Route className="h-4 w-4 inline mr-1" />
                      Distance
                    </label>
                    <input
                      type="text"
                      value={formData.distance}
                      onChange={(e) => updateFormField('distance', e.target.value)}
                      placeholder="Ex: 120 km, 80-160 km"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Site web
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormField('website', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Description de la cyclosportive..."
                  />
                </div>

                {/* Section Images */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Images et Logos
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo de la cyclosportive
                      </label>
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={formData.logoUrl}
                          onChange={(e) => updateFormField('logoUrl', e.target.value)}
                          placeholder="URL du logo ou chemin /logos/logo.png"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">ou</span>
                          <input
                            ref={logoFileRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file, 'logo')
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => logoFileRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            {uploading ? 'Upload...' : 'Upload fichier'}
                          </button>
                        </div>
                        {formData.logoUrl && (
                          <div className="mt-2">
                            <SafeImage 
                              src={formData.logoUrl} 
                              alt="Logo preview" 
                              width={128}
                              height={64}
                              className="object-contain border rounded" 
                              fallbackSrc="/logos/placeholder.svg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image de fond */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image de fond
                      </label>
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => updateFormField('imageUrl', e.target.value)}
                          placeholder="URL de l'image ou chemin /images/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">ou</span>
                          <input
                            ref={imageFileRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file, 'image')
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => imageFileRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            {uploading ? 'Upload...' : 'Upload fichier'}
                          </button>
                        </div>
                        {formData.imageUrl && (
                          <div className="mt-2">
                            <SafeImage 
                              src={formData.imageUrl} 
                              alt="Image preview" 
                              width={192}
                              height={96}
                              className="object-cover border rounded" 
                              fallbackSrc="/images/placeholder.svg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="border-t pt-6 flex justify-between">
                  <button
                    onClick={() => handleDelete(editingRace.id)}
                    className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </button>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !formData.name.trim() || !formData.location.trim()}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liste des courses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Cyclosportives ({races.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {races.map((race) => (
              <div key={race.id} className="px-6 py-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{race.name}</h3>
                      {race.website && (
                        <a
                          href={race.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {race.location}
                      </div>
                      
                      {race.date && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(race.date).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                      
                      {race.distance && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Route className="h-4 w-4 mr-2 text-gray-400" />
                          {race.distance}
                        </div>
                      )}
                    </div>

                    {race.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {race.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-xs">
                        <ImageIcon className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-gray-500 mr-1">Logo:</span>
                        {race.logoUrl ? (
                          <span className="text-green-600 font-medium">✓ Défini</span>
                        ) : (
                          <span className="text-gray-400">Non défini</span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs">
                        <ImageIcon className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-gray-500 mr-1">Image:</span>
                        {race.imageUrl ? (
                          <span className="text-green-600 font-medium">✓ Définie</span>
                        ) : (
                          <span className="text-gray-400">Non définie</span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs">
                        <FileText className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-gray-500 mr-1">Description:</span>
                        {race.description ? (
                          <span className="text-green-600 font-medium">✓ Complète</span>
                        ) : (
                          <span className="text-gray-400">Manquante</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(race)}
                      className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                    
                    <button
                      onClick={() => handleDelete(race.id)}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Guide d'Administration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">📝 Gestion des Cyclosportives</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Modifier :</strong> Cliquez sur "Modifier" pour éditer tous les champs</li>
                <li>• <strong>Supprimer :</strong> Bouton rouge pour supprimer définitivement</li>
                <li>• <strong>Champs obligatoires :</strong> Nom et localisation requis</li>
                <li>• <strong>Date :</strong> Format automatique YYYY-MM-DD</li>
                <li>• <strong>Distance :</strong> Ex: "120 km" ou "80-160 km"</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">🖼️ Gestion des Images</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Upload direct :</strong> Glissez-déposez ou sélectionnez un fichier</li>
                <li>• <strong>URLs externes :</strong> Collez l'URL d'une image en ligne</li>
                <li>• <strong>Formats :</strong> JPG, PNG, SVG, WebP (max 5MB)</li>
                <li>• <strong>Logos :</strong> 200x100px recommandé (ratio 2:1)</li>
                <li>• <strong>Images :</strong> 400x200px minimum pour le fond</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">⚠️ Attention</h4>
            <p className="text-sm text-blue-800">
              La suppression d'une cyclosportive est <strong>irréversible</strong> et supprimera également tous les votes associés. 
              Assurez-vous de bien vouloir supprimer avant de confirmer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
