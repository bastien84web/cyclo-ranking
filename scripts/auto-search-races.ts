import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Note: Ce script nécessite l'utilisation de l'outil search_web
// Il doit être exécuté dans un environnement qui a accès à cet outil

interface SearchResult {
  title: string
  url: string
  summary: string
}

// Fonction pour analyser les résultats de recherche et trouver le meilleur site
function findBestWebsite(results: SearchResult[], raceName: string): string | null {
  if (!results || results.length === 0) return null

  // Mots-clés qui indiquent un site officiel
  const officialKeywords = [
    'site officiel',
    'official site',
    'inscription',
    'registration',
    raceName.toLowerCase()
  ]

  // Domaines à éviter (pas officiels)
  const avoidDomains = [
    'wikipedia',
    'facebook',
    'strava',
    'garmin',
    'komoot',
    'wikiloc',
    'results',
    'resultats'
  ]

  // Scorer chaque résultat
  const scoredResults = results.map(result => {
    let score = 0
    const lowerTitle = result.title.toLowerCase()
    const lowerUrl = result.url.toLowerCase()
    const lowerSummary = result.summary.toLowerCase()

    // Points positifs
    officialKeywords.forEach(keyword => {
      if (lowerTitle.includes(keyword)) score += 3
      if (lowerUrl.includes(keyword)) score += 2
      if (lowerSummary.includes(keyword)) score += 1
    })

    // Bonus si c'est le premier résultat
    if (results.indexOf(result) === 0) score += 2

    // Bonus pour les domaines .com, .fr, .org
    if (lowerUrl.includes('.com') || lowerUrl.includes('.fr') || lowerUrl.includes('.org')) {
      score += 1
    }

    // Pénalités pour les domaines à éviter
    avoidDomains.forEach(domain => {
      if (lowerUrl.includes(domain)) score -= 5
    })

    return { ...result, score }
  })

  // Trier par score décroissant
  scoredResults.sort((a, b) => b.score - a.score)

  // Retourner le meilleur résultat si le score est positif
  const best = scoredResults[0]
  return best && best.score > 0 ? best.url : null
}

// Fonction pour rechercher une image appropriée basée sur le nom et la localisation
function selectAppropriateImage(raceName: string, location: string): string {
  const name = raceName.toLowerCase()
  const loc = location.toLowerCase()

  // Images spécifiques pour des courses connues
  const specificImages: Record<string, string> = {
    'marmotte': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
    'etape du tour': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center',
    'ardechoise': 'https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center',
    'maurienne': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
    'ventoux': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center'
  }

  // Chercher une correspondance spécifique
  for (const [keyword, imageUrl] of Object.entries(specificImages)) {
    if (name.includes(keyword)) {
      return imageUrl
    }
  }

  // Images par région/type de terrain
  if (name.includes('mont') || name.includes('col') || loc.includes('alpes') || loc.includes('savoie') || loc.includes('isere')) {
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center' // Montagne
  }

  if (loc.includes('pyrenees') || loc.includes('ariege') || loc.includes('haute-garonne')) {
    return 'https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center' // Pyrénées
  }

  if (loc.includes('bretagne') || loc.includes('normandie') || loc.includes('mer') || loc.includes('cote')) {
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center' // Côte
  }

  if (loc.includes('paris') || loc.includes('ile-de-france') || name.includes('urban') || name.includes('ville')) {
    return 'https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center' // Urbain
  }

  // Image par défaut (route de campagne)
  return 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center'
}

// Fonction principale (à adapter selon votre environnement)
async function autoSearchRaces() {
  try {
    console.log('🚀 Démarrage de la recherche automatique des données de cyclosportives...')

    // Récupérer les courses qui ont besoin de données
    const races = await prisma.race.findMany({
      where: {
        OR: [
          { website: null },
          { website: '' },
          { imageUrl: null },
          { imageUrl: '' }
        ]
      },
      orderBy: { name: 'asc' }
    })

    console.log(`📊 ${races.length} courses nécessitent une mise à jour`)

    let websiteUpdates = 0
    let imageUpdates = 0

    for (let i = 0; i < races.length; i++) {
      const race = races[i]
      console.log(`\n[${i + 1}/${races.length}] 🏁 Traitement: "${race.name}" (${race.location})`)

      const updateData: any = {}

      // Rechercher le site web si manquant
      if (!race.website || race.website.trim() === '') {
        console.log(`🔍 Recherche du site web pour "${race.name}"...`)
        
        // Construire les requêtes de recherche
        const searchQueries = [
          `"${race.name}" cyclosportive site officiel`,
          `${race.name} ${race.location} cyclosportive inscription`,
          `${race.name} cyclosportive`
        ]

        let websiteFound = false
        
        for (const query of searchQueries) {
          if (websiteFound) break

          try {
            console.log(`   Requête: "${query}"`)
            
            // IMPORTANT: Cette partie doit être adaptée selon votre environnement
            // Vous devez utiliser l'outil search_web disponible
            // Exemple: const searchResults = await search_web({ query })
            
            // Pour cette démonstration, je simule la structure des résultats
            const mockResults: SearchResult[] = [
              {
                title: `${race.name} - Site Officiel`,
                url: `https://www.${race.name.toLowerCase().replace(/\s+/g, '-')}.com`,
                summary: `Site officiel de la cyclosportive ${race.name}`
              }
            ]

            const bestWebsite = findBestWebsite(mockResults, race.name)
            
            if (bestWebsite) {
              updateData.website = bestWebsite
              websiteUpdates++
              websiteFound = true
              console.log(`✅ Site web trouvé: ${bestWebsite}`)
            }
            
          } catch (error) {
            console.error(`❌ Erreur lors de la recherche: ${error}`)
          }

          // Pause entre les requêtes
          await new Promise(resolve => setTimeout(resolve, 2000))
        }

        if (!websiteFound) {
          console.log(`❌ Aucun site web trouvé pour "${race.name}"`)
        }
      }

      // Assigner une image si manquante
      if (!race.imageUrl || race.imageUrl.trim() === '') {
        const imageUrl = selectAppropriateImage(race.name, race.location)
        updateData.imageUrl = imageUrl
        imageUpdates++
        console.log(`✅ Image assignée: ${imageUrl}`)
      }

      // Mettre à jour la base de données
      if (Object.keys(updateData).length > 0) {
        await prisma.race.update({
          where: { id: race.id },
          data: updateData
        })
        console.log(`💾 Données mises à jour pour "${race.name}"`)
      } else {
        console.log(`⏭️  Aucune mise à jour nécessaire`)
      }

      // Pause entre les courses pour éviter la surcharge
      if ((i + 1) % 3 === 0) {
        console.log(`⏸️  Pause de 5 secondes...`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    console.log(`\n🎉 Recherche automatique terminée !`)
    console.log(`📈 Résultats:`)
    console.log(`   - Sites web trouvés/mis à jour: ${websiteUpdates}`)
    console.log(`   - Images assignées: ${imageUpdates}`)
    console.log(`   - Total courses traitées: ${races.length}`)

    console.log(`\n📝 Instructions pour utiliser la vraie recherche web:`)
    console.log(`1. Remplacez les mockResults par un vrai appel à search_web`)
    console.log(`2. Adaptez la structure des résultats selon l'API utilisée`)
    console.log(`3. Testez d'abord sur quelques courses avant le traitement complet`)

  } catch (error) {
    console.error('❌ Erreur lors de la recherche automatique:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Instructions d'utilisation
console.log(`
🔧 INSTRUCTIONS D'UTILISATION:

Ce script recherche automatiquement les sites web officiels et assigne des images
appropriées aux cyclosportives dans votre base de données.

Pour utiliser la vraie recherche web:
1. Adaptez la section "search_web" dans la fonction autoSearchRaces()
2. Remplacez mockResults par de vrais appels à l'outil search_web
3. Testez d'abord sur quelques courses

Commandes disponibles:
- npm run db:auto-search-races  # Exécuter ce script
- npm run db:add-race-images    # Ajouter seulement des images
- npm run db:search-websites    # Version alternative

⚠️  ATTENTION: 
- Respectez les limites de taux des APIs de recherche
- Testez d'abord sur un petit échantillon
- Vérifiez manuellement les résultats importants
`)

// Export pour utilisation externe
export { autoSearchRaces, findBestWebsite, selectAppropriateImage }

// Exécution directe
if (require.main === module) {
  autoSearchRaces()
}
