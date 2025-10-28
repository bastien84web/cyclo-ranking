// Script de peuplement pour la production
// Ce script sera exécuté après le déploiement pour peupler la base PostgreSQL

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const realRaces = [
  // Courses mythiques
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

  console.log(`✅ ${createdCount} nouvelles cyclosportives créées en production!`)
  console.log(`📊 Total: ${realRaces.length} cyclosportives disponibles`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
