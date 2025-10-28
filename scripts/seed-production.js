// Script de peuplement pour la production
// Ce script sera exécuté après le déploiement pour peupler la base PostgreSQL

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const realRaces = [
  {
    name: "L'Étape du Tour",
    description: "Revivez l'expérience du Tour de France sur une étape mythique. Parcours exigeant avec montées légendaires et paysages à couper le souffle.",
    date: new Date('2025-07-13'),
    location: "Alpe d'Huez, France",
    distance: "138 km",
    website: "https://www.letapedutour.com"
  },
  {
    name: "La Marmotte",
    description: "L'une des cyclosportives les plus prestigieuses des Alpes. 4 cols mythiques : Glandon, Télégraphe, Galibier et Alpe d'Huez.",
    date: new Date('2025-07-05'),
    location: "Bourg d'Oisans, France",
    distance: "174 km",
    website: "https://www.lamarmotte.fr"
  },
  {
    name: "Paris-Roubaix Challenge",
    description: "Sur les traces des coureurs professionnels, découvrez l'enfer du Nord et ses pavés légendaires.",
    date: new Date('2025-04-13'),
    location: "Compiègne, France",
    distance: "170 km",
    website: "https://www.parisroubaixchallenge.fr"
  },
  {
    name: "La Cyclo des Vins de Bourgogne",
    description: "Parcours vallonné à travers les vignobles bourguignons. Dégustation et patrimoine viticole au programme.",
    date: new Date('2025-09-14'),
    location: "Beaune, Côte-d'Or",
    distance: "95 km",
    website: "https://www.cyclobourgogne.fr"
  },
  {
    name: "La Montée du Puy de Dôme",
    description: "Ascension mythique du volcan auvergnat. Vue panoramique exceptionnelle sur la chaîne des Puys.",
    date: new Date('2025-06-08'),
    location: "Clermont-Ferrand, Puy-de-Dôme",
    distance: "85 km",
    website: "https://www.puydedome-cyclo.fr"
  },
  {
    name: "La Transpyrénéenne",
    description: "Traversée des Pyrénées de l'Atlantique à la Méditerranée. Défi sportif et paysages grandioses.",
    date: new Date('2025-08-02'),
    location: "Hendaye, Pyrénées-Atlantiques",
    distance: "720 km",
    website: "https://www.transpyrenenne.com"
  },
  {
    name: "La Cyclo du Luberon",
    description: "Découverte des villages perchés du Luberon. Lavande, vignes et patrimoine provençal.",
    date: new Date('2025-06-15'),
    location: "Apt, Vaucluse",
    distance: "112 km",
    website: "https://www.cycloluberon.fr"
  },
  {
    name: "L'Ardéchoise",
    description: "La plus grande cyclosportive de France ! Découvrez les routes sinueuses et les paysages sauvages de l'Ardèche.",
    date: new Date('2025-06-14'),
    location: "Saint-Félicien, Ardèche",
    distance: "145 km",
    website: "https://www.ardechoise.com"
  },
  {
    name: "La Quebrantahuesos",
    description: "Cyclosportive espagnole mythique dans les Pyrénées. Parcours exigeant avec le col du Somport et des paysages grandioses.",
    date: new Date('2025-06-21'),
    location: "Sabiñánigo, Espagne",
    distance: "200 km",
    website: "https://www.quebrantahuesos.com"
  },
  {
    name: "La Ventoux Dénivelé Challenge",
    description: "Défi ultime : gravir 3 fois le Mont Ventoux par ses 3 versants différents. Pour les plus courageux !",
    date: new Date('2025-06-08'),
    location: "Bédoin, Vaucluse",
    distance: "138 km",
    website: "https://www.ventouxdenivelechallenge.com"
  }
]

async function main() {
  console.log('🌱 Début du peuplement de la base de production...')

  // Créer un utilisateur admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cycloranking.com' },
    update: {},
    create: {
      email: 'admin@cycloranking.com',
      name: 'Administrateur',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  })

  console.log('👤 Utilisateur admin créé:', adminUser.email)

  // Créer les cyclosportives
  let createdCount = 0
  for (const raceData of realRaces) {
    const existingRace = await prisma.race.findFirst({
      where: { name: raceData.name }
    })
    
    if (!existingRace) {
      const race = await prisma.race.create({
        data: {
          ...raceData,
          createdBy: adminUser.id,
        },
      })
      console.log(`🚴 Course créée: ${race.name}`)
      createdCount++
    }
  }

  console.log(`✅ ${createdCount} cyclosportives créées en production!`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
