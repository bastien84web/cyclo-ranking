import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Images d'événements pour les cyclosportives populaires
const raceImages = [
  {
    name: "La Marmotte",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "L'Étape du Tour",
    imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "L'Ardéchoise",
    imageUrl: "https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "La Cyclo des Vins",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "La Granfondo",
    imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "La Montagnarde",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "La Cyclosportive des Alpes",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "La Pyrénéenne",
    imageUrl: "https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "La Jurassienne",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "La Vosgienne",
    imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center"
  }
]

// Images génériques pour différents types de cyclosportives
const genericImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center", // Montagne
  "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center", // Route
  "https://images.unsplash.com/photo-1544191696-15693072b5d5?w=400&h=400&fit=crop&crop=center", // Peloton
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center", // Paysage
  "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&crop=center", // Cycliste solo
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center", // Col de montagne
]

async function addRaceImages() {
  try {
    console.log('🖼️  Ajout des images pour les cyclosportives...')

    // Récupérer toutes les courses
    const races = await prisma.race.findMany()
    console.log(`📊 ${races.length} courses trouvées`)

    let updatedCount = 0

    for (const race of races) {
      // Chercher une image spécifique pour cette course
      const specificImage = raceImages.find(img => 
        race.name.toLowerCase().includes(img.name.toLowerCase()) ||
        img.name.toLowerCase().includes(race.name.toLowerCase())
      )

      let imageUrl = specificImage?.imageUrl

      // Si pas d'image spécifique, utiliser une image générique
      if (!imageUrl && !race.imageUrl) {
        const randomIndex = Math.floor(Math.random() * genericImages.length)
        imageUrl = genericImages[randomIndex]
      }

      // Mettre à jour seulement si pas d'image existante
      if (imageUrl && !race.imageUrl) {
        await prisma.race.update({
          where: { id: race.id },
          data: { imageUrl }
        })
        
        console.log(`✅ Image ajoutée pour "${race.name}"`)
        updatedCount++
      } else if (race.imageUrl) {
        console.log(`⏭️  "${race.name}" a déjà une image`)
      }
    }

    console.log(`🎉 ${updatedCount} images ajoutées avec succès !`)

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
addRaceImages()
