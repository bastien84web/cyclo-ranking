import { RaceList } from '@/components/RaceList'
import { Hero } from '@/components/Hero'

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <RaceList />
      </div>
    </div>
  )
}
