import { PatientData, NonSensitivePatientData, NewPatientData } from "../types";
import patients from "../../data/patients";
import { v1 as uuid } from "uuid";

const getEntries = (): PatientData[] => {
  return patients;
};

const getPatientData = (id: string): PatientData => {
  const patientData = patients.find(patient => patient.id === id);

  if (!patientData) {
    throw new Error('patient not found');
  }

  return patientData;
};

const getNonSensitiveEntries = (): NonSensitivePatientData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const addPatient = (entry: NewPatientData): PatientData => {
  const newPatient: PatientData = {
    id: uuid(),
    entries: [], //temporary fix
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  getPatientData,
  getNonSensitiveEntries,
  addPatient,
};
