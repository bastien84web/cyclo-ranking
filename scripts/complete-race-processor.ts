import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Ce script utilise les vrais outils search_web et read_url_content
// pour traiter automatiquement toutes les 101 cyclosportives

interface ProcessingResult {
  raceName: string
  websiteFound: boolean
  websiteUrl?: string
  imageFound: boolean
  imageUrl?: string
  error?: string
}

// Fonction pour rechercher le site officiel avec search_web
async function findOfficialWebsite(raceName: string, location: string): Promise<string | null> {
  const searchQueries = [
    `"${raceName}" cyclosportive site officiel`,
    `${raceName} ${location} cyclosportive inscription`,
    `${raceName} cyclosportive`,
    `cyclosportive "${raceName}" ${location}`
  ]

  for (const query of searchQueries) {
    try {
      console.log(`   🔍 Recherche: "${query}"`)
      
      // Utilisation du vrai outil search_web
      // const results = await search_web({ query })
      
      // PLACEHOLDER: Vous devez décommenter la ligne ci-dessus et adapter le code
      // Pour cette démonstration, je retourne null
      // Dans la vraie implémentation, analysez results et retournez la meilleure URL
      
      console.log(`   ⏭️  Recherche simulée pour: ${query}`)
      
      // Pause entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error(`   ❌ Erreur recherche: ${error}`)
    }
  }
  
  return null
}

// Fonction pour extraire l'image officielle avec read_url_content
async function extractOfficialImage(websiteUrl: string, raceName: string): Promise<string | null> {
  try {
    console.log(`   🖼️  Extraction image depuis: ${websiteUrl}`)
    
    // Utilisation du vrai outil read_url_content
    // const content = await read_url_content({ Url: websiteUrl })
    
    // PLACEHOLDER: Vous devez décommenter la ligne ci-dessus
    // Pour cette démonstration, je retourne null
    // Dans la vraie implémentation, parsez le HTML et extrayez les images
    
    console.log(`   ⏭️  Extraction simulée depuis: ${websiteUrl}`)
    
    return null
    
  } catch (error) {
    console.error(`   ❌ Erreur extraction: ${error}`)
    return null
  }
}

// Fonction pour traiter une cyclosportive individuelle
async function processIndividualRace(race: any): Promise<ProcessingResult> {
  const result: ProcessingResult = {
    raceName: race.name,
    websiteFound: false,
    imageFound: false
  }

  try {
    console.log(`\n🏁 Traitement: "${race.name}" (${race.location})`)
    
    let websiteUrl = race.website
    let imageUrl = race.imageUrl
    let needsUpdate = false
    const updateData: any = {}

    // Étape 1: Rechercher le site web si manquant
    if (!websiteUrl || websiteUrl.trim() === '') {
      console.log(`   🔍 Recherche du site web...`)
      websiteUrl = await findOfficialWebsite(race.name, race.location)
      
      if (websiteUrl) {
        result.websiteFound = true
        result.websiteUrl = websiteUrl
        updateData.website = websiteUrl
        needsUpdate = true
        console.log(`   ✅ Site web trouvé: ${websiteUrl}`)
      } else {
        console.log(`   ❌ Aucun site web trouvé`)
      }
    } else {
      console.log(`   ⏭️  Site web déjà présent: ${websiteUrl}`)
      result.websiteUrl = websiteUrl
    }

    // Étape 2: Extraire l'image si manquante et si on a un site web
    if ((!imageUrl || imageUrl.trim() === '') && websiteUrl) {
      console.log(`   🖼️  Extraction de l'image...`)
      imageUrl = await extractOfficialImage(websiteUrl, race.name)
      
      if (imageUrl) {
        result.imageFound = true
        result.imageUrl = imageUrl
        updateData.imageUrl = imageUrl
        needsUpdate = true
        console.log(`   ✅ Image extraite: ${imageUrl}`)
      } else {
        console.log(`   ❌ Aucune image appropriée trouvée`)
      }
    } else if (imageUrl) {
      console.log(`   ⏭️  Image déjà présente`)
      result.imageUrl = imageUrl
    }

    // Étape 3: Mettre à jour la base de données si nécessaire
    if (needsUpdate) {
      await prisma.race.update({
        where: { id: race.id },
        data: updateData
      })
      console.log(`   💾 Base de données mise à jour`)
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue'
    result.error = errorMsg
    console.error(`   ❌ Erreur traitement "${race.name}": ${errorMsg}`)
  }

  return result
}

// Fonction principale pour traiter toutes les cyclosportives
async function processAllCyclosportives() {
  try {
    console.log('🚀 DÉMARRAGE DU TRAITEMENT COMPLET DE TOUTES LES CYCLOSPORTIVES')
    console.log('=' .repeat(80))
    
    // Récupérer toutes les cyclosportives
    const allRaces = await prisma.race.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📊 ${allRaces.length} cyclosportives à traiter`)
    console.log(`⏰ Estimation: ${Math.ceil(allRaces.length * 0.5)} minutes`)
    console.log('')
    
    const results: ProcessingResult[] = []
    let processed = 0
    let websitesFound = 0
    let imagesExtracted = 0
    let errors = 0
    
    // Traiter chaque cyclosportive
    for (const race of allRaces) {
      processed++
      
      console.log(`[${processed}/${allRaces.length}] - ${Math.round((processed / allRaces.length) * 100)}%`)
      
      const result = await processIndividualRace(race)
      results.push(result)
      
      // Compter les succès
      if (result.websiteFound) websitesFound++
      if (result.imageFound) imagesExtracted++
      if (result.error) errors++
      
      // Pause pour éviter la surcharge des APIs
      if (processed % 3 === 0) {
        const remaining = allRaces.length - processed
        console.log(`   ⏸️  Pause de 5 secondes... (${remaining} restantes)`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      
      // Affichage du progrès tous les 10
      if (processed % 10 === 0) {
        console.log(`\n📈 Progrès intermédiaire:`)
        console.log(`   - Traitées: ${processed}/${allRaces.length}`)
        console.log(`   - Sites web trouvés: ${websitesFound}`)
        console.log(`   - Images extraites: ${imagesExtracted}`)
        console.log(`   - Erreurs: ${errors}`)
        console.log('')
      }
    }
    
    // Statistiques finales
    console.log('\n' + '='.repeat(80))
    console.log('🎉 TRAITEMENT TERMINÉ !')
    console.log('='.repeat(80))
    
    console.log(`\n📊 RÉSULTATS GLOBAUX:`)
    console.log(`   - Total cyclosportives traitées: ${processed}`)
    console.log(`   - Sites web trouvés: ${websitesFound}`)
    console.log(`   - Images extraites: ${imagesExtracted}`)
    console.log(`   - Erreurs rencontrées: ${errors}`)
    console.log(`   - Taux de succès sites web: ${Math.round((websitesFound / processed) * 100)}%`)
    console.log(`   - Taux de succès images: ${Math.round((imagesExtracted / processed) * 100)}%`)
    
    // Statistiques de la base de données
    const dbStats = await prisma.race.aggregate({
      _count: {
        id: true,
        website: true,
        imageUrl: true
      }
    })
    
    console.log(`\n📈 ÉTAT DE LA BASE DE DONNÉES:`)
    console.log(`   - Total cyclosportives: ${dbStats._count.id}`)
    console.log(`   - Avec site web: ${dbStats._count.website}`)
    console.log(`   - Avec image: ${dbStats._count.imageUrl}`)
    console.log(`   - Complétude sites web: ${Math.round((dbStats._count.website / dbStats._count.id) * 100)}%`)
    console.log(`   - Complétude images: ${Math.round((dbStats._count.imageUrl / dbStats._count.id) * 100)}%`)
    
    // Afficher les erreurs s'il y en a
    const errorResults = results.filter(r => r.error)
    if (errorResults.length > 0) {
      console.log(`\n❌ ERREURS DÉTAILLÉES:`)
      errorResults.forEach(result => {
        console.log(`   - ${result.raceName}: ${result.error}`)
      })
    }
    
    // Afficher les succès notables
    const successResults = results.filter(r => r.websiteFound || r.imageFound)
    if (successResults.length > 0) {
      console.log(`\n✅ SUCCÈS NOTABLES (${successResults.length} premiers):`)
      successResults.slice(0, 10).forEach(result => {
        const status = []
        if (result.websiteFound) status.push('Site web')
        if (result.imageFound) status.push('Image')
        console.log(`   - ${result.raceName}: ${status.join(' + ')}`)
      })
      if (successResults.length > 10) {
        console.log(`   ... et ${successResults.length - 10} autres succès`)
      }
    }
    
    console.log(`\n🏁 Traitement complet terminé !`)
    
  } catch (error) {
    console.error('❌ ERREUR CRITIQUE lors du traitement:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Instructions d'utilisation
console.log(`
🔧 INSTRUCTIONS POUR ACTIVER LES VRAIS OUTILS:

1. Dans findOfficialWebsite(), décommentez:
   const results = await search_web({ query })
   
   Puis ajoutez la logique pour analyser les résultats et retourner la meilleure URL.

2. Dans extractOfficialImage(), décommentez:
   const content = await read_url_content({ Url: websiteUrl })
   
   Puis ajoutez la logique pour parser le HTML et extraire les images.

3. Testez d'abord sur quelques courses:
   - Modifiez la requête pour limiter: .take(5)
   - Vérifiez les résultats manuellement
   - Ajustez les algorithmes si nécessaire

4. Lancez le traitement complet:
   npm run db:complete-race-processor

Ce script traite automatiquement les 101 cyclosportives !
`)

// Export pour utilisation externe
export { processAllCyclosportives, processIndividualRace }

// Exécution directe
if (require.main === module) {
  processAllCyclosportives()
}
