import { Router } from 'express';
import { requireAuth, requireRole } from '../auth/middleware.js';
import {
  createRFP, publishRFP, getMyRFPs, listPublished, getRFP,
  updateRFP, markUnderReview, approveRFP, rejectRFP, listResponsesForBuyer
} from './rfp.controller.js';
import { upload } from '../upload.js';


export const rfpRouter = Router();

rfpRouter.get('/', listPublished);
rfpRouter.get('/mine', requireAuth, requireRole('BUYER'), getMyRFPs);
rfpRouter.get('/:id', requireAuth, getRFP);

rfpRouter.post('/', requireAuth, requireRole('BUYER'), upload.single('attachment'), createRFP);
rfpRouter.put('/:id', requireAuth, requireRole('BUYER'), upload.single('attachment'), updateRFP);
rfpRouter.post('/:id/publish', requireAuth, requireRole('BUYER'), publishRFP);
rfpRouter.post('/:id/under-review', requireAuth, requireRole('BUYER'), markUnderReview);
rfpRouter.post('/:id/approve', requireAuth, requireRole('BUYER'), approveRFP);
rfpRouter.post('/:id/reject', requireAuth, requireRole('BUYER'), rejectRFP);

rfpRouter.get('/:id/responses', requireAuth, requireRole('BUYER'), listResponsesForBuyer);
