import { Router }  from "express";
import { login, registerUser, favoriteRepo, getFavoriteRepo } from "../controllers/userControllers";
import { authenticateToken} from "../middleware/authenticateToken";

const router = Router();

router.post('/login', login);
router.post('/registerUser', registerUser);
router.post('/favoriteRepo', authenticateToken,favoriteRepo);
router.get('/favorites',authenticateToken,getFavoriteRepo)

export default router;