import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// Liste complète des cyclosportives 2025
const cyclosportives2025 = [
  // Alsace
  { name: "La sundgauvienne", location: "Hégenheim, Haut-Rhin", date: new Date('2025-05-11'), distance: "127 km" },
  { name: "L'Alsacienne lac de Kruth - Wildenstein", location: "Kruth-Wildenstein, Haut-Rhin", date: new Date('2025-06-29'), distance: "170 km" },
  { name: "GFNY Grand Ballon", location: "Thann, Haut-Rhin", date: new Date('2025-07-20'), distance: "120 km" },
  
  // Aquitaine
  { name: "Défi 47", location: "Prayssas, Lot-et-Garonne", date: new Date('2025-04-13'), distance: "80 km" },
  { name: "La Beuchigue", location: "Saint-Sever, Landes", date: new Date('2025-04-20'), distance: "145 km" },
  { name: "Euskal Cyclo", location: "Cambo-les-Bains, Pyrénées-Atlantiques", date: new Date('2025-05-25'), distance: "145 km" },
  { name: "La Bizikleta", location: "Saint-Jean-de-Luz, Pyrénées-Atlantiques", date: new Date('2025-06-08'), distance: "130 km" },
  { name: "GFNY Lourdes Tourmalet", location: "Lourdes, Pyrénées-Atlantiques", date: new Date('2025-06-22'), distance: "140 km" },
  { name: "La Périgordine", location: "Le Lardin-Saint-Lazare, Dordogne", date: new Date('2025-06-22'), distance: "150 km" },
  { name: "La Matthieu Ladagnous", location: "Asson, Pyrénées-Atlantiques", date: new Date('2025-07-13'), distance: "120 km" },
  { name: "La Marcel Queheille", location: "Mauléon-Licharre, Pyrénées-Atlantiques", date: new Date('2025-08-16'), distance: "110 km" },
  
  // Auvergne
  { name: "La Volcane", location: "Volvic, Puy-de-Dôme", date: new Date('2025-06-15'), distance: "135 km" },
  { name: "Les Copains", location: "Ambert, Puy-de-Dôme", date: new Date('2025-07-05'), distance: "125 km" },
  { name: "L'Etape Sanfloraine", location: "Saint-Flour, Cantal", date: new Date('2025-08-10'), distance: "140 km" },
  { name: "La Sancy Arc en Ciel By Laurent Brochard", location: "Chambon-sur-Lac, Puy-de-Dôme", date: new Date('2025-09-13'), distance: "155 km" },
  
  // Basse-Normandie
  { name: "L'Ornaise", location: "Argentan, Orne", date: new Date('2025-05-11'), distance: "115 km" },
  { name: "La Ronde Normande", location: "Juaye-Mondaye, Calvados", date: new Date('2025-05-25'), distance: "130 km" },
  
  // Bourgogne
  { name: "La Claudio Chiappucci", location: "Arnay-le-Duc, Côte d'Or", date: new Date('2025-06-07'), distance: "145 km" },
  { name: "Courir pour la Paix", location: "Chailly-sur-Armançon, Côte d'Or", date: new Date('2025-08-02'), distance: "120 km" },
  { name: "La Jean-François Bernard", location: "Corbigny, Nièvre", date: new Date('2025-09-07'), distance: "135 km" },
  
  // Bretagne
  { name: "Tro Bro Leon Challenge", location: "Lannelis, Finistère", date: new Date('2025-05-10'), distance: "160 km" },
  { name: "La Coeur de Bretagne", location: "Malestroit, Morbihan", date: new Date('2025-07-06'), distance: "125 km" },
  
  // Nord - Pas-de-Calais
  { name: "Paris-Roubaix Challenge", location: "Denain, Nord", date: new Date('2025-04-12'), distance: "170 km" },
  
  // PACA
  { name: "GFNY Cannes", location: "Cannes, Alpes-Maritimes", date: new Date('2025-03-23'), distance: "110 km" },
  { name: "GF Mont Ventoux", location: "Vaison la Romaine, Vaucluse", date: new Date('2025-06-01'), distance: "150 km" },
  { name: "Marmotte Granfondo Alpes", location: "Le Bourg d'Oisans, Isère", date: new Date('2025-06-22'), distance: "174 km" },
  
  // Rhône-Alpes
  { name: "La Corima Drôme Provençale", location: "Montélimar, Drôme", date: new Date('2025-03-30'), distance: "125 km" },
  { name: "GFNY Villard-de-Lans", location: "Villard-de-Lans, Isère", date: new Date('2025-05-25'), distance: "135 km" },
  { name: "L'Ardéchoise", location: "Saint-Félicien, Ardèche", date: new Date('2025-06-14'), distance: "145 km" },
  { name: "GFNY La Vaujany Alpe d'Huez", location: "Vaujany, Isère", date: new Date('2025-06-15'), distance: "155 km" },
  { name: "Etape du Tour : Albertville - La Plagne", location: "Albertville, Savoie", date: new Date('2025-07-20'), distance: "138 km" },
  { name: "L'Etape du Tour femmes", location: "Chambéry, Savoie", date: new Date('2025-08-02'), distance: "120 km" },
  { name: "GFNY Alpes Vaujany", location: "Vaujany, Isère", date: new Date('2025-08-24'), distance: "140 km" },
  { name: "La Bisou", location: "Péronnas, Ain", date: new Date('2025-09-28'), distance: "95 km" }
]

// URLs vérifiées
const urlsVerifiees: { [key: string]: string } = {
  "La sundgauvienne": "https://lasundgauvienne.fr",
  "L'Alsacienne lac de Kruth - Wildenstein": "https://www.lac-kruth-wildenstein.fr",
  "GFNY Grand Ballon": "https://www.gfny.com",
  "Défi 47": "https://cd47ffc.wixsite.com/defi47",
  "La Beuchigue": "https://www.labeuchigue.com",
  "Euskal Cyclo": "https://pyreneeschrono.fr/evenement/euskal-cyclo/",
  "La Bizikleta": "https://www.labizikleta.fr",
  "GFNY Lourdes Tourmalet": "https://www.gfny.com",
  "La Périgordine": "https://ok-time.fr/competition/la-perigordine-2024/",
  "Paris-Roubaix Challenge": "https://www.parisroubaixchallenge.com",
  "GFNY Cannes": "https://www.gfny.com",
  "GF Mont Ventoux": "https://gfmontventoux.com",
  "La Corima Drôme Provençale": "https://www.corimadromeprovencale.com",
  "GFNY Villard-de-Lans": "https://www.gfny.com",
  "L'Ardéchoise": "https://www.ardechoise.com",
  "GFNY La Vaujany Alpe d'Huez": "https://www.gfny.com",
  "Marmotte Granfondo Alpes": "https://marmottegranfondoalpes.com",
  "Etape du Tour : Albertville - La Plagne": "https://www.letapedutourdefrance.com",
  "L'Etape du Tour femmes": "https://www.letapedutourdefrance.com",
  "GFNY Alpes Vaujany": "https://www.gfny.com",
  "La Bisou": "https://www.labisou.com"
}

async function verifierUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, { 
      method: 'HEAD', 
      signal: controller.signal 
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

async function main() {
  console.log('🔄 Réinitialisation complète avec toutes les cyclosportives 2025...')
  
  // 1. Supprimer toutes les données
  await prisma.vote.deleteMany()
  await prisma.race.deleteMany()
  
  // 2. Récupérer admin
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@cycloranking.com' }
  })
  
  if (!adminUser) {
    console.error('❌ Admin non trouvé')
    return
  }
  
  // 3. Créer cyclosportives avec URLs vérifiées
  console.log('\n🏁 Création des cyclosportives...')
  const coursesCreees = []
  
  for (const cyclo of cyclosportives2025) {
    const url = urlsVerifiees[cyclo.name]
    let urlValide = false
    
    if (url) {
      urlValide = await verifierUrl(url)
      console.log(`${urlValide ? '✅' : '❌'} ${cyclo.name}: ${url}`)
    } else {
      console.log(`⚠️  ${cyclo.name}: URL à rechercher`)
    }
    
    if (urlValide) {
      const course = await prisma.race.create({
        data: {
          name: cyclo.name,
          location: cyclo.location,
          date: cyclo.date,
          distance: cyclo.distance,
          website: url,
          createdBy: adminUser.id,
          description: `Cyclosportive ${cyclo.name} à ${cyclo.location}`
        }
      })
      coursesCreees.push(course)
    }
  }
  
  console.log(`\n✅ ${coursesCreees.length} cyclosportives créées`)
  
  // Statistiques finales
  const coursesFinales = await prisma.race.count()
  console.log(`🏁 ${coursesFinales} cyclosportives au total`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
