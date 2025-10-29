// Script de peuplement pour les cyclosportives 2025
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const cyclosportives2025 = [
  // Alsace
  {
    name: "La sundgauvienne",
    description: "Cyclosportive dans le Sundgau alsacien, région vallonnée aux paysages bucoliques.",
    location: "Hégenheim (Haut-Rhin - 68)",
    date: new Date('2025-05-11'),
    distance: "80-120 km",
    website: null
  },
  {
    name: "L'Alsacienne lac de Kruth - Wildenstein",
    description: "Parcours autour du lac de Kruth-Wildenstein dans les Vosges alsaciennes.",
    location: "Kruth - Wildenstein (Haut-Rhin - 68)",
    date: new Date('2025-06-29'),
    distance: "90-140 km",
    website: null
  },
  {
    name: "GFNY Grand Ballon",
    description: "Granfondo avec ascension du Grand Ballon, point culminant des Vosges.",
    location: "Thann (Haut-Rhin - 68)",
    date: new Date('2025-07-20'),
    distance: "100-160 km",
    website: "https://www.gfny.com"
  },

  // Aquitaine
  {
    name: "Défi 47",
    description: "Cyclosportive dans le Lot-et-Garonne, parcours vallonné entre vignes et vergers.",
    location: "Prayssas (Lot-et-Garonne - 47)",
    date: new Date('2025-04-13'),
    distance: "70-130 km",
    website: null
  },
  {
    name: "La Beuchigue",
    description: "Cyclosportive landaise à travers la forêt des Landes et ses paysages typiques.",
    location: "Saint-Sever (Landes - 40)",
    date: new Date('2025-04-20'),
    distance: "85-150 km",
    website: null
  },
  {
    name: "Euskal Cyclo",
    description: "Cyclosportive au cœur du Pays Basque, entre montagne et tradition basque.",
    location: "Cambo-les-Bains (Pyrénées-Atlantiques - 64)",
    date: new Date('2025-05-25'),
    distance: "90-160 km",
    website: null
  },
  {
    name: "La Bizikleta",
    description: "Cyclosportive basque avec vue sur l'océan Atlantique et les Pyrénées.",
    location: "Saint-Jean-de-Luz (Pyrénées-Atlantiques - 64)",
    date: new Date('2025-06-08'),
    distance: "80-140 km",
    website: null
  },
  {
    name: "GFNY Lourdes Tourmalet",
    description: "Granfondo mythique avec l'ascension du col du Tourmalet.",
    location: "Lourdes (Pyrénées-Atlantiques - 65)",
    date: new Date('2025-06-22'),
    distance: "120-180 km",
    website: "https://www.gfny.com"
  },
  {
    name: "La Périgordine",
    description: "Découverte du Périgord Noir, ses châteaux et sa gastronomie.",
    location: "Le Lardin-Saint-Lazare (Dordogne - 24)",
    date: new Date('2025-06-22'),
    distance: "75-130 km",
    website: null
  },

  // Auvergne
  {
    name: "La Volcane",
    description: "Cyclosportive au cœur des volcans d'Auvergne, paysages volcaniques uniques.",
    location: "Volvic (Puy-de-Dôme - 63)",
    date: new Date('2025-06-15'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Les Copains",
    description: "Cyclosportive conviviale dans les monts du Forez.",
    location: "Ambert (Puy-de-Dôme - 63)",
    date: new Date('2025-07-05'),
    distance: "80-140 km",
    website: null
  },
  {
    name: "L'Etape Sanfloraine",
    description: "Cyclosportive dans le Cantal avec vue sur les monts du Cantal.",
    location: "Saint-Flour (Cantal - 15)",
    date: new Date('2025-08-10'),
    distance: "85-160 km",
    website: null
  },

  // PACA
  {
    name: "GFNY Cannes",
    description: "Granfondo sur la Côte d'Azur avec vue sur la Méditerranée.",
    location: "Cannes (Alpes-Maritimes - 06)",
    date: new Date('2025-03-23'),
    distance: "100-160 km",
    website: "https://www.gfny.com"
  },
  {
    name: "La Lazaridès",
    description: "Cyclosportive cannoise en hommage au photographe Jean-Claude Lazaridès.",
    location: "Cannes (Alpes-Maritimes - 06)",
    date: new Date('2025-04-20'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "GF Mont Ventoux",
    description: "Granfondo avec l'ascension mythique du Mont Ventoux, Géant de Provence.",
    location: "Vaison la Romaine (Vaucluse - 84)",
    date: new Date('2025-06-01'),
    distance: "130-160 km",
    website: "https://www.granfondo-montventoux.com"
  },
  {
    name: "La Mercan'Tour Bonette",
    description: "Cyclosportive avec ascension de la Bonette, plus haute route d'Europe.",
    location: "Valberg (Alpes-Maritimes - 06)",
    date: new Date('2025-06-15'),
    distance: "140-180 km",
    website: null
  },

  // Rhône-Alpes
  {
    name: "Marmotte Granfondo Alpes",
    description: "La cyclosportive la plus mythique des Alpes : Glandon, Télégraphe, Galibier, Alpe d'Huez.",
    location: "Le Bourg d'Oisans (Isère - 38)",
    date: new Date('2025-06-22'),
    distance: "174 km",
    website: "https://www.lamarmotte.fr"
  },
  {
    name: "L'Ardéchoise",
    description: "La plus grande cyclosportive de France dans les gorges de l'Ardèche.",
    location: "Saint-Félicien (Ardèche - 07)",
    date: new Date('2025-06-14'),
    distance: "60-170 km",
    website: "https://www.ardechoise.com"
  },
  {
    name: "GFNY La Vaujany Alpe d'Huez",
    description: "Granfondo avec arrivée à l'Alpe d'Huez par les 21 lacets mythiques.",
    location: "Vaujany (Isère - 38)",
    date: new Date('2025-06-15'),
    distance: "120-180 km",
    website: "https://www.gfny.com"
  },
  {
    name: "Etape du Tour : Albertville - La Plagne",
    description: "Revivez une étape du Tour de France avec arrivée à La Plagne.",
    location: "Albertville (Savoie - 73)",
    date: new Date('2025-07-20'),
    distance: "140 km",
    website: "https://www.letapedutour.com"
  },
  {
    name: "Megève Mont Blanc",
    description: "Cyclosportive de prestige dans le massif du Mont-Blanc.",
    location: "Megève (Haute-Savoie - 74)",
    date: new Date('2025-08-31'),
    distance: "120-180 km",
    website: null
  }
]

async function main() {
  console.log('🌱 Début du peuplement avec les cyclosportives 2025...')

  // Créer un utilisateur admin si nécessaire
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

  console.log('👤 Utilisateur admin:', adminUser.email)

  // Créer les cyclosportives
  let createdCount = 0
  for (const raceData of cyclosportives2025) {
    const existingRace = await prisma.race.findFirst({
      where: { 
        name: raceData.name,
        location: raceData.location 
      }
    })
    
    if (!existingRace) {
      const race = await prisma.race.create({
        data: {
          ...raceData,
          createdBy: adminUser.id,
        },
      })
      console.log(`🚴 Course créée: ${race.name} - ${race.location}`)
      createdCount++
    } else {
      console.log(`⏭️  Course existante: ${raceData.name}`)
    }
  }

  console.log(`✅ ${createdCount} nouvelles cyclosportives créées!`)
  console.log(`📊 Total traité: ${cyclosportives2025.length} cyclosportives`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
