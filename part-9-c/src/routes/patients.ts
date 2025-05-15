import express from 'express';
import { NewPatientData, NonSensitivePatientData, PatientData, Entry } from '../types';
import patientService from '../services/patientService';
import z from 'zod';
import { NewEntry, NewPatientSchema } from '../utils';
import { Request, Response, NextFunction } from "express";

import { NewEntrySchema } from '../utils';

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

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientData[]>) => {
  res.json(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req: Request<{ id: string }>, res: Response<PatientData>) => {
  res.json(patientService.getPatientData(req.params.id));
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientData>, res: Response<PatientData>) => {
  const addedPatientEntry = patientService.addPatient(req.body);
  res.json(addedPatientEntry);
});


//error occurs here
router.post('/:userId/entries', newEntryParser, (req: Request<{ userId: string }, unknown, NewEntry>, res: Response<Entry>) => {
  const userId = req.params.userId;

  const addedEntry = patientService.addEntry(userId, req.body);

  res.json(addedEntry);
}); 

router.use(errorMiddleware);

export default router;

  // const result = NewEntrySchema.safeParse(req.body);
  // if (!result.success) {
  //   return res.status(400).send({ error: result.error.message });
  // }