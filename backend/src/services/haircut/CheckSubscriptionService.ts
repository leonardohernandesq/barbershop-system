import prismaClient from "../../prisma";

interface ICheckSubcription{
    user_id: string
}

class CheckSubscriptionService{
    async execute( {user_id} :ICheckSubcription){
        
        const status = await prismaClient.user.findFirst({
            where:{
                id: user_id
            },
            select:{
                subscriptions:{
                    select:{
                        id:true,
                        status:true
                    }
                }
            }
        })

        return status

    }
}

export { CheckSubscriptionService }