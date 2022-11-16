import { Request, Response } from "express";
import { CountHaircutService } from "../../services/haircut/CountHaircutService";

class CountHaircutController{
    async handle(req: Request, res: Response){
        const user_id = req.user_id;

        const countHaircuts = new CountHaircutService();

        const count = await countHaircuts.execute({
            user_id
        })

        return res.json(count)

    }
}

export {CountHaircutController}