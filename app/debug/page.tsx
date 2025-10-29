'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface DiagnosticData {
  timestamp: string
  environment: {
    nextauth_secret: boolean
    nextauth_url: string
    database_url: boolean
    node_env: string
  }
  database: {
    status: string
    userCount: number
    raceCount: number
    adminExists: boolean
  }
  status: string
  error?: string
}

export default function DebugPage() {
  const [data, setData] = useState<DiagnosticData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDiagnostic = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug')
      const result = await response.json()
      setData(result)
    } catch (error) {
      setData({
        timestamp: new Date().toISOString(),
        environment: {
          nextauth_secret: false,
          nextauth_url: 'unknown',
          database_url: false,
          node_env: 'unknown'
        },
        database: {
          status: 'error',
          userCount: 0,
          raceCount: 0,
          adminExists: false
        },
        status: 'error',
        error: error instanceof Error ? error.message : 'Fetch failed'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiagnostic()
  }, [])

  const StatusIcon = ({ status }: { status: boolean | string }) => {
    if (typeof status === 'boolean') {
      return status ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )
    }
    
    if (status === 'connected' || status === 'ok') {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    
    if (status.includes('error')) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
    
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Diagnostic en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic Système</h1>
          <p className="text-gray-600">
            Vérification de la configuration en production
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière vérification : {data?.timestamp ? new Date(data.timestamp).toLocaleString('fr-FR') : 'N/A'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Status Global */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <StatusIcon status={data?.status === 'ok'} />
              <h2 className="text-xl font-semibold text-gray-900 ml-3">
                Status Global
              </h2>
            </div>
            <div className="text-lg">
              {data?.status === 'ok' ? (
                <span className="text-green-600 font-medium">✅ Système Opérationnel</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Problème Détecté</span>
              )}
            </div>
            {data?.error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 text-sm">{data.error}</p>
              </div>
            )}
          </div>

          {/* Variables d'Environnement */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Variables d'Environnement</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">NEXTAUTH_SECRET</span>
                <div className="flex items-center">
                  <StatusIcon status={data?.environment.nextauth_secret || false} />
                  <span className="ml-2 text-sm text-gray-600">
                    {data?.environment.nextauth_secret ? 'Configuré' : 'Manquant'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">NEXTAUTH_URL</span>
                <div className="flex items-center">
                  <StatusIcon status={!!data?.environment.nextauth_url} />
                  <span className="ml-2 text-sm text-gray-600">
                    {data?.environment.nextauth_url || 'Non défini'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">DATABASE_URL</span>
                <div className="flex items-center">
                  <StatusIcon status={data?.environment.database_url || false} />
                  <span className="ml-2 text-sm text-gray-600">
                    {data?.environment.database_url ? 'Configuré' : 'Manquant'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">NODE_ENV</span>
                <div className="flex items-center">
                  <StatusIcon status={data?.environment.node_env === 'production'} />
                  <span className="ml-2 text-sm text-gray-600">
                    {data?.environment.node_env || 'unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Base de Données */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Base de Données</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Connexion</span>
                <div className="flex items-center">
                  <StatusIcon status={data?.database.status || 'unknown'} />
                  <span className="ml-2 text-sm text-gray-600">
                    {data?.database.status || 'unknown'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Utilisateurs</span>
                <span className="text-sm text-gray-600">
                  {data?.database.userCount || 0} utilisateur(s)
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Cyclosportives</span>
                <span className="text-sm text-gray-600">
                  {data?.database.raceCount || 0} course(s)
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Admin Existe</span>
                <div className="flex items-center">
                  <StatusIcon status={data?.database.adminExists || false} />
                  <span className="ml-2 text-sm text-gray-600">
                    {data?.database.adminExists ? 'admin@cycloranking.com' : 'Non trouvé'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={fetchDiagnostic}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </button>
              
              <a
                href="/auth/signin"
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Tester Connexion
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
