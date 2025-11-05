import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// Prénoms par tranche d'âge
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

// Commentaires de base par catégorie
const commentairesBase = {
  court: [
    'Super parcours !', 'Très bien organisé', 'À refaire', 'Magnifique', 'Parfait !',
    'Excellent', 'Top niveau', 'Bravo', 'Génial', 'Superbe', 'Formidable !',
    'Incroyable', 'Fantastique', 'Exceptionnel', 'Remarquable', 'Splendide',
    'Merveilleux', 'Époustouflant', 'Impressionnant', 'Extraordinaire',
    'Quel plaisir !', 'Que du bonheur', 'Au top !', 'Nickel !', 'Parfait',
    'Sublime', 'Grandiose', 'Fabuleux', 'Sensationnel', 'Phénoménal'
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
    'Routes magnifiques, quelques passages délicats mais ça passe.',
    'Ravitaillements copieux et variés, merci aux bénévoles.',
    'Ambiance conviviale du début à la fin, bravo !',
    'Parcours vallonné avec de beaux panoramas sur la région.',
    'Organisation millimétrée, sécurité au rendez-vous.',
    'Cyclosportive familiale avec une belle découverte du territoire.',
    'Défi relevé avec plaisir, à recommander aux amateurs.',
    'Belle épreuve avec des passages techniques intéressants.',
    'Paysages variés et routes en bon état, que demander de plus.',
    'Cyclosportive bien pensée avec des difficultés progressives.',
    'Accueil chaleureux et parcours soigneusement étudié.'
  ],
  long: [
    'Excellente cyclosportive que je recommande vivement ! Le parcours est vraiment bien pensé avec des difficultés progressives. Les paysages sont magnifiques et les ravitaillements bien placés. L\'organisation est parfaite et l\'ambiance très conviviale.',
    'Superbe expérience sur cette cyclosportive ! Les routes sont en bon état, le balisage parfait. J\'ai particulièrement apprécié l\'accueil des bénévoles et la qualité des ravitaillements. Le parcours est exigeant mais accessible.',
    'Une cyclosportive de grande qualité ! L\'organisation est irréprochable, les parcours bien étudiés et les paysages somptueux. Les ravitaillements sont copieux et variés. L\'ambiance est excellente du départ à l\'arrivée.'
  ],
  tres_long: [
    'Quelle magnifique cyclosportive ! J\'ai participé pour la troisième fois et je ne m\'en lasse pas. Le parcours est techniquement intéressant avec des montées qui font mal aux jambes mais les descentes sont un régal. L\'organisation est vraiment au top niveau, on sent que les organisateurs connaissent leur affaire. Les ravitaillements sont parfaitement espacés et bien fournis, j\'ai particulièrement apprécié celui au sommet avec la vue panoramique. L\'ambiance est formidable, les cyclistes s\'entraident et les bénévoles sont aux petits soins. Le rapport qualité-prix est excellent. Je reviendrai l\'année prochaine c\'est sûr !',
    'Extraordinaire cyclosportive qui mérite sa réputation ! Dès l\'inscription, on sent le professionnalisme de l\'organisation. Le parcours est un vrai plaisir pour les yeux et les jambes, avec des passages techniques qui demandent de la concentration mais aussi des portions roulantes pour récupérer. Les paysages sont à couper le souffle, on en prend plein les yeux ! Les ravitaillements sont copieux et variés, mention spéciale pour les produits locaux qui donnent une vraie identité à l\'épreuve. L\'accueil des bénévoles est chaleureux, ils encouragent et aident vraiment. La signalisation est parfaite, impossible de se perdre. Seul petit bémol, un peu d\'attente au départ mais c\'est le prix du succès ! Une cyclosportive que je recommande à tous les passionnés.'
  ]
}

// Fautes d'orthographe communes
const fautesOrthographe = [
  ['magnifique', 'magnifike'], ['excellent', 'exellent'], ['vraiment', 'vraimment'],
  ['parcours', 'parcour'], ['organisé', 'organisée'], ['balisage', 'balisagge'],
  ['ravitaillement', 'ravitaillemment'], ['paysage', 'paysagge'], ['difficile', 'dificile'],
  ['technique', 'tecnique'], ['cycliste', 'cicliste'], ['expérience', 'expériance']
]

// Erreurs de frappe communes
const erreursFrappe = [
  ['le', 'le '], ['de', 'de '], ['et', 'et '], ['un', 'un '], ['la', 'la '],
  ['que', 'qeu'], ['pour', 'poru'], ['avec', 'avce'], ['bien', 'bein'], ['très', 'trés']
]

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

function ajouterExpressionCycliste(commentaire: string): string {
  if (Math.random() < 0.6) {
    const expression = expressionsCyclistes[Math.floor(Math.random() * expressionsCyclistes.length)]
    const phrases = [
      `J'${expression} pendant toute la montée.`,
      `Heureusement que j'${expression} !`,
      `À la fin j'${expression}.`,
      `Dans la dernière côte j'${expression}.`
    ]
    const phrase = phrases[Math.floor(Math.random() * phrases.length)]
    return commentaire + ' ' + phrase
  }
  return commentaire
}

function ajouterFautes(commentaire: string): string {
  let resultat = commentaire
  
  // Fautes d'orthographe (20-30%)
  if (Math.random() < 0.25) {
    const faute = fautesOrthographe[Math.floor(Math.random() * fautesOrthographe.length)]
    resultat = resultat.replace(new RegExp(faute[0], 'gi'), faute[1])
  }
  
  // Erreurs de frappe (20%)
  if (Math.random() < 0.2) {
    const erreur = erreursFrappe[Math.floor(Math.random() * erreursFrappe.length)]
    resultat = resultat.replace(new RegExp(`\\b${erreur[0]}\\b`, 'gi'), erreur[1])
  }
  
  return resultat
}

function genererCommentaire(): string {
  const rand = Math.random()
  let commentaire: string
  
  if (rand < 0.05) {
    // 5% commentaires courts
    commentaire = commentairesBase.court[Math.floor(Math.random() * commentairesBase.court.length)]
  } else if (rand < 0.1) {
    // 5% commentaires très longs
    commentaire = commentairesBase.tres_long[Math.floor(Math.random() * commentairesBase.tres_long.length)]
  } else if (rand < 0.15) {
    // 5% commentaires longs
    commentaire = commentairesBase.long[Math.floor(Math.random() * commentairesBase.long.length)]
  } else {
    // 85% commentaires moyens
    commentaire = commentairesBase.moyen[Math.floor(Math.random() * commentairesBase.moyen.length)]
  }
  
  // Ajouter expression cycliste (60% de chance)
  commentaire = ajouterExpressionCycliste(commentaire)
  
  // Ajouter fautes
  commentaire = ajouterFautes(commentaire)
  
  return commentaire
}

function genererNotes(raceName: string, targetAverage?: number) {
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
  const baseNote = targetAverage || (3.5 + Math.random() * 1.0) // Entre 3.5 et 4.5
  const variation = 0.8 // Variation autour de la moyenne
  
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

async function main() {
  console.log('🌱 Génération de 1500 avis avec 200 utilisateurs...')
  
  // Créer 200 utilisateurs
  const utilisateurs = []
  for (let i = 0; i < 200; i++) {
    const { prenom, age } = genererNomUtilisateur()
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
  
  console.log(`👥 ${utilisateurs.length} utilisateurs créés`)
  
  // Récupérer toutes les courses
  const courses = await prisma.race.findMany()
  console.log(`🏁 ${courses.length} courses disponibles`)
  
  // Système pour s'assurer que tous les commentaires sont différents
  const commentairesUtilises = new Set<string>()
  
  // Système pour s'assurer que chaque course a une note globale différente
  const moyennesParCourse = new Map<string, number>()
  
  // Pré-calculer les moyennes cibles pour chaque course
  courses.forEach((course, index) => {
    if (course.name.includes("Étape du Tour") || course.name.includes("Etape du Tour")) {
      moyennesParCourse.set(course.id, 2.6)
    } else {
      // Distribuer les moyennes entre 3.5 et 4.5 de manière unique
      const moyenne = 3.5 + (index % courses.length) * (1.0 / courses.length)
      moyennesParCourse.set(course.id, Math.round(moyenne * 10) / 10) // Arrondir à 1 décimale
    }
  })
  
  // Générer 1500 avis
  let avisGeneres = 0
  let tentatives = 0
  const maxTentatives = 10000
  
  while (avisGeneres < 1500 && tentatives < maxTentatives) {
    tentatives++
    const user = utilisateurs[Math.floor(Math.random() * utilisateurs.length)]
    const course = courses[Math.floor(Math.random() * courses.length)]
    
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
      let tentativesCommentaire = 0
      
      while (commentairesUtilises.has(commentaire) && tentativesCommentaire < 50) {
        commentaire = genererCommentaire()
        tentativesCommentaire++
      }
      
      // Si on n'arrive pas à générer un commentaire unique, on ajoute un suffixe
      if (commentairesUtilises.has(commentaire)) {
        commentaire += ` (${Math.random().toString(36).substring(7)})`
      }
      
      commentairesUtilises.add(commentaire)
      
      // Générer les notes avec la moyenne cible pour cette course
      const moyenneCible = moyennesParCourse.get(course.id) || 4.0
      const notes = genererNotes(course.name, moyenneCible)
      
      await prisma.vote.create({
        data: {
          userId: user.id,
          raceId: course.id,
          comment: commentaire,
          ...notes
        }
      })
      
      avisGeneres++
      if (avisGeneres % 100 === 0) {
        console.log(`📝 ${avisGeneres} avis générés...`)
      }
    }
  }
  
  console.log('✅ Génération terminée !')
  console.log(`📊 ${avisGeneres} avis créés avec ${utilisateurs.length} utilisateurs`)
  console.log(`🔄 ${tentatives} tentatives au total`)
  console.log(`💬 ${commentairesUtilises.size} commentaires uniques générés`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
