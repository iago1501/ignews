import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { SignInButton } from '.'

jest.mock('next-auth/react')

describe('SignInButton component', () => {

  it('should renders correctly when user is not authenticated', () => {

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated"
     })

    render(
      <SignInButton/>
    )
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()    
  })


  it('should renders correctly when user is authenticated', () => {

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "Iago"
        },
        expires: "fake-iso-format"
      },
      status: "authenticated"
     })

    render(
      <SignInButton/>
    )
    expect(screen.getByText('Iago')).toBeInTheDocument()    
  })

})