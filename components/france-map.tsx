'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngExpression, Icon } from 'leaflet'
import { CommentsModal } from './CommentsModal'
import 'leaflet/dist/leaflet.css'

// Fix pour l'icône par défaut de Leaflet
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

interface FranceMapProps {
  races: Race[]
}

// Coordonnées approximatives des principales villes françaises
const cityCoordinates: { [key: string]: LatLngExpression } = {
  // Alsace
  'Hégenheim': [47.5800, 7.5200],
  'Kruth-Wildenstein': [47.9400, 7.0300],
  'Thann': [47.8100, 7.1000],
  
  // Aquitaine
  'Prayssas': [44.2900, 0.4900],
  'Saint-Sever': [43.7600, -0.5700],
  'Cambo-les-Bains': [43.3600, -1.4000],
  'Saint-Jean-de-Luz': [43.3883, -1.6600],
  'Lourdes': [43.0947, 0.0464],
  'Le Lardin-Saint-Lazare': [45.1300, 1.2300],
  'Asson': [43.0700, -0.2500],
  'Mauléon-Licharre': [43.2200, -0.8800],
  
  // Auvergne
  'Volvic': [45.8700, 3.0400],
  'Ambert': [45.5500, 3.7400],
  'Saint-Flour': [45.0340, 3.0930],
  'Chambon-sur-Lac': [45.5700, 2.9200],
  
  // Basse-Normandie
  'Argentan': [48.7440, -0.0220],
  'Juaye-Mondaye': [49.2300, -0.6500],
  
  // Bourgogne
  'Arnay-le-Duc': [47.1300, 4.4900],
  'Chailly-sur-Armançon': [47.2500, 4.6700],
  'Corbigny': [47.2600, 3.6800],
  
  // Bretagne
  'Lannelis': [48.5700, -4.5200],
  'Malestroit': [47.8100, -2.3800],
  
  // Champagne-Ardenne
  'Bar-sur-Aube': [48.2300, 4.7100],
  
  // Corse
  'Bastelicaccia': [41.9200, 8.8200],
  
  // DOM-TOM
  'Capesterre-Belle-Eau': [16.0400, -61.5600],
  
  // Franche-Comté
  'Besançon': [47.2380, 6.0240],
  'Viré': [46.4300, 4.7800],
  'Vitry-en-Charollais': [46.5900, 4.1700],
  'Lons-le-Saunier': [46.6700, 5.5500],
  'Ronchamp': [47.7000, 6.6300],
  'Luxeuil-les-Bains': [47.8200, 6.3800],
  'Dole': [47.0900, 5.4900],
  'Champagnole': [46.7500, 5.9100],
  
  // Ile-de-France
  'Mennecy': [48.5700, 2.4300],
  'Paley': [48.4500, 3.0800],
  'Oncy-sur-Ecole': [48.3300, 2.4800],
  'Egreville': [48.1700, 2.8800],
  
  // Languedoc-Roussillon
  'Valflaunès': [43.7700, 3.8200],
  'Montagnac': [43.4800, 3.4800],
  'Rivesaltes': [42.7700, 2.8700],
  'Cornillon': [44.2500, 4.5700],
  'La Canourgue': [44.4300, 3.2200],
  'L\'Espérou': [44.0400, 3.6100],
  
  // Limousin
  'Tulle': [45.2650, 1.7660],
  'Panazol': [45.8400, 1.3100],
  
  // Lorraine
  'Vittel': [48.2000, 5.9500],
  'Epinal': [48.1740, 6.4500],
  'La Bresse': [48.0100, 6.8700],
  'Gérardmer': [48.0700, 6.8800],
  'Neuves-Maisons': [48.6200, 6.1000],
  'Damelevières': [48.5600, 6.3800],
  
  // Midi-Pyrénées
  'Ju-Belloc': [43.7500, 0.0800],
  'La Primaube': [44.2900, 2.5500],
  'Bagnères-de-Luchon': [42.7900, 0.5900],
  'Murat-sur-Vèbre': [43.7200, 2.8700],
  'Tarascon-sur-Ariège': [42.8500, 1.6100],
  'Argelès-Gazost': [43.0000, -0.1000],
  'Figeac': [44.6100, 2.0300],
  'Roquefort-sur-Soulzon': [43.9800, 2.9900],
  'Saint-Girons': [42.9800, 1.1500],
  'Mazamet': [43.4900, 2.3700],
  'Castres': [43.6050, 2.2420],
  
  // Nord - Pas-de-Calais
  'Denain': [50.3290, 3.3950],
  
  // PACA
  'Cannes': [43.5528, 7.0174],
  'Apt': [43.8760, 5.3960],
  'La Cadière d\'Azur': [43.1900, 5.7400],
  'La Motte-du-Caire': [44.3200, 6.0300],
  'Vence': [43.7230, 7.1120],
  'Gréoux-les-Bains': [43.7600, 5.8800],
  'Vaison la Romaine': [44.2420, 5.0750],
  'Drap': [43.7500, 7.3200],
  'Le Castellet': [43.2000, 5.7800],
  'Valberg': [44.0900, 6.9300],
  'Manosque': [43.8300, 5.7800],
  'Saint-Etienne-en-Dévoluy': [44.6800, 5.9000],
  'Orcières': [44.6900, 6.3300],
  'Breil-sur-Roya': [43.9300, 7.5100],
  'Castellane': [43.8470, 6.5140],
  'Hyères': [43.1200, 6.1300],
  'Marseille': [43.2965, 5.3698],
  'Maussane-les-Alpilles': [43.7200, 4.8000],
  'Fréjus': [43.4330, 6.7360],
  
  // Pays de la Loire
  'Saint Mars La Réorthe': [46.7200, -0.9100],
  'Evron': [48.1600, -0.4000],
  'Les Herbiers': [46.8700, -1.0100],
  'Le Mans': [48.0060, 0.1990],
  
  // Picardie
  'Eaucourt-sur-Somme': [50.0900, 1.8600],
  
  // Poitou-Charentes
  'Saint-Vulbas': [45.8400, 5.2800],
  'Tusson': [45.9800, 0.1500],
  
  // Rhône-Alpes
  'Montélimar': [44.5580, 4.7510],
  'Vercheny': [44.7400, 5.0700],
  'Lagnieu': [45.9000, 5.3500],
  'Thonon-les-Bains': [46.3700, 6.4800],
  'Vizille': [45.0800, 5.7700],
  'Belley': [45.7600, 5.6900],
  'Villard-de-Lans': [45.0700, 5.5500],
  'La Tour-de-Salvagny': [45.8100, 4.7100],
  'Motz': [45.9200, 5.8300],
  'Bonneville': [46.0800, 6.4000],
  'Saint-Michel-de-Maurienne': [45.2200, 6.4700],
  'Saint-Félicien': [45.0860, 4.6360],
  'Vaujany': [45.1700, 6.0700],
  'Châtel': [46.2650, 6.8410],
  'Salins-les-Bains': [46.9400, 5.8800],
  'Le Bourg d\'Oisans': [45.0560, 6.0300],
  'Grenoble': [45.1885, 5.7245],
  'Les Carroz': [46.0300, 6.6400],
  'Les Saisies': [45.7600, 6.5300],
  'Bletterans': [46.7500, 5.4500],
  'Brides-les-Bains': [45.4500, 6.5700],
  'La Toussuire': [45.2500, 6.3000],
  'Albertville': [45.6760, 6.3920],
  'La Chambre': [45.4200, 6.3700],
  'Chambéry': [45.5640, 5.9200],
  'Les Abrets en Dauphiné': [45.5400, 5.5800],
  'Pays de Gex': [46.3300, 6.0600],
  'Saint Jorioz': [45.8300, 6.1700],
  'Megève': [45.8560, 6.6170],
  'Saint-Just-en-Chevalet': [45.9200, 3.8600],
  'Laffrey': [45.0000, 5.7700],
  'Die': [44.7540, 5.3690],
  'Péronnas': [46.1800, 5.2000]
}

export default function FranceMap({ races }: FranceMapProps) {
  const [selectedRace, setSelectedRace] = useState<{ id: string; name: string; location: string } | null>(null)
  
  // Centre de la France
  const franceCenter: LatLngExpression = [46.603354, 1.888334]

  return (
    <>
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={franceCenter}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {races.map((race) => {
            // Extraire la ville principale de la location
            const ville = race.location.split(',')[0].trim()
            const coords = cityCoordinates[ville]
            
            if (!coords) {
              console.warn(`Coordonnées non trouvées pour: ${ville}`)
              return null
            }

            return (
              <Marker key={race.id} position={coords}>
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <h3 className="font-bold text-lg mb-2">{race.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      📍 {race.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      📅 {new Date(race.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      🚴 {race.distance}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Note moyenne:</span>
                        <span className="text-lg font-bold text-blue-600">
                          {race.averageRating.toFixed(1)} / 5
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        {race.voteCount} {race.voteCount > 1 ? 'votes' : 'vote'}
                      </p>
                      <button
                        onClick={() => setSelectedRace({
                          id: race.id,
                          name: race.name,
                          location: race.location
                        })}
                        className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Voir les commentaires
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {selectedRace && (
        <CommentsModal
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
        />
      )}
    </>
  )
}
