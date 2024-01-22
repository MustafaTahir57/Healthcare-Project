import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './component/header/Header';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Patient from './pages/Patient';
import Doctor from './pages/Doctor';
import AddMedicalRecord from './pages/AddMedicalRecord';
import AddInsuranceInformation from './pages/AddInsuranceInformation';
import AddPrescription from './pages/AddPrescription';
import AddBillingInformation from './pages/AddBillingInformation';
import Home from './pages/Home';
import AuthState from './context';
function App() {
  return (
    <div className="App">
      <AuthState>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/patient-appointment' element={<Patient/>}/>
        <Route path="/doctor-appointment" element={<Doctor/>}/>
        <Route path="/add-medical-record" element={<AddMedicalRecord/>}/>
        <Route path="/add-insurance-information" element={<AddInsuranceInformation/>}/>
        <Route path='/add-prescription' element={<AddPrescription/>}/>
        <Route path="/add-billing-information" element={<AddBillingInformation/>}/>
      </Routes>
      </BrowserRouter>
      </AuthState>
      
    </div>
  );
}

export default App;
