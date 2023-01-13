import { render, screen, fireEvent } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SubscribeButton, UserSession } from '.'

jest.mock('next-auth/react')

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('SubscribeButton component', () => {

  it('should renders correctly', () => {

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({ 
        data: null,
        status: "unauthenticated"
    })

    render(
      <SubscribeButton/>
    )
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({ 
      data: null,
      status: "unauthenticated"
  })

    const signInMocked = jest.mocked(signIn)

    render(
      <SubscribeButton/>
    )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()

  })
  
  it('redirects to posts when user already has a subscription', () => {
    
    const useSessionMocked = jest.mocked(useSession)

    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "Iago"
        },
        activeSubscription: "fake-active-subscription",
        expires: "fake-iso-format"
      } as unknown as UserSession,
      status: "authenticated"
    })

    const useRouterMocked = (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/',
      push: pushMock,
  }))

    render(
      <SubscribeButton/>
    )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith("/posts")

})
})