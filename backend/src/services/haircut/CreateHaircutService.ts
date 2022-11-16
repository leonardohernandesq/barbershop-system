import prismaClient from "../../prisma";

interface IHaircurRequest{
    user_id: string;
    name: string;
    price: number;
}

class CreateHaircutService{
    async execute({user_id, name, price}: IHaircurRequest){
        if(!name || !price){
            throw new Error("Error")
        }

        // Buscar Quantidade de modelos cadastrados
        const myHaircuts = await prismaClient.haircut.count({
            where:{
                user_id: user_id
            }
        })

        //Verificar se é premium
        const user = await prismaClient.user.findFirst({
            where:{
                id:user_id,
            },
            include:{
                subscriptions: true,
            }
        })

        if(myHaircuts >= 3 && user?.subscriptions?.status !== 'active'){
            throw new Error("Not authorized")
        }

        const haircut = await prismaClient.haircut.create({
            data:{
                name: name,
                price: price,
                user_id: user_id,
            }
        })
        

        return haircut;

    }
}

export { CreateHaircutService }