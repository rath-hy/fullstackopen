import { PatientData, NonSensitivePatientData, NewPatientData, Entry, EntryWithoutId } from "../types";
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

//new function
const addEntry = (userId: string, entry: EntryWithoutId): Entry => {
  const patientMatched = patients.find(p => p.id === userId);

  if (!patientMatched) {
    throw new Error('patient not found');
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patientMatched.entries = patientMatched.entries.concat(newEntry);

  return newEntry;
};

export default {
  getEntries,
  getPatientData,
  getNonSensitiveEntries,
  addPatient,
  addEntry
};
