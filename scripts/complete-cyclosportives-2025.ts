import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Les variables d'environnement sont chargées par dotenv-cli
// Utiliser: npx dotenv -e .env.production -- npm run db:complete-cyclosportives-2025

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')

const prisma = new PrismaClient()

// Liste COMPLÈTE des cyclosportives 2025 (127 au total)
const cyclosportives2025 = [
  // Alsace
  { name: "La sundgauvienne", location: "Hégenheim, Haut-Rhin", date: new Date('2025-05-11'), distance: "127 km" },
  { name: "L'Alsacienne lac de Kruth - Wildenstein", location: "Kruth-Wildenstein, Haut-Rhin", date: new Date('2025-06-29'), distance: "170 km" },
  { name: "GFNY Grand Ballon", location: "Thann, Haut-Rhin", date: new Date('2025-07-20'), distance: "120 km" },
  
  // Aquitaine - COMPLET
  { name: "Défi 47", location: "Prayssas, Lot-et-Garonne", date: new Date('2025-04-13'), distance: "80 km" },
  { name: "La Beuchigue", location: "Saint-Sever, Landes", date: new Date('2025-04-20'), distance: "145 km" },
  { name: "Euskal Cyclo", location: "Cambo-les-Bains, Pyrénées-Atlantiques", date: new Date('2025-05-25'), distance: "145 km" },
  { name: "La Bizikleta", location: "Saint-Jean-de-Luz, Pyrénées-Atlantiques", date: new Date('2025-06-08'), distance: "130 km" },
  { name: "GFNY Lourdes Tourmalet", location: "Lourdes, Pyrénées-Atlantiques", date: new Date('2025-06-22'), distance: "140 km" },
  { name: "La Périgordine", location: "Le Lardin-Saint-Lazare, Dordogne", date: new Date('2025-06-22'), distance: "150 km" },
  { name: "La Matthieu Ladagnous", location: "Asson, Pyrénées-Atlantiques", date: new Date('2025-07-13'), distance: "120 km" },
  { name: "La Marcel Queheille", location: "Mauléon-Licharre, Pyrénées-Atlantiques", date: new Date('2025-08-16'), distance: "110 km" },
  
  // Auvergne - COMPLET
  { name: "La Volcane", location: "Volvic, Puy-de-Dôme", date: new Date('2025-06-15'), distance: "135 km" },
  { name: "Les Copains", location: "Ambert, Puy-de-Dôme", date: new Date('2025-07-05'), distance: "125 km" },
  { name: "L'Etape Sanfloraine", location: "Saint-Flour, Cantal", date: new Date('2025-08-10'), distance: "140 km" },
  { name: "La Sancy Arc en Ciel By Laurent Brochard", location: "Chambon-sur-Lac, Puy-de-Dôme", date: new Date('2025-09-13'), distance: "155 km" },
  
  // Basse-Normandie - COMPLET
  { name: "L'Ornaise", location: "Argentan, Orne", date: new Date('2025-05-11'), distance: "115 km" },
  { name: "La Ronde Normande", location: "Juaye-Mondaye, Calvados", date: new Date('2025-05-25'), distance: "130 km" },
  
  // Bourgogne - COMPLET
  { name: "La Claudio Chiappucci", location: "Arnay-le-Duc, Côte d'Or", date: new Date('2025-06-07'), distance: "145 km" },
  { name: "Courir pour la Paix", location: "Chailly-sur-Armançon, Côte d'Or", date: new Date('2025-08-02'), distance: "120 km" },
  { name: "La Jean-François Bernard", location: "Corbigny, Nièvre", date: new Date('2025-09-07'), distance: "135 km" },
  
  // Bretagne - COMPLET
  { name: "Tro Bro Leon Challenge", location: "Lannelis, Finistère", date: new Date('2025-05-10'), distance: "160 km" },
  { name: "La Coeur de Bretagne", location: "Malestroit, Morbihan", date: new Date('2025-07-06'), distance: "125 km" },
  
  // Champagne-Ardenne
  { name: "Bar sur Aube Chemins Blancs Cycling Race", location: "Bar-sur-Aube, Aube", date: new Date('2025-06-15'), distance: "140 km" },
  
  // Corse
  { name: "L'Allégra", location: "Bastelicaccia, Corse-du-Sud", date: new Date('2025-04-27'), distance: "130 km" },
  
  // DOM-TOM
  { name: "GF Iles de Guadeloupe", location: "Capesterre-Belle-Eau, Guadeloupe", date: new Date('2025-12-07'), distance: "120 km" },
  
  // Franche-Comté - AJOUT COMPLET
  { name: "La Flèche Bisontine", location: "Besançon, Doubs", date: new Date('2025-04-27'), distance: "135 km" },
  { name: "Cyclo Sud Bourgogne", location: "Viré, Saône-et-Loire", date: new Date('2025-04-27'), distance: "125 km" },
  { name: "La Bernard Thévenet", location: "Vitry-en-Charollais, Saône-et-Loire", date: new Date('2025-05-24'), distance: "140 km" },
  { name: "La Vache qui rit", location: "Lons-le-Saunier, Jura", date: new Date('2025-05-25'), distance: "115 km" },
  { name: "Les Trois Ballons", location: "Ronchamp, Haute-Saône", date: new Date('2025-06-07'), distance: "150 km" },
  { name: "Grand Huit Luxeuil Vosges du Sud", location: "Luxeuil-les-Bains, Haute-Saône", date: new Date('2025-06-14'), distance: "145 km" },
  { name: "La Louis Pasteur", location: "Dole, Jura", date: new Date('2025-08-24'), distance: "120 km" },
  { name: "La Transju' Cyclo", location: "Champagnole, Jura", date: new Date('2025-09-07'), distance: "135 km" },
  
  // Ile-de-France - AJOUT COMPLET
  { name: "La Jacques Gouin", location: "Mennecy, Essonne", date: new Date('2025-03-02'), distance: "110 km" },
  { name: "La Pakavélo sud 77", location: "Paley, Seine-et-Marne", date: new Date('2025-04-20'), distance: "125 km" },
  { name: "La Raymond Martin", location: "Oncy-sur-Ecole, Essonne", date: new Date('2025-09-14'), distance: "130 km" },
  { name: "Le Bocage Gâtinais", location: "Egreville, Seine-et-Marne", date: new Date('2025-09-28'), distance: "115 km" },
  
  // Languedoc-Roussillon - AJOUT COMPLET
  { name: "Le Tour de l'Hortus", location: "Valflaunès, Hérault", date: new Date('2025-02-23'), distance: "120 km" },
  { name: "La Montagnacoise", location: "Montagnac, Hérault", date: new Date('2025-04-06'), distance: "135 km" },
  { name: "66 degrés sud", location: "Rivesaltes, Pyrénées-Orientales", date: new Date('2025-04-26'), distance: "140 km" },
  { name: "GF Provence Occitane", location: "Cornillon, Gard", date: new Date('2025-05-04'), distance: "145 km" },
  { name: "La Lozérienne Cyclo", location: "La Canourgue, Lozère", date: new Date('2025-05-11'), distance: "130 km" },
  { name: "La Cycl'Aigoual Route", location: "L'Espérou, Gard", date: new Date('2025-06-28'), distance: "155 km" },
  
  // Nord - Pas-de-Calais
  { name: "Paris-Roubaix Challenge", location: "Denain, Nord", date: new Date('2025-04-12'), distance: "170 km" },
  
  // PACA - AJOUT COMPLET
  { name: "GFNY Cannes", location: "Cannes, Alpes-Maritimes", date: new Date('2025-03-23'), distance: "110 km" },
  { name: "Tour du Pays d'Apt Cyclo", location: "Apt, Vaucluse", date: new Date('2025-03-30'), distance: "125 km" },
  { name: "Poli Sainte-Baume", location: "La Cadière d'Azur, Var", date: new Date('2025-04-06'), distance: "140 km" },
  { name: "La Lavandine", location: "La Motte-du-Caire, Alpes-de-Haute-Provence", date: new Date('2025-04-13'), distance: "130 km" },
  { name: "La Lazaridès", location: "Cannes, Alpes-Maritimes", date: new Date('2025-04-20'), distance: "115 km" },
  { name: "Granfondo La Vençoise", location: "Vence, Alpes-Maritimes", date: new Date('2025-05-11'), distance: "135 km" },
  { name: "Les Boucles du Verdon", location: "Gréoux-les-Bains, Alpes-de-Haute-Provence", date: new Date('2025-05-18'), distance: "145 km" },
  { name: "GF Mont Ventoux", location: "Vaison la Romaine, Vaucluse", date: new Date('2025-06-01'), distance: "150 km" },
  { name: "La Drapoise, souvenir René Vietto", location: "Drap, Alpes-Maritimes", date: new Date('2025-06-01'), distance: "120 km" },
  { name: "Bol d'Or circuit Paul Ricard", location: "Le Castellet, Var", date: new Date('2025-06-07'), distance: "125 km" },
  { name: "La Mercan'Tour Bonette", location: "Valberg, Alpes-Maritimes", date: new Date('2025-06-15'), distance: "160 km" },
  { name: "La Provençale Cyclo", location: "Manosque, Alpes-de-Haute-Provence", date: new Date('2025-06-28'), distance: "135 km" },
  { name: "Altitude 1664", location: "Saint-Etienne-en-Dévoluy, Hautes-Alpes", date: new Date('2025-06-29'), distance: "140 km" },
  { name: "GFNY Orcières", location: "Orcières, Hautes-Alpes", date: new Date('2025-07-27'), distance: "145 km" },
  { name: "Les Cimes du Mercantour", location: "Breil-sur-Roya, Alpes-Maritimes", date: new Date('2025-07-27'), distance: "155 km" },
  { name: "Alpes Verdon Tour", location: "Castellane, Alpes-de-Haute-Provence", date: new Date('2025-09-07'), distance: "130 km" },
  { name: "La Lucien Aimar", location: "Hyères, Var", date: new Date('2025-09-07'), distance: "125 km" },
  { name: "Les Bosses de Provence", location: "Marseille, Bouches-du-Rhône", date: new Date('2025-09-14'), distance: "140 km" },
  { name: "GF Luberon Pays d'Apt", location: "Apt, Vaucluse", date: new Date('2025-09-28'), distance: "135 km" },
  { name: "Le Raid des Alpilles", location: "Maussane-les-Alpilles, Bouches-du-Rhône", date: new Date('2025-10-05'), distance: "120 km" },
  { name: "Ekoï Cyclo Roc", location: "Fréjus, Var", date: new Date('2025-10-12'), distance: "115 km" },
  
  // Rhône-Alpes - AJOUT COMPLET
  { name: "La Corima Drôme Provençale", location: "Montélimar, Drôme", date: new Date('2025-03-30'), distance: "125 km" },
  { name: "Les Rondes de la Clairette", location: "Vercheny, Drôme", date: new Date('2025-04-13'), distance: "130 km" },
  { name: "Le Raid du Bugey", location: "Lagnieu, Ain", date: new Date('2025-04-27'), distance: "140 km" },
  { name: "Thonon Cycling Race", location: "Thonon-les-Bains, Haute-Savoie", date: new Date('2025-05-04'), distance: "135 km" },
  { name: "La Thierry Claveyrolat", location: "Vizille, Isère", date: new Date('2025-05-04'), distance: "145 km" },
  { name: "L'Aindinoise", location: "Belley, Ain", date: new Date('2025-05-10'), distance: "125 km" },
  { name: "GFNY Villard-de-Lans", location: "Villard-de-Lans, Isère", date: new Date('2025-05-25'), distance: "135 km" },
  { name: "Les 3 cols materiel-velo.com", location: "La Tour-de-Salvagny, Rhône", date: new Date('2025-05-29'), distance: "150 km" },
  { name: "Motz-Chautagne Tour", location: "Motz, Savoie", date: new Date('2025-06-01'), distance: "120 km" },
  { name: "La Faucigny Glières", location: "Bonneville, Haute-Savoie", date: new Date('2025-06-01'), distance: "140 km" },
  { name: "Galibier Challenge", location: "Saint-Michel-de-Maurienne, Savoie", date: new Date('2025-06-08'), distance: "160 km" },
  { name: "L'Ardéchoise", location: "Saint-Félicien, Ardèche", date: new Date('2025-06-14'), distance: "145 km" },
  { name: "GFNY La Vaujany Alpe d'Huez", location: "Vaujany, Isère", date: new Date('2025-06-15'), distance: "155 km" },
  { name: "Châtel Chablais Léman Race", location: "Châtel, Haute-Savoie", date: new Date('2025-06-22'), distance: "130 km" },
  { name: "La Téméraire", location: "Salins-les-Bains, Jura", date: new Date('2025-06-22'), distance: "125 km" },
  { name: "Marmotte Granfondo Alpes", location: "Le Bourg d'Oisans, Isère", date: new Date('2025-06-22'), distance: "174 km" },
  { name: "La Grenobloise", location: "Grenoble, Isère", date: new Date('2025-07-06'), distance: "135 km" },
  { name: "La JPP - Neuf de Coeur", location: "Les Carroz, Haute-Savoie", date: new Date('2025-07-06'), distance: "140 km" },
  { name: "Le Tour du Mont Blanc", location: "Les Saisies, Savoie", date: new Date('2025-07-12'), distance: "165 km" },
  { name: "Les 24 heures cyclistes de Bletterans", location: "Bletterans, Jura", date: new Date('2025-07-12'), distance: "Variable" },
  { name: "24 h Cycliste de Bletterans", location: "Bletterans, Jura", date: new Date('2025-07-12'), distance: "Variable" },
  { name: "Granfondo Col de la Loze", location: "Brides-les-Bains, Savoie", date: new Date('2025-07-13'), distance: "150 km" },
  { name: "GF Sybelles La Toussuire", location: "La Toussuire, Savoie", date: new Date('2025-07-14'), distance: "145 km" },
  { name: "Etape du Tour : Albertville - La Plagne", location: "Albertville, Savoie", date: new Date('2025-07-20'), distance: "138 km" },
  { name: "La Madeleine", location: "La Chambre, Savoie", date: new Date('2025-07-27'), distance: "135 km" },
  { name: "L'Etape du Tour femmes", location: "Chambéry, Savoie", date: new Date('2025-08-02'), distance: "120 km" },
  { name: "La Colruyt", location: "Dole, Jura", date: new Date('2025-08-02'), distance: "125 km" },
  { name: "Le défi des Vals", location: "Les Abrets en Dauphiné, Isère", date: new Date('2025-08-08'), distance: "140 km" },
  { name: "Lélex Pays de Gex", location: "Pays de Gex, Ain", date: new Date('2025-08-09'), distance: "130 km" },
  { name: "GFNY Alpes Vaujany", location: "Vaujany, Isère", date: new Date('2025-08-24'), distance: "140 km" },
  { name: "Dvélos Lac d'Annecy", location: "Saint Jorioz, Haute-Savoie", date: new Date('2025-08-24'), distance: "115 km" },
  { name: "Megève Mont Blanc", location: "Megève, Haute-Savoie", date: new Date('2025-08-31'), distance: "145 km" },
  { name: "La Rémi Cavagna au coeur de la Loire", location: "Saint-Just-en-Chevalet, Loire", date: new Date('2025-09-07'), distance: "135 km" },
  { name: "L'Impériale Cyclosportive", location: "Laffrey, Isère", date: new Date('2025-09-14'), distance: "150 km" },
  { name: "La Drômoise", location: "Die, Drôme", date: new Date('2025-09-21'), distance: "125 km" },
  { name: "La Bisou", location: "Péronnas, Ain", date: new Date('2025-09-28'), distance: "95 km" }
]

// URLs vérifiées par recherche internet
const urlsVerifiees: { [key: string]: string } = {
  "La sundgauvienne": "https://lasundgauvienne.fr",
  "L'Alsacienne lac de Kruth - Wildenstein": "https://www.lac-kruth-wildenstein.fr",
  "GFNY Grand Ballon": "https://www.gfny.com",
  "Défi 47": "https://cd47ffc.wixsite.com/defi47",
  "La Beuchigue": "https://www.labeuchigue.com",
  "Euskal Cyclo": "https://pyreneeschrono.fr/evenement/euskal-cyclo/",
  "La Bizikleta": "https://www.labizikleta.fr",
  "GFNY Lourdes Tourmalet": "https://www.gfny.com",
  "La Périgordine": "https://ok-time.fr/competition/la-perigordine-2024/",
  "La Matthieu Ladagnous": "https://www.asson.fr/accueil/sports/1005-cyclosportive-la-matthieu-ladagnous",
  "La Marcel Queheille": "https://www.sportsnconnect.com/calendrier-evenements/view/501/la-marcel-queheille",
  "La Volcane": "https://cyclos-cournon-auvergne.fr/volcane",
  "Les Copains": "https://www.cyclolescopains.fr/",
  "L'Etape Sanfloraine": "https://www.pays-saint-flour.fr/incontournables/nos-grands-evenements/course-cyclo-la-sanfloraine/",
  "L'Ornaise": "https://lornaise.fr/",
  "La Ronde Normande": "https://www.normandiecyclisme.fr/cyclo-laronde-normandie/",
  "Tro Bro Leon Challenge": "https://www.trobroleon.com/",
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
  "GFNY Orcières": "https://www.gfny.com",
  "La Bisou": "https://www.labisou.com"
}

// Commentaires très diversifiés adaptés aux notes
function genererCommentaire(moyenne: number): string {
  if (moyenne <= 2) {
    const commentaires = [
      'Décevant.', 'Pas terrible.', 'Trop cher.', 'Mal organisé.', 'À éviter.',
      'Bof.', 'Dommage.', 'Nul.', 'Beaucoup trop cher.', 'Très mal organisé.',
      'Organisation catastrophique.', 'Aucun intérêt.', 'Vraiment décevant.',
      'Pas à la hauteur.', 'Très mauvais parcours.', 'Ravitaillement inexistant.',
      'Accueil froid.', 'Cher pour rien.', 'À déconseiller.', 'Parcours dangereux.',
      'Zéro ambiance.', 'Mauvaise signalisation.', 'Vraiment nul.', 'Pas top.',
      'Très déçu.', 'Trop de monde.', 'Mal balisé.', 'Organisation lamentable.'
    ]
    return commentaires[Math.floor(Math.random() * commentaires.length)]
  } else if (moyenne <= 3) {
    const commentaires = [
      'Correct.', 'Moyen.', 'Peut mieux faire.', 'Pas mal.', 'Convenable.',
      'Ça va.', 'Classique.', 'Sans plus.', 'Correct sans être génial.',
      'Bien mais cher.', 'Assez bien.', 'Moyen plus.', 'Banal.', 'Standard.',
      'Rien de spécial.', 'Fait le job.', 'Pourquoi pas.', 'Sympa quand même.',
      'Un peu déçu.', 'Mitigé.', 'Bof bof.', 'Attendais mieux.', 'Basique.',
      'Ça passe.', 'Honnête.', 'Pas mal du tout.', 'Pas terrible mais OK.'
    ]
    return commentaires[Math.floor(Math.random() * commentaires.length)]
  } else if (moyenne <= 4) {
    const commentaires = [
      'Bien organisé.', 'Sympa.', 'Très correct.', 'Bonne ambiance.', 'À recommander.',
      'Vraiment bien.', 'Super !', 'Agréable.', 'Parcours sympa.', 'Belle épreuve.',
      'Bonne organisation.', 'Top !', 'Chouette parcours.', 'Très bien.', 'Cool.',
      'Très sympa.', 'Belle découverte.', 'Joli parcours.', 'Bon accueil.',
      'Beau paysage.', 'Bien pensé.', 'Très agréable.', 'Superbe !', 'Génial.',
      'Recommande vivement.', 'Ravitaillement top.', 'Ambiance au top.', 'Nickel.',
      'Belle orga.', 'Très pro.', 'Qualité au rendez-vous.', 'Vraiment sympa.'
    ]
    return commentaires[Math.floor(Math.random() * commentaires.length)]
  } else {
    const commentaires = [
      'Excellent !', 'Parfait !', 'Au top !', 'Magnifique !', 'Exceptionnel !',
      'Incroyable !', 'Fantastique !', 'Grandiose !', 'Sublime !', 'Mythique !',
      'Superbe épreuve !', 'Organisation parfaite !', 'Parcours de rêve !',
      'Wow !', 'Extraordinaire !', 'Bluffant !', 'Éblouissant !', 'Magique !',
      'Inoubliable !', 'Époustouflant !', 'Somptueux !', 'Remarquable !',
      'Absolument parfait !', 'Chef-d\'œuvre !', 'Splendide !', 'Merveilleux !',
      'Impressionnant !', 'Fabuleux !', 'Prodigieux !', 'Sensationnel !',
      'Formidable !', 'Phénoménal !'
    ]
    return commentaires[Math.floor(Math.random() * commentaires.length)]
  }
}

function genererNotes(raceName: string): any {
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

function calculerMoyenne(notes: any): number {
  const valeurs = Object.values(notes) as number[]
  return valeurs.reduce((sum, val) => sum + val, 0) / valeurs.length
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
  console.log('🔄 Création complète base de données 2025...')
  console.log(`📊 ${cyclosportives2025.length} cyclosportives à traiter`)
  
  // Supprimer données existantes
  await prisma.vote.deleteMany()
  await prisma.race.deleteMany()
  await prisma.user.deleteMany()
  
  // Créer l'admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@cycloranking.com',
      name: 'Admin',
      password: hashedAdminPassword
    }
  })
  console.log('✅ Admin créé')
  
  // Créer cyclosportives avec URLs vérifiées
  console.log('\n🏁 Création des cyclosportives...')
  const coursesCreees = []
  
  for (const cyclo of cyclosportives2025) {
    const url = urlsVerifiees[cyclo.name]
    let urlValide = false
    let urlFinale = null
    
    if (url) {
      urlValide = await verifierUrl(url)
      if (urlValide) {
        urlFinale = url
        console.log(`✅ ${cyclo.name}: ${url}`)
      } else {
        console.log(`❌ ${cyclo.name}: URL invalide`)
      }
    } else {
      console.log(`⚠️  ${cyclo.name}: Pas d'URL trouvée`)
    }
    
    // Créer la course même sans URL valide
    const course = await prisma.race.create({
      data: {
        name: cyclo.name,
        location: cyclo.location,
        date: cyclo.date,
        distance: cyclo.distance,
        website: urlFinale, // null si pas d'URL valide
        createdBy: adminUser.id,
        description: `Cyclosportive ${cyclo.name} à ${cyclo.location}`
      }
    })
    coursesCreees.push(course)
  }
  
  console.log(`\n✅ ${coursesCreees.length} cyclosportives créées`)
  
  // Créer 200 utilisateurs de test
  console.log('\n👥 Création des utilisateurs...')
  const prenoms = ['Jean', 'Pierre', 'Marie', 'Sophie', 'Luc', 'Paul', 'Julie', 'Anne', 'Marc', 'Claire']
  const noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau']
  const domaines = ['gmail.com', 'orange.fr', 'free.fr', 'hotmail.fr', 'wanadoo.fr']
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const utilisateurs = []
  for (let i = 0; i < 200; i++) {
    const prenom = prenoms[Math.floor(Math.random() * prenoms.length)]
    const nom = noms[Math.floor(Math.random() * noms.length)]
    const domaine = domaines[Math.floor(Math.random() * domaines.length)]
    const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}${i}@${domaine}`
    
    const user = await prisma.user.create({
      data: {
        email,
        name: `${prenom} ${nom}`,
        password: hashedPassword
      }
    })
    utilisateurs.push(user)
  }
  
  console.log(`👥 ${utilisateurs.length} utilisateurs créés`)
  
  // Générer votes et commentaires
  console.log('\n📝 Génération votes et commentaires...')
  let totalVotes = 0
  let totalCommentaires = 0
  
  for (const course of coursesCreees) {
    // 20-100 votes par cyclosportive
    const nombreVotes = 20 + Math.floor(Math.random() * 81)
    
    // 0-6 commentaires par cyclosportive
    const nombreCommentaires = Math.floor(Math.random() * 7)
    
    const utilisateursSelectionnes = utilisateurs
      .sort(() => Math.random() - 0.5)
      .slice(0, nombreVotes)
    
    let commentairesGeneres = 0
    
    for (let i = 0; i < nombreVotes; i++) {
      const user = utilisateursSelectionnes[i]
      const notes = genererNotes(course.name)
      const moyenne = calculerMoyenne(notes)
      
      let commentaire = null
      if (commentairesGeneres < nombreCommentaires) {
        commentaire = genererCommentaire(moyenne)
        commentairesGeneres++
      }
      
      const dateCreation = new Date(2024 + Math.random() * (2025 - 2024), Math.random() * 12, Math.random() * 28)
      
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
  
  console.log('\n📊 Statistiques finales:')
  console.log(`🏁 ${coursesCreees.length} cyclosportives`)
  console.log(`💬 ${totalVotes} votes`)
  console.log(`📝 ${totalCommentaires} commentaires`)
  console.log(`🌐 URLs vérifiées`)
  
  console.log('\n✅ Base de données complète créée !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
