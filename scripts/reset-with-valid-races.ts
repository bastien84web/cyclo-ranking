import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// Liste des cyclosportives valides avec recherche d'URLs
const cyclosportivesValides = [
  // Alsace
  { name: "La sundgauvienne", location: "Hégenheim, Haut-Rhin", date: new Date('2025-05-11'), distance: "127 km" },
  { name: "L'Alsacienne lac de Kruth - Wildenstein", location: "Kruth-Wildenstein, Haut-Rhin", date: new Date('2025-06-29'), distance: "170 km" },
  { name: "GFNY Grand Ballon", location: "Thann, Haut-Rhin", date: new Date('2025-07-20'), distance: "120 km" },
  
  // Aquitaine
  { name: "Défi 47", location: "Prayssas, Lot-et-Garonne", date: new Date('2025-04-13'), distance: "80 km" },
  { name: "La Beuchigue", location: "Saint-Sever, Landes", date: new Date('2025-04-20'), distance: "145 km" },
  { name: "Euskal Cyclo", location: "Cambo-les-Bains, Pyrénées-Atlantiques", date: new Date('2025-05-25'), distance: "145 km" },
  { name: "La Bizikleta", location: "Saint-Jean-de-Luz, Pyrénées-Atlantiques", date: new Date('2025-06-08'), distance: "130 km" },
  { name: "GFNY Lourdes Tourmalet", location: "Lourdes, Pyrénées-Atlantiques", date: new Date('2025-06-22'), distance: "140 km" },
  { name: "La Périgordine", location: "Le Lardin-Saint-Lazare, Dordogne", date: new Date('2025-06-22'), distance: "105 km" },
  
  // Nord - Pas-de-Calais
  { name: "Paris-Roubaix Challenge", location: "Denain, Nord", date: new Date('2025-04-12'), distance: "170 km" },
  
  // PACA
  { name: "GFNY Cannes", location: "Cannes, Alpes-Maritimes", date: new Date('2025-03-23'), distance: "110 km" },
  { name: "GF Mont Ventoux", location: "Vaison la Romaine, Vaucluse", date: new Date('2025-06-01'), distance: "150 km" },
  
  // Rhône-Alpes
  { name: "La Corima Drôme Provençale", location: "Montélimar, Drôme", date: new Date('2025-03-30'), distance: "125 km" },
  { name: "GFNY Villard-de-Lans", location: "Villard-de-Lans, Isère", date: new Date('2025-05-25'), distance: "135 km" },
  { name: "L'Ardéchoise", location: "Saint-Félicien, Ardèche", date: new Date('2025-06-14'), distance: "145 km" },
  { name: "GFNY La Vaujany Alpe d'Huez", location: "Vaujany, Isère", date: new Date('2025-06-15'), distance: "155 km" },
  { name: "Marmotte Granfondo Alpes", location: "Le Bourg d'Oisans, Isère", date: new Date('2025-06-22'), distance: "174 km" },
  { name: "Etape du Tour : Albertville - La Plagne", location: "Albertville, Savoie", date: new Date('2025-07-20'), distance: "138 km" },
  { name: "L'Etape du Tour femmes", location: "Chambéry, Savoie", date: new Date('2025-08-02'), distance: "120 km" },
  { name: "GFNY Alpes Vaujany", location: "Vaujany, Isère", date: new Date('2025-08-24'), distance: "140 km" },
  { name: "La Bisou", location: "Péronnas, Ain", date: new Date('2025-09-28'), distance: "95 km" }
]

// URLs recherchées et vérifiées
const urlsVerifiees: { [key: string]: string } = {
  "La sundgauvienne": "https://lasundgauvienne.fr",
  "L'Alsacienne lac de Kruth - Wildenstein": "https://www.lac-kruth-wildenstein.fr",
  "GFNY Grand Ballon": "https://www.gfny.com",
  "Défi 47": "https://cd47ffc.wixsite.com/defi47",
  "La Beuchigue": "https://www.labeuchigue.com",
  "Euskal Cyclo": "https://euskalcyclo.fr",
  "La Bizikleta": "https://www.labizikleta.fr",
  "GFNY Lourdes Tourmalet": "https://www.gfny.com",
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
  "GFNY Alpes Vaujany": "https://www.gfny.com",
  "La Bisou": "https://www.labisou.com"
}

// Fonction pour vérifier si une URL est accessible
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

// Prénoms par tranche d'âge (repris du script précédent)
const prenoms40_50 = [
  'Philippe', 'Christophe', 'Laurent', 'Frédéric', 'Stéphane', 'Pascal', 'Thierry', 'Olivier', 'Éric', 'Didier',
  'Patrice', 'Bruno', 'Alain', 'Michel', 'Jean-Luc', 'François', 'Gilles', 'Dominique', 'Hervé', 'Yves',
  'Catherine', 'Isabelle', 'Sylvie', 'Nathalie', 'Véronique', 'Corinne', 'Martine', 'Brigitte', 'Françoise', 'Monique'
]

const prenoms30_40 = [
  'Julien', 'Sébastien', 'Nicolas', 'David', 'Cédric', 'Fabrice', 'Vincent', 'Jérôme', 'Arnaud', 'Franck',
  'Sandrine', 'Céline', 'Valérie', 'Karine', 'Delphine', 'Émilie', 'Aurélie', 'Laetitia', 'Virginie', 'Stéphanie'
]

const prenoms50_plus = [
  'Bernard', 'Jean-Pierre', 'André', 'Pierre', 'Claude', 'Roger', 'Marcel', 'Henri', 'Robert', 'Georges',
  'Jacqueline', 'Marie-Claire', 'Denise', 'Colette', 'Simone', 'Jeanne', 'Paulette', 'Yvette', 'Odette', 'Ginette'
]

// Expressions cyclistes
const expressionsCyclistes = [
  'avoir les jambes qui tournent bien', 'être dans le rouge', 'avoir du jus', 'être cuit', 'avoir la fringale',
  'pédaler dans la choucroute', 'avoir les jambes en coton', 'être dans le dur', 'avoir du coffre', 'être grillé',
  'avoir les watts', 'être dans le tempo', 'avoir la patate', 'être lessivé', 'avoir du braquet',
  'pédaler carré', 'avoir les jambes qui flageolent', 'être dans le jus', 'avoir la niaque', 'être cramé'
]

// Commentaires de base
const commentairesBase = {
  court: [
    'Super parcours !', 'Très bien organisé', 'À refaire', 'Magnifique', 'Parfait !',
    'Excellent', 'Top niveau', 'Bravo', 'Génial', 'Superbe', 'Formidable !',
    'Incroyable', 'Fantastique', 'Exceptionnel', 'Remarquable', 'Splendide'
  ],
  moyen: [
    'Belle cyclosportive avec un parcours varié et bien balisé.',
    'Organisation au top, ravitaillements bien placés.',
    'Parcours exigeant mais magnifique, paysages à couper le souffle.',
    'Très bonne ambiance, participants sympas et bénévoles au top.',
    'Course bien organisée, quelques difficultés mais ça fait partie du jeu.',
    'Cyclosportive de qualité avec des montées qui font mal aux jambes.',
    'Beau défi sportif dans un cadre exceptionnel.',
    'Parcours technique et roulant, parfait pour tous les niveaux.',
    'Excellente organisation, dommage pour la météo capricieuse.',
    'Routes magnifiques, quelques passages délicats mais ça passe.'
  ],
  long: [
    'Excellente cyclosportive que je recommande vivement ! Le parcours est vraiment bien pensé avec des difficultés progressives. Les paysages sont magnifiques et les ravitaillements bien placés.',
    'Superbe expérience sur cette cyclosportive ! Les routes sont en bon état, le balisage parfait. J\'ai particulièrement apprécié l\'accueil des bénévoles et la qualité des ravitaillements.',
    'Une cyclosportive de grande qualité ! L\'organisation est irréprochable, les parcours bien étudiés et les paysages somptueux. Les ravitaillements sont copieux et variés.'
  ]
}

function genererNomUtilisateur(): { prenom: string, age: string } {
  const rand = Math.random()
  let prenom: string
  let age: string
  
  if (rand < 0.7) {
    prenom = prenoms40_50[Math.floor(Math.random() * prenoms40_50.length)]
    age = '40-50'
  } else if (rand < 0.9) {
    prenom = prenoms30_40[Math.floor(Math.random() * prenoms30_40.length)]
    age = '30-40'
  } else {
    prenom = prenoms50_plus[Math.floor(Math.random() * prenoms50_plus.length)]
    age = '50+'
  }
  
  return { prenom, age }
}

function genererCommentaire(): string {
  const rand = Math.random()
  let commentaire: string
  
  if (rand < 0.05) {
    commentaire = commentairesBase.court[Math.floor(Math.random() * commentairesBase.court.length)]
  } else if (rand < 0.15) {
    commentaire = commentairesBase.long[Math.floor(Math.random() * commentairesBase.long.length)]
  } else {
    commentaire = commentairesBase.moyen[Math.floor(Math.random() * commentairesBase.moyen.length)]
  }
  
  // Ajouter expression cycliste (60% de chance)
  if (Math.random() < 0.6) {
    const expression = expressionsCyclistes[Math.floor(Math.random() * expressionsCyclistes.length)]
    const phrases = [
      `J'${expression} pendant toute la montée.`,
      `Heureusement que j'${expression} !`,
      `À la fin j'${expression}.`,
      `Dans la dernière côte j'${expression}.`
    ]
    const phrase = phrases[Math.floor(Math.random() * phrases.length)]
    commentaire += ' ' + phrase
  }
  
  return commentaire
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
  
  // Notes normales pour les autres cyclosportives (moyenne 3.5-4.5)
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

function genererDateAleatoire(): Date {
  const debut2024 = new Date('2024-01-01')
  const maintenant = new Date()
  const diffTime = maintenant.getTime() - debut2024.getTime()
  const dateAleatoire = new Date(debut2024.getTime() + Math.random() * diffTime)
  return dateAleatoire
}

async function main() {
  console.log('🔄 Réinitialisation avec les cyclosportives valides...')
  
  // 1. Supprimer toutes les données existantes
  console.log('\n🗑️ Suppression des données existantes...')
  await prisma.vote.deleteMany()
  await prisma.race.deleteMany()
  
  // 2. Récupérer l'utilisateur admin
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@cycloranking.com' }
  })
  
  if (!adminUser) {
    console.error('❌ Utilisateur admin non trouvé')
    return
  }
  
  // 3. Créer les cyclosportives valides avec vérification des URLs
  console.log('\n🏁 Création des cyclosportives valides...')
  const coursesCreees = []
  
  for (const cyclo of cyclosportivesValides) {
    const url = urlsVerifiees[cyclo.name]
    let urlValide = false
    
    if (url) {
      urlValide = await verifierUrl(url)
      console.log(`${urlValide ? '✅' : '❌'} ${cyclo.name}: ${url}`)
    } else {
      console.log(`⚠️  ${cyclo.name}: Pas d'URL trouvée`)
    }
    
    // Créer la course seulement si l'URL est valide
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
  
  console.log(`\n✅ ${coursesCreees.length} cyclosportives créées avec URLs valides`)
  
  // 4. Créer 200 utilisateurs
  console.log('\n👥 Création des utilisateurs...')
  const utilisateurs = []
  for (let i = 0; i < 200; i++) {
    const { prenom } = genererNomUtilisateur()
    const email = `${prenom.toLowerCase()}.${i}@example.com`
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
  
  // 5. Générer les avis (environ 15-20 par cyclosportive)
  console.log('\n📝 Génération des avis...')
  const commentairesUtilises = new Set<string>()
  let avisGeneres = 0
  
  for (const course of coursesCreees) {
    const nombreAvis = 15 + Math.floor(Math.random() * 6) // 15-20 avis par course
    
    for (let i = 0; i < nombreAvis; i++) {
      const user = utilisateurs[Math.floor(Math.random() * utilisateurs.length)]
      
      // Vérifier si l'utilisateur a déjà voté pour cette course
      const existingVote = await prisma.vote.findUnique({
        where: {
          userId_raceId: {
            userId: user.id,
            raceId: course.id
          }
        }
      })
      
      if (!existingVote) {
        // Générer un commentaire unique
        let commentaire = genererCommentaire()
        let tentatives = 0
        
        while (commentairesUtilises.has(commentaire) && tentatives < 50) {
          commentaire = genererCommentaire()
          tentatives++
        }
        
        if (commentairesUtilises.has(commentaire)) {
          commentaire += ` (${Math.random().toString(36).substring(7)})`
        }
        
        commentairesUtilises.add(commentaire)
        
        const notes = genererNotes(course.name)
        const dateCreation = genererDateAleatoire()
        
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
        
        avisGeneres++
      }
    }
  }
  
  // Statistiques finales
  const coursesFinales = await prisma.race.count()
  const votesFinaux = await prisma.vote.count()
  const utilisateursFinaux = await prisma.user.count()
  
  console.log('\n📊 Statistiques finales:')
  console.log(`🏁 ${coursesFinales} cyclosportives avec sites valides`)
  console.log(`💬 ${votesFinaux} avis générés`)
  console.log(`👥 ${utilisateursFinaux} utilisateurs`)
  console.log(`🌐 Toutes les URLs ont été vérifiées`)
  
  console.log('\n✅ Réinitialisation terminée avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la réinitialisation:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
