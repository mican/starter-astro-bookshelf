import { createClient } from 'contentful'

const IS_DEV = import.meta.env.DEV
const SPACE = import.meta.env.CONTENTFUL_SPACE_ID
const TOKEN = IS_DEV ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN : import.meta.env.CONTENTFUL_DELIVERY_TOKEN

const contentful = createClient({
  space: SPACE,
  accessToken: TOKEN,
  host: IS_DEV ? 'preview.contentful.com' : 'cdn.contentful.com'
})

async function getAllBooks() {
  const response = await contentful.getEntries({
    content_type: 'bookReferencePage'
  })

  return response.items.map(item => ({
    id: item.sys.id,
    title: item.fields.title,
    author: item.fields.author?.fields?.name,
    coverImage: {
      url: item.fields.coverImage?.fields?.file?.url,
      description: item.fields.coverImage?.fields?.description
    }
  }))
}

async function getAllAuthors() {
  const response = await contentful.getEntries({
    content_type: 'authorPage'
  })

  return response.items.map(item => ({
    id: item.sys.id,
    name: item.fields.name,
    avatar: {
      url: item.fields.avatar?.fields?.file?.url,
      description: item.fields.avatar?.fields?.description
    },
    bio: { json: item.fields.bio.content[0] },
    books: item.fields.linkedFrom?.bookReferencePageCollection?.items?.map(item => item.fields.title) || []
  }))
}

async function getSingleBook(id) {
  const entry = await contentful.getEntry(id)

  return {
    id: entry.sys.id,
    title: entry.fields.title,
    coverImage: {
      url: entry.fields.coverImage?.fields?.file?.url,
      description: entry.fields.coverImage?.fields?.description
    },
    description: { json: entry.fields.description?.content?.[0] },
    author: {
      id: entry.fields.author?.sys.id,
      name: entry.fields.author?.fields?.name
    }
  }
}

async function getAuthor(id) {
  const entry = await contentful.getEntry(id)

  return {
    id: entry.sys.id,
    name: entry.fields.name,
    avatar: {
      url: entry.fields.avatar?.fields?.file?.url,
      description: entry.fields.avatar?.fields?.description
    },
    bio: { json: entry.fields.bio.content[0] },
    books: entry.fields.linkedFrom?.bookReferencePageCollection?.items?.map(item => item.fields.title) || []
  }
}

export const client = {
  getAllBooks,
  getAllAuthors,
  getSingleBook,
  getAuthor
}
