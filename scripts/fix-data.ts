import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// Fonction pour générer une date aléatoire entre 2024 et aujourd'hui
function genererDateAleatoire(): Date {
  const debut2024 = new Date('2024-01-01')
  const maintenant = new Date()
  const diffTime = maintenant.getTime() - debut2024.getTime()
  const dateAleatoire = new Date(debut2024.getTime() + Math.random() * diffTime)
  return dateAleatoire
}

// Fonction pour corriger les fautes de français courantes
function corrigerFautesCommentaire(commentaire: string): string {
  let commentaireCorrige = commentaire
  
  // Corrections des fautes courantes avec j'être et j'avoir
  commentaireCorrige = commentaireCorrige.replace(/j'être/gi, "j'étais")
  commentaireCorrige = commentaireCorrige.replace(/j'avoir/gi, "j'avais")
  
  // Autres corrections courantes
  const corrections = [
    [/magnifike/gi, 'magnifique'],
    [/exellent/gi, 'excellent'],
    [/vraimment/gi, 'vraiment'],
    [/parcour\b/gi, 'parcours'],
    [/organisée\b/gi, 'organisé'],
    [/balisagge/gi, 'balisage'],
    [/ravitaillemment/gi, 'ravitaillement'],
    [/paysagge/gi, 'paysage'],
    [/dificile/gi, 'difficile'],
    [/tecnique/gi, 'technique'],
    [/cicliste/gi, 'cycliste'],
    [/expériance/gi, 'expérience'],
    [/qeu\b/gi, 'que'],
    [/poru\b/gi, 'pour'],
    [/avce\b/gi, 'avec'],
    [/bein\b/gi, 'bien'],
    [/trés\b/gi, 'très'],
    // Corrections des espaces en trop
    [/\s+/g, ' '],
    [/^\s+|\s+$/g, '']
  ]
  
  corrections.forEach(([pattern, replacement]) => {
    commentaireCorrige = commentaireCorrige.replace(pattern, replacement as string)
  })
  
  return commentaireCorrige
}

async function main() {
  console.log('🔧 Correction des données...')
  
  // 1. Modifier les dates de publication des commentaires
  console.log('\n📅 Mise à jour des dates de commentaires...')
  const votes = await prisma.vote.findMany()
  
  // Créer un ensemble de dates uniques
  const datesUtilisees = new Set<string>()
  
  for (const vote of votes) {
    let nouvelleDate = genererDateAleatoire()
    let dateString = nouvelleDate.toISOString()
    
    // S'assurer que chaque date est unique
    while (datesUtilisees.has(dateString)) {
      nouvelleDate = genererDateAleatoire()
      dateString = nouvelleDate.toISOString()
    }
    
    datesUtilisees.add(dateString)
    
    await prisma.vote.update({
      where: { id: vote.id },
      data: { 
        createdAt: nouvelleDate,
        updatedAt: nouvelleDate
      }
    })
  }
  
  console.log(`✅ ${votes.length} dates de commentaires mises à jour`)
  
  // 2. Corriger les fautes de français dans 95% des commentaires
  console.log('\n📝 Correction des fautes de français...')
  const votesAvecCommentaires = await prisma.vote.findMany({
    where: {
      comment: {
        not: null
      }
    }
  })
  
  const nombreACorreger = Math.floor(votesAvecCommentaires.length * 0.95)
  const votesACorreger = votesAvecCommentaires
    .sort(() => Math.random() - 0.5) // Mélanger aléatoirement
    .slice(0, nombreACorreger)
  
  let commentairesCorrigesCount = 0
  
  for (const vote of votesACorreger) {
    if (vote.comment) {
      const commentaireCorrige = corrigerFautesCommentaire(vote.comment)
      
      if (commentaireCorrige !== vote.comment) {
        await prisma.vote.update({
          where: { id: vote.id },
          data: { comment: commentaireCorrige }
        })
        commentairesCorrigesCount++
      }
    }
  }
  
  console.log(`✅ ${commentairesCorrigesCount} commentaires corrigés sur ${nombreACorreger} sélectionnés`)
  
  // 3. Supprimer les cyclosportives sans site internet valide
  console.log('\n🗑️ Suppression des cyclosportives sans site valide...')
  
  // D'abord, supprimer tous les votes associés aux courses sans site valide
  const coursesInvalides = await prisma.race.findMany({
    where: {
      OR: [
        { website: null },
        { website: '' },
        { website: { contains: 'sundgauvienne.fr' } }, // URLs génériques à supprimer
        { website: { contains: 'alsacienne-cyclo.fr' } },
        { website: { contains: 'defi47.fr' } },
        { website: { contains: 'beuchigue.fr' } },
        { website: { contains: 'euskalcyclo.com' } },
        { website: { contains: 'bizikleta.fr' } },
        { website: { contains: 'perigordine-cyclo.fr' } },
        { website: { contains: 'matthieuladagnous.fr' } },
        { website: { contains: 'marcelqueheille.fr' } },
        { website: { contains: 'volcane-cyclo.fr' } },
        { website: { contains: 'lescopains-cyclo.fr' } },
        { website: { contains: 'sanfloraine.fr' } },
        { website: { contains: 'sancy-cyclo.fr' } },
        { website: { contains: 'ornaise-cyclo.fr' } },
        { website: { contains: 'rondenormande.fr' } },
        { website: { contains: 'claudiochiappucci.fr' } },
        { website: { contains: 'courirpourlapaix.fr' } },
        { website: { contains: 'jeanfrancoisbernard.fr' } },
        { website: { contains: 'trobroleon.fr' } },
        { website: { contains: 'apt-cyclo.fr' } },
        { website: { contains: 'poli-saintebaume.fr' } },
        { website: { contains: 'lavandine-cyclo.fr' } },
        { website: { contains: 'lazarides-cyclo.fr' } },
        { website: { contains: 'vencoise.fr' } },
        { website: { contains: 'bouclesduverdon.fr' } },
        { website: { contains: 'drapoise.fr' } },
        { website: { contains: 'boldor-paulricard.fr' } },
        { website: { contains: 'mercantour-bonette.fr' } },
        { website: { contains: 'corima-drome.fr' } },
        { website: { contains: 'rondesclairette.fr' } },
        { website: { contains: 'raidbugey.fr' } },
        { website: { contains: 'thonon-cyclingrace.fr' } },
        { website: { contains: 'thierryclaveyrolat.fr' } },
        { website: { contains: 'aindinoise.fr' } },
        { website: { contains: '3cols-materiel-velo.fr' } },
        { website: { contains: 'motz-chautagne.fr' } },
        { website: { contains: 'faucigny-glieres.fr' } },
        { website: { contains: 'galibier-challenge.fr' } },
        { website: { contains: 'chatel-chablais.fr' } },
        { website: { contains: 'temeraire-cyclo.fr' } },
        { website: { contains: 'grenobloise-cyclo.fr' } },
        { website: { contains: 'jpp-neufdecoeur.fr' } },
        { website: { contains: 'tourdumontblanc-cyclo.fr' } },
        { website: { contains: 'coldelaloze.fr' } },
        { website: { contains: 'sybelles-toussuire.fr' } },
        { website: { contains: 'madeleine-cyclo.fr' } },
        { website: { contains: 'defidesvals.fr' } },
        { website: { contains: 'lelex-paysdegex.fr' } },
        { website: { contains: 'dvelos-annecy.fr' } },
        { website: { contains: 'megeve-montblanc.fr' } },
        { website: { contains: 'remicavagna-loire.fr' } },
        { website: { contains: 'dromoise-cyclo.fr' } }
      ]
    }
  })
  
  console.log(`🔍 ${coursesInvalides.length} courses avec sites invalides trouvées`)
  
  // Supprimer les votes associés
  let votesSupprimes = 0
  for (const course of coursesInvalides) {
    const result = await prisma.vote.deleteMany({
      where: { raceId: course.id }
    })
    votesSupprimes += result.count
  }
  
  // Supprimer les courses
  const coursesSupprimeesResult = await prisma.race.deleteMany({
    where: {
      id: {
        in: coursesInvalides.map(c => c.id)
      }
    }
  })
  
  console.log(`✅ ${coursesSupprimeesResult.count} cyclosportives supprimées`)
  console.log(`✅ ${votesSupprimes} votes associés supprimés`)
  
  // Statistiques finales
  const coursesRestantes = await prisma.race.count()
  const votesRestants = await prisma.vote.count()
  const utilisateurs = await prisma.user.count()
  
  console.log('\n📊 Statistiques finales:')
  console.log(`🏁 ${coursesRestantes} cyclosportives avec sites valides`)
  console.log(`💬 ${votesRestants} avis conservés`)
  console.log(`👥 ${utilisateurs} utilisateurs`)
  
  console.log('\n✅ Toutes les corrections ont été appliquées avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors des corrections:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
