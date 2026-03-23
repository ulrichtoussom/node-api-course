import { Router } from 'express';
import * as livreController from '../controllers/livreController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = Router();

// Routes publiques
router.get('/', livreController.getLivres);
router.get('/:id', livreController.getLivres); // Tu peux ajouter un getById spécifique

// Routes protégées (User)
router.post('/', authenticate, livreController.postLivre);
router.put('/:id', authenticate, livreController.postLivre); // À adapter pour l'update
router.post('/:id/emprunter', authenticate, livreController.emprunterLivre);
router.post('/:id/retourner', authenticate, livreController.retournerLivre);

// Routes protégées (Admin uniquement - Section 3)
router.delete('/:id', authenticate, authorize('admin'), livreController.deleteLivre);

export default router;