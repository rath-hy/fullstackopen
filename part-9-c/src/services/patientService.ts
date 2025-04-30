import { PatientData, NonSensitivePatientData } from '../types';
import patientsData from '../../data/patients';

const getEntries = (): PatientData[] => {
  return patientsData;
};

const getNonSensitiveEntries = (): NonSensitivePatientData[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = () => {
  return null;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
};