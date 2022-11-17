import { Session } from 'next-auth'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

export interface UserSession extends Session {
  activeSubscription: object 
}

export function SubscribeButton() {

  const { data, status } = useSession()
  const router = useRouter()

  const session = {...data} as UserSession

  async function handleSubscribe () {        

    if (status !== "authenticated"){
      signIn('github')
      return
    }    

    if (session?.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const {sessionId} = response.data

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({sessionId})

    } catch(err){
      alert(err.message);
    }

  }

  return (
    <button type="button"
    className={styles.subscribeButton}
    onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}