import diagnosesData from '../../data/diagnoses';
import { DiagnosisData } from '../types';

const getEntries = (): DiagnosisData[] => {
  return diagnosesData;
};

const addDiagnosis = () => {
  return null;
};

export default {
  getEntries,
  addDiagnosis
};
