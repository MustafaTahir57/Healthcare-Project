import React, { useState, useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import prescription from "../assets/prescription.jpg"
import Button from 'react-bootstrap/Button';
import { healthCareAddress, healthCareAbi } from "../utils/contracts/HealthcareContract"
import { AuthUserContext } from "../context"
import { toast } from "react-toastify";
function AddPrescription() {
    const [formData, setFormData] = useState({
        patientID: '',
        medicationName: '',
        dosage: '',
        prescriptionDate: '',
        healthCareProviderID: '',
    });
    const [loading, setLoading] = useState(false);
    const { connectWallet } = useContext(AuthUserContext);
    const [error, setError] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.patientID ||
                !formData.medicationName ||
                !formData.dosage ||
                !formData.prescriptionDate ||
                !formData.healthCareProviderID
            ) {
                setError(true)
                return false
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                setLoading(true)
                const date = new Date(formData.prescriptionDate)
                const unixTimestamp = Math.floor(date.getTime() / 1000);
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                let result = await healthcareContract.methods.addPrescription(
                    formData.patientID,
                    formData.medicationName,
                    formData.dosage,
                    unixTimestamp,
                    formData.healthCareProviderID
                ).send({ from: connectWallet })
                setLoading(false)
                toast.success("Added Prescription successfully")
                setError(false)
                setFormData({
                    patientID: '',
                    medicationName: '',
                    dosage: '',
                    prescriptionDate: '',
                    healthCareProviderID: '',
                });
            }
        } catch (e) {
            setLoading(false)
            toast.error(e.message)
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
                        <h3 className='patient-h3'>Add Prescription</h3>
                    </Col>
                    <Col xs={12}>
                        <Row className='d-flex flex-md-row flex-column-reverse'>
                            <Col xs={12} md={7} className='mt-3'>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Patient ID</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Patient ID"
                                                name="patientID"
                                                value={formData.patientID}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.patientID && <span className='error-text'>Enter Patient ID</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Medication Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Medication Name"
                                                name="medicationName"
                                                value={formData.medicationName}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.medicationName && <span className='error-text'>Enter Medication Name</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Dosage</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Dosage"
                                                name="dosage"
                                                value={formData.dosage}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.dosage && <span className='error-text'>Enter Dosage</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Prescription Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter Insurance Provider"
                                                name="prescriptionDate"
                                                value={formData.prescriptionDate}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.prescriptionDate && <span className='error-text'>Enter Insurance Provider</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>

                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Health Care Provider Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Claims History"
                                                name="healthCareProviderID"
                                                value={formData.healthCareProviderID}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.healthCareProviderID && <span className='error-text'>Enter Claims History</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className='mt-3'>
                                        <div className="d-grid gap-2">
                                            <Button variant="info" onClick={handleSubmit}>
                                                Submit
                                            </Button>

                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} md={5}>
                                <img src={prescription} height="320px" width="100%" className="image-css" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>

    )
}

export default AddPrescription