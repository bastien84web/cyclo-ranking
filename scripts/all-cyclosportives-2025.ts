import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// LISTE COMPLÈTE des 100+ cyclosportives 2025
const cyclosportives2025 = [
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
  { name: "La Périgordine", location: "Le Lardin-Saint-Lazare, Dordogne", date: new Date('2025-06-22'), distance: "150 km" },
  { name: "La Matthieu Ladagnous", location: "Asson, Pyrénées-Atlantiques", date: new Date('2025-07-13'), distance: "120 km" },
  { name: "La Marcel Queheille", location: "Mauléon-Licharre, Pyrénées-Atlantiques", date: new Date('2025-08-16'), distance: "110 km" },
  
  // Auvergne
  { name: "La Volcane", location: "Volvic, Puy-de-Dôme", date: new Date('2025-06-15'), distance: "135 km" },
  { name: "Les Copains", location: "Ambert, Puy-de-Dôme", date: new Date('2025-07-05'), distance: "125 km" },
  { name: "L'Etape Sanfloraine", location: "Saint-Flour, Cantal", date: new Date('2025-08-10'), distance: "140 km" },
  { name: "La Sancy Arc en Ciel By Laurent Brochard", location: "Chambon-sur-Lac, Puy-de-Dôme", date: new Date('2025-09-13'), distance: "155 km" },
  
  // Basse-Normandie
  { name: "L'Ornaise", location: "Argentan, Orne", date: new Date('2025-05-11'), distance: "115 km" },
  { name: "La Ronde Normande", location: "Juaye-Mondaye, Calvados", date: new Date('2025-05-25'), distance: "130 km" },
  
  // Bourgogne
  { name: "La Claudio Chiappucci", location: "Arnay-le-Duc, Côte d'Or", date: new Date('2025-06-07'), distance: "145 km" },
  { name: "Courir pour la Paix", location: "Chailly-sur-Armançon, Côte d'Or", date: new Date('2025-08-02'), distance: "120 km" },
  { name: "La Jean-François Bernard", location: "Corbigny, Nièvre", date: new Date('2025-09-07'), distance: "135 km" },
  
  // Bretagne
  { name: "Tro Bro Leon Challenge", location: "Lannelis, Finistère", date: new Date('2025-05-10'), distance: "160 km" },
  { name: "La Coeur de Bretagne", location: "Malestroit, Morbihan", date: new Date('2025-07-06'), distance: "125 km" },
  
  // Champagne-Ardenne
  { name: "Bar sur Aube Chemins Blancs Cycling Race", location: "Bar-sur-Aube, Aube", date: new Date('2025-06-15'), distance: "140 km" },
  
  // Corse
  { name: "L'Allégra", location: "Bastelicaccia, Corse-du-Sud", date: new Date('2025-04-27'), distance: "130 km" },
  
  // DOM-TOM
  { name: "GF Iles de Guadeloupe", location: "Capesterre-Belle-Eau, Guadeloupe", date: new Date('2025-12-07'), distance: "120 km" },
  
  // Franche-Comté
  { name: "La Flèche Bisontine", location: "Besançon, Doubs", date: new Date('2025-04-27'), distance: "135 km" },
  { name: "Cyclo Sud Bourgogne", location: "Viré, Saône-et-Loire", date: new Date('2025-04-27'), distance: "125 km" },
  { name: "La Bernard Thévenet", location: "Vitry-en-Charollais, Saône-et-Loire", date: new Date('2025-05-24'), distance: "140 km" },
  { name: "La Vache qui rit", location: "Lons-le-Saunier, Jura", date: new Date('2025-05-25'), distance: "115 km" },
  { name: "Les Trois Ballons", location: "Ronchamp, Haute-Saône", date: new Date('2025-06-07'), distance: "150 km" },
  { name: "Grand Huit Luxeuil Vosges du Sud", location: "Luxeuil-les-Bains, Haute-Saône", date: new Date('2025-06-14'), distance: "145 km" },
  { name: "La Louis Pasteur", location: "Dole, Jura", date: new Date('2025-08-24'), distance: "120 km" },
  { name: "La Transju' Cyclo", location: "Champagnole, Jura", date: new Date('2025-09-07'), distance: "135 km" },
  
  // Ile-de-France
  { name: "La Jacques Gouin", location: "Mennecy, Essonne", date: new Date('2025-03-02'), distance: "110 km" },
  { name: "La Pakavélo sud 77", location: "Paley, Seine-et-Marne", date: new Date('2025-04-20'), distance: "125 km" },
  { name: "La Raymond Martin", location: "Oncy-sur-Ecole, Essonne", date: new Date('2025-09-14'), distance: "130 km" },
  { name: "Le Bocage Gâtinais", location: "Egreville, Seine-et-Marne", date: new Date('2025-09-28'), distance: "115 km" },
  
  // Languedoc-Roussillon
  { name: "Le Tour de l'Hortus", location: "Valflaunès, Hérault", date: new Date('2025-02-23'), distance: "120 km" },
  { name: "La Montagnacoise", location: "Montagnac, Hérault", date: new Date('2025-04-06'), distance: "135 km" },
  { name: "66 degrés sud", location: "Rivesaltes, Pyrénées-Orientales", date: new Date('2025-04-26'), distance: "140 km" },
  { name: "GF Provence Occitane", location: "Cornillon, Gard", date: new Date('2025-05-04'), distance: "145 km" },
  { name: "La Lozérienne Cyclo", location: "La Canourgue, Lozère", date: new Date('2025-05-11'), distance: "130 km" },
  { name: "La Cycl'Aigoual Route", location: "L'Espérou, Gard", date: new Date('2025-06-28'), distance: "155 km" },
  
  // Limousin
  { name: "L'agglomérée", location: "Tulle, Corrèze", date: new Date('2025-04-06'), distance: "125 km" },
  { name: "La LIMOUSINE André Dufraisse", location: "Panazol, Haute-Vienne", date: new Date('2025-06-07'), distance: "140 km" },
  
  // Lorraine
  { name: "La Route Thermale", location: "Vittel, Vosges", date: new Date('2025-04-13'), distance: "120 km" },
  { name: "La Route Verte", location: "Epinal, Vosges", date: new Date('2025-05-04'), distance: "135 km" },
  { name: "UCI Granfondo Vosges", location: "La Bresse, Vosges", date: new Date('2025-05-18'), distance: "150 km" },
  { name: "Les Ballons Vosgiens", location: "Gérardmer, Vosges", date: new Date('2025-08-31'), distance: "145 km" },
  { name: "La Néodomienne Cyclo", location: "Neuves-Maisons, Meurthe-et-Moselle", date: new Date('2025-09-14'), distance: "125 km" },
  { name: "La Mirabelle Cyclo", location: "Damelevières, Meurthe-et-Moselle", date: new Date('2025-09-28'), distance: "130 km" },
  
  // Midi-Pyrénées
  { name: "Plaimont Jean-Luc Garnier", location: "Ju-Belloc, Gers", date: new Date('2025-02-16'), distance: "115 km" },
  { name: "L'Octogonale Aveyron Luc", location: "La Primaube, Aveyron", date: new Date('2025-05-18'), distance: "140 km" },
  { name: "La Lapébie", location: "Bagnères-de-Luchon, Haute-Garonne", date: new Date('2025-06-01'), distance: "135 km" },
  { name: "2SEO_La Murataise", location: "Murat-sur-Vèbre, Tarn", date: new Date('2025-06-07'), distance: "125 km" },
  { name: "L'Ariégeoise", location: "Tarascon-sur-Ariège, Ariège", date: new Date('2025-06-28'), distance: "150 km" },
  { name: "La Pyrénéenne", location: "Argelès-Gazost, Hautes-Pyrénées", date: new Date('2025-07-06'), distance: "160 km" },
  { name: "La Vélotoise", location: "Figeac, Lot", date: new Date('2025-08-03'), distance: "130 km" },
  { name: "La Cycl' Roquefort", location: "Roquefort-sur-Soulzon, Aveyron", date: new Date('2025-09-07'), distance: "120 km" },
  { name: "La Casartelli", location: "Saint-Girons, Ariège", date: new Date('2025-09-07'), distance: "145 km" },
  { name: "La Laurent Jalabert", location: "Mazamet, Tarn", date: new Date('2025-09-21'), distance: "155 km" },
  { name: "La Castraise", location: "Castres, Tarn", date: new Date('2025-10-19'), distance: "135 km" },
  
  // Nord - Pas-de-Calais
  { name: "Paris-Roubaix Challenge", location: "Denain, Nord", date: new Date('2025-04-12'), distance: "170 km" },
  
  // PACA
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
  
  // Pays de la Loire
  { name: "La Vendéenne", location: "Saint Mars La Réorthe, Vendée", date: new Date('2025-04-05'), distance: "130 km" },
  { name: "Cyclosportive Babybel", location: "Evron, Mayenne", date: new Date('2025-04-27'), distance: "125 km" },
  { name: "La Tricolore", location: "Les Herbiers, Vendée", date: new Date('2025-06-28'), distance: "145 km" },
  { name: "24 Heures Vélo Skoda", location: "Le Mans, Sarthe", date: new Date('2025-08-23'), distance: "Variable" },
  
  // Picardie
  { name: "La Ronde Picarde - Henri Sannier", location: "Eaucourt-sur-Somme, Somme", date: new Date('2025-09-21'), distance: "140 km" },
  
  // Poitou-Charentes
  { name: "Les Héros", location: "Saint-Vulbas, Ain", date: new Date('2025-04-06'), distance: "125 km" },
  { name: "La Paul Poux", location: "Tusson, Charente", date: new Date('2025-06-28'), distance: "135 km" },
  
  // Rhône-Alpes
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

console.log(`📊 Total: ${cyclosportives2025.length} cyclosportives dans la liste complète`)

async function main() {
  console.log('🔄 Vérification de la liste complète...')
  console.log(`📊 ${cyclosportives2025.length} cyclosportives trouvées dans votre liste`)
  
  // Grouper par région
  const parRegion: { [key: string]: number } = {}
  cyclosportives2025.forEach(cyclo => {
    const region = cyclo.location.split(',').pop()?.trim() || 'Inconnue'
    parRegion[region] = (parRegion[region] || 0) + 1
  })
  
  console.log('\n📍 Répartition par région:')
  Object.entries(parRegion).forEach(([region, count]) => {
    console.log(`${region}: ${count} cyclosportives`)
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
