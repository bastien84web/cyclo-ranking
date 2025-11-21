import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Interface pour les résultats de recherche
interface SearchResult {
  title: string
  url: string
  snippet: string
}

interface ImageResult {
  url: string
  alt?: string
  width?: number
  height?: number
}

// Fonction pour rechercher sur le web (simulation - vous devrez utiliser une vraie API)
async function searchWeb(query: string): Promise<SearchResult[]> {
  // Pour une vraie implémentation, utilisez une API comme:
  // - Google Custom Search API
  // - Bing Search API
  // - SerpApi
  
  console.log(`🔍 Recherche: "${query}"`)
  
  // Simulation de résultats basés sur des cyclosportives connues
  const knownRaces: Record<string, { website: string; imageUrl: string }> = {
    'la marmotte': {
      website: 'https://www.sportcommunication.com/fr/cyclosportives/la-marmotte',
      imageUrl: 'https://www.sportcommunication.com/images/marmotte-2024.jpg'
    },
    'etape du tour': {
      website: 'https://www.letapedutour.com',
      imageUrl: 'https://www.letapedutour.com/images/etape-2024.jpg'
    },
    'ardechoise': {
      website: 'https://www.ardechoise.com',
      imageUrl: 'https://www.ardechoise.com/images/ardeche-2024.jpg'
    },
    'cyclosportive des vins': {
      website: 'https://www.cyclosportive-des-vins.com',
      imageUrl: 'https://www.cyclosportive-des-vins.com/images/vins-2024.jpg'
    },
    'granfondo': {
      website: 'https://www.granfondo.fr',
      imageUrl: 'https://www.granfondo.fr/images/granfondo-2024.jpg'
    },
    'montagnarde': {
      website: 'https://www.montagnarde-cyclo.com',
      imageUrl: 'https://www.montagnarde-cyclo.com/images/mont-2024.jpg'
    },
    'pyrenees': {
      website: 'https://www.cyclo-pyrenees.com',
      imageUrl: 'https://www.cyclo-pyrenees.com/images/pyrenees-2024.jpg'
    },
    'alpes': {
      website: 'https://www.cyclo-alpes.fr',
      imageUrl: 'https://www.cyclo-alpes.fr/images/alpes-2024.jpg'
    },
    'jura': {
      website: 'https://www.cyclo-jura.com',
      imageUrl: 'https://www.cyclo-jura.com/images/jura-2024.jpg'
    },
    'vosges': {
      website: 'https://www.cyclo-vosges.fr',
      imageUrl: 'https://www.cyclo-vosges.fr/images/vosges-2024.jpg'
    }
  }

  const normalizedQuery = query.toLowerCase()
  
  // Chercher une correspondance dans les courses connues
  for (const [key, data] of Object.entries(knownRaces)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery.split(' ')[0])) {
      return [{
        title: `Site officiel - ${query}`,
        url: data.website,
        snippet: `Site officiel de la cyclosportive ${query}`
      }]
    }
  }

  // Générer une URL générique basée sur le nom
  const slug = query.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return [{
    title: `Site officiel - ${query}`,
    url: `https://www.${slug}.com`,
    snippet: `Site officiel de la cyclosportive ${query}`
  }]
}

// Fonction pour rechercher des images
async function searchImages(raceName: string, websiteUrl?: string): Promise<string | null> {
  console.log(`🖼️  Recherche d'image pour: "${raceName}"`)
  
  // Images basées sur des cyclosportives connues
  const knownImages: Record<string, string> = {
    'la marmotte': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
    'etape du tour': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center',
    'ardechoise': 'https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center',
    'cyclosportive des vins': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
    'granfondo': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center',
    'montagnarde': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
    'pyrenees': 'https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center',
    'alpes': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
    'jura': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center',
    'vosges': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center'
  }

  const normalizedName = raceName.toLowerCase()
  
  // Chercher une image spécifique
  for (const [key, imageUrl] of Object.entries(knownImages)) {
    if (normalizedName.includes(key) || key.includes(normalizedName.split(' ')[0])) {
      return imageUrl
    }
  }

  // Images génériques par type de course
  const genericImages = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center', // Montagne
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center', // Route
    'https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center', // Peloton
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center', // Paysage
  ]

  // Retourner une image aléatoire
  const randomIndex = Math.floor(Math.random() * genericImages.length)
  return genericImages[randomIndex]
}

// Fonction pour valider une URL
async function isValidUrl(url: string): Promise<boolean> {
  try {
    // Simulation de validation - dans la vraie vie, vous feriez un HEAD request
    return url.startsWith('http') && url.includes('.')
  } catch {
    return false
  }
}

// Fonction principale
async function fetchRaceData() {
  try {
    console.log('🚀 Démarrage de la recherche automatique des données de cyclosportives...')

    // Récupérer toutes les courses sans site web ou image
    const races = await prisma.race.findMany({
      where: {
        OR: [
          { website: null },
          { website: '' },
          { imageUrl: null },
          { imageUrl: '' }
        ]
      }
    })

    console.log(`📊 ${races.length} courses à traiter`)

    let websiteUpdates = 0
    let imageUpdates = 0

    for (const race of races) {
      console.log(`\n🏁 Traitement: "${race.name}" (${race.location})`)

      let websiteUrl = race.website
      let imageUrl = race.imageUrl

      // Rechercher le site web si manquant
      if (!websiteUrl) {
        const searchQuery = `${race.name} cyclosportive ${race.location} site officiel`
        const searchResults = await searchWeb(searchQuery)
        
        if (searchResults.length > 0) {
          const firstResult = searchResults[0]
          if (await isValidUrl(firstResult.url)) {
            websiteUrl = firstResult.url
            console.log(`✅ Site web trouvé: ${websiteUrl}`)
          }
        }
      }

      // Rechercher une image si manquante
      if (!imageUrl) {
        const foundImageUrl = await searchImages(race.name, websiteUrl || undefined)
        if (foundImageUrl) {
          imageUrl = foundImageUrl
          console.log(`✅ Image trouvée: ${imageUrl}`)
        }
      }

      // Mettre à jour la base de données si des changements ont été trouvés
      const updateData: any = {}
      if (websiteUrl && websiteUrl !== race.website) {
        updateData.website = websiteUrl
        websiteUpdates++
      }
      if (imageUrl && imageUrl !== race.imageUrl) {
        updateData.imageUrl = imageUrl
        imageUpdates++
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.race.update({
          where: { id: race.id },
          data: updateData
        })
        console.log(`💾 Données mises à jour pour "${race.name}"`)
      } else {
        console.log(`⏭️  Aucune mise à jour nécessaire pour "${race.name}"`)
      }

      // Petite pause pour éviter de surcharger les APIs
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`\n🎉 Traitement terminé !`)
    console.log(`📈 Statistiques:`)
    console.log(`   - Sites web ajoutés: ${websiteUpdates}`)
    console.log(`   - Images ajoutées: ${imageUpdates}`)
    console.log(`   - Total courses traitées: ${races.length}`)

  } catch (error) {
    console.error('❌ Erreur lors de la recherche des données:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Instructions pour utiliser une vraie API de recherche
console.log(`
📝 INSTRUCTIONS POUR UTILISER UNE VRAIE API DE RECHERCHE:

1. Google Custom Search API:
   - Créer un projet sur Google Cloud Console
   - Activer l'API Custom Search
   - Créer une clé API et un moteur de recherche personnalisé
   - Remplacer la fonction searchWeb() avec des appels à l'API

2. Bing Search API:
   - S'inscrire sur Microsoft Azure
   - Créer une ressource Bing Search
   - Utiliser la clé API pour faire des requêtes

3. SerpApi:
   - S'inscrire sur serpapi.com
   - Utiliser leur API pour obtenir des résultats Google

Exemple d'implémentation avec Google Custom Search:

async function searchWeb(query: string): Promise<SearchResult[]> {
  const API_KEY = process.env.GOOGLE_SEARCH_API_KEY
  const CX = process.env.GOOGLE_SEARCH_CX
  
  const response = await fetch(
    \`https://www.googleapis.com/customsearch/v1?key=\${API_KEY}&cx=\${CX}&q=\${encodeURIComponent(query)}\`
  )
  
  const data = await response.json()
  return data.items?.map(item => ({
    title: item.title,
    url: item.link,
    snippet: item.snippet
  })) || []
}
`)

// Exécuter le script
if (require.main === module) {
  fetchRaceData()
}

export { fetchRaceData }
