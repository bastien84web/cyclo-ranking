// Script pour nettoyer les images des cyclosportives et les laisser vides
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanRaceImages() {
  console.log('🧹 Nettoyage des images des cyclosportives...')

  // Mettre à jour toutes les courses pour supprimer les images
  const result = await prisma.race.updateMany({
    data: {
      logoUrl: null,
      imageUrl: null
    }
  })

  console.log(`✅ ${result.count} cyclosportives nettoyées - images supprimées`)
  console.log('📝 Les admins pourront maintenant ajouter les images manuellement')
}

cleanRaceImages()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
