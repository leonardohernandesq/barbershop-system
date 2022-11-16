import prismaClient from "../../prisma";

interface IUserRequest{
    user_id: string;
    name: string;
    endereco: string;
}

class UpdateUserService{
    async execute({user_id, name, endereco}: IUserRequest){

        try{
            const userAlreadyExists = await prismaClient.user.findFirst({
                where:{
                    id: user_id,
                }
            })

            if(!userAlreadyExists){
                throw new Error("User not exists!");
            }

            const userUpdated = await prismaClient.user.update({
                where:{
                    id:user_id
                },
                data:{
                    name,
                    endereco,
                },
                select:{
                    name: true,
                    email: true,
                    endereco: true,
                }
            })

            return userUpdated;
            
        }catch(err){
            console.log(err);
            throw new Error("Error an update the user!")
        }

    }
}

export { UpdateUserService }