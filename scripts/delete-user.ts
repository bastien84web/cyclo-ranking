import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteUser() {
  const email = 'beaurinbastien@gmail.com'
  
  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        votes: true,
        races: true
      }
    })

    if (!user) {
      console.log(`❌ Utilisateur ${email} non trouvé`)
      return
    }

    console.log(`📊 Utilisateur trouvé:`)
    console.log(`   - Email: ${user.email}`)
    console.log(`   - Nom: ${user.name}`)
    console.log(`   - Votes: ${user.votes.length}`)
    console.log(`   - Courses créées: ${user.races.length}`)

    // Supprimer l'utilisateur (les votes et races seront supprimés en cascade si configuré)
    await prisma.user.delete({
      where: { email }
    })

    console.log(`✅ Utilisateur ${email} supprimé avec succès`)
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteUser()
