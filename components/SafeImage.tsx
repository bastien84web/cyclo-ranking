'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  fill?: boolean
}

export function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  fallbackSrc = '/images/placeholder.svg',
  fill = false 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  // Si l'image a échoué et qu'il n'y a pas de fallback, afficher un placeholder
  if (hasError && imgSrc === fallbackSrc && !imgSrc.startsWith('/')) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border border-gray-200 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      onError={handleError}
      unoptimized={imgSrc.startsWith('http')} // Désactiver l'optimisation pour les URLs externes
    />
  )
}
