import prismaClient from "../../prisma";
import Stripe from "stripe";

interface ICreatePortalRequest{
    user_id:string;
}

class CreatePortalService{
    async execute({ user_id }: ICreatePortalRequest){

        const stripe = new Stripe(
            process.env.STRIPE_API_KEY,
            {
                apiVersion: '2022-08-01',
                appInfo: {
                    name: 'barberpro',
                    version: '1'
                }
            }
        )

        const findUser = await prismaClient.user.findFirst({
            where:{
                id: user_id
            }
        })

        let sessionId = findUser.stripe_customer_id

        if(!sessionId){
            console.log("NÃO TEM ID")
            return {message: 'User not found'} 
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: sessionId,
            return_url: process.env.STRIPE_SUCCESS_URL
        })

        return { sessionId: portalSession.url }

    }
}

export { CreatePortalService }