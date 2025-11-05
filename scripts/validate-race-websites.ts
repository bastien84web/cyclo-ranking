import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// Function to check if a URL is valid and accessible
async function validateUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      timeout: 10000, // 10 seconds timeout
    })
    return response.ok
  } catch (error) {
    console.log(`❌ URL non accessible: ${url}`)
    return false
  }
}

// Alternative URLs for races that might not have working websites
const alternativeUrls: { [key: string]: string } = {
  "L'Étape du Tour": "https://www.letapedutour.com",
  "La Marmotte": "https://www.sportcommunication.info/marmotte",
  "Paris-Roubaix Challenge": "https://www.parisroubaixchallenge.fr",
  "La Cyclo des Vins de Bourgogne": "https://www.bourgogne-tourisme.com",
  "La Montée du Puy de Dôme": "https://www.puydedome.fr",
  "La Transpyrénéenne": "https://www.transpyrenenne.org",
  "La Cyclo du Luberon": "https://www.luberon-apt.fr",
  "La Ronde des Châteaux de la Loire": "https://www.chateauxloire.fr",
  "La Granfondo del Gavia": "https://www.granfondogavia.it",
  "La Cyclo des Gorges du Verdon": "https://www.verdon-tourisme.com",
  "La Montée de l'Alpe d'Huez": "https://www.alpedhuez.com",
  "La Cyclo de la Côte d'Azur": "https://www.cotedazur-france.fr",
  "La Velothon Berlin": "https://www.velothon-berlin.de",
  "La Cyclo des Volcans d'Auvergne": "https://www.auvergne-volcan.com",
  "La Granfondo Stelvio Santini": "https://www.granfondostelvio.com",
  "La Cyclo du Mont-Blanc": "https://www.chamonix.com",
  "La Ronde Picarde": "https://www.somme-tourisme.com",
  "La Cyclo des Causses": "https://www.millau-viaduc-tourisme.fr",
  "La Flèche Wallonne Cyclo": "https://www.flechewallonne.be",
  "La Cyclo des Châteaux Cathares": "https://www.audetourisme.com",
  "La Granfondo Campagnolo Roma": "https://www.granfondoroma.it",
  "La Cyclo de la Baie de Somme": "https://www.baiedesomme-tourisme.com",
  "La Montée du Ventoux par Bédoin": "https://www.bedoin.fr",
  "La Cyclo des Lacs alpins": "https://www.lac-annecy.com",
  "La Ronde des Moulins de Flandre": "https://www.flandre-tourisme.fr",
  "La Cyclo du Périgord Noir": "https://www.lascaux-dordogne.com",
  "La Granfondo Nove Colli": "https://www.novecolli.it",
  "La Cyclo des Gorges de l'Ardèche": "https://www.ardeche-guide.com",
  "La Cyclo des Vosges": "https://www.gerardmer.net",
  "La Ronde Tahitienne": "https://www.tahiti-tourisme.pf",
  "La Cyclo des Châteaux de Dordogne": "https://www.sarlat-tourisme.com"
}

async function main() {
  console.log('🔍 Validation des URLs des cyclosportives...')
  
  const races = await prisma.race.findMany({
    select: {
      id: true,
      name: true,
      website: true
    }
  })

  let validCount = 0
  let invalidCount = 0
  let updatedCount = 0

  for (const race of races) {
    if (!race.website) {
      // If no website, try to find an alternative
      const alternativeUrl = alternativeUrls[race.name]
      if (alternativeUrl) {
        const isValid = await validateUrl(alternativeUrl)
        if (isValid) {
          await prisma.race.update({
            where: { id: race.id },
            data: { website: alternativeUrl }
          })
          console.log(`✅ URL ajoutée pour ${race.name}: ${alternativeUrl}`)
          updatedCount++
          validCount++
        } else {
          console.log(`❌ URL alternative non valide pour ${race.name}: ${alternativeUrl}`)
          invalidCount++
        }
      } else {
        console.log(`⚠️  Pas d'URL pour ${race.name}`)
        invalidCount++
      }
    } else {
      // Validate existing URL
      const isValid = await validateUrl(race.website)
      if (isValid) {
        console.log(`✅ URL valide pour ${race.name}: ${race.website}`)
        validCount++
      } else {
        // Try alternative URL
        const alternativeUrl = alternativeUrls[race.name]
        if (alternativeUrl && alternativeUrl !== race.website) {
          const isAlternativeValid = await validateUrl(alternativeUrl)
          if (isAlternativeValid) {
            await prisma.race.update({
              where: { id: race.id },
              data: { website: alternativeUrl }
            })
            console.log(`🔄 URL mise à jour pour ${race.name}: ${alternativeUrl}`)
            updatedCount++
            validCount++
          } else {
            console.log(`❌ URL non valide pour ${race.name}: ${race.website}`)
            invalidCount++
          }
        } else {
          console.log(`❌ URL non valide pour ${race.name}: ${race.website}`)
          invalidCount++
        }
      }
    }
  }

  console.log('\n📊 Résumé de la validation:')
  console.log(`✅ URLs valides: ${validCount}`)
  console.log(`❌ URLs non valides: ${invalidCount}`)
  console.log(`🔄 URLs mises à jour: ${updatedCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la validation:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
