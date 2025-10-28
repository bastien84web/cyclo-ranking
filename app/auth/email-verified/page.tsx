'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Email vérifié avec succès !
          </h1>
          <p className="text-gray-600">
            Votre compte a été activé. Vous pouvez maintenant vous connecter et commencer à voter pour vos cyclosportives préférées.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium inline-block"
          >
            Se connecter
          </Link>
          
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium inline-block"
          >
            Retour à l'accueil
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            🚴‍♂️ Bienvenue dans la communauté Cyclo Ranking !
          </p>
        </div>
      </div>
    </div>
  )
}
