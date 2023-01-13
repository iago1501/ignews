import {render, screen} from '@testing-library/react'
import Posts, {getStaticProps} from '../../pages/posts'
import {getPrismicClient} from '../../services/prismic'

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    abstract: 'Post excerpt',
    updatedAt: 'April 10th'

  }
]

describe('Posts page', () => {
  
  it('renders correctly', () => {

    render(<Posts posts={posts}/>)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([{
        uid:'my-new-post',
        last_publication_date: '01-12-2023',
        data: {
          title: [
            {type: 'heading', text: 'My New Post'}
          ],
          content: [
            {type: 'paragraph', text: 'Post abstract' }
          ]
        }
      }])
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
          {
            slug: 'my-new-post',
            title: 'My New Post',
            abstract: 'Post abstract',
            updatedAt: '12 de janeiro de 2023'
          }
        ]
        }
      }))

  })

})