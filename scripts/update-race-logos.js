// Script pour mettre à jour les logos des cyclosportives
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Mapping des logos connus pour les cyclosportives majeures
const raceLogos = {
  // GFNY Series
  "GFNY Grand Ballon": {
    logoUrl: "/logos/gfny-logo.svg",
    imageUrl: "/images/grand-ballon.svg"
  },
  "GFNY Lourdes Tourmalet": {
    logoUrl: "/logos/gfny-logo.svg", 
    imageUrl: "/images/tourmalet.svg"
  },
  "GFNY Cannes": {
    logoUrl: "/logos/gfny-logo.svg",
    imageUrl: "/images/cannes-cyclo.svg"
  },
  "GFNY Villard-de-Lans": {
    logoUrl: "/logos/gfny-logo.svg",
    imageUrl: "/images/vercors.svg"
  },
  "GFNY La Vaujany Alpe d'Huez": {
    logoUrl: "/logos/gfny-logo.svg",
    imageUrl: "/images/alpe-dhuez.svg"
  },
  "GFNY Alpes Vaujany": {
    logoUrl: "/logos/gfny-logo.svg",
    imageUrl: "/images/vaujany.svg"
  },

  // Cyclosportives mythiques
  "Marmotte Granfondo Alpes": {
    logoUrl: "/logos/marmotte-logo.svg",
    imageUrl: "/images/marmotte-alpes.svg"
  },
  "L'Ardéchoise": {
    logoUrl: "/logos/ardechoise-logo.svg",
    imageUrl: "/images/ardechoise.svg"
  },
  "GF Mont Ventoux": {
    logoUrl: "/logos/mont-ventoux-logo.svg",
    imageUrl: "/images/mont-ventoux.svg"
  },
  "Etape du Tour : Albertville - La Plagne": {
    logoUrl: "/logos/etape-du-tour-logo.svg",
    imageUrl: "/images/la-plagne.svg"
  },
  "L'Etape du Tour femmes": {
    logoUrl: "/logos/etape-du-tour-logo.svg",
    imageUrl: "/images/chambery.svg"
  },

  // Cyclosportives régionales avec logos spécifiques
  "Tro Bro Leon Challenge": {
    logoUrl: "/logos/tro-bro-leon-logo.png",
    imageUrl: "/images/bretagne-cyclo.jpg"
  },
  "Paris-Roubaix Challenge": {
    logoUrl: "/logos/paris-roubaix-logo.png",
    imageUrl: "/images/paves-roubaix.jpg"
  },
  "La Volcane": {
    logoUrl: "/logos/volcane-logo.png",
    imageUrl: "/images/volcans-auvergne.jpg"
  },
  "Megève Mont Blanc": {
    logoUrl: "/logos/megeve-logo.png",
    imageUrl: "/images/mont-blanc.jpg"
  },
  "Le Tour du Mont Blanc": {
    logoUrl: "/logos/tour-mont-blanc-logo.png",
    imageUrl: "/images/tour-mont-blanc.jpg"
  },
  "Galibier Challenge": {
    logoUrl: "/logos/galibier-logo.png",
    imageUrl: "/images/galibier.jpg"
  },
  "La Madeleine": {
    logoUrl: "/logos/madeleine-logo.png",
    imageUrl: "/images/col-madeleine.jpg"
  },
  "Granfondo Col de la Loze": {
    logoUrl: "/logos/col-loze-logo.png",
    imageUrl: "/images/col-loze.jpg"
  },

  // Logos par région/type
  "La Mercan'Tour Bonette": {
    logoUrl: "/logos/mercantour-logo.png",
    imageUrl: "/images/col-bonette.jpg"
  },
  "Les Boucles du Verdon": {
    logoUrl: "/logos/verdon-logo.png",
    imageUrl: "/images/gorges-verdon.jpg"
  },
  "Bol d'Or circuit Paul Ricard": {
    logoUrl: "/logos/paul-ricard-logo.png",
    imageUrl: "/images/circuit-paul-ricard.jpg"
  },
  "La Drapoise, souvenir René Vietto": {
    logoUrl: "/logos/rene-vietto-logo.png",
    imageUrl: "/images/nice-arriere-pays.jpg"
  }
}

// Logos par défaut selon la région
const defaultLogos = {
  "Alsace": {
    logoUrl: "/logos/default-alsace.svg",
    imageUrl: "/images/default-alsace.svg"
  },
  "Aquitaine": {
    logoUrl: "/logos/default-aquitaine.svg", 
    imageUrl: "/images/default-pyrenees.svg"
  },
  "Auvergne": {
    logoUrl: "/logos/default-auvergne.svg",
    imageUrl: "/images/default-volcans.svg"
  },
  "PACA": {
    logoUrl: "/logos/default-paca.svg",
    imageUrl: "/images/default-provence.svg"
  },
  "Rhône-Alpes": {
    logoUrl: "/logos/default-alpes.svg",
    imageUrl: "/images/default-alpes.svg"
  },
  "Bretagne": {
    logoUrl: "/logos/default-bretagne.svg",
    imageUrl: "/images/default-bretagne.svg"
  },
  "Bourgogne": {
    logoUrl: "/logos/default-bourgogne.svg",
    imageUrl: "/images/default-vignobles.svg"
  },
  "Normandie": {
    logoUrl: "/logos/default-normandie.svg",
    imageUrl: "/images/default-normandie.svg"
  }
}

function getRegionFromLocation(location) {
  if (location.includes('Haut-Rhin')) return 'Alsace'
  if (location.includes('Pyrénées') || location.includes('Landes') || location.includes('Dordogne') || location.includes('Lot-et-Garonne')) return 'Aquitaine'
  if (location.includes('Puy-de-Dôme') || location.includes('Cantal')) return 'Auvergne'
  if (location.includes('Alpes-Maritimes') || location.includes('Var') || location.includes('Vaucluse') || location.includes('Alpes-de-Haute-Provence')) return 'PACA'
  if (location.includes('Savoie') || location.includes('Isère') || location.includes('Rhône') || location.includes('Ain') || location.includes('Drôme') || location.includes('Ardèche') || location.includes('Loire')) return 'Rhône-Alpes'
  if (location.includes('Finistère') || location.includes('Morbihan')) return 'Bretagne'
  if (location.includes('Côte d\'Or') || location.includes('Nièvre')) return 'Bourgogne'
  if (location.includes('Calvados') || location.includes('Orne')) return 'Normandie'
  return 'Rhône-Alpes' // Par défaut
}

async function main() {
  console.log('🖼️  Début de la mise à jour des logos des cyclosportives...')

  const races = await prisma.race.findMany()
  let updatedCount = 0

  for (const race of races) {
    let logoUrl = null
    let imageUrl = null

    // Vérifier si on a un logo spécifique pour cette course
    if (raceLogos[race.name]) {
      logoUrl = raceLogos[race.name].logoUrl
      imageUrl = raceLogos[race.name].imageUrl
    } else {
      // Utiliser le logo par défaut de la région
      const region = getRegionFromLocation(race.location)
      if (defaultLogos[region]) {
        logoUrl = defaultLogos[region].logoUrl
        imageUrl = defaultLogos[region].imageUrl
      }
    }

    if (logoUrl || imageUrl) {
      await prisma.race.update({
        where: { id: race.id },
        data: {
          logoUrl: logoUrl,
          imageUrl: imageUrl
        }
      })
      console.log(`🎨 Logo mis à jour: ${race.name} -> ${logoUrl}`)
      updatedCount++
    }
  }

  console.log(`✅ ${updatedCount} cyclosportives mises à jour avec des logos!`)
  
  // Afficher les logos manquants à créer
  console.log('\n📋 Logos à créer dans /public/logos/:')
  const logosToCreate = new Set()
  
  Object.values(raceLogos).forEach(logo => {
    if (logo.logoUrl) logosToCreate.add(logo.logoUrl)
  })
  
  Object.values(defaultLogos).forEach(logo => {
    if (logo.logoUrl) logosToCreate.add(logo.logoUrl)
  })
  
  Array.from(logosToCreate).sort().forEach(logo => {
    console.log(`   ${logo}`)
  })

  console.log('\n📋 Images à créer dans /public/images/:')
  const imagesToCreate = new Set()
  
  Object.values(raceLogos).forEach(logo => {
    if (logo.imageUrl) imagesToCreate.add(logo.imageUrl)
  })
  
  Object.values(defaultLogos).forEach(logo => {
    if (logo.imageUrl) imagesToCreate.add(logo.imageUrl)
  })
  
  Array.from(imagesToCreate).sort().forEach(image => {
    console.log(`   ${image}`)
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
