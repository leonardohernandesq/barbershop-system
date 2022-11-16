import prismaClient from "../../prisma";

interface IDetailRequest{
    haircut_id: string
}

class DetailHaircutService{
    async execute({haircut_id}: IDetailRequest){

        const haircut = await prismaClient.haircut.findFirst({
            where:{
                id: haircut_id
            }
        })

        return haircut

    }
}

export { DetailHaircutService }