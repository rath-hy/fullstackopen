import express from 'express';
import { Response } from 'express';
import { DiagnosisData } from '../types';
import diagnosisService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res: Response<DiagnosisData[]>) => {
  res.json(diagnosisService.getEntries());
});

export default router;