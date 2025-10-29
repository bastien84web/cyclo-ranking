// Script pour ajouter des commentaires de démonstration
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Commentaires de démonstration
const demoComments = [
  {
    raceName: "Marmotte Granfondo Alpes",
    userName: "Pierre Cycliste",
    userEmail: "pierre@example.com",
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
    userEmail: "marie@example.com", 
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
    raceName: "GF Mont Ventoux",
    userName: "Jean Grimpeur",
    userEmail: "jean@example.com",
    comment: "Le Géant de Provence ne pardonne pas ! Montée épique avec une vue incroyable au sommet. Organisation parfaite, sécurité au top. Par contre, attention à la météo, le vent peut être traître. Une cyclosportive à faire au moins une fois dans sa vie de cycliste.",
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
    raceName: "GFNY Cannes",
    userName: "Sophie Sportive",
    userEmail: "sophie@example.com",
    comment: "Superbe parcours entre mer et montagne ! L'organisation GFNY est toujours au top niveau international. Parcours exigeant mais magnifique, surtout la montée vers l'arrière-pays. Seul point négatif : un peu cher comparé aux cyclosportives locales.",
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
      scenery: 5,
      routeVariety: 4,
      priceValue: 2
    }
  }
]

async function addDemoComments() {
  console.log('🗨️  Ajout de commentaires de démonstration...')

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
        where: { name: { contains: demo.raceName } }
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
            password: 'demo123' // Mot de passe simple pour les comptes de démo
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

    console.log(`\n🎉 ${addedCount} commentaires de démonstration ajoutés !`)
    console.log('\n💡 Vous pouvez maintenant tester le système de commentaires en cliquant sur "Voir les commentaires" sur les cartes des cyclosportives.')

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

addDemoComments()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
