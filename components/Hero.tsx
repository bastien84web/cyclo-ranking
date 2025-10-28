import { Trophy, Users, Star } from 'lucide-react'

export function Hero() {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Classement des Courses Cyclosportives
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Votez et découvrez les meilleures courses cyclosportives selon la communauté
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Classement Communautaire</h3>
              <p className="text-primary-100">
                Découvrez les courses les mieux notées par les cyclistes
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Critères Détaillés</h3>
              <p className="text-primary-100">
                Logistique, parcours, ravitaillement, prix - tous les aspects comptent
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Communauté Active</h3>
              <p className="text-primary-100">
                Partagez votre expérience et aidez les autres cyclistes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
