/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from 'express';
import { Response } from 'express';
import { NonSensitivePatientData } from '../types';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientData[]>) => {
  res.json(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation} = req.body;
  const newPatient = patientService.addPatient({
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation
  });

  res.json(newPatient);
});

export default router;

/*
What I did:
  1. create a new type for the new patients (without id)
  2. implement the services function to append to list of patient entries
  3. do the router stuff above
*/