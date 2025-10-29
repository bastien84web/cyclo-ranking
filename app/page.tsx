import { RaceList } from '@/components/RaceList'
import { Hero } from '@/components/Hero'
import { StructuredData } from '@/components/StructuredData'

export default function Home() {
  return (
    <div>
      <StructuredData type="website" data={{}} />
      <Hero />
      

      <div className="container mx-auto px-4 py-8">
        <RaceList />
      </div>

      {/* Section FAQ SEO */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Questions Fréquentes sur les Cyclosportives
            </h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Qu'est-ce qu'une cyclosportive ?
                </h3>
                <p className="text-gray-700">
                  Une cyclosportive est une épreuve cycliste ouverte à tous, sur route fermée ou sécurisée, 
                  proposant généralement plusieurs parcours de distances différentes. Ces événements allient 
                  défi sportif et convivialité, avec ravitaillements et assistance technique.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Comment choisir sa cyclosportive ?
                </h3>
                <p className="text-gray-700">
                  Le choix dépend de votre niveau, vos objectifs et vos préférences. Consultez notre classement 
                  basé sur les avis des participants : difficulté du parcours, qualité de l'organisation, 
                  ambiance, rapport qualité-prix. Les cyclosportives comme La Marmotte conviennent aux cyclistes 
                  expérimentés, tandis que L'Ardéchoise propose des parcours pour tous niveaux.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
