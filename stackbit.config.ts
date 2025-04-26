import { ContentfulContentSource } from '@stackbit/cms-contentful'

import { defineStackbitConfig, type SiteMapEntry } from '@stackbit/types'

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  nodeVersion: '18',
  ssgName: 'astro',
  contentSources: [
    new ContentfulContentSource({
      spaceId: process.env.CONTENTFUL_SPACE_ID!,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!
    })
  ],
  modelExtensions: [
    { name: 'bookReferencePage', type: 'page' },
    { name: 'bookAuthor', type: 'page' }
  ],
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter(m => m.type === 'page')

    return documents
      .filter(d => pageModels.some(m => m.name === d.modelName))
      .map(document => {
        const urlModel = (() => {
          switch (document.modelName) {
            case 'bookReferencePage':
              return 'books'
            case 'bookAuthor':
              return 'author'
            default:
              return null
          }
        })()

        return {
          stableId: document.id,
          urlPath: `/${urlModel}/${document.id}`,
          document,
          isHomePage: false
        }
      })
      .filter(Boolean) as SiteMapEntry[]
  }
})
