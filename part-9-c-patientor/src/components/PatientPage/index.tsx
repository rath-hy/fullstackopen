import { useState, useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../constants";
import { Patient, DiagnosisData, Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry, HealthCheckRating } from '../../types';

import FavoriteIcon from '@mui/icons-material/Favorite';

function assertNever(value: never) {
  throw new Error("Unexpected value: " + value);
}

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

  const EntryDetails = ({ entry } : { entry: Entry}) => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalEntryDetails entry={entry}/>;
      case "OccupationalHealthcare":
        return <OccupationalHealthEntryDetails entry={entry}/>;
      case "HealthCheck":
        return <HealthCheckEntryDetails entry={entry}/>;
      default:
        assertNever(entry);
    }
  };

  const OccupationalHealthEntryDetails = ({ entry } : { entry: OccupationalHealthcareEntry }) => {
    return (
      <>
        <div>employer name: {entry.employerName}</div>
        {entry.sickLeave && (<div>sick leave: {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate}</div>)}
      </>
    );
  };

  const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
    return (
      <>
        <div>discharge date: {entry.discharge.date}</div>
        <div>discharge criteria: {entry.discharge.criteria}</div>
      </>
    );
  };

  const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
    let color: string;

    switch (entry.healthCheckRating) {
      case HealthCheckRating.Healthy:
        color = 'green';
        break;
      case HealthCheckRating.LowRisk:
        color = 'yellow';
        break;
      case HealthCheckRating.HighRisk:
        color = 'orange';
        break;
      case HealthCheckRating.CriticalRisk:
        color = 'red';
        break;
      default:
        color = 'white';
    }

    return (
      <>
        <FavoriteIcon htmlColor={color}/>
        <div>health check rating: {entry.healthCheckRating}</div>

      </>
    );
  };
  
  return (
    <>
      <h2>{patient.name}</h2>
      <div>ssh: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <h1>entries</h1>
      <div>
        {patient.entries.map(entry => (
          <fieldset key={entry.id}>
            <p>{entry.date} <em>{entry.description}</em></p>
            <ul>
              {entry.diagnosisCodes?.map(code => (
                <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
              ))}
            </ul>
            <EntryDetails entry={entry}/>
          </fieldset>
        ))}
      </div>
    </>
  );
};

export default PatientPage;