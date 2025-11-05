import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// URLs vérifiées par recherche internet
const urlsVerifiees: { [key: string]: string } = {
  // Vérifiées par recherche
  "La Volcane": "https://cyclos-cournon-auvergne.fr/volcane",
  "Les Copains": "https://www.cyclolescopains.fr/",
  "Tro Bro Leon Challenge": "https://www.trobroleon.com/",
  "La sundgauvienne": "https://lasundgauvienne.fr",
  "L'Alsacienne lac de Kruth - Wildenstein": "https://www.lac-kruth-wildenstein.fr",
  "GFNY Grand Ballon": "https://www.gfny.com",
  "Défi 47": "https://cd47ffc.wixsite.com/defi47",
  "La Beuchigue": "https://www.labeuchigue.com",
  "Euskal Cyclo": "https://pyreneeschrono.fr/evenement/euskal-cyclo/",
  "La Bizikleta": "https://www.labizikleta.fr",
  "GFNY Lourdes Tourmalet": "https://www.gfny.com",
  "La Périgordine": "https://ok-time.fr/competition/la-perigordine-2024/",
  "Paris-Roubaix Challenge": "https://www.parisroubaixchallenge.com",
  "GFNY Cannes": "https://www.gfny.com",
  "GF Mont Ventoux": "https://gfmontventoux.com",
  "La Corima Drôme Provençale": "https://www.corimadromeprovencale.com",
  "GFNY Villard-de-Lans": "https://www.gfny.com",
  "L'Ardéchoise": "https://www.ardechoise.com",
  "GFNY La Vaujany Alpe d'Huez": "https://www.gfny.com",
  "Marmotte Granfondo Alpes": "https://marmottegranfondoalpes.com",
  "Etape du Tour : Albertville - La Plagne": "https://www.letapedutourdefrance.com",
  "L'Etape du Tour femmes": "https://www.letapedutourdefrance.com",
  "GFNY Alpes Vaujany": "https://www.gfny.com"
}

// Prénoms (95% hommes, 5% femmes)
const prenomsHommes = [
  'Philippe', 'Christophe', 'Laurent', 'Frédéric', 'Stéphane', 'Pascal', 'Thierry', 'Olivier', 'Éric', 'Didier',
  'Patrice', 'Bruno', 'Alain', 'Michel', 'Jean-Luc', 'François', 'Gilles', 'Dominique', 'Hervé', 'Yves',
  'Julien', 'Sébastien', 'Nicolas', 'David', 'Cédric', 'Fabrice', 'Vincent', 'Jérôme', 'Arnaud', 'Franck',
  'Bernard', 'Jean-Pierre', 'André', 'Pierre', 'Claude', 'Roger', 'Marcel', 'Henri', 'Robert', 'Georges'
]

const prenomsFemmes = [
  'Catherine', 'Isabelle', 'Sylvie', 'Nathalie', 'Véronique', 'Corinne', 'Martine', 'Brigitte', 'Françoise', 'Monique',
  'Sandrine', 'Céline', 'Valérie', 'Karine', 'Delphine', 'Émilie', 'Aurélie', 'Laetitia', 'Virginie', 'Stéphanie'
]

// Commentaires courts (30-40 caractères) - 80%
const commentairsCourts = [
  'Bien organisé.', 'Sympa à faire.', 'Très correct.', 'Bonne ambiance.', 'À recommander.',
  'Parcours agréable.', 'Excellent !', 'Parfait !', 'Au top !', 'Magnifique !',
  'Correct sans plus.', 'Moyen cette fois.', 'Peut mieux faire.', 'Pas mal.',
  'Décevant cette année.', 'Pas terrible.', 'Trop cher.', 'Mal organisé.'
]

// Commentaires longs (100-150 caractères) - 20%
const commentairesLongs = [
  'Excellente cyclosportive, organisation parfaite et magnifiques paysages !',
  'Au top du début à la fin, une des meilleures que j\'ai faites.',
  'Belle cyclosportive avec une bonne organisation et parcours varié.',
  'Très correct, bonne ambiance et ravitaillements bien placés.',
  'Vraiment décevant cette année, organisation à revoir complètement.',
  'Correct sans plus, quelques problèmes mais ça reste faisable.'
]

// Domaines email
const domainesEmail = [
  { domaine: 'gmail.com', pourcentage: 0.50 },
  { domaine: 'orange.fr', pourcentage: 0.20 },
  { domaine: 'free.fr', pourcentage: 0.15 },
  { domaine: 'hotmail.fr', pourcentage: 0.10 },
  { domaine: 'wanadoo.fr', pourcentage: 0.05 }
]

const consonnes = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'z']
const voyelles = ['a', 'e', 'i', 'o', 'u']

function genererCommentaire(): string {
  // 80% courts, 20% longs
  const estLong = Math.random() < 0.2
  
  if (estLong) {
    return commentairesLongs[Math.floor(Math.random() * commentairesLongs.length)]
  } else {
    return commentairsCourts[Math.floor(Math.random() * commentairsCourts.length)]
  }
}

function genererNotes(raceName: string): any {
  // Notes spéciales pour L'Étape du Tour (moyenne 2.6)
  if (raceName.includes("Étape du Tour") || raceName.includes("Etape du Tour")) {
    return {
      accommodationAvailability: Math.random() < 0.5 ? 2 : 3,
      parkingAvailability: Math.random() < 0.3 ? 2 : 3,
      startFinishDistance: Math.random() < 0.4 ? 2 : 3,
      foodQuality: Math.random() < 0.6 ? 2 : 3,
      foodQuantity: Math.random() < 0.5 ? 2 : 3,
      foodConviviality: Math.random() < 0.4 ? 2 : 3,
      safety: Math.random() < 0.3 ? 2 : 3,
      signage: Math.random() < 0.2 ? 3 : 4,
      traffic: Math.random() < 0.7 ? 2 : 3,
      scenery: Math.random() < 0.1 ? 4 : 5,
      routeVariety: Math.random() < 0.2 ? 3 : 4,
      priceValue: Math.random() < 0.8 ? 2 : 3
    }
  }
  
  // Notes normales (moyenne 3.5-4.5)
  const baseNote = 3.5 + Math.random() * 1.0
  const variation = 0.8
  
  return {
    accommodationAvailability: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    parkingAvailability: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    startFinishDistance: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    foodQuality: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    foodQuantity: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    foodConviviality: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    safety: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    signage: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    traffic: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    scenery: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    routeVariety: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation))),
    priceValue: Math.max(1, Math.min(5, Math.round(baseNote + (Math.random() - 0.5) * variation)))
  }
}

function genererDomaineEmail(): string {
  const rand = Math.random()
  let cumul = 0
  
  for (const { domaine, pourcentage } of domainesEmail) {
    cumul += pourcentage
    if (rand <= cumul) {
      return domaine
    }
  }
  
  return 'gmail.com'
}

function genererDebutEmail(prenom: string): string {
  // 50% avec le prénom, 50% avec consonne + voyelle
  if (Math.random() < 0.5) {
    return prenom.toLowerCase()
  } else {
    const consonne = consonnes[Math.floor(Math.random() * consonnes.length)]
    const voyelle = voyelles[Math.floor(Math.random() * voyelles.length)]
    return consonne + voyelle
  }
}

function genererDateAleatoire(): Date {
  const debut2024 = new Date('2024-01-01')
  const maintenant = new Date()
  const diffTime = maintenant.getTime() - debut2024.getTime()
  const dateAleatoire = new Date(debut2024.getTime() + Math.random() * diffTime)
  return dateAleatoire
}

async function verifierUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, { 
      method: 'HEAD', 
      signal: controller.signal 
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

async function main() {
  console.log('🔄 Création de la base de données finale 2025...')
  
  // 1. Supprimer toutes les données
  await prisma.vote.deleteMany()
  await prisma.race.deleteMany()
  
  // 2. Récupérer admin
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@cycloranking.com' }
  })
  
  if (!adminUser) {
    console.error('❌ Admin non trouvé')
    return
  }
  
  // 3. Créer seulement les cyclosportives avec URLs vérifiées
  console.log('\n🏁 Création des cyclosportives avec URLs vérifiées...')
  const coursesCreees = []
  
  // Pour l'instant, on utilise seulement celles avec URLs vérifiées
  const cyclosportivesAvecUrls = [
    { name: "La Volcane", location: "Volvic, Puy-de-Dôme", date: new Date('2025-06-15'), distance: "135 km" },
    { name: "Les Copains", location: "Ambert, Puy-de-Dôme", date: new Date('2025-07-05'), distance: "125 km" },
    { name: "Tro Bro Leon Challenge", location: "Lannelis, Finistère", date: new Date('2025-05-10'), distance: "160 km" },
    { name: "La sundgauvienne", location: "Hégenheim, Haut-Rhin", date: new Date('2025-05-11'), distance: "127 km" },
    { name: "GFNY Grand Ballon", location: "Thann, Haut-Rhin", date: new Date('2025-07-20'), distance: "120 km" },
    { name: "Défi 47", location: "Prayssas, Lot-et-Garonne", date: new Date('2025-04-13'), distance: "80 km" },
    { name: "La Beuchigue", location: "Saint-Sever, Landes", date: new Date('2025-04-20'), distance: "145 km" },
    { name: "Euskal Cyclo", location: "Cambo-les-Bains, Pyrénées-Atlantiques", date: new Date('2025-05-25'), distance: "145 km" },
    { name: "La Bizikleta", location: "Saint-Jean-de-Luz, Pyrénées-Atlantiques", date: new Date('2025-06-08'), distance: "130 km" },
    { name: "GFNY Lourdes Tourmalet", location: "Lourdes, Pyrénées-Atlantiques", date: new Date('2025-06-22'), distance: "140 km" },
    { name: "La Périgordine", location: "Le Lardin-Saint-Lazare, Dordogne", date: new Date('2025-06-22'), distance: "150 km" },
    { name: "Paris-Roubaix Challenge", location: "Denain, Nord", date: new Date('2025-04-12'), distance: "170 km" },
    { name: "GFNY Cannes", location: "Cannes, Alpes-Maritimes", date: new Date('2025-03-23'), distance: "110 km" },
    { name: "GF Mont Ventoux", location: "Vaison la Romaine, Vaucluse", date: new Date('2025-06-01'), distance: "150 km" },
    { name: "La Corima Drôme Provençale", location: "Montélimar, Drôme", date: new Date('2025-03-30'), distance: "125 km" },
    { name: "GFNY Villard-de-Lans", location: "Villard-de-Lans, Isère", date: new Date('2025-05-25'), distance: "135 km" },
    { name: "L'Ardéchoise", location: "Saint-Félicien, Ardèche", date: new Date('2025-06-14'), distance: "145 km" },
    { name: "GFNY La Vaujany Alpe d'Huez", location: "Vaujany, Isère", date: new Date('2025-06-15'), distance: "155 km" },
    { name: "Marmotte Granfondo Alpes", location: "Le Bourg d'Oisans, Isère", date: new Date('2025-06-22'), distance: "174 km" },
    { name: "Etape du Tour : Albertville - La Plagne", location: "Albertville, Savoie", date: new Date('2025-07-20'), distance: "138 km" },
    { name: "L'Etape du Tour femmes", location: "Chambéry, Savoie", date: new Date('2025-08-02'), distance: "120 km" },
    { name: "GFNY Alpes Vaujany", location: "Vaujany, Isère", date: new Date('2025-08-24'), distance: "140 km" }
  ]
  
  for (const cyclo of cyclosportivesAvecUrls) {
    const url = urlsVerifiees[cyclo.name]
    
    if (url) {
      const urlValide = await verifierUrl(url)
      console.log(`${urlValide ? '✅' : '❌'} ${cyclo.name}: ${url}`)
      
      if (urlValide) {
        const course = await prisma.race.create({
          data: {
            name: cyclo.name,
            location: cyclo.location,
            date: cyclo.date,
            distance: cyclo.distance,
            website: url,
            createdBy: adminUser.id,
            description: `Cyclosportive ${cyclo.name} à ${cyclo.location}`
          }
        })
        coursesCreees.push(course)
      }
    }
  }
  
  console.log(`\n✅ ${coursesCreees.length} cyclosportives créées`)
  
  // 4. Créer 200 utilisateurs
  console.log('\n👥 Création des utilisateurs...')
  const utilisateurs = []
  const nombreFemmes = Math.floor(200 * 0.05) // 5%
  const nombreHommes = 200 - nombreFemmes // 95%
  
  for (let i = 0; i < 200; i++) {
    const estFemme = i < nombreFemmes
    const prenom = estFemme 
      ? prenomsFemmes[Math.floor(Math.random() * prenomsFemmes.length)]
      : prenomsHommes[Math.floor(Math.random() * prenomsHommes.length)]
    
    const domaine = genererDomaineEmail()
    const debutEmail = genererDebutEmail(prenom)
    const email = `${debutEmail}.${i}@${domaine}`
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: prenom,
        password: hashedPassword
      }
    })
    utilisateurs.push(user)
  }
  
  console.log(`✅ ${utilisateurs.length} utilisateurs créés (${nombreFemmes} femmes, ${nombreHommes} hommes)`)
  
  // 5. Générer votes et commentaires
  console.log('\n📝 Génération des votes et commentaires...')
  let totalVotes = 0
  let totalCommentaires = 0
  
  for (const course of coursesCreees) {
    // 20-100 votes par cyclosportive
    const nombreVotes = 20 + Math.floor(Math.random() * 81)
    
    // 2-3 commentaires par cyclosportive
    const nombreCommentaires = 2 + Math.floor(Math.random() * 2)
    
    const utilisateursSelectionnes = utilisateurs
      .sort(() => Math.random() - 0.5)
      .slice(0, nombreVotes)
    
    let commentairesGeneres = 0
    
    for (let i = 0; i < nombreVotes; i++) {
      const user = utilisateursSelectionnes[i]
      const notes = genererNotes(course.name)
      const dateCreation = genererDateAleatoire()
      
      // Générer commentaire seulement pour les premiers (2-3)
      let commentaire = null
      if (commentairesGeneres < nombreCommentaires) {
        commentaire = genererCommentaire()
        commentairesGeneres++
      }
      
      await prisma.vote.create({
        data: {
          userId: user.id,
          raceId: course.id,
          comment: commentaire,
          createdAt: dateCreation,
          updatedAt: dateCreation,
          ...notes
        }
      })
      
      totalVotes++
      if (commentaire) totalCommentaires++
    }
    
    console.log(`${course.name}: ${nombreVotes} votes, ${commentairesGeneres} commentaires`)
  }
  
  // Statistiques finales
  const coursesFinales = await prisma.race.count()
  const votesFinaux = await prisma.vote.count()
  const utilisateursFinaux = await prisma.user.count()
  
  console.log('\n📊 Statistiques finales:')
  console.log(`🏁 ${coursesFinales} cyclosportives avec URLs vérifiées`)
  console.log(`💬 ${totalVotes} votes générés`)
  console.log(`📝 ${totalCommentaires} commentaires (2-3 par cyclosportive)`)
  console.log(`👥 ${utilisateursFinaux} utilisateurs`)
  console.log(`🌐 Toutes les URLs ont été vérifiées`)
  
  console.log('\n✅ Base de données finale créée avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
