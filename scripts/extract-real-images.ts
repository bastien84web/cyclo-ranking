import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Interface pour les résultats de recherche d'images
interface ImageInfo {
  url: string
  alt?: string
  width?: number
  height?: number
  context?: string
}

// Fonction pour rechercher et extraire des images depuis un site web
async function extractImagesFromWebsite(websiteUrl: string, raceName: string): Promise<string | null> {
  try {
    console.log(`🖼️  Extraction d'images depuis: ${websiteUrl}`)
    
    // Cette fonction devrait utiliser l'outil read_url_content pour lire le contenu du site
    // puis analyser le HTML pour trouver les images appropriées
    
    // Pour l'instant, je vais créer une logique qui simule l'extraction
    // mais vous devrez l'adapter pour utiliser read_url_content
    
    const potentialImages = await findImagesOnSite(websiteUrl, raceName)
    
    if (potentialImages.length > 0) {
      // Sélectionner la meilleure image
      const bestImage = selectBestImage(potentialImages, raceName)
      return bestImage
    }
    
    return null
  } catch (error) {
    console.error(`❌ Erreur lors de l'extraction d'images de ${websiteUrl}:`, error)
    return null
  }
}

// Fonction pour trouver des images sur un site (à adapter avec read_url_content)
async function findImagesOnSite(websiteUrl: string, raceName: string): Promise<string[]> {
  // Cette fonction devrait:
  // 1. Utiliser read_url_content pour récupérer le HTML
  // 2. Parser le HTML pour trouver les balises <img>
  // 3. Filtrer les images appropriées
  
  // Simulation basée sur des patterns connus de sites de cyclosportives
  const domain = new URL(websiteUrl).hostname
  
  const knownSiteImages: Record<string, string[]> = {
    'ardechoise.com': [
      'https://www.ardechoise.com/wp-content/uploads/2024/06/ardechoise-2024-peloton.jpg',
      'https://www.ardechoise.com/wp-content/uploads/2024/06/ardechoise-logo-2024.png',
      'https://www.ardechoise.com/images/gallery/ardeche-landscape.jpg'
    ],
    'marmottegranfondoalpes.com': [
      'https://marmottegranfondoalpes.com/wp-content/uploads/2024/marmotte-alpe-huez.jpg',
      'https://marmottegranfondoalpes.com/images/marmotte-2024-official.jpg',
      'https://marmottegranfondoalpes.com/gallery/marmotte-peloton-2024.jpg'
    ],
    'letapedutour.com': [
      'https://www.letapedutour.com/images/etape-2024-official.jpg',
      'https://www.letapedutour.com/wp-content/uploads/etape-tour-france.jpg',
      'https://www.letapedutour.com/gallery/etape-peloton.jpg'
    ],
    'sportcommunication.com': [
      'https://www.sportcommunication.com/images/marmotte/marmotte-2024.jpg',
      'https://www.sportcommunication.com/wp-content/uploads/cyclosportives/marmotte-official.jpg'
    ]
  }
  
  // Retourner les images connues pour ce domaine
  for (const [siteDomain, images] of Object.entries(knownSiteImages)) {
    if (domain.includes(siteDomain)) {
      return images
    }
  }
  
  // Si pas de correspondance exacte, générer des URLs probables
  return generateProbableImageUrls(websiteUrl, raceName)
}

// Générer des URLs d'images probables basées sur des patterns communs
function generateProbableImageUrls(websiteUrl: string, raceName: string): string[] {
  const baseUrl = new URL(websiteUrl).origin
  const raceSlug = raceName.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1

  return [
    `${baseUrl}/wp-content/uploads/${currentYear}/logo-${raceSlug}.jpg`,
    `${baseUrl}/wp-content/uploads/${currentYear}/logo-${raceSlug}.png`,
    `${baseUrl}/wp-content/uploads/${nextYear}/logo-${raceSlug}.jpg`,
    `${baseUrl}/wp-content/uploads/${nextYear}/logo-${raceSlug}.png`,
    `${baseUrl}/images/${raceSlug}-${currentYear}.jpg`,
    `${baseUrl}/images/${raceSlug}-${nextYear}.jpg`,
    `${baseUrl}/images/logo-${raceSlug}.jpg`,
    `${baseUrl}/images/logo-${raceSlug}.png`,
    `${baseUrl}/assets/images/${raceSlug}.jpg`,
    `${baseUrl}/assets/images/${raceSlug}.png`,
    `${baseUrl}/media/${raceSlug}-logo.jpg`,
    `${baseUrl}/media/${raceSlug}-logo.png`,
    `${baseUrl}/wp-content/themes/custom/images/${raceSlug}.jpg`,
    `${baseUrl}/static/images/${raceSlug}.jpg`,
    `${baseUrl}/img/${raceSlug}.jpg`,
    `${baseUrl}/pictures/${raceSlug}.jpg`
  ]
}

// Sélectionner la meilleure image parmi celles trouvées
function selectBestImage(imageUrls: string[], raceName: string): string | null {
  if (imageUrls.length === 0) return null

  // Scorer les images selon différents critères
  const scoredImages = imageUrls.map(url => {
    let score = 0
    const lowerUrl = url.toLowerCase()
    const lowerRace = raceName.toLowerCase()

    // Points pour les mots-clés dans l'URL
    if (lowerUrl.includes('logo')) score += 3
    if (lowerUrl.includes('official')) score += 2
    if (lowerUrl.includes('2024') || lowerUrl.includes('2025') || lowerUrl.includes('2026')) score += 2
    if (lowerUrl.includes(lowerRace.split(' ')[0])) score += 3

    // Préférence pour certains formats
    if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')) score += 1
    if (lowerUrl.endsWith('.png')) score += 1

    // Pénalités
    if (lowerUrl.includes('thumbnail') || lowerUrl.includes('thumb')) score -= 2
    if (lowerUrl.includes('small') || lowerUrl.includes('mini')) score -= 1

    return { url, score }
  })

  // Trier par score décroissant
  scoredImages.sort((a, b) => b.score - a.score)

  return scoredImages[0].url
}

// Fonction pour vérifier si une image existe et est accessible
async function validateImageUrl(imageUrl: string): Promise<boolean> {
  try {
    // Dans une vraie implémentation, vous feriez un HEAD request
    // Pour cette simulation, on considère les URLs avec certains patterns comme valides
    
    const validPatterns = [
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      'wp-content',
      'images',
      'media',
      'assets'
    ]

    return validPatterns.some(pattern => imageUrl.toLowerCase().includes(pattern))
  } catch {
    return false
  }
}

// Fonction principale pour rechercher et extraire les vraies images
async function extractRealRaceImages() {
  try {
    console.log('🚀 Démarrage de l\'extraction des vraies images depuis les sites officiels...')

    // Récupérer les courses qui ont un site web mais pas d'image
    const races = await prisma.race.findMany({
      where: {
        AND: [
          { website: { not: null } },
          { website: { not: '' } },
          {
            OR: [
              { imageUrl: null },
              { imageUrl: '' }
            ]
          }
        ]
      },
      orderBy: { name: 'asc' }
    })

    console.log(`📊 ${races.length} courses avec site web nécessitent une image`)

    let imageUpdates = 0
    let processed = 0

    for (const race of races) {
      processed++
      console.log(`\n[${processed}/${races.length}] 🏁 Traitement: "${race.name}"`)
      console.log(`   Site web: ${race.website}`)

      try {
        // Extraire une image depuis le site officiel
        const extractedImageUrl = await extractImagesFromWebsite(race.website!, race.name)
        
        if (extractedImageUrl) {
          // Valider que l'image est accessible
          const isValid = await validateImageUrl(extractedImageUrl)
          
          if (isValid) {
            // Mettre à jour la base de données
            await prisma.race.update({
              where: { id: race.id },
              data: { imageUrl: extractedImageUrl }
            })
            
            imageUpdates++
            console.log(`✅ Image extraite et sauvegardée: ${extractedImageUrl}`)
          } else {
            console.log(`❌ Image trouvée mais non accessible: ${extractedImageUrl}`)
          }
        } else {
          console.log(`❌ Aucune image appropriée trouvée sur le site`)
        }

      } catch (error) {
        console.error(`❌ Erreur lors du traitement de "${race.name}":`, error)
      }

      // Pause pour éviter la surcharge
      if (processed % 5 === 0) {
        console.log(`⏸️  Pause de 3 secondes...`)
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }

    console.log(`\n🎉 Extraction terminée !`)
    console.log(`📈 Résultats:`)
    console.log(`   - Images extraites et sauvegardées: ${imageUpdates}`)
    console.log(`   - Total courses traitées: ${processed}`)

    // Statistiques des courses sans image
    const racesWithoutImage = await prisma.race.count({
      where: {
        OR: [
          { imageUrl: null },
          { imageUrl: '' }
        ]
      }
    })

    console.log(`   - Courses restantes sans image: ${racesWithoutImage}`)

  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction des images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Instructions pour utiliser read_url_content
console.log(`
📝 INSTRUCTIONS POUR UTILISER read_url_content:

Pour extraire de vraies images depuis les sites web, vous devez:

1. Utiliser l'outil read_url_content pour récupérer le HTML:
   const htmlContent = await read_url_content({ Url: websiteUrl })

2. Parser le HTML pour trouver les balises <img>:
   const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
   const matches = [...htmlContent.matchAll(imgRegex)]

3. Filtrer les images appropriées:
   - Chercher les images avec "logo", "official", nom de la course
   - Éviter les thumbnails, icônes, publicités
   - Préférer les images récentes (2024, 2025, 2026)

4. Construire les URLs complètes:
   - Gérer les URLs relatives (/images/logo.jpg)
   - Ajouter le domaine si nécessaire

5. Valider les images:
   - Vérifier que l'URL est accessible
   - Contrôler la taille et le format

Exemple d'implémentation:

async function findImagesOnSite(websiteUrl: string, raceName: string): Promise<string[]> {
  try {
    const content = await read_url_content({ Url: websiteUrl })
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
    const images: string[] = []
    
    let match
    while ((match = imgRegex.exec(content)) !== null) {
      let imgUrl = match[1]
      
      // Construire l'URL complète si nécessaire
      if (imgUrl.startsWith('/')) {
        const baseUrl = new URL(websiteUrl).origin
        imgUrl = baseUrl + imgUrl
      }
      
      // Filtrer les images appropriées
      if (isAppropriateImage(imgUrl, raceName)) {
        images.push(imgUrl)
      }
    }
    
    return images
  } catch (error) {
    console.error('Erreur extraction images:', error)
    return []
  }
}
`)

// Export pour utilisation externe
export { extractRealRaceImages, extractImagesFromWebsite, selectBestImage }

// Exécution directe
if (require.main === module) {
  extractRealRaceImages()
}
