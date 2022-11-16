import prismaClient from "../../prisma";

interface IListScheduleRequest{
    user_id: string
}

class ListScheduleService{
    async execute({user_id}: IListScheduleRequest){

        const schedule = await prismaClient.service.findMany({
            where:{
                user_id: user_id
            },
            select:{
                id:true,
                customer: true,
                haircut: true,
            }
        })
        
        return schedule;
        
    }
}

export { ListScheduleService }