import { PatientData, NonSensitivePatientData, NewPatientData } from "../types";
import patients from "../../data/patients";
import { v1 as uuid } from "uuid";

const getEntries = (): PatientData[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatientData): PatientData => {
  const newPatient: PatientData = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
};
