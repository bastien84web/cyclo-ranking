interface StructuredDataProps {
  type: 'website' | 'race' | 'review'
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let schema = {}

  switch (type) {
    case 'website':
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Meilleures Cyclosportives",
        "description": "Classement et avis des meilleures cyclosportives de France",
        "url": "https://meilleures-cyclosportives.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://meilleures-cyclosportives.com/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Meilleures Cyclosportives",
          "url": "https://meilleures-cyclosportives.com"
        }
      }
      break

    case 'race':
      schema = {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": data.name,
        "description": data.description,
        "location": {
          "@type": "Place",
          "name": data.location,
          "address": data.location
        },
        "startDate": data.date,
        "sport": "Cycling",
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": {
          "@type": "Organization",
          "name": data.name
        },
        "url": data.website || `https://meilleures-cyclosportives.com/race/${data.id}`,
        "aggregateRating": data.averageRating > 0 ? {
          "@type": "AggregateRating",
          "ratingValue": data.averageRating.toFixed(1),
          "ratingCount": data._count?.votes || 0,
          "bestRating": "5",
          "worstRating": "1"
        } : undefined
      }
      break

    case 'review':
      schema = {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
          "@type": "SportsEvent",
          "name": data.raceName
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": data.rating,
          "bestRating": "5",
          "worstRating": "1"
        },
        "author": {
          "@type": "Person",
          "name": data.authorName
        },
        "reviewBody": data.comment,
        "datePublished": data.createdAt
      }
      break
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
