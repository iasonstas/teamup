// anyfile inside api must be a serveless function
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      try {
         // Create Checkout Sessions from body params.
         const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'ideal'],
            line_items: [
               {
                  price: process.env.PRICE_ID,
                  quantity: 1
               }
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/checkout`
         });

         res.redirect(303, session.url);
      } catch (err) {
         res.status(err.statusCode || 500).json(err.message);
      }
   } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
   }
}
