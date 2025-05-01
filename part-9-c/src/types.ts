export interface PatientData {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
}

export type NonSensitivePatientData = Omit<PatientData, "ssn">;

export interface DiagnosisData {
  code: string;
  name: string;
  latin?: string;
}

export type NewPatientData = Omit<PatientData, "id">;
