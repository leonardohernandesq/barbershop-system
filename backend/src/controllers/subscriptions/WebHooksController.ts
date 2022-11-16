import { Request, Response } from "express";
import Stripe from "stripe";
import { saveSubscription } from "../../utils/manageSubscription";
import { stripe } from '../../utils/stripe'

class WebHooksController{
    async handle(req: Request, res:Response){
        let event:Stripe.Event = req.body;

        const signature = req.headers['stripe-signature']
        let endpointSecret = 'whsec_fcdba394221c7d89b2abf318fad9808b536b10afd8e7a0f0bcb5da4f54bff40f';

        try{
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            )
        }catch(err){
            return res.status(400).send(`Webhook error: ${err.message}`);
        }
        switch(event.type) {
            case 'customer.subscription.deleted':
                // Caso ele cancele sua assinatura delete ela
                const payment = event.data.object as Stripe.Subscription;

                await saveSubscription(
                    payment.id,
                    payment.customer.toString(),
                    false,
                    true
                )
                break;
            case 'customer.subscription.updated':
                // Caso atualize a assinatura
                const paymentIntent = event.data.object as Stripe.Subscription;

                await saveSubscription(
                    paymentIntent.id,
                    paymentIntent.customer.toString(),
                    false
                )

                break;
            case 'checkout.session.completed':
                // Criar a assinatura
                const checkoutSession = event.data.object as Stripe.Checkout.Session;

                await saveSubscription(
                    checkoutSession.subscription.toString(),
                    checkoutSession.customer.toString(),
                    true,
                )
                break;
            default:
                console.log(`evento desconhecido ${event.type}`)
        }

    res.send();
    }
}

export { WebHooksController }