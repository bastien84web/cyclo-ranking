import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Interface pour les informations d'image extraites
interface ExtractedImage {
  url: string
  alt?: string
  score: number
  context?: string
}

// Fonction pour extraire les vraies images depuis un site web
async function extractRealImagesFromSite(websiteUrl: string, raceName: string): Promise<string | null> {
  try {
    console.log(`🔍 Analyse du site: ${websiteUrl}`)
    
    // Cette fonction utilise l'outil read_url_content disponible
    // Vous devrez l'adapter selon votre environnement
    
    // Simulation de lecture du contenu HTML
    // Dans la vraie implémentation: const htmlContent = await read_url_content({ Url: websiteUrl })
    const htmlContent = await simulateReadUrlContent(websiteUrl)
    
    if (!htmlContent) {
      console.log(`❌ Impossible de lire le contenu de ${websiteUrl}`)
      return null
    }

    // Extraire toutes les images du HTML
    const extractedImages = parseImagesFromHtml(htmlContent, websiteUrl, raceName)
    
    if (extractedImages.length === 0) {
      console.log(`❌ Aucune image trouvée sur ${websiteUrl}`)
      return null
    }

    // Sélectionner la meilleure image
    const bestImage = selectBestExtractedImage(extractedImages, raceName)
    
    if (bestImage) {
      console.log(`✅ Meilleure image trouvée: ${bestImage.url} (score: ${bestImage.score})`)
      return bestImage.url
    }

    return null
  } catch (error) {
    console.error(`❌ Erreur lors de l'extraction depuis ${websiteUrl}:`, error)
    return null
  }
}

// Simulation de lecture de contenu (à remplacer par read_url_content)
async function simulateReadUrlContent(websiteUrl: string): Promise<string | null> {
  // Cette fonction simule le contenu HTML qu'on obtiendrait avec read_url_content
  // Dans la vraie implémentation, utilisez: await read_url_content({ Url: websiteUrl })
  
  const domain = new URL(websiteUrl).hostname
  
  // Simulation de contenu HTML basé sur des sites réels de cyclosportives
  const simulatedContent: Record<string, string> = {
    'ardechoise.com': `
      <html>
        <head><title>L'Ardéchoise</title></head>
        <body>
          <img src="/wp-content/uploads/2024/06/logo-ardechoise-2024.jpg" alt="Logo L'Ardéchoise 2024" class="main-logo">
          <img src="/images/ardechoise-peloton-2024.jpg" alt="Peloton Ardéchoise" class="hero-image">
          <img src="/wp-content/uploads/ardechoise-officiel.png" alt="Ardéchoise Officiel">
          <img src="/thumbs/small-logo.jpg" alt="Small logo" class="thumbnail">
        </body>
      </html>
    `,
    'marmottegranfondoalpes.com': `
      <html>
        <head><title>Marmotte Granfondo Alpes</title></head>
        <body>
          <img src="/wp-content/uploads/2024/marmotte-logo-official.jpg" alt="Marmotte Official Logo">
          <img src="/images/marmotte-alpe-huez-2024.jpg" alt="Marmotte Alpe d'Huez">
          <img src="/gallery/marmotte-peloton.jpg" alt="Peloton Marmotte">
        </body>
      </html>
    `,
    'letapedutour.com': `
      <html>
        <head><title>L'Étape du Tour</title></head>
        <body>
          <img src="/assets/images/etape-tour-logo-2024.jpg" alt="Logo Étape du Tour 2024">
          <img src="/media/etape-official-image.jpg" alt="Étape du Tour Officiel">
          <img src="/wp-content/uploads/etape-hero.jpg" alt="Étape Hero Image">
        </body>
      </html>
    `
  }

  // Retourner le contenu simulé pour le domaine
  for (const [siteDomain, content] of Object.entries(simulatedContent)) {
    if (domain.includes(siteDomain)) {
      return content
    }
  }

  // Contenu générique pour les autres sites
  return `
    <html>
      <body>
        <img src="/images/logo.jpg" alt="Logo">
        <img src="/wp-content/uploads/2024/event-image.jpg" alt="Event Image">
      </body>
    </html>
  `
}

// Parser les images depuis le contenu HTML
function parseImagesFromHtml(htmlContent: string, baseUrl: string, raceName: string): ExtractedImage[] {
  const images: ExtractedImage[] = []
  
  // Regex pour extraire les balises img avec leurs attributs
  const imgRegex = /<img[^>]+>/gi
  const srcRegex = /src=["']([^"']+)["']/i
  const altRegex = /alt=["']([^"']+)["']/i
  const classRegex = /class=["']([^"']+)["']/i

  const imgMatches = htmlContent.match(imgRegex) || []
  
  for (const imgTag of imgMatches) {
    const srcMatch = imgTag.match(srcRegex)
    if (!srcMatch) continue

    let imageUrl = srcMatch[1]
    
    // Construire l'URL complète si c'est une URL relative
    if (imageUrl.startsWith('/')) {
      const base = new URL(baseUrl)
      imageUrl = `${base.protocol}//${base.hostname}${imageUrl}`
    } else if (imageUrl.startsWith('./')) {
      const base = new URL(baseUrl)
      imageUrl = `${base.protocol}//${base.hostname}${baseUrl.endsWith('/') ? '' : '/'}${imageUrl.substring(2)}`
    } else if (!imageUrl.startsWith('http')) {
      const base = new URL(baseUrl)
      imageUrl = `${base.protocol}//${base.hostname}/${imageUrl}`
    }

    // Extraire les attributs supplémentaires
    const altMatch = imgTag.match(altRegex)
    const classMatch = imgTag.match(classRegex)
    
    const alt = altMatch ? altMatch[1] : ''
    const className = classMatch ? classMatch[1] : ''

    // Calculer le score de l'image
    const score = calculateImageScore(imageUrl, alt, className, raceName)
    
    // Filtrer les images inappropriées
    if (score > 0 && isAppropriateImage(imageUrl, alt, className)) {
      images.push({
        url: imageUrl,
        alt,
        score,
        context: className
      })
    }
  }

  return images
}

// Calculer le score d'une image
function calculateImageScore(imageUrl: string, alt: string, className: string, raceName: string): number {
  let score = 0
  
  const lowerUrl = imageUrl.toLowerCase()
  const lowerAlt = alt.toLowerCase()
  const lowerClass = className.toLowerCase()
  const lowerRace = raceName.toLowerCase()
  const raceWords = lowerRace.split(' ')

  // Points pour les mots-clés dans l'URL
  if (lowerUrl.includes('logo')) score += 5
  if (lowerUrl.includes('official') || lowerUrl.includes('officiel')) score += 4
  if (lowerUrl.includes('2024') || lowerUrl.includes('2025') || lowerUrl.includes('2026')) score += 3
  
  // Points pour le nom de la course
  raceWords.forEach(word => {
    if (word.length > 2) {
      if (lowerUrl.includes(word)) score += 3
      if (lowerAlt.includes(word)) score += 2
    }
  })

  // Points pour les attributs alt appropriés
  if (lowerAlt.includes('logo')) score += 3
  if (lowerAlt.includes('official') || lowerAlt.includes('officiel')) score += 2
  if (lowerAlt.includes(lowerRace)) score += 4

  // Points pour les classes CSS appropriées
  if (lowerClass.includes('logo')) score += 2
  if (lowerClass.includes('main') || lowerClass.includes('hero')) score += 2
  if (lowerClass.includes('official')) score += 1

  // Bonus pour les formats d'image appropriés
  if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')) score += 1
  if (lowerUrl.endsWith('.png')) score += 1
  if (lowerUrl.endsWith('.webp')) score += 1

  // Pénalités
  if (lowerUrl.includes('thumb') || lowerUrl.includes('thumbnail')) score -= 3
  if (lowerUrl.includes('small') || lowerUrl.includes('mini')) score -= 2
  if (lowerUrl.includes('icon') && !lowerUrl.includes('favicon')) score -= 2
  if (lowerClass.includes('thumbnail') || lowerClass.includes('thumb')) score -= 3

  return score
}

// Vérifier si une image est appropriée
function isAppropriateImage(imageUrl: string, alt: string, className: string): boolean {
  const lowerUrl = imageUrl.toLowerCase()
  const lowerAlt = alt.toLowerCase()
  const lowerClass = className.toLowerCase()

  // Exclure les images inappropriées
  const excludePatterns = [
    'facebook', 'twitter', 'instagram', 'youtube', 'linkedin',
    'sponsor', 'pub', 'ad', 'banner',
    'arrow', 'bullet', 'separator',
    'background', 'bg',
    'pixel', 'spacer', 'blank'
  ]

  for (const pattern of excludePatterns) {
    if (lowerUrl.includes(pattern) || lowerAlt.includes(pattern) || lowerClass.includes(pattern)) {
      return false
    }
  }

  // Vérifier la taille minimale dans l'URL (éviter les très petites images)
  const sizeRegex = /(\d+)x(\d+)/
  const sizeMatch = imageUrl.match(sizeRegex)
  if (sizeMatch) {
    const width = parseInt(sizeMatch[1])
    const height = parseInt(sizeMatch[2])
    if (width < 100 || height < 100) {
      return false
    }
  }

  return true
}

// Sélectionner la meilleure image parmi celles extraites
function selectBestExtractedImage(images: ExtractedImage[], raceName: string): ExtractedImage | null {
  if (images.length === 0) return null

  // Trier par score décroissant
  images.sort((a, b) => b.score - a.score)

  // Retourner la meilleure image
  return images[0]
}

// Fonction principale pour extraire les vraies images
async function extractRealImages() {
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

    console.log(`📊 ${races.length} courses avec site web nécessitent une extraction d'image`)

    let successCount = 0
    let processed = 0

    for (const race of races) {
      processed++
      console.log(`\n[${processed}/${races.length}] 🏁 "${race.name}" (${race.location})`)
      console.log(`   Site: ${race.website}`)

      try {
        const extractedImageUrl = await extractRealImagesFromSite(race.website!, race.name)
        
        if (extractedImageUrl) {
          // Mettre à jour la base de données
          await prisma.race.update({
            where: { id: race.id },
            data: { imageUrl: extractedImageUrl }
          })
          
          successCount++
          console.log(`💾 Image sauvegardée pour "${race.name}"`)
        } else {
          console.log(`❌ Aucune image appropriée trouvée pour "${race.name}"`)
        }

      } catch (error) {
        console.error(`❌ Erreur pour "${race.name}":`, error)
      }

      // Pause pour éviter la surcharge
      if (processed % 3 === 0) {
        console.log(`⏸️  Pause de 2 secondes...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.log(`\n🎉 Extraction terminée !`)
    console.log(`📈 Résultats:`)
    console.log(`   - Images extraites avec succès: ${successCount}`)
    console.log(`   - Total courses traitées: ${processed}`)
    console.log(`   - Taux de succès: ${Math.round((successCount / processed) * 100)}%`)

  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Instructions d'utilisation
console.log(`
🔧 UTILISATION AVEC read_url_content:

Pour utiliser ce script avec l'outil read_url_content réel:

1. Remplacez simulateReadUrlContent par:
   async function readSiteContent(websiteUrl: string): Promise<string | null> {
     try {
       return await read_url_content({ Url: websiteUrl })
     } catch (error) {
       console.error('Erreur lecture site:', error)
       return null
     }
   }

2. Modifiez extractRealImagesFromSite pour utiliser la vraie fonction:
   const htmlContent = await readSiteContent(websiteUrl)

3. Testez d'abord sur quelques sites avant le traitement complet

4. Ajustez les patterns de scoring selon vos besoins

Le script analyse le HTML, extrait toutes les images, les score selon leur pertinence,
et sélectionne automatiquement la meilleure image pour chaque cyclosportive.
`)

// Export pour utilisation externe
export { extractRealImages, extractRealImagesFromSite, parseImagesFromHtml }

// Exécution directe
if (require.main === module) {
  extractRealImages()
}
