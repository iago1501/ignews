import * as prismicClient from '@prismicio/client'

export function getPrismicClient(req?: unknown) {
  const prismic = prismicClient.createClient(
    process.env.PRISMIC_ENDPOINT,
    {            
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,   
      routes: [
        { 
          type: 'post',
          path: '/:uid',
        },
      ],
    }
  )

  return prismic
}