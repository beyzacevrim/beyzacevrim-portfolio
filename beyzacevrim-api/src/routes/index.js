import { Router } from 'express';
import { submitMessage } from '../controllers/contact.controller.js';
import { getHealth } from '../controllers/health.controller.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import { validateContact } from '../validators/contact.validator.js';

const router = Router();

router.get('/health', getHealth);
router.post('/contact', contactLimiter, validate(validateContact), submitMessage);

export default router;
