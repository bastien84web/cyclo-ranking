// Script d'initialisation post-déploiement
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initProduction() {
  try {
    console.log('🔄 Initialisation de la base de données...')
    
    // Vérifier si déjà initialisé
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@cycloranking.com' }
    })
    
    if (adminExists) {
      console.log('✅ Base déjà initialisée')
      const raceCount = await prisma.race.count()
      console.log(`📊 ${raceCount} courses présentes`)
      return
    }
    
    console.log('🚀 Première initialisation...')
    
    // Exécuter le seed
    const seedScript = require('./seed-production.js')
    
    console.log('✅ Initialisation terminée')
    
  } catch (error) {
    console.error('❌ Erreur initialisation:', error)
    // Ne pas faire échouer le déploiement
  } finally {
    await prisma.$disconnect()
  }
}

// Exporter pour utilisation via API
module.exports = { initProduction }

// Exécuter si appelé directement
if (require.main === module) {
  initProduction()
}
