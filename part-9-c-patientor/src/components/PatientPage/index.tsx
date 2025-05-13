import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../constants";
import { Patient, DiagnosisData } from '../../types';

interface PatientPageProps {
  id: string;
  diagnoses: DiagnosisData[];
}

const PatientPage = ({ id, diagnoses }: PatientPageProps) => {
  const [ patient, setPatient ] = useState<Patient>();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchPatient();
  }, [id]);

  if (!id) {
    throw new Error('Invalid patient id');
  }

  if (!patient) {
    return (
      <div>loading...</div>
    );
  }

  // console.log(patient);
  // console.log(diagnoses);
  
  return (
    <>
      <h2>{patient.name}</h2>
      <div>ssh: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <h1>entries</h1>
      <div>{patient.entries.map(entry => (
        <Fragment key={entry.id}>
          <p>{entry.date} <em>{entry.description}</em></p>
          {entry.diagnosisCodes?.map(code => (
            <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
          ))}
        </Fragment>
      ))}</div>
    </>
  );
};

export default PatientPage;