import { NewPatientData } from "./types";
import { Gender } from "./types";

const toNewPatientEntry = (object: unknown): NewPatientData => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object
    && 'dateOfBirth' in object
    && 'ssn' in object
    && 'gender' in object
    && 'occupation' in object
  ) {
    const newPatient: NewPatientData = {
      name: parseString(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation),
    };

    return newPatient;
  }

  throw new Error('Incorrect data. Some fields are missing');
};

const isString = (text: unknown): text is string => {
  return ((typeof text === 'string') || (text instanceof String));
};

const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error('Not a string');
  }
  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing data: ' + date);
  };
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Invalid gender: ' + gender);
  };
  return gender;
};

export default toNewPatientEntry;