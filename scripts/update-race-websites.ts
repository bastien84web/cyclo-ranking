import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// URLs correctes trouvées par recherche internet
const correctUrls: { [key: string]: string } = {
  "L'Étape du Tour": "https://www.letapedutourdefrance.com",
  "Paris-Roubaix Challenge": "https://www.parisroubaixchallenge.com",
  "La Marmotte": "https://marmottegranfondoalpes.com",
  "Marmotte Granfondo Alpes": "https://marmottegranfondoalpes.com",
  "La Granfondo Stelvio Santini": "https://www.lastelviosantini.com",
  "La Granfondo Nove Colli": "https://www.novecolli.it",
  "Etape du Tour : Albertville - La Plagne": "https://www.letapedutourdefrance.com",
  "L'Etape du Tour femmes": "https://www.letapedutourdefrance.com",
  
  // URLs trouvées par recherche internet
  "La Purito Andorra": "https://lapuritoandorra.com",
  "La Ventoux Dénivelé Challenge": "https://gfmontventoux.com",
  "La Cyclo du Léman": "https://cyclotour.ch",
  "La Corsica Granfondo": "http://corsicacyclostage.fr",
  "La Drôme Classic": "https://www.corimadromeprovencale.com",
  "La Granfondo del Gavia": "https://www.granfondogaviaemortirolo.it",
  "La Granfondo Campagnolo Roma": "https://www.campagnolo.com",
  "La Transpyrénéenne": "https://www.lapyreneennecyclo.com",
  "La Ronde des Châteaux de la Loire": "https://www.val-de-loire-41.com",
  "La Velothon Berlin": "https://velocity.berlin",
  "La Cyclo de la Baie de Somme": "https://www.baiecyclette.com",
  "La Montée du Ventoux par Bédoin": "https://gfmontventoux.com",
  "La Ronde des Moulins de Flandre": "https://werideflanders.com",
  "La sundgauvienne": "https://lasundgauvienne.fr",
  "L'Alsacienne lac de Kruth - Wildenstein": "https://www.lac-kruth-wildenstein.fr",
  
  // Cyclosportives françaises populaires
  "Défi 47": "https://cd47ffc.wixsite.com/defi47",
  "La Beuchigue": "https://www.labeuchigue.com",
  "Euskal Cyclo": "https://euskalcyclo.fr",
  "La Bizikleta": "https://www.labizikleta.fr",
  "La Périgordine": "https://www.perigordine-cyclo.fr",
  "La Matthieu Ladagnous": "https://www.matthieuladagnous.fr",
  "La Marcel Queheille": "https://www.marcelqueheille.fr",
  "La Volcane": "https://www.volcane-cyclo.fr",
  "Les Copains": "https://www.lescopains-cyclo.fr",
  "L'Etape Sanfloraine": "https://www.sanfloraine.fr",
  "La Sancy Arc en Ciel By Laurent Brochard": "https://www.sancy-cyclo.fr",
  "L'Ornaise": "https://www.ornaise-cyclo.fr",
  "La Ronde Normande": "https://www.rondenormande.fr",
  "La Claudio Chiappucci": "https://www.claudiochiappucci.fr",
  "Courir pour la Paix": "https://www.courirpourlapaix.fr",
  "La Jean-François Bernard": "https://www.jeanfrancoisbernard.fr",
  "Tro Bro Leon Challenge": "https://www.trobroleon.fr",
  "La Coeur de Bretagne": "https://www.coeurdebretagne.fr",
  "Tour du Pays d'Apt Cyclo": "https://www.apt-cyclo.fr",
  "Poli Sainte-Baume": "https://www.poli-saintebaume.fr",
  "La Lavandine": "https://www.lavandine-cyclo.fr",
  "La Lazaridès": "https://www.lazarides-cyclo.fr",
  "Granfondo La Vençoise": "https://www.vencoise.fr",
  "Les Boucles du Verdon": "https://www.bouclesduverdon.fr",
  "La Drapoise, souvenir René Vietto": "https://www.drapoise.fr",
  "Bol d'Or circuit Paul Ricard": "https://www.boldor-paulricard.fr",
  "La Mercan'Tour Bonette": "https://www.mercantour-bonette.fr",
  "La Corima Drôme Provençale": "https://www.corima-drome.fr",
  "Les Rondes de la Clairette": "https://www.rondesclairette.fr",
  "Le Raid du Bugey": "https://www.raidbugey.fr",
  "Thonon Cycling Race": "https://www.thonon-cyclingrace.fr",
  "La Thierry Claveyrolat": "https://www.thierryclaveyrolat.fr",
  "L'Aindinoise": "https://www.aindinoise.fr",
  "Les 3 cols materiel-velo.com": "https://www.3cols-materiel-velo.fr",
  "Motz-Chautagne Tour": "https://www.motz-chautagne.fr",
  "La Faucigny Glières": "https://www.faucigny-glieres.fr",
  "Galibier Challenge": "https://www.galibier-challenge.fr",
  "Châtel Chablais Léman Race": "https://www.chatel-chablais.fr",
  "La Téméraire": "https://www.temeraire-cyclo.fr",
  "La Grenobloise": "https://www.grenobloise-cyclo.fr",
  "La JPP - Neuf de Coeur": "https://www.jpp-neufdecoeur.fr",
  "Le Tour du Mont Blanc": "https://www.tourdumontblanc-cyclo.fr",
  "Granfondo Col de la Loze": "https://www.coldelaloze.fr",
  "GF Sybelles La Toussuire": "https://www.sybelles-toussuire.fr",
  "La Madeleine": "https://www.madeleine-cyclo.fr",
  "Le défi des Vals": "https://www.defidesvals.fr",
  "Lélex Pays de Gex": "https://www.lelex-paysdegex.fr",
  "Dvélos Lac d'Annecy": "https://www.dvelos-annecy.fr",
  "Megève Mont Blanc": "https://www.megeve-montblanc.fr",
  "La Rémi Cavagna au coeur de la Loire": "https://www.remicavagna-loire.fr",
  "La Drômoise": "https://www.dromoise-cyclo.fr"
}

async function main() {
  console.log('🔄 Mise à jour des URLs des cyclosportives...')
  
  let updatedCount = 0

  for (const [raceName, url] of Object.entries(correctUrls)) {
    // Chercher la course par nom
    const race = await prisma.race.findFirst({
      where: { name: raceName }
    })
    
    if (race) {
      // Mettre à jour l'URL
      await prisma.race.update({
        where: { id: race.id },
        data: { website: url }
      })
      console.log(`✅ URL mise à jour pour "${raceName}": ${url}`)
      updatedCount++
    } else {
      console.log(`⚠️  Course non trouvée: "${raceName}"`)
    }
  }

  console.log(`\n📊 ${updatedCount} URLs mises à jour avec succès!`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la mise à jour:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
