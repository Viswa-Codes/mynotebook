import express from 'express';
import * as AuthController from '../controllers/auth.controller';
import fetchuser from '../middleware/fetchuser';

const router = express.Router();

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', AuthController.createUser);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', AuthController.login);

// ROUTE 3: Get logged-in User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, AuthController.getUser);

export default router;