import express from 'express';
import { sitemap } from '../controllers/seoController.js';

const router = express.Router();
router.get('/sitemap.xml', sitemap);
export default router;
