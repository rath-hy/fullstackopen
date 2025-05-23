import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch, Navigate } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { DiagnosisData, Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

import diagnosisService from "./services/diagnoses";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const match = useMatch('/:id');
  const id = match ? match.params.id : null;

  const [diagnoses, setDiagnoses] = useState<DiagnosisData[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/patients`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };

    void fetchPatientList();

    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };

    void fetchDiagnoses();
  }, []);
  
  return (
    <div className="App">
      
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path='/' element={<PatientListPage patients={patients} setPatients={setPatients}/>} />
            <Route 
              path='/:id' 
              element={ 
                id 
                ? <PatientPage id={id} diagnoses={diagnoses}/>
                : <Navigate to='/' replace />
              }
            />
          </Routes>
        </Container>

    </div>
  );
};

export default App;
