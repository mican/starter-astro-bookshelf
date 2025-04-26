import { defineStackbitConfig } from '@stackbit/types'
import { storyblokInit, apiPlugin } from '@storyblok/js'

// Initialize Storyblok client (this should be in a separate file)
const { storyblokApi } = storyblokInit({
  accessToken: 'AdpuhnmPC4YradQPkzv9iwtt',
  use: [apiPlugin]
})

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'astro',
  nodeVersion: '18',
  cmsName: 'storyblok', // Specify Storyblok as CMS

  // Content source configuration
  contentSources: [
    {
      storyblokApi
    }
  ],

  // Model definitions
  models: {
    page: {
      type: 'page',
      label: 'Page',
      fields: [{ name: 'title', type: 'string', label: 'Title' }]
    }
  },

  // Site map configuration
  siteMap: ({ documents }) => {
    return documents.map(document => {
      return {
        stableId: document.id,
        urlPath: document.fields?.slug ? `/${document.fields.slug}` : `/${document.id}`,
        document,
        isHomePage: document.modelName === 'page' && document.fields?.slug === 'home'
      }
    })
  }
})
