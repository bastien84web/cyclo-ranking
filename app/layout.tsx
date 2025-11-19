import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meilleures Cyclosportives - Classement et Avis des Courses 2025',
  description: 'Découvrez le classement des meilleures cyclosportives de France. Plus de 100 courses notées par les cyclistes : La Marmotte, L\'Étape du Tour, L\'Ardéchoise. Votez et partagez vos avis !',
  keywords: 'cyclosportives, classement cyclosportives, meilleures cyclosportives France, La Marmotte, Étape du Tour, Ardéchoise, courses cyclistes, vélo, cyclisme',
  authors: [{ name: 'Meilleures Cyclosportives' }],
  creator: 'Meilleures Cyclosportives',
  publisher: 'Meilleures Cyclosportives',
  robots: 'index, follow',
  openGraph: {
    title: 'Meilleures Cyclosportives - Classement des Courses 2025',
    description: 'Découvrez le classement des meilleures cyclosportives de France. Plus de 100 courses notées par les cyclistes.',
    url: 'https://meilleures-cyclosportives.com',
    siteName: 'Meilleures Cyclosportives',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meilleures Cyclosportives - Classement des Courses 2025',
    description: 'Découvrez le classement des meilleures cyclosportives de France. Plus de 100 courses notées par les cyclistes.',
  },
  alternates: {
    canonical: 'https://meilleures-cyclosportives.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
