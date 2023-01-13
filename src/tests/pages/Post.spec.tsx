import {render, screen} from '@testing-library/react'
import Post, {getServerSideProps} from '../../pages/posts/[...slug]'
import {getPrismicClient} from '../../services/prismic'
import { unstable_getServerSession } from "next-auth"


jest.mock('../../services/prismic')

jest.mock('../../pages/api/auth/[...nextauth]', () => {
  return {
    authOptions: {}
  }
})

jest.mock('next-auth', () => {
  return {
    unstable_getServerSession: jest.fn()
  }
})

const post = 
  {
    slug: 'my-new-post',
    title: 'My New Post',
    content: '<p>Post content</p>',
    updatedAt: 'April 10th'

  }


describe('Post page', () => {
  
  it('renders correctly', () => {

    render(<Post post={post}/>)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {

    (unstable_getServerSession as jest.Mock).mockImplementationOnce(() => ({
      activeSubscription: false
    }))

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false
        }
      })
    )
  })

  it('loads post data if the user is authenticated', async () => {

   (unstable_getServerSession as jest.Mock).mockImplementationOnce(() => ({
      activeSubscription: true
    }))

    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        last_publication_date: '01-12-2023',
        data: {
          title: [
            {type: 'heading', text: 'My New Post'}
          ],
          content: [
            {type: 'paragraph', text: 'Post content' }
          ]
        }
      })
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: 
          {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post content</p>',
            updatedAt: '12 de janeiro de 2023'
          }
        }
      }))

  })

})