import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-2">
              Meilleures Cyclosportives
            </h3>
            <p className="text-gray-300 text-sm">
              Découvrez et notez les meilleures cyclosportives de France
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-2">
              <Mail className="h-5 w-5 mr-2 text-blue-400" />
              <span className="text-sm text-gray-300">Contact :</span>
            </div>
            <a 
              href="mailto:contact@meilleures-cyclosportives.com"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
            >
              contact@meilleures-cyclosportives.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Meilleures Cyclosportives. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
