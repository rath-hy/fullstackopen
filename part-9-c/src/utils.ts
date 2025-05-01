import { NewPatientData } from "./types";

const toNewPatientData = (object: unknown): NewPatientData => {
  console.log(object);
  const newPatient: NewPatientData = {
    name: 'Rath Hy',
    dateOfBirth: 'Mar 17 2004',
    ssn: '696969',
    gender: 'male',
    occupation: 'student',
  };

  return newPatient;
};

export default toNewPatientData;