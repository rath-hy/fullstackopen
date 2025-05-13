import { useState, useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../constants";
import { Patient } from '../../types';

const PatientPage = ({id}: { id: string }) => {
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

  console.log(patient);
  
  return (
    <>
      <h2>{patient.name}</h2>
      <div>ssh: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <h1>entries</h1>
      <div>{patient.entries.map(entry => (
        <>
          <p>{entry.date} <em>{entry.description}</em></p>
          {entry.diagnosisCodes?.map(code => (
            <li>{code}</li>
          ))}
        </>
      ))}</div>
    </>
  );
};

export default PatientPage;