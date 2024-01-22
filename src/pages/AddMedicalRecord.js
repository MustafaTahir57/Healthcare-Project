import React, { useState, useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import patient from "../assets/Mask-group-2-3.png"
import Button from 'react-bootstrap/Button';
import { healthCareAddress, healthCareAbi } from "../utils/contracts/HealthcareContract"
import { AuthUserContext } from "../context"
import { toast } from "react-toastify";
function AddMedicalRecord() {
    const [formData, setFormData] = useState({
        patientId: '',
        diagnosisCodes: '',
        treatmentHistory: '',
        medicationHistory: '',
        allergies: '',
        labTestResults: '',
        radiologyReports: '',
    });
    const { connectWallet } = useContext(AuthUserContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.patientId ||
                !formData.diagnosisCodes ||
                !formData.treatmentHistory ||
                !formData.medicationHistory ||
                !formData.allergies ||
                !formData.labTestResults ||
                !formData.radiologyReports
            ) {
                setError(true)
                return false;
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                setLoading(true)
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );

                let result = await healthcareContract.methods.addMedicalRecord(
                    formData.patientId,
                    [formData.diagnosisCodes],
                    [formData.treatmentHistory],
                    [formData.medicationHistory],
                    [formData.allergies],
                    [formData.labTestResults],
                    [formData.radiologyReports]
                ).send({ from: connectWallet })
                setError(false)
                setLoading(false)
                toast.success("Added Medical Record successfully")
                setFormData({
                    patientId: '',
                    diagnosisCodes: '',
                    treatmentHistory: '',
                    medicationHistory: '',
                    allergies: '',
                    labTestResults: '',
                    radiologyReports: '',
                });
                console.log("result", result);
            }
        } catch (e) {
            setLoading(false)
            console.log("e", e);
        }
    };

    return (
        <>
            {
                loading ? (<div>
                    <div class="load-wrapp">
                        <div class="load-9">
                            <div class="spinner">
                                <div class="bubble-1"></div>
                                <div class="bubble-2"></div>
                            </div>
                        </div>
                    </div>
                </div>) : (
                    <></>
                )
            }
            <Container>
                <Row className='text-start'>
                    <Col xs={12} className='text-center mt-4 mb-4'>
                        <h3 className='patient-h3'>Add Medical Record</h3>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12} md={5}>
                                <img src={patient} className="image-css" height="420px" width="100%" />
                            </Col>
                            <Col xs={12} md={7} className='mt-3'>
                                <Row className='d-flex justify-content-center '>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Patient ID</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Patient ID"
                                                name="patientId"
                                                value={formData.patientId}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.patientId && <span className='error-text'>Enter Patient ID</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Diagnosis Codes</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Diagnosis Codes"
                                                name="diagnosisCodes"
                                                value={formData.diagnosisCodes}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.diagnosisCodes && <span className='error-text'>Enter Diagnosis Codes</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Treatment History</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Treatment History"
                                                name="treatmentHistory"
                                                value={formData.treatmentHistory}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.treatmentHistory && <span className='error-text'>Enter Treatment History</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Medication History</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Medication History"
                                                name="medicationHistory"
                                                value={formData.medicationHistory}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.medicationHistory && <span className='error-text'>Enter Medication History</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Allergies</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Allergies"
                                                name="allergies"
                                                value={formData.allergies}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.allergies && <span className='error-text'>Enter Allergies</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Lab Test Results</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Lab Test Results"
                                                name="labTestResults"
                                                value={formData.labTestResults}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.labTestResults && <span className='error-text'>Enter Lab Test Results</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Radiology Reports</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Radiology Reports"
                                                name="radiologyReports"
                                                value={formData.radiologyReports}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.radiologyReports && <span className='error-text'>Enter Radiology Reportss</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className='mt-3 mb-3'>
                                        <div className="d-grid gap-2">
                                            <Button variant="info" onClick={handleSubmit}>
                                                Submit
                                            </Button>

                                        </div>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>

    )
}

export default AddMedicalRecord