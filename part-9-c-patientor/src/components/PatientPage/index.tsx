import { useState, useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../constants";
import { Patient, DiagnosisData, Entry, EntryWithoutId, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry, HealthCheckRating } from '../../types';

import FavoriteIcon from '@mui/icons-material/Favorite';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import patientService from '../../services/patients';

function assertNever(value: never) {
  throw new Error("Unexpected value: " + value);
}

interface PatientPageProps {
  id: string;
  diagnoses: DiagnosisData[];
}



const NewEntryForm = ({ userId, diagnoses} : { userId: string, diagnoses: DiagnosisData[] }) => {
  const [entryType, setEntryType] = useState('Hospital');

  const [description, setDescription] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  

  const [criteria, setCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  const handleDiagnosisCodeSelect = (event: SelectChangeEvent<string[]>) => {
    
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const submitNewEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const base = {
      description,
      date: dischargeDate,
      specialist,
      diagnosisCodes,
    };

    //left off here
    let newEntry: EntryWithoutId;
    if (entryType === 'Hospital') {
      newEntry = {
        ...base,
        type: entryType,
        discharge: {
          date: dischargeDate,
          criteria,
        }
      };
    } else if (entryType === 'HealthCheck') {
      newEntry = {
        ...base,
        type: entryType,
        healthCheckRating,
      };
    } else if (entryType === 'OccupationalHealthcare') {
      newEntry = {
        ...base,
        type: entryType,
        employerName,
        sickLeave: {
          startDate,
          endDate
        }
      };
    } else {
      throw new Error('Unknown type entry');
    }

    //error occurs here
    patientService.createEntry(userId, newEntry);
    console.log(startDate, endDate);

  };

  return (
    <form onSubmit={submitNewEntry}>
      <div>
        entry type:
        <select onChange={(event) => setEntryType(event.target.value)}>
          <option value="Hospital">Hospital</option>
          <option value="OccupationalHealthcare">Occupational Healthcare</option>
          <option value="HealthCheck">Health Check</option>
        </select>
      </div>

      <div>
        description:
        <input name="description-input" value={description} onChange={(event) => (setDescription(event.target.value))}/>
      </div>

      <div>
        specialist:
        <input name="description-input" value={specialist} onChange={(event) => (setSpecialist(event.target.value))}/>
      </div>

      <div>
        diagnosis codes:
        <Select multiple value={diagnosisCodes} onChange={handleDiagnosisCodeSelect}>
          {diagnoses.map(d => (
            <MenuItem key={d.code} value={d.code}>{d.code}</MenuItem>
          ))}
        </Select>
      </div>

      {entryType === 'HealthCheck' && (
        <div>
          health check rating:
          <select onChange={event => setHealthCheckRating(Number(event.target.value) as HealthCheckRating)}>
            <option value={HealthCheckRating.Healthy}>Healthy</option>
            <option value={HealthCheckRating.LowRisk}>Low risk</option>
            <option value={HealthCheckRating.HighRisk}>High risk</option>
            <option value={HealthCheckRating.CriticalRisk}>Critical risk</option>
          </select>
        </div>
      )}

      {entryType === 'Hospital' && (
        <div>
          discharge date:
          <input type="date" onChange={(e) => setDischargeDate(e.target.value)}/>

          discharge criteria:
          <input value={criteria} onChange={(e) => setCriteria(e.target.value)}/>
        </div>
        
      )}

      

      {entryType === 'OccupationalHealthcare' && (
        <div>
          employer name:
          <input value={employerName} onChange={e => setEmployerName(e.target.value)} />

          sick leave start date:
          <input type="date" onChange={e => setStartDate(e.target.value)}/>
          <input type="date" onChange={e => setEndDate(e.target.value)}/>
        </div>
      )}

      <div>
        <button type="submit">submit</button>
      </div>

    </form>
  );
  console.log(dischargeDate);
};

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
        return (
          <>
            <HospitalEntryDetails entry={entry}/>
          </>);
      case "OccupationalHealthcare":
        return (
          <>
            <OccupationalHealthEntryDetails entry={entry}/>
          </>
        );
      case "HealthCheck":
        return (
          <>
            <HealthCheckEntryDetails entry={entry}/>
          </>
        );
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
      <NewEntryForm userId={patient.id} diagnoses={diagnoses}/>
    </>
  );
};

export default PatientPage;