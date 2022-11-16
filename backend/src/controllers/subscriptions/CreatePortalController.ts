import { Request, Response} from 'express'
import { CreatePortalService } from '../../services/subscriptions/CreatePortalService';

class CreatePortalController{
    async handle(req: Request, res: Response){
        const user_id = req.user_id;

        const createPortal = new CreatePortalService();

        const portal = await createPortal.execute({
            user_id
        })

        return res.json(portal);
    }
}

export {CreatePortalController}