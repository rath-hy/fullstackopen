import { NewPatientData } from "./types";
import { Gender } from "./types";

import z from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

const toNewPatientEntry = (object: unknown): NewPatientData => {
  return NewPatientSchema.parse(object);
};

export default toNewPatientEntry;