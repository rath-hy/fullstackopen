import { z } from "zod";
import { NewPatientSchema } from "./utils";

export interface PatientData {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
  entries: Entry[];
}

export type NonSensitivePatientData = Omit<PatientData, "ssn" | "entries">;

export interface DiagnosisData {
  code: string;
  name: string;
  latin?: string;
}

export type NewPatientData = z.infer<typeof NewPatientSchema>;

export enum Gender {
  Male = "male",
  Female = "female",
}

export interface Entry {
  text: string;
}