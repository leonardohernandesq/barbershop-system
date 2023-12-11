import express, { Router, Request, Response} from 'express';

import { isAuthenticated } from './middlewares/isAuthenticated';

import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { UpdateUserController } from './controllers/user/UpdateUserController';

import { CreateHaircutController } from './controllers/haircut/CreateHaircutController';
import { ListHaircutController } from './controllers/haircut/ListHaircutController';
import { UpdateHaircutController } from './controllers/haircut/UpdateHaircutController';
import { CheckSubscriptionController } from './controllers/haircut/CheckSubscriptionController';
import { CountHaircutController } from './controllers/haircut/CountHaircutController';
import { DetailHaircutController } from './controllers/haircut/DetailHaircutController';

import { NewScheduleController } from './controllers/schedule/NewScheduleController';
import { ListScheduleController } from './controllers/schedule/ListScheduleController';
import { FinishScheduleController } from './controllers/schedule/FinishScheduleController';
import { SubscribeController } from './controllers/subscriptions/SubscribeController';
import { WebHooksController } from './controllers/subscriptions/WebHooksController';
import { CreatePortalController } from './controllers/subscriptions/CreatePortalController';

const router = Router();

// ---- ROTAS USER ----
<<<<<<< HEAD
router.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});
=======

router.get('/', (req, res) => {res.send('hello world')})

>>>>>>> 57c03d32232b60be474b2504ff6f52dadb7369a1
router.post('/users', new CreateUserController().handle)
router.post('/session', new AuthUserController().handle) 

router.get('/me', isAuthenticated, new DetailUserController().handle)
router.put('/users', isAuthenticated, new UpdateUserController().handle)

// ---- ROTAS DE HAIRCUT ----
router.post('/haircut', isAuthenticated, new CreateHaircutController().handle)
router.put('/haircut', isAuthenticated, new UpdateHaircutController().handle)
router.get('/haircuts', isAuthenticated, new ListHaircutController().handle)
router.get('/haircut/check', isAuthenticated, new CheckSubscriptionController().handle)
router.get('/haircut/count', isAuthenticated, new CountHaircutController().handle)
router.get('/haircut/detail', isAuthenticated, new DetailHaircutController().handle)


// ---- ROTAS DE SCHEDULE ----
router.post('/schedule', isAuthenticated, new NewScheduleController().handle)
router.get('/schedule', isAuthenticated, new ListScheduleController().handle)
router.delete('/schedule', isAuthenticated, new FinishScheduleController().handle)

// ---- ROTAS DE PAGAMENTO ----
router.post('/subscribe', isAuthenticated, new SubscribeController().handle)
router.post('/webhooks', express.raw({type: 'application/json'}), new WebHooksController().handle)
router.post('/create-portal', isAuthenticated, new CreatePortalController().handle)

export { router };
