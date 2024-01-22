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
function AddBillingInformation() {
    const [billingInfo, setBillingInfo] = useState({
        patientId: '',
        invoices: '',
        paymentHistory: '',
    });
    const { connectWallet } = useContext(AuthUserContext);
    const [consentForm, setConsentForm] = useState({
        patientId: ''
    });
    const [loading, setLoading] = useState(false);
    const [billingInfoError, setBillingInfoError] = useState(false)
    const [consentFormError, setConsentFormError] = useState(false)
    const handleBillingInfoChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo((prevBillingInfo) => ({
            ...prevBillingInfo,
            [name]: value,
        }));
    };

    const handleConsentFormChange = (e) => {
        const { name, value } = e.target;
        setConsentForm((prevConsentForm) => ({
            ...prevConsentForm,
            [name]: value,
        }));
    };

    const handleBillingInfoSubmit = async () => {
        try {
            if (!billingInfo.patientId ||
                !billingInfo.invoices ||
                !billingInfo.paymentHistory) {
                setBillingInfoError(true)
                return false
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
                 await healthcareContract.methods.addBillingInformation(
                    billingInfo.patientId,
                    [billingInfo.invoices],
                    [billingInfo.paymentHistory]
                ).send({ from: connectWallet })
                setBillingInfoError(false)
                setLoading(false)
                toast.success("Add Billing Information successfully.")
                setBillingInfo({
                    patientId: '',
                    invoices: '',
                    paymentHistory: '',
                })
            }

        } catch (err) {
            setLoading(false)
            toast.error(err.message)
            console.log("err", err);
        }
    };

    const handleConsentFormSubmit = async () => {
        try {
            if (!consentForm.patientId) {
                setConsentFormError(true);
                return false
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

                let result = await healthcareContract.methods.signConsentForm(consentForm.patientId)
                    .send({ from: connectWallet });
                setConsentForm({
                    patientId: ''
                })
                setLoading(false)
                setConsentFormError(false)
                toast.success("Sign Consent Form successfully.")
            }
        } catch (err) {
            setLoading(false)
            toast.error(err.message)
            console.log("err", err);
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
            <Container className='container-set'>
                <Row className='text-start'>
                    <Col xs={12} className=''>
                        <Row className='d-flex justify-content-between'>
                            <Col xs={12} md={6} className='mt-3 ' style={{ borderRight: "1px solid #f0f0f0" }}>
                                <Col xs={11} className='text-center mt-4 mb-4'>
                                    <h3 className='patient-h3'>Add Billing Information</h3>
                                </Col>
                                <Row className='d-flex justify-content-center '>
                                    <Col xs={12} md={5}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Patient ID</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Patient ID"
                                                name='patientId'
                                                value={billingInfo.patientId}
                                                onChange={handleBillingInfoChange}
                                                className='mb-1'
                                            />
                                            {billingInfoError && !billingInfo.patientId && <span className='error-text'>Enter Patient ID</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={5}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Invoices</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Invoices"
                                                name='invoices'
                                                value={billingInfo.invoices}
                                                onChange={handleBillingInfoChange}
                                                className='mb-1'
                                            />
                                            {billingInfoError && !billingInfo.invoices && <span className='error-text'>Enter Invoices</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={10}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Payment History</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Payment History"
                                                name='paymentHistory'
                                                value={billingInfo.paymentHistory}
                                                onChange={handleBillingInfoChange}
                                                className='mb-1'
                                            />
                                            {billingInfoError && !billingInfo.paymentHistory && <span className='error-text'>Enter Payment History</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className='mt-3'>
                                        <div className="d-grid gap-2">
                                            <Button variant="info" onClick={handleBillingInfoSubmit}>
                                                Add Billing Information
                                            </Button>

                                        </div>
                                    </Col>
                                </Row>

                            </Col>
                            <Col xs={12} md={6} className='mt-3 mb-3' >
                                <Col xs={10} className='text-center mt-4 mb-4'>
                                    <h3 className='patient-h3'>Sign Consent Form</h3>
                                </Col>
                                <Row className='d-flex justify-content-center '>
                                    <Col xs={12} md={10}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Patient ID</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Patient ID"
                                                name='patientId'
                                                value={consentForm.patientId}
                                                onChange={handleConsentFormChange}
                                            />
                                            {consentFormError && !consentForm.patientId && <span className='error-text'>Enter Patient ID</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={7} className='mt-3'>
                                        <div className="d-grid gap-2">
                                            <Button variant="info" onClick={handleConsentFormSubmit}>
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

export default AddBillingInformation