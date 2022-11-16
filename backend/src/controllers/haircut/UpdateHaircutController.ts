import { Request, Response } from "express";
import { UpdateHaircutService } from "../../services/haircut/UpdateHaircutService";

class UpdateHaircutController{
    async handle(req: Request, res: Response){
        const user_id = req.user_id;
        const { haircut_id, name, price, status } = req.body

        const updateHaircut = new UpdateHaircutService();

        const haircut = await updateHaircut.execute({
            user_id,
            name,
            price,
            status,
            haircut_id
        })

        return res.json(haircut)

    }
}

export { UpdateHaircutController }