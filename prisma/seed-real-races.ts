import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
    name: "La Purito Andorra",
    description: "Cyclosportive de montagne en Andorre avec des paysages pyrénéens exceptionnels. Parcours vallonné et technique.",
    date: new Date('2025-08-24'),
    location: "Andorre-la-Vieille, Andorre",
    distance: "125 km",
    website: "https://www.puritoandorra.com"
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
  },
  {
    name: "La Cyclo du Léman",
    description: "Tour du lac Léman entre France et Suisse. Parcours roulant avec vues magnifiques sur le lac et les Alpes.",
    date: new Date('2025-05-25'),
    location: "Thonon-les-Bains, France",
    distance: "180 km",
    website: "https://www.cyclodulman.com"
  },
  {
    name: "La Granfondo Stelvio Santini",
    description: "Cyclosportive italienne légendaire avec l'ascension du col du Stelvio, l'un des plus hauts cols routiers d'Europe.",
    date: new Date('2025-08-30'),
    location: "Bormio, Italie",
    distance: "151 km",
    website: "https://www.granfondostelvio.com"
  },
  {
    name: "La Dordogne Intégrale",
    description: "Parcours vallonné à travers les plus beaux villages du Périgord. Gastronomie et patrimoine au rendez-vous.",
    date: new Date('2025-09-07'),
    location: "Sarlat-la-Canéda, Dordogne",
    distance: "120 km",
    website: "https://www.dordogneintegrale.fr"
  },
  {
    name: "La Haute Route Alpes",
    description: "Étape de prestige dans les Alpes françaises. Cols mythiques et paysages alpins d'exception.",
    date: new Date('2025-08-16'),
    location: "Megève, Haute-Savoie",
    distance: "165 km",
    website: "https://www.hauteroute.org"
  },
  {
    name: "La Corsica Granfondo",
    description: "Découvrez la beauté sauvage de la Corse sur des routes sinueuses entre mer et montagne.",
    date: new Date('2025-05-11'),
    location: "Ajaccio, Corse",
    distance: "135 km",
    website: "https://www.corsicagranfondo.com"
  },
  {
    name: "La Drôme Classic",
    description: "Cyclosportive dans la Drôme provençale. Lavande, vignobles et routes de caractère vous attendent.",
    date: new Date('2025-06-29'),
    location: "Nyons, Drôme",
    distance: "110 km",
    website: "https://www.dromeclassic.fr"
  },
  {
    name: "La Flèche Wallonne Cyclo",
    description: "Sur les traces de la classique belge, avec l'ascension redoutable du Mur de Huy en point d'orgue.",
    date: new Date('2025-04-20'),
    location: "Huy, Belgique",
    distance: "98 km",
    website: "https://www.flechewallonnecyclo.be"
  },
  {
    name: "La Vuelta a Mallorca Cyclosportive",
    description: "Cyclosportive sur l'île de Majorque avec des vues spectaculaires sur la Méditerranée et la Serra de Tramuntana.",
    date: new Date('2025-03-30'),
    location: "Palma de Majorque, Espagne",
    distance: "155 km",
    website: "https://www.vueltamallorca.com"
  }
]

async function main() {
  console.log('🌱 Début du peuplement de la base de données avec de vraies cyclosportives...')

  // Créer un utilisateur admin pour créer les courses
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cycloranking.com' },
    update: {},
    create: {
      email: 'admin@cycloranking.com',
      name: 'Administrateur',
      password: hashedPassword,
    },
  })

  console.log('👤 Utilisateur admin créé:', adminUser.email)

  // Créer les vraies cyclosportives
  for (const raceData of realRaces) {
    // Vérifier si la course existe déjà
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
      console.log(`🚴 Course créée: ${race.name} - ${race.location}`)
    } else {
      console.log(`⏭️  Course déjà existante: ${existingRace.name}`)
    }
  }

  // Créer quelques utilisateurs de test
  const testUsers = [
    {
      email: 'jean.dupont@example.com',
      name: 'Jean Dupont',
      password: 'password123'
    },
    {
      email: 'marie.martin@example.com',
      name: 'Marie Martin',
      password: 'password123'
    },
    {
      email: 'pierre.bernard@example.com',
      name: 'Pierre Bernard',
      password: 'password123'
    }
  ]

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
      },
    })
    console.log(`👤 Utilisateur de test créé: ${user.email}`)
  }

  console.log('✅ Peuplement terminé avec succès!')
  console.log(`📊 ${realRaces.length} cyclosportives ajoutées`)
  console.log(`👥 ${testUsers.length + 1} utilisateurs créés`)
  console.log('')
  console.log('🔐 Comptes de test disponibles:')
  console.log('- admin@cycloranking.com / admin123 (Administrateur)')
  testUsers.forEach(user => {
    console.log(`- ${user.email} / ${user.password}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du peuplement:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
