/**
 * Calcule le dimanche le plus proche d'une date donnée pour l'année suivante
 * @param date2025 - Date de la course en 2025
 * @returns Date estimée pour 2026 (dimanche le plus proche)
 */
export function getClosestSunday2026(date2025: Date): Date {
  // Créer une date pour 2026 avec le même mois et jour
  const date2026 = new Date(2026, date2025.getMonth(), date2025.getDate())
  
  // Obtenir le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
  const dayOfWeek = date2026.getDay()
  
  // Calculer le nombre de jours à ajouter ou soustraire pour atteindre le dimanche le plus proche
  let daysToSunday: number
  
  if (dayOfWeek === 0) {
    // C'est déjà un dimanche
    daysToSunday = 0
  } else if (dayOfWeek <= 3) {
    // Lundi, mardi, mercredi - aller au dimanche précédent
    daysToSunday = -dayOfWeek
  } else {
    // Jeudi, vendredi, samedi - aller au dimanche suivant
    daysToSunday = 7 - dayOfWeek
  }
  
  // Créer la nouvelle date
  const closestSunday = new Date(date2026)
  closestSunday.setDate(date2026.getDate() + daysToSunday)
  
  return closestSunday
}

/**
 * Formate une date en français
 * @param date - Date à formater
 * @returns Date formatée en français
 */
export function formatDateFrench(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Groupe les courses par mois
 * @param races - Liste des courses avec leurs dates
 * @returns Courses groupées par mois
 */
export function groupRacesByMonth(races: Array<{ id: string; name: string; date: Date; location: string }>) {
  const grouped = races.reduce((acc, race) => {
    const month = race.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(race)
    return acc
  }, {} as Record<string, Array<{ id: string; name: string; date: Date; location: string }>>)
  
  // Trier les courses dans chaque mois par date
  Object.keys(grouped).forEach(month => {
    grouped[month].sort((a, b) => a.date.getTime() - b.date.getTime())
  })
  
  return grouped
}
