import {render, screen} from '@testing-library/react'
import Post, {getStaticProps} from '../../pages/posts/preview/[slug]'
import { useSession } from "next-auth/react";
import {getPrismicClient} from '../../services/prismic'
import { useRouter } from "next/router";


jest.mock('../../services/prismic')

jest.mock("next-auth/react")

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const post = 
  {
    slug: 'my-new-post',
    title: 'My New Post',
    content: '<p>Post content</p>',
    updatedAt: 'April 10th'

  }


describe('Post Preview page', () => {
  it('renders correctly', () => {

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: false
      }
    } as any)

    render(<Post post={post}/>)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription'
      }
    } as any)
 
    const mockedpush = jest.fn()

    const useRouterMocked = (useRouter as jest.Mock).mockImplementation(() => ({
        push: mockedpush
    }))

    render(<Post post={post}/>)

    expect(mockedpush).toHaveBeenCalledWith('/posts/my-new-post')
   
  })

  it('loads initial data', async () => {

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

    const response = await getStaticProps({
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