import { render } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter () {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {
  
  it('should renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).toBeInTheDocument()
  })
  
  it('should add active class if the link is active', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )    
  
    expect(getByText('Home')).toHaveClass('active')
  })
  
  it('should not add active class if the link is not active', () => {
    const { getByText } = render(
      <ActiveLink href="/not-active" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).not.toHaveClass('active')
  })
})