// Script de peuplement complet pour les cyclosportives 2025
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const cyclosportives2025 = [
  // Alsace
  {
    name: "La sundgauvienne",
    description: "Cyclosportive dans le Sundgau alsacien, région vallonnée aux paysages bucoliques entre forêts et prairies.",
    location: "Hégenheim (Haut-Rhin - 68)",
    date: new Date('2025-05-11'),
    distance: "80-120 km",
    website: null
  },
  {
    name: "L'Alsacienne lac de Kruth - Wildenstein",
    description: "Parcours autour du lac de Kruth-Wildenstein dans les Vosges alsaciennes, entre montagne et nature préservée.",
    location: "Kruth - Wildenstein (Haut-Rhin - 68)",
    date: new Date('2025-06-29'),
    distance: "90-140 km",
    website: null
  },
  {
    name: "GFNY Grand Ballon",
    description: "Granfondo avec ascension du Grand Ballon, point culminant des Vosges à 1424m d'altitude.",
    location: "Thann (Haut-Rhin - 68)",
    date: new Date('2025-07-20'),
    distance: "100-160 km",
    website: "https://www.gfny.com"
  },

  // Aquitaine
  {
    name: "Défi 47",
    description: "Cyclosportive dans le Lot-et-Garonne, parcours vallonné entre vignes, vergers et bastides.",
    location: "Prayssas (Lot-et-Garonne - 47)",
    date: new Date('2025-04-13'),
    distance: "70-130 km",
    website: null
  },
  {
    name: "La Beuchigue",
    description: "Cyclosportive landaise à travers la forêt des Landes et ses paysages typiques de pins maritimes.",
    location: "Saint-Sever (Landes - 40)",
    date: new Date('2025-04-20'),
    distance: "85-150 km",
    website: null
  },
  {
    name: "Euskal Cyclo",
    description: "Cyclosportive au cœur du Pays Basque, entre montagne basque et tradition euskaldun.",
    location: "Cambo-les-Bains (Pyrénées-Atlantiques - 64)",
    date: new Date('2025-05-25'),
    distance: "90-160 km",
    website: null
  },
  {
    name: "La Bizikleta",
    description: "Cyclosportive basque avec vue sur l'océan Atlantique et les Pyrénées, dans un cadre exceptionnel.",
    location: "Saint-Jean-de-Luz (Pyrénées-Atlantiques - 64)",
    date: new Date('2025-06-08'),
    distance: "80-140 km",
    website: null
  },
  {
    name: "GFNY Lourdes Tourmalet",
    description: "Granfondo mythique avec l'ascension du col du Tourmalet, géant des Pyrénées à 2115m.",
    location: "Lourdes (Hautes-Pyrénées - 65)",
    date: new Date('2025-06-22'),
    distance: "120-180 km",
    website: "https://www.gfny.com"
  },
  {
    name: "La Périgordine",
    description: "Découverte du Périgord Noir, ses châteaux médiévaux, grottes préhistoriques et gastronomie.",
    location: "Le Lardin-Saint-Lazare (Dordogne - 24)",
    date: new Date('2025-06-22'),
    distance: "75-130 km",
    website: null
  },
  {
    name: "La Matthieu Ladagnous",
    description: "Cyclosportive en hommage au coureur cycliste, dans les vallées pyrénéennes.",
    location: "Asson (Pyrénées-Atlantiques - 65)",
    date: new Date('2025-07-13'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "La Marcel Queheille",
    description: "Cyclosportive dans le Béarn, parcours montagneux en hommage à Marcel Queheille.",
    location: "Mauléon-Licharre (Pyrénées-Atlantiques - 64)",
    date: new Date('2025-08-16'),
    distance: "100-160 km",
    website: null
  },

  // Auvergne
  {
    name: "La Volcane",
    description: "Cyclosportive au cœur des volcans d'Auvergne, paysages volcaniques uniques et sources de Volvic.",
    location: "Volvic (Puy-de-Dôme - 63)",
    date: new Date('2025-06-15'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Les Copains",
    description: "Cyclosportive conviviale dans les monts du Forez, ambiance chaleureuse garantie.",
    location: "Ambert (Puy-de-Dôme - 63)",
    date: new Date('2025-07-05'),
    distance: "80-140 km",
    website: null
  },
  {
    name: "L'Etape Sanfloraine",
    description: "Cyclosportive dans le Cantal avec vue sur les monts du Cantal et le plateau de Saint-Flour.",
    location: "Saint-Flour (Cantal - 15)",
    date: new Date('2025-08-10'),
    distance: "85-160 km",
    website: null
  },
  {
    name: "La Sancy Arc en Ciel By Laurent Brochard",
    description: "Cyclosportive autour du Puy de Sancy, point culminant du Massif Central, par Laurent Brochard.",
    location: "Chambon-sur-Lac (Puy-de-Dôme - 63)",
    date: new Date('2025-09-13'),
    distance: "100-170 km",
    website: null
  },

  // Basse-Normandie
  {
    name: "L'Ornaise",
    description: "Cyclosportive normande à travers le bocage ornais et ses paysages verdoyants.",
    location: "Argentan (Orne - 61)",
    date: new Date('2025-05-11'),
    distance: "80-140 km",
    website: null
  },
  {
    name: "La Ronde Normande",
    description: "Découverte du Calvados entre bocage normand et côte du Bessin.",
    location: "Juaye-Mondaye (Calvados - 14)",
    date: new Date('2025-05-25'),
    distance: "90-150 km",
    website: null
  },

  // Bourgogne
  {
    name: "La Claudio Chiappucci",
    description: "Cyclosportive en hommage au coureur italien, à travers les vignobles bourguignons.",
    location: "Arnay-le-Duc (Côte d'Or - 21)",
    date: new Date('2025-06-07'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "Courir pour la Paix",
    description: "Cyclosportive solidaire dans la Côte d'Or, entre vignobles et patrimoine bourguignon.",
    location: "Chailly-sur-Armançon (Côte d'Or - 21)",
    date: new Date('2025-08-02'),
    distance: "85-140 km",
    website: null
  },
  {
    name: "La Jean-François Bernard",
    description: "Cyclosportive en hommage au grimpeur français, dans le Morvan nivernais.",
    location: "Corbigny (Nièvre - 58)",
    date: new Date('2025-09-07'),
    distance: "90-150 km",
    website: null
  },

  // Bretagne
  {
    name: "Tro Bro Leon Challenge",
    description: "Cyclosportive bretonne sur les routes du Tro Bro Leon, avec secteurs pavés et chemins.",
    location: "Lannelis (Finistère - 29)",
    date: new Date('2025-05-10'),
    distance: "100-180 km",
    website: null
  },
  {
    name: "La Coeur de Bretagne",
    description: "Cyclosportive au cœur de la Bretagne, entre landes et forêts bretonnes.",
    location: "Malestroit (Morbihan - 56)",
    date: new Date('2025-07-06'),
    distance: "80-140 km",
    website: null
  },

  // PACA
  {
    name: "GFNY Cannes",
    description: "Granfondo sur la Côte d'Azur avec vue sur la Méditerranée et l'arrière-pays cannois.",
    location: "Cannes (Alpes-Maritimes - 06)",
    date: new Date('2025-03-23'),
    distance: "100-160 km",
    website: "https://www.gfny.com"
  },
  {
    name: "Tour du Pays d'Apt Cyclo",
    description: "Cyclosportive dans le Luberon, entre villages perchés et champs de lavande.",
    location: "Apt (Vaucluse - 84)",
    date: new Date('2025-03-30'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Poli Sainte-Baume",
    description: "Cyclosportive varoise autour du massif de la Sainte-Baume, haut lieu spirituel.",
    location: "La Cadière d'Azur (Var - 83)",
    date: new Date('2025-04-06'),
    distance: "85-140 km",
    website: null
  },
  {
    name: "La Lavandine",
    description: "Cyclosportive dans les Alpes de Haute-Provence, au pays de la lavande.",
    location: "La Motte-du-Caire (Alpes-de-Haute-Provence - 04)",
    date: new Date('2025-04-13'),
    distance: "80-130 km",
    website: null
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
    name: "Granfondo La Vençoise",
    description: "Granfondo dans l'arrière-pays niçois, entre mer et montagne.",
    location: "Vence (Alpes-Maritimes - 06)",
    date: new Date('2025-05-11'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "Les Boucles du Verdon",
    description: "Cyclosportive autour des gorges du Verdon, Grand Canyon français.",
    location: "Gréoux-les-Bains (Alpes-de-Haute-Provence - 04)",
    date: new Date('2025-05-18'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "GF Mont Ventoux",
    description: "Granfondo avec l'ascension mythique du Mont Ventoux, Géant de Provence à 1912m.",
    location: "Vaison la Romaine (Vaucluse - 84)",
    date: new Date('2025-06-01'),
    distance: "118-160 km",
    website: "https://gfmontventoux.com"
  },
  {
    name: "La Drapoise, souvenir René Vietto",
    description: "Cyclosportive en hommage à René Vietto, roi de la montagne, dans l'arrière-pays niçois.",
    location: "Drap (Alpes-Maritimes - 06)",
    date: new Date('2025-06-01'),
    distance: "90-140 km",
    website: null
  },
  {
    name: "Bol d'Or circuit Paul Ricard",
    description: "Cyclosportive sur le célèbre circuit Paul Ricard, expérience unique sur piste F1.",
    location: "Le Castellet (Var - 83)",
    date: new Date('2025-06-07'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "La Mercan'Tour Bonette",
    description: "Cyclosportive avec ascension de la Bonette, plus haute route d'Europe à 2802m.",
    location: "Valberg (Alpes-Maritimes - 06)",
    date: new Date('2025-06-15'),
    distance: "140-180 km",
    website: null
  },

  // Rhône-Alpes
  {
    name: "La Corima Drôme Provençale",
    description: "Cyclosportive dans la Drôme provençale, entre lavande et vignobles.",
    location: "Montélimar (Drôme - 26)",
    date: new Date('2025-03-30'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Les Rondes de la Clairette",
    description: "Cyclosportive dans le Vercors drômois, pays de la Clairette de Die.",
    location: "Vercheny (Drôme - 26)",
    date: new Date('2025-04-13'),
    distance: "80-140 km",
    website: null
  },
  {
    name: "Le Raid du Bugey",
    description: "Cyclosportive dans le Bugey, entre Jura et Alpes, paysages vallonnés.",
    location: "Lagnieu (Ain - 01)",
    date: new Date('2025-04-27'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "Thonon Cycling Race",
    description: "Cyclosportive autour du lac Léman, entre France et Suisse.",
    location: "Thonon-les-Bains (Haute-Savoie - 74)",
    date: new Date('2025-05-04'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "La Thierry Claveyrolat",
    description: "Cyclosportive en hommage au grimpeur français, dans l'Oisans.",
    location: "Vizille (Isère - 38)",
    date: new Date('2025-05-04'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "L'Aindinoise",
    description: "Cyclosportive dans le Bugey, autour de Belley et ses paysages vallonnés.",
    location: "Belley (Ain - 01)",
    date: new Date('2025-05-10'),
    distance: "85-140 km",
    website: null
  },
  {
    name: "GFNY Villard-de-Lans",
    description: "Granfondo dans le Vercors, plateau aux paysages grandioses.",
    location: "Villard-de-Lans (Isère - 38)",
    date: new Date('2025-05-25'),
    distance: "100-160 km",
    website: "https://www.gfny.com"
  },
  {
    name: "Les 3 cols materiel-velo.com",
    description: "Cyclosportive lyonnaise avec 3 cols emblématiques de la région.",
    location: "La Tour-de-Salvagny (Rhône - 69)",
    date: new Date('2025-05-29'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Motz-Chautagne Tour",
    description: "Cyclosportive savoyarde entre lac du Bourget et vignobles de Chautagne.",
    location: "Motz (Savoie - 73)",
    date: new Date('2025-06-01'),
    distance: "80-130 km",
    website: null
  },
  {
    name: "La Faucigny Glières",
    description: "Cyclosportive en Haute-Savoie, sur les traces de la Résistance au plateau des Glières.",
    location: "Bonneville (Haute-Savoie - 74)",
    date: new Date('2025-06-01'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Galibier Challenge",
    description: "Cyclosportive avec ascension du col du Galibier, géant des Alpes à 2642m.",
    location: "Saint-Michel-de-Maurienne (Savoie - 73)",
    date: new Date('2025-06-08'),
    distance: "120-180 km",
    website: null
  },
  {
    name: "L'Ardéchoise",
    description: "La plus grande cyclosportive de France ! 5 parcours de 66 à 285 km dans les gorges de l'Ardèche. Parcours mythiques : Volcanique (186km), Boutières (134km), AVM (285km), Ardéchoise (230km), Sucs (241km).",
    location: "Saint-Félicien (Ardèche - 07)",
    date: new Date('2025-06-14'),
    distance: "66-285 km",
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
    name: "Châtel Chablais Léman Race",
    description: "Cyclosportive dans le Chablais, entre lac Léman et sommets alpins.",
    location: "Châtel (Haute-Savoie - 74)",
    date: new Date('2025-06-22'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "La Téméraire",
    description: "Cyclosportive jurassienne dans la région de Salins-les-Bains.",
    location: "Salins-les-Bains (Jura - 39)",
    date: new Date('2025-06-22'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Marmotte Granfondo Alpes",
    description: "La cyclosportive la plus mythique des Alpes ! 4 cols légendaires : Glandon, Télégraphe, Galibier et Alpe d'Huez. 174 km et 5000m de dénivelé.",
    location: "Le Bourg d'Oisans (Isère - 38)",
    date: new Date('2025-06-22'),
    distance: "174 km",
    website: "https://www.lamarmotte.fr"
  },
  {
    name: "La Grenobloise",
    description: "Cyclosportive dans l'agglomération grenobloise, entre Vercors et Chartreuse.",
    location: "Grenoble (Isère - 38)",
    date: new Date('2025-07-06'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "La JPP - Neuf de Coeur",
    description: "Cyclosportive en Haute-Savoie, dans la vallée de l'Arve.",
    location: "Les Carroz (Haute-Savoie - 74)",
    date: new Date('2025-07-06'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "Le Tour du Mont Blanc",
    description: "Cyclosportive autour du massif du Mont-Blanc, entre France, Suisse et Italie.",
    location: "Les Saisies (Savoie - 73)",
    date: new Date('2025-07-12'),
    distance: "160-200 km",
    website: null
  },
  {
    name: "Granfondo Col de la Loze",
    description: "Granfondo avec ascension du col de la Loze, nouveau col du Tour de France.",
    location: "Brides-les-Bains (Savoie - 73)",
    date: new Date('2025-07-13'),
    distance: "120-180 km",
    website: null
  },
  {
    name: "GF Sybelles La Toussuire",
    description: "Granfondo dans le domaine des Sybelles, plus grand domaine skiable de France.",
    location: "La Toussuire (Savoie - 73)",
    date: new Date('2025-07-14'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "Etape du Tour : Albertville - La Plagne",
    description: "Revivez une étape du Tour de France avec arrivée à La Plagne, station olympique.",
    location: "Albertville (Savoie - 73)",
    date: new Date('2025-07-20'),
    distance: "140 km",
    website: "https://www.letapedutour.com"
  },
  {
    name: "La Madeleine",
    description: "Cyclosportive avec ascension du col de la Madeleine, col mythique de Maurienne.",
    location: "La Chambre (Savoie - 73)",
    date: new Date('2025-07-27'),
    distance: "100-160 km",
    website: null
  },
  {
    name: "L'Etape du Tour femmes",
    description: "Etape du Tour de France dédiée aux femmes, parcours adapté et festif.",
    location: "Chambéry (Savoie - 73)",
    date: new Date('2025-08-02'),
    distance: "100-140 km",
    website: "https://www.letapedutour.com"
  },
  {
    name: "Le défi des Vals",
    description: "Cyclosportive dans les vallées dauphinoises, défi montagnard.",
    location: "Les Abrets en Dauphiné (Isère - 38)",
    date: new Date('2025-08-08'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Lélex Pays de Gex",
    description: "Cyclosportive dans le Pays de Gex, entre Jura et lac Léman.",
    location: "Pays de Gex (Ain - 01)",
    date: new Date('2025-08-09'),
    distance: "80-140 km",
    website: null
  },
  {
    name: "GFNY Alpes Vaujany",
    description: "Granfondo dans l'Oisans, au cœur des Alpes françaises.",
    location: "Vaujany (Isère - 38)",
    date: new Date('2025-08-24'),
    distance: "120-180 km",
    website: "https://www.gfny.com"
  },
  {
    name: "Dvélos Lac d'Annecy",
    description: "Cyclosportive autour du lac d'Annecy, perle des Alpes françaises.",
    location: "Saint Jorioz (Haute-Savoie - 74)",
    date: new Date('2025-08-24'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "Megève Mont Blanc",
    description: "Cyclosportive de prestige dans le massif du Mont-Blanc, station mythique de Megève.",
    location: "Megève (Haute-Savoie - 74)",
    date: new Date('2025-08-31'),
    distance: "120-180 km",
    website: null
  },
  {
    name: "La Rémi Cavagna au coeur de la Loire",
    description: "Cyclosportive en hommage au coureur français Rémi Cavagna, dans la Loire.",
    location: "Saint-Just-en-Chevalet (Loire - 42)",
    date: new Date('2025-09-07'),
    distance: "90-150 km",
    website: null
  },
  {
    name: "La Drômoise",
    description: "Cyclosportive dans la Drôme, entre Vercors et Provence.",
    location: "Die (Drôme - 26)",
    date: new Date('2025-09-21'),
    distance: "80-140 km",
    website: null
  },
  {
    name: "La Bisou",
    description: "Cyclosportive dans l'Ain, parcours vallonné et convivial.",
    location: "Péronnas (Ain - 01)",
    date: new Date('2025-09-28'),
    distance: "85-140 km",
    website: null
  }
]

async function main() {
  console.log('🌱 Début du peuplement complet avec les cyclosportives 2025...')

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
  let updatedCount = 0
  
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
      // Mettre à jour si nécessaire
      const updatedRace = await prisma.race.update({
        where: { id: existingRace.id },
        data: {
          description: raceData.description,
          distance: raceData.distance,
          website: raceData.website,
        }
      })
      console.log(`🔄 Course mise à jour: ${updatedRace.name}`)
      updatedCount++
    }
  }

  console.log(`✅ ${createdCount} nouvelles cyclosportives créées!`)
  console.log(`🔄 ${updatedCount} cyclosportives mises à jour!`)
  console.log(`📊 Total traité: ${cyclosportives2025.length} cyclosportives`)
  
  // Statistiques par région
  const regions = {}
  cyclosportives2025.forEach(race => {
    const location = race.location
    const region = location.includes('Alpes') ? 'PACA/Rhône-Alpes' :
                  location.includes('Savoie') || location.includes('Isère') || location.includes('Rhône') || location.includes('Ain') || location.includes('Drôme') || location.includes('Ardèche') ? 'Rhône-Alpes' :
                  location.includes('Haut-Rhin') ? 'Alsace' :
                  location.includes('Pyrénées') || location.includes('Landes') || location.includes('Dordogne') || location.includes('Lot-et-Garonne') ? 'Aquitaine' :
                  location.includes('Puy-de-Dôme') || location.includes('Cantal') ? 'Auvergne' :
                  'Autres'
    
    regions[region] = (regions[region] || 0) + 1
  })
  
  console.log('\n📍 Répartition par région:')
  Object.entries(regions).forEach(([region, count]) => {
    console.log(`   ${region}: ${count} cyclosportives`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
