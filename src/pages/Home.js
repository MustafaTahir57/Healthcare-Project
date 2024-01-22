import React, { useState, useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import image1 from "../assets/image-1-1.png"
import { FaMinus, FaUserDoctor, FaBuildingColumns } from "react-icons/fa6";
import { TbCheckupList } from "react-icons/tb";
import { FaBriefcaseMedical } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { healthCareAddress, healthCareAbi } from "../utils/contracts/HealthcareContract"
import { AuthUserContext } from "../context"
import { toast } from "react-toastify";
function Home() {
    const [patientId, setPatientId] = useState();
    const [appointmentId, setAppointmentId] = useState();
    const [insuranceId, setInsuranceId] = useState();
    const [index, setIndex] = useState()
    const [prescriptionsId, setPrescriptionsId] = useState();
    const [indexId, setIndexId] = useState()
    const [error, setError] = useState(false);
    const [patientError, setPatientError] = useState(false);
    const [insuranceError, setInsuranceError] = useState(false);
    const [prescriptionsError, setPrescriptionsError] = useState(false);
    const [prescriptionsData, setPrescriptionsData] = useState([])
    const [patientDetails, setPatientDetails] = useState([]);
    const [insuranceData, setInsuranceData] = useState([]);
    const [appointmentData, setAppointmentData] = useState([]);
    const { connectWallet } = useContext(AuthUserContext);
    const [medicalRecord, setMedicalRecord] = useState();
    const [medicalRecordError, setMedicalRecordError] = useState(false);
    const [medicalRecordData, setMedicalRecordData] = useState([]);
    const [billingInformation, setBillingInFormation] = useState();
    const [billingInformationError, setBillingInFormationError] = useState(false);
    const [billingInformationData, setBillingInFormationData] = useState([])
    const checkInsurance = async () => {
        try {
            if (!insuranceId) {
                setError(true);
                return false;
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                let result = await healthcareContract.methods.insuranceInformation(insuranceId).call();
                let results = await healthcareContract.methods.consentForms(insuranceId).call();
                if (result[0].length <= 0) {
                    toast.error("No record found.")
                }
                let data = {
                    insuranceID: result.insuranceID,
                    insuranceProvider: result.insuranceProvider,
                    policyNumber: result.policyNumber,
                    status: results == true ? "Patient Signed" : "Not Signed"
                }
                setInsuranceData(data)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const CheckPatient = async () => {
        try {
            if (!patientId) {
                setPatientError(true);
                return false;
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                let result = await healthcareContract.methods.patients(patientId).call();
                if (result[0].length <= 0) {
                    toast.error("No record found.")
                }
                let Dob = Number(result.dateOfBirth)
                const milliseconds = Dob * 1000;
                let DOB;
                if (Dob > 0) {
                    const date = new Date(milliseconds);
                     DOB = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                }
                let data = {
                    fullName: result.name,
                    dateOfBirth: DOB === undefined ? "": DOB,
                    gender: result.gender,
                    addres: result.addres,
                    phoneNumber: result.phoneNumber,
                    emailAddress: result.emailAddress
                }
                setPatientDetails(data)
            }
        } catch (err) {

        }
    }
    const appointmentCheck = async () => {
        try {
            if (!appointmentId || !index) {
                setInsuranceError(true);
                return false;
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                let result = await healthcareContract.methods.appointments(appointmentId, index).call();
                let Dob = Number(result.dateTime)
                const milliseconds = Dob * 1000;

                const date = new Date(milliseconds);
                const DOB = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                let acc = result.healthcareProviderID
                let data = {
                    dateTime: DOB,
                    healthcareProviderID: acc.substring(0, 5) + "..." + acc.substring(acc.length - 5),
                    notes: result.notes,
                    purposeOfVisit: result.purposeOfVisit,
                }
                setAppointmentData(data)
            }
        } catch (err) {
            console.log("err", err);
        }
    }
    const prescriptionsCheck = async () => {
        try {
            if (!prescriptionsId || !indexId) {
                setPrescriptionsError(true)
                return false
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                let result = await healthcareContract.methods.prescriptions(prescriptionsId, indexId).call();
                let Dob = Number(result.prescriptionDate)
                const milliseconds = Dob * 1000;
                const date = new Date(milliseconds);
                const DOB = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                let acc = result.healthcareProviderID
                let data = {
                    dosage: Number(result.dosage),
                    healthcareProviderID: acc.substring(0, 5) + "..." + acc.substring(acc.length - 5),
                    medicationName: result.medicationName,
                    prescriptionDate: DOB,
                }
                setPrescriptionsData(data)
            }

        } catch (err) {
            console.log("err", err);
        }
    }
    const medicalRecordCheck = async () => {
        try {
            if (!medicalRecord) {
                setMedicalRecordError(true);
                return false;
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                let result = await healthcareContract.methods.getMedicalRecord(medicalRecord).call();
                if (result[0].length <= 0) {
                    toast.error("No record found.")
                }
                setMedicalRecordData(result);
            }
        } catch (err) {
            console.log("err", err);
        }
    }

    const billingInformationCheck = async () => {
        try {
            if (!billingInformation) {
                setBillingInFormationError(true);
                return false;
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                let result = await healthcareContract.methods.getBillingInformation(billingInformation).call();
                if (result[0].length <= 0) {
                    toast.error("No record found.")
                }
                console.log("result", result);
                setBillingInFormationData(result)
            }
        } catch (err) {
            console.log("err")
        }
    }
    return (
        <div className='fluid-container'>
            <section className='home-image'>
                <div className='container text-start'>
                    <h1 className='trust-h1'>Trust You Health to the<br /> Best Specialists</h1>
                    <p className='healthcare-p'>Essential healthcare promotes well-being through prevention, diagnosis, and treatment.<br /> Universal access and medical advancements foster a resilient and healthier population.</p>
                    <button className='btn btn-grad'><Link to="/patient-appointment" style={{ textDecoration: "none", color: "#fff" }}> Register </Link></button>
                </div>
            </section>
            <section className='container home-down'>
                <Row className='d-flex justify-content-md-around justify-content-center'>
                    <Col xs={11} md={4} className='col-card mt-4' >
                        <h5 className='mt-3'>Appointment Details</h5>
                        <Form.Group className="mb-3 mt-4 text-start" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Number" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} />
                            {insuranceError && !appointmentId && <span className='error-text'>Enter Patient ID</span>}
                        </Form.Group>
                        <Form.Group className="mb-3 text-start" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Number" value={index} onChange={(e) => setIndex(e.target.value)} />
                            {insuranceError && !index && <span className='error-text'>Enter Number</span>}
                        </Form.Group>
                        <div className='d-flex justify-content-end'>
                            <Button className='btn btn-submot' type="submit" onClick={appointmentCheck}>
                                Submit
                            </Button>
                        </div>
                        <div className='mt-4 mb-4'>
                            <div className='d-flex justify-content-between'>
                                <span className='span-text'>Date/Time </span>
                                <span className='span-text1'>{appointmentData.dateTime}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Health Care Provider ID</span>
                                <span className='span-text1'>{appointmentData.healthcareProviderID}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Purpose Of Visit</span>
                                <span className='span-text1'>{appointmentData.purposeOfVisit}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Notes</span>
                                <span className='span-text1'>{appointmentData.notes}</span>
                            </div>
                        </div>
                    </Col>
                    <Col xs={11} md={4} className='col-card mt-4'>
                        <h5 className='mt-3'>Insurance Information</h5>
                        <Form.Group className="mb-3 mt-4 text-start" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Patient ID" value={insuranceId} onChange={(e) => setInsuranceId(e.target.value)} />
                            {error && !insuranceId && <span className='error-text'>Enter Patient ID</span>}
                        </Form.Group>
                        <div className='d-flex justify-content-end'>
                            <Button className='btn btn-submot' type="submit" onClick={checkInsurance}>
                                Submit
                            </Button>
                        </div>
                        <div className='mt-5 mb-4'>
                            <div className='d-flex justify-content-between mt-4'>
                                <span className='span-text'>Insurance ID</span>
                                <span className='span-text1'>{insuranceData.insuranceID}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-4'>
                                <span className='span-text'>Policy Number</span>
                                <span className='span-text1'>{insuranceData.policyNumber}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-4'>
                                <span className='span-text'>Insurance Provider</span>
                                <span className='span-text1'>{insuranceData.insuranceProvider}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-4'>
                                <span className='span-text'>Status</span>
                                <span className='span-text1'>{insuranceData?.status}</span>
                            </div>
                        </div>
                    </Col>
                    <Col xs={11} md={4} className='col-card mt-4'>
                        <h5 className='mt-3'>Patient Information</h5>
                        <Form.Group className="mb-3 mt-4 text-start" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
                            {patientError && !patientId && <span className='error-text'>Enter Patient ID</span>}
                        </Form.Group>
                        <div className='d-flex justify-content-end'>
                            <Button className='btn btn-submot' onClick={CheckPatient}>
                                Submit
                            </Button>
                        </div>
                        <div className='mt-4 mb-4'>
                            <div className='d-flex justify-content-between'>
                                <span className='span-text'>Full Name</span>
                                <span className='span-text1'>{patientDetails.fullName}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Date Of Birth</span>
                                <span className='span-text1'>{patientDetails.dateOfBirth}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Gender</span>
                                <span className='span-text1'>{patientDetails.gender}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Address </span>
                                <span className='span-text1'>{patientDetails.addres}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>PhoneNumber</span>
                                <span className='span-text1'>{patientDetails.phoneNumber}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Email Address</span>
                                <span className='span-text1'>{patientDetails.emailAddress}</span>
                            </div>
                        </div>
                    </Col>
                    <Col xs={11} md={4} className='col-card mt-4'>
                        <h5 className='mt-3'>Prescriptions Information</h5>
                        <Form.Group className="mb-3 mt-4 text-start" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Patient Id" value={prescriptionsId} onChange={(e) => setPrescriptionsId(e.target.value)} />
                            {prescriptionsError && !prescriptionsId && <span className='error-text'>Enter Patient ID</span>}
                        </Form.Group>
                        <Form.Group className="mb-3 mt-4 text-start" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Number" value={indexId} onChange={(e) => setIndexId(e.target.value)} />
                            {prescriptionsError && !indexId && <span className='error-text'>Enter Number</span>}
                        </Form.Group>
                        <div className='d-flex justify-content-end'>
                            <Button className='btn btn-submot' type="submit" onClick={prescriptionsCheck}>
                                Submit
                            </Button>
                        </div>
                        <div className='mt-4 mb-4'>
                            <div className='d-flex justify-content-between'>
                                <span className='span-text'>Medication Name</span>
                                <span className='span-text1'>{prescriptionsData.medicationName}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Dosage</span>
                                <span className='span-text1'>{prescriptionsData.dosage}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Prescription Date</span>
                                <span className='span-text1'>{prescriptionsData.prescriptionDate}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Healthcare Provider ID</span>
                                <span className='span-text1'>{prescriptionsData.healthcareProviderID}</span>
                            </div>

                        </div>
                    </Col>
                    <Col xs={11} md={4} className='col-card mt-4'>
                        <h5 className='mt-3'>Medical Record Information</h5>
                        <Form.Group className="mb-3 mt-4 text-start" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Patient Id" value={medicalRecord} onChange={(e) => setMedicalRecord(e.target.value)} />
                            {medicalRecordError && !medicalRecord && <span className='error-text'>Enter Patient ID</span>}
                        </Form.Group>
                        <div className='d-flex justify-content-end'>
                            <Button className='btn btn-submot' type="submit" onClick={medicalRecordCheck}>
                                Submit
                            </Button>
                        </div>
                        <div className='mt-4 mb-4'>
                            <div className='d-flex justify-content-between'>
                                <span className='span-text'>Diagnosis Codes</span>
                                <span className='span-text1'>{medicalRecordData.diagnosisCodes}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Treatment History</span>
                                <span className='span-text1'>{medicalRecordData.treatmentHistory}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Medication History</span>
                                <span className='span-text1'>{medicalRecordData.medicationHistory}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Allergies</span>
                                <span className='span-text1'>{medicalRecordData.allergies}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Lab Test Results</span>
                                <span className='span-text1'>{medicalRecordData.labTestResults}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <span className='span-text'>Radiology Reports</span>
                                <span className='span-text1'>{medicalRecordData.radiologyReports}</span>
                            </div>

                        </div>
                    </Col>
                    <Col xs={11} md={4} className='col-card mt-4'>
                        <h5 className='mt-3'>Medical Record Information</h5>
                        <Form.Group className="mb-3 mt-4 text-start" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Patient Id" value={billingInformation} onChange={(e) => setBillingInFormation(e.target.value)} />
                            {billingInformationError && !billingInformation && <span className='error-text'>Enter Patient ID</span>}
                        </Form.Group>
                        <div className='d-flex justify-content-end'>
                            <Button className='btn btn-submot' type="submit" onClick={billingInformationCheck}>
                                Submit
                            </Button>
                        </div>
                        <div className='mt-4 mb-4'>
                            <div className='d-flex justify-content-between mt-4'>
                                <span className='span-text'>Invoices History</span>
                                <span className='span-text1'>{billingInformationData.invoices}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-4'>
                                <span className='span-text'>PaymentHistory History</span>
                                <span className='span-text1'>{billingInformationData.paymentHistory}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </section>
            <section className='container home-down'>
                <div className="row">
                    <div className="col-lg-3 col-sm-3 col-md-3 col-xl-3 col-xs-12 mt-2">
                        <div className="card">
                            <div className="card-body mt-4">
                                <FaUserDoctor size={100} color='#fff' />
                                <p className="card-text mt-4">Search Doctor</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-3 col-md-3 col-xl-3 col-xs-12 mt-2">
                        <div className="card">
                            <div className="card-body mt-4">

                                <FaBuildingColumns size={100} color='#fff' />
                                <p className="card-text mt-4">Choose Location</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-3 col-md-3 col-xl-3 col-xs-12 mt-2">
                        <div className="card">
                            <div className="card-body mt-4">
                                <TbCheckupList size={100} color='#fff' />
                                <p className="card-text mt-4">Medical Check Up</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-3 col-md-3 col-xl-3 col-xs-12 mt-2">
                        <div className="card">
                            <div className="card-body mt-4">
                                <FaBriefcaseMedical size={100} color='#fff' />
                                <p className="card-text mt-4">Get Your Solution</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='container home-down' >
                <Row >
                    <Col xs={12} md={6} className='down-image'>
                        <img src={image1} className="ladies-image" />
                    </Col>
                    <Col xs={12} md={6} className='text-start mt-4'>
                        <h2>We are Always ensure Best Medical Treatment for Your Health</h2>
                        <p className='top-p mt-4'><FaMinus size={40} /> Top specialist doctor</p>
                        <p className='top-p'><FaMinus size={40} /> State of the art doctor service</p>
                        <p className='top-p'><FaMinus size={40} /> Easy online booking here</p>
                        <button className='btn btn-gradss mt-4'><Link to="/patient-appointment" style={{ textDecoration: "none", color: "#fff" }}> Register</Link></button>
                    </Col>
                </Row>
            </section>
        </div>
    )
}

export default Home