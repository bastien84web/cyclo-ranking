import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const extendedRaces = [
  // Courses mythiques déjà existantes
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
  
  // Nouvelles courses ajoutées
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
    name: "La Ronde des Châteaux de la Loire",
    description: "Circuit royal à travers les plus beaux châteaux de la Loire. Histoire et gastronomie française.",
    date: new Date('2025-05-18'),
    location: "Blois, Loir-et-Cher",
    distance: "130 km",
    website: "https://www.chateauxloire-cyclo.fr"
  },
  {
    name: "La Granfondo del Gavia",
    description: "Cyclosportive italienne avec l'ascension du col du Gavia dans les Alpes lombardes.",
    date: new Date('2025-07-27'),
    location: "Bormio, Italie",
    distance: "168 km",
    website: "https://www.granfondogavia.it"
  },
  {
    name: "La Cyclo des Gorges du Verdon",
    description: "Parcours spectaculaire autour du Grand Canyon du Verdon. Falaises et eaux turquoise.",
    date: new Date('2025-09-07'),
    location: "Castellane, Alpes-de-Haute-Provence",
    distance: "140 km",
    website: "https://www.verdon-cyclo.fr"
  },
  {
    name: "La Montée de l'Alpe d'Huez",
    description: "Ascension mythique des 21 lacets de l'Alpe d'Huez. Temple du cyclisme mondial.",
    date: new Date('2025-07-12'),
    location: "Bourg d'Oisans, Isère",
    distance: "55 km",
    website: "https://www.alpedhuez-cyclo.fr"
  },
  {
    name: "La Cyclo de la Côte d'Azur",
    description: "De Nice à Monaco par la corniche. Mer Méditerranée et villages perchés.",
    date: new Date('2025-04-27'),
    location: "Nice, Alpes-Maritimes",
    distance: "145 km",
    website: "https://www.cotedazur-cyclo.fr"
  },
  {
    name: "La Velothon Berlin",
    description: "Cyclosportive urbaine dans la capitale allemande. Histoire et modernité berlinoise.",
    date: new Date('2025-06-01'),
    location: "Berlin, Allemagne",
    distance: "120 km",
    website: "https://www.velothon-berlin.de"
  },
  {
    name: "La Cyclo des Volcans d'Auvergne",
    description: "Circuit à travers le Parc des Volcans. Paysages volcaniques uniques en Europe.",
    date: new Date('2025-08-24'),
    location: "Le Lioran, Cantal",
    distance: "155 km",
    website: "https://www.volcans-cyclo.fr"
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
    name: "La Cyclo du Mont-Blanc",
    description: "Tour du massif du Mont-Blanc entre France, Suisse et Italie. Haute montagne et glaciers.",
    date: new Date('2025-08-16'),
    location: "Chamonix, Haute-Savoie",
    distance: "165 km",
    website: "https://www.montblanc-cyclo.fr"
  },
  {
    name: "La Ronde Picarde",
    description: "Découverte de la Picardie historique. Cathédrales gothiques et champs de bataille.",
    date: new Date('2025-05-11'),
    location: "Amiens, Somme",
    distance: "98 km",
    website: "https://www.rondepicarde.fr"
  },
  {
    name: "La Cyclo des Causses",
    description: "Plateaux calcaires et gorges profondes. Paysages sauvages du sud du Massif Central.",
    date: new Date('2025-06-29'),
    location: "Millau, Aveyron",
    distance: "125 km",
    website: "https://www.causses-cyclo.fr"
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
    name: "La Cyclo des Châteaux Cathares",
    description: "Sur les traces des Cathares dans l'Aude. Châteaux perchés et histoire médiévale.",
    date: new Date('2025-09-21'),
    location: "Carcassonne, Aude",
    distance: "135 km",
    website: "https://www.cathares-cyclo.fr"
  },
  {
    name: "La Granfondo Campagnolo Roma",
    description: "Cyclosportive dans la campagne romaine. Patrimoine antique et collines du Latium.",
    date: new Date('2025-03-30'),
    location: "Rome, Italie",
    distance: "142 km",
    website: "https://www.granfondoroma.it"
  },
  {
    name: "La Cyclo de la Baie de Somme",
    description: "Parcours plat le long de la baie. Phoques, oiseaux migrateurs et paysages maritimes.",
    date: new Date('2025-06-07'),
    location: "Saint-Valery-sur-Somme, Somme",
    distance: "75 km",
    website: "https://www.baiesomme-cyclo.fr"
  },
  {
    name: "La Montée du Ventoux par Bédoin",
    description: "Ascension classique du Géant de Provence par son versant le plus difficile.",
    date: new Date('2025-06-22'),
    location: "Bédoin, Vaucluse",
    distance: "42 km",
    website: "https://www.ventoux-cyclo.fr"
  },
  {
    name: "La Cyclo des Lacs alpins",
    description: "Circuit des lacs d'Annecy et du Bourget. Eaux cristallines et montagnes savoyardes.",
    date: new Date('2025-07-06'),
    location: "Annecy, Haute-Savoie",
    distance: "118 km",
    website: "https://www.lacsalpins-cyclo.fr"
  },
  {
    name: "La Ronde des Moulins de Flandre",
    description: "Parcours plat dans la campagne flamande. Moulins à vent et patrimoine nordiste.",
    date: new Date('2025-05-04'),
    location: "Cassel, Nord",
    distance: "85 km",
    website: "https://www.moulins-flandre.fr"
  },
  {
    name: "La Cyclo du Périgord Noir",
    description: "Vallées de la Dordogne et de la Vézère. Grottes préhistoriques et gastronomie périgourdine.",
    date: new Date('2025-09-28'),
    location: "Les Eyzies, Dordogne",
    distance: "105 km",
    website: "https://www.perigordnoir-cyclo.fr"
  },
  {
    name: "La Granfondo Nove Colli",
    description: "Cyclosportive italienne historique en Émilie-Romagne. Neuf cols et paysages vallonnés.",
    date: new Date('2025-05-25'),
    location: "Cesenatico, Italie",
    distance: "200 km",
    website: "https://www.novecolli.it"
  },
  {
    name: "La Cyclo des Gorges de l'Ardèche",
    description: "Parcours spectaculaire le long des méandres de l'Ardèche. Pont d'Arc et villages de caractère.",
    date: new Date('2025-10-05'),
    location: "Vallon-Pont-d'Arc, Ardèche",
    distance: "92 km",
    website: "https://www.ardeche-cyclo.fr"
  },
  {
    name: "La Cyclo des Vosges",
    description: "Ballons des Vosges et Route des Crêtes. Forêts de sapins et panoramas alsaciens.",
    date: new Date('2025-08-10'),
    location: "Gérardmer, Vosges",
    distance: "128 km",
    website: "https://www.vosges-cyclo.fr"
  },
  {
    name: "La Ronde Tahitienne",
    description: "Tour de l'île de Tahiti. Lagon turquoise, montagnes tropicales et culture polynésienne.",
    date: new Date('2025-11-02'),
    location: "Papeete, Tahiti",
    distance: "115 km",
    website: "https://www.tahiti-cyclo.pf"
  },
  {
    name: "La Cyclo des Châteaux de Dordogne",
    description: "Vallée de la Dordogne et ses châteaux médiévaux. Beynac, Castelnaud et Milandes.",
    date: new Date('2025-10-12'),
    location: "Sarlat-la-Canéda, Dordogne",
    distance: "88 km",
    website: "https://www.chateauxdordogne-cyclo.fr"
  }
]

async function main() {
  console.log('🌱 Début du peuplement étendu de la base de données...')

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

  // Créer toutes les cyclosportives
  let createdCount = 0
  let existingCount = 0

  for (const raceData of extendedRaces) {
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
      createdCount++
    } else {
      console.log(`⏭️  Course déjà existante: ${existingRace.name}`)
      existingCount++
    }
  }

  // Créer quelques utilisateurs de test supplémentaires
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
    },
    {
      email: 'sophie.durand@example.com',
      name: 'Sophie Durand',
      password: 'password123'
    },
    {
      email: 'lucas.moreau@example.com',
      name: 'Lucas Moreau',
      password: 'password123'
    }
  ]

  let usersCreated = 0
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
    if (user) usersCreated++
  }

  console.log('')
  console.log('✅ Peuplement étendu terminé avec succès!')
  console.log(`📊 ${createdCount} nouvelles cyclosportives ajoutées`)
  console.log(`⏭️  ${existingCount} cyclosportives déjà existantes`)
  console.log(`👥 ${usersCreated} utilisateurs de test disponibles`)
  console.log('')
  console.log('🔐 Comptes de test disponibles:')
  console.log('- admin@cycloranking.com / admin123 (Administrateur)')
  testUsers.forEach(user => {
    console.log(`- ${user.email} / ${user.password}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du peuplement étendu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
