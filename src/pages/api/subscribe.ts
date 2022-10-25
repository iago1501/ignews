import { authOptions }  from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { fauna } from './../../services/fauna';
import { stripe } from './../../services/stripe';
import { NextApiRequest, NextApiResponse } from "next";
import { query as q} from 'faunadb';

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async function subscribe (req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST'){

    const session = await unstable_getServerSession(req, res, authOptions)

    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    console.log(session)

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )
    
    let customerId = user.data.stripe_customer_id

    if(!customerId) {

      //save user on stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata:
      })


      //save reference of stripe on fauna
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )
      
      customerId = stripeCustomer.id

    }  
    
    //create user checkout's session
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {price: 'price_1LkcYoA8qnXu8DnumYom2I1X', quantity: 1}
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({sessionId: stripeCheckoutSession.id})

  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}