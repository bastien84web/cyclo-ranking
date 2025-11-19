import { Calendar, MapPin } from 'lucide-react'
import { getClosestSunday2026, formatDateFrench, groupRacesByMonth } from '@/lib/calendar-utils'

interface Race {
  id: string
  name: string
  location: string
  date: Date
}

interface Calendar2026Props {
  races: Race[]
}

export function Calendar2026({ races }: Calendar2026Props) {
  // Calculer les dates 2026 pour toutes les courses
  const races2026 = races.map(race => ({
    ...race,
    date: getClosestSunday2026(new Date(race.date))
  })).sort((a, b) => a.date.getTime() - b.date.getTime())

  // Grouper par mois
  const racesByMonth = groupRacesByMonth(races2026)
  const months = Object.keys(racesByMonth).sort((a, b) => {
    const dateA = new Date(racesByMonth[a][0].date)
    const dateB = new Date(racesByMonth[b][0].date)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                Calendrier Prévisionnel 2026
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dates estimées basées sur les cyclosportives 2025. 
              Les dates correspondent au dimanche le plus proche de la date 2025.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {months.map(month => (
              <div key={month} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                  {month}
                </h3>
                <div className="space-y-3">
                  {racesByMonth[month].map(race => (
                    <div key={race.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">
                        {race.name}
                      </h4>
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDateFrench(race.date)}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{race.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>Note :</strong> Ces dates sont des estimations basées sur les cyclosportives 2025. 
              Les organisateurs peuvent modifier les dates réelles. Consultez les sites officiels pour confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
