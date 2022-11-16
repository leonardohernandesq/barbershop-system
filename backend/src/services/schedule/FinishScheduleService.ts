import prismaClient from "../../prisma";

interface IFinishRequest{
    schedule_id: string;
    user_id: string;
}

class FinishScheduleService{
    async execute({user_id, schedule_id}: IFinishRequest){

        if(schedule_id === '' || user_id === ''){
            throw new Error('Error...')
        }

        try{
            // verificar se o serviço é do user
            const belongsToUser = await prismaClient.service.findFirst({
                where:{
                    id: schedule_id,
                    user_id: user_id,
                }
            })

            if(!belongsToUser){
                throw new Error('Not authorized')
            }

            await prismaClient.service.delete({
                where:{
                    id: schedule_id
                }
            })

            return { message: 'Finalizado com sucesso!'}

        }catch(err){
            console.log(err)
            throw new Error(err)
        }

    }
}

export {FinishScheduleService}