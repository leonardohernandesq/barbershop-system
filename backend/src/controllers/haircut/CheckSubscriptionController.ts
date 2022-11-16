import { Response, Request } from "express";
import { CheckSubscriptionService } from "../../services/haircut/CheckSubscriptionService";

class CheckSubscriptionController{
    async handle(req: Request, res: Response){
        const user_id = req.user_id;

        const checkSubscription = new CheckSubscriptionService();

        const status = await checkSubscription.execute({
            user_id
        })

        return res.json(status)
    }
}

export {CheckSubscriptionController}