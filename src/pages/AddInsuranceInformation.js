import React, { useState, useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import insurance from "../assets/insurance.png"
import Button from 'react-bootstrap/Button';
import { healthCareAddress, healthCareAbi } from "../utils/contracts/HealthcareContract"
import { AuthUserContext } from "../context"
import { toast } from "react-toastify";

function AddInsuranceInformation() {
    const [formData, setFormData] = useState({
        patientID: '',
        insuranceID: '',
        policyNumber: '',
        insuranceProvider: '',
        claimsHistory: '',
    });
    const [loading, setLoading] = useState(false);
    const { connectWallet } = useContext(AuthUserContext);
    const [error, setError] = useState(false)
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
                !formData.insuranceID ||
                !formData.policyNumber ||
                !formData.insuranceProvider ||
                !formData.claimsHistory
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

                let result = await healthcareContract.methods.addInsuranceInformation(
                    formData.patientID,
                    formData.insuranceID,
                    formData.policyNumber,
                    formData.insuranceProvider,
                    [formData.claimsHistory]
                ).send({ from: connectWallet })
                setError(false)
                setLoading(false)
                toast.success("Add Insurance Information successfully added")
                setFormData({
                    patientID: '',
                    insuranceID: '',
                    policyNumber: '',
                    insuranceProvider: '',
                    claimsHistory: '',
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
                        <h3 className='patient-h3'>Add Insurance Information</h3>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12} md={5}>
                                <img src={insurance} className='' height="320px" width="100%" />
                            </Col>
                            <Col xs={12} md={7} className='mt-3 mb-3'>
                                <Row className='d-flex justify-content-center '>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Patient ID</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Patient ID"
                                                name="patientID"
                                                value={formData.patientID}
                                                onChange={handleInputChange}
                                                className='mb-1'
                                            />
                                            {error && !formData.patientID && <span className='error-text'>Enter Patient ID</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Insurance ID</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Insurance ID"
                                                name="insuranceID"
                                                value={formData.insuranceID}
                                                onChange={handleInputChange}
                                                className='mb-1'
                                            />
                                            {error && !formData.insuranceID && <span className='error-text'>Enter Insurance ID</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Policy Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Policy Number"
                                                name="policyNumber"
                                                value={formData.policyNumber}
                                                onChange={handleInputChange}
                                                className='mb-1'
                                            />
                                            {error && !formData.policyNumber && <span className='error-text'>Enter Policy Number</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Insurance Provider</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Insurance Provider"
                                                name="insuranceProvider"
                                                value={formData.insuranceProvider}
                                                onChange={handleInputChange}
                                                className='mb-1'
                                            />
                                            {error && !formData.insuranceProvider && <span className='error-text'>Enter Insurance Provider</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>

                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Claims History</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Claims History"
                                                name="claimsHistory"
                                                value={formData.claimsHistory}
                                                onChange={handleInputChange}
                                                className='mb-1'
                                            />
                                            {error && !formData.claimsHistory && <span className='error-text'>Enter Claims History</span>}
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
                        </Row>
                    </Col>

                </Row>
            </Container>
        </>

    )
}

export default AddInsuranceInformation