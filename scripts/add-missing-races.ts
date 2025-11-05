import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

async function main() {
  console.log('➕ Ajout des cyclosportives manquantes...')
  
  // Récupérer l'utilisateur admin
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@cycloranking.com' }
  })
  
  if (!adminUser) {
    console.error('❌ Utilisateur admin non trouvé')
    return
  }
  
  // Cyclosportives à ajouter avec URLs alternatives trouvées
  const cyclosportivesManquantes = [
    {
      name: "Euskal Cyclo",
      location: "Cambo-les-Bains, Pyrénées-Atlantiques", 
      date: new Date('2025-05-25'),
      distance: "145 km",
      website: "https://pyreneeschrono.fr/evenement/euskal-cyclo/",
      description: "Cyclosportive Euskal Cyclo à Cambo-les-Bains"
    },
    {
      name: "La Périgordine", 
      location: "Le Lardin-Saint-Lazare, Dordogne",
      date: new Date('2025-06-22'),
      distance: "150 km", 
      website: "https://ok-time.fr/competition/la-perigordine-2024/",
      description: "Cyclosportive La Périgordine au Lardin-Saint-Lazare"
    }
  ]
  
  let coursesAjoutees = 0
  
  for (const cyclo of cyclosportivesManquantes) {
    // Vérifier si la course existe déjà
    const existingRace = await prisma.race.findFirst({
      where: { name: cyclo.name }
    })
    
    if (!existingRace) {
      const course = await prisma.race.create({
        data: {
          name: cyclo.name,
          location: cyclo.location,
          date: cyclo.date,
          distance: cyclo.distance,
          website: cyclo.website,
          description: cyclo.description,
          createdBy: adminUser.id
        }
      })
      
      console.log(`✅ ${cyclo.name} ajoutée: ${cyclo.website}`)
      coursesAjoutees++
    } else {
      console.log(`⏭️ ${cyclo.name} existe déjà`)
    }
  }
  
  // Statistiques finales
  const coursesFinales = await prisma.race.count()
  
  console.log('\n📊 Statistiques:')
  console.log(`➕ ${coursesAjoutees} cyclosportives ajoutées`)
  console.log(`🏁 ${coursesFinales} cyclosportives au total`)
  
  console.log('\n✅ Ajout terminé !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'ajout:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
