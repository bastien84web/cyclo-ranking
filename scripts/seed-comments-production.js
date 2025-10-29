// Script pour ajouter des commentaires de démonstration en production
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Commentaires de démonstration pour la production
const demoComments = [
  {
    raceName: "La Marmotte",
    userName: "Pierre Cycliste",
    userEmail: "pierre.demo@cycloranking.com",
    comment: "Parcours absolument magnifique ! Les 4 cols sont un vrai défi mais les paysages sont à couper le souffle. L'organisation est top, ravitaillements bien placés. Seul bémol : le prix un peu élevé mais ça vaut le coup pour cette cyclosportive mythique.",
    ratings: {
      accommodationAvailability: 4,
      parkingAvailability: 3,
      startFinishDistance: 4,
      foodQuality: 5,
      foodQuantity: 4,
      foodConviviality: 4,
      safety: 4,
      signage: 5,
      traffic: 3,
      scenery: 5,
      routeVariety: 5,
      priceValue: 3
    }
  },
  {
    raceName: "L'Ardéchoise",
    userName: "Marie Vélo",
    userEmail: "marie.demo@cycloranking.com", 
    comment: "Première participation à l'Ardéchoise et je ne suis pas déçue ! Ambiance familiale exceptionnelle, parcours variés pour tous les niveaux. Les bénévoles sont formidables et l'accueil chaleureux. Le rapport qualité-prix est imbattable. Je recommande vivement !",
    ratings: {
      accommodationAvailability: 5,
      parkingAvailability: 4,
      startFinishDistance: 4,
      foodQuality: 4,
      foodQuantity: 5,
      foodConviviality: 5,
      safety: 4,
      signage: 4,
      traffic: 4,
      scenery: 4,
      routeVariety: 4,
      priceValue: 5
    }
  },
  {
    raceName: "L'Étape du Tour",
    userName: "Jean Grimpeur",
    userEmail: "jean.demo@cycloranking.com",
    comment: "Une expérience inoubliable ! Revivre l'étape du Tour de France avec les mêmes difficultés que les pros. L'organisation est parfaite, la sécurité au top. L'ambiance est électrique avec tous les spectateurs sur le bord de route. Un must pour tout cycliste passionné !",
    ratings: {
      accommodationAvailability: 4,
      parkingAvailability: 4,
      startFinishDistance: 5,
      foodQuality: 4,
      foodQuantity: 3,
      foodConviviality: 3,
      safety: 5,
      signage: 5,
      traffic: 4,
      scenery: 5,
      routeVariety: 3,
      priceValue: 4
    }
  },
  {
    raceName: "Paris-Roubaix Challenge",
    userName: "Sophie Sportive",
    userEmail: "sophie.demo@cycloranking.com",
    comment: "L'enfer du Nord porte bien son nom ! Les pavés sont impitoyables mais quelle expérience unique. L'organisation respecte parfaitement l'esprit de la course professionnelle. Attention à bien préparer son matériel et ses roues. Une aventure à vivre au moins une fois !",
    ratings: {
      accommodationAvailability: 3,
      parkingAvailability: 3,
      startFinishDistance: 4,
      foodQuality: 4,
      foodQuantity: 4,
      foodConviviality: 3,
      safety: 5,
      signage: 5,
      traffic: 3,
      scenery: 4,
      routeVariety: 5,
      priceValue: 4
    }
  }
]

async function seedCommentsProduction() {
  console.log('💬 Ajout de commentaires de démonstration en production...')

  try {
    // Récupérer l'utilisateur admin
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@cycloranking.com' }
    })

    if (!adminUser) {
      console.log('❌ Utilisateur admin non trouvé')
      return
    }

    let addedCount = 0

    for (const demo of demoComments) {
      // Trouver la course
      const race = await prisma.race.findFirst({
        where: { 
          name: { 
            contains: demo.raceName,
            mode: 'insensitive'
          } 
        }
      })

      if (!race) {
        console.log(`⏭️  Course non trouvée: ${demo.raceName}`)
        continue
      }

      // Créer ou trouver l'utilisateur
      let user = await prisma.user.findUnique({
        where: { email: demo.userEmail }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: demo.userEmail,
            name: demo.userName,
            password: '$2a$10$demo.hash.for.production.users' // Hash de démonstration
          }
        })
      }

      // Vérifier si un vote existe déjà
      const existingVote = await prisma.vote.findUnique({
        where: {
          userId_raceId: {
            userId: user.id,
            raceId: race.id
          }
        }
      })

      if (existingVote) {
        console.log(`⏭️  Vote déjà existant pour ${demo.userName} sur ${demo.raceName}`)
        continue
      }

      // Créer le vote avec commentaire
      await prisma.vote.create({
        data: {
          userId: user.id,
          raceId: race.id,
          comment: demo.comment,
          ...demo.ratings
        }
      })

      console.log(`✅ Commentaire ajouté: ${demo.userName} -> ${demo.raceName}`)
      addedCount++
    }

    console.log(`\n🎉 ${addedCount} commentaires de démonstration ajoutés en production !`)

  } catch (error) {
    console.error('❌ Erreur:', error)
    throw error
  }
}

// Exécuter seulement si appelé directement
if (require.main === module) {
  seedCommentsProduction()
    .catch((e) => {
      console.error('❌ Erreur:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

module.exports = { seedCommentsProduction }
