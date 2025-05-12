import express from 'express';
import { NewPatientData, NonSensitivePatientData, PatientData } from '../types';
import patientService from '../services/patientService';
import z from 'zod';
import { NewPatientSchema } from '../utils';
import { Request, Response, NextFunction } from "express";


const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientData[]>) => {
  res.json(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req: Request<{ id: string }>, res: Response<NonSensitivePatientData>) => {
  res.json(patientService.getNonSensitivePatientData(req.params.id));
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientData>, res: Response<PatientData>) => {
  const addedPatientEntry = patientService.addPatient(req.body);
  res.json(addedPatientEntry);
});

router.use(errorMiddleware);

export default router;