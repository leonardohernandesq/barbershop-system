import prismaClient from "../../prisma";

interface ICountRequest{
    user_id: string;
}

class CountHaircutService{
    async execute({user_id}: ICountRequest){

        const count = await prismaClient.haircut.count({
            where:{
                user_id: user_id
            }
        })

        return count

    }
}

export { CountHaircutService }