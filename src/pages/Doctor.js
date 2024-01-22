import React, { useState, useContext } from 'react'
import doctor from "../assets/doctor1.webp"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { healthCareAddress, healthCareAbi } from "../utils/contracts/HealthcareContract"
import { AuthUserContext } from "../context"
import { toast } from "react-toastify";
function Doctor() {
    const [formData, setFormData] = useState({
        patientId: '',
        dateTime: '',
        healthCareProviderId: '',
        purposeOfVisit: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const { connectWallet } = useContext(AuthUserContext);
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
                !formData.dateTime ||
                !formData.healthCareProviderId ||
                !formData.purposeOfVisit ||
                !formData.notes
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
                const date = new Date(formData.dateTime)
                const unixTimestamp = Math.floor(date.getTime() / 1000);
                
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                await healthcareContract.methods.addAppointment(
                    formData.patientId,
                    unixTimestamp,
                    formData.healthCareProviderId,
                    formData.purposeOfVisit,
                    formData.notes
                ).send({ from: connectWallet })
                setLoading(false)
                setError(false)
                toast.success("patient Appointment successfully added")
                setFormData({
                    patientId: '',
                    dateTime: '',
                    healthCareProviderId: '',
                    purposeOfVisit: '',
                    notes: '',
                  });
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
            <Container>
                <Row className='text-start'>
                    <Col xs={12} className='text-center mt-4 mb-4'>
                        <h3 className='patient-h3'>Add Appointment</h3>
                    </Col>
                    <Col xs={12}>
                        <Row className='d-flex flex-md-row flex-column-reverse'>
                            <Col xs={12} md={7} className='mb-3 mt-3'>
                                <Row className='d-flex justify-content-center '>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Patient ID</Form.Label>
                                            <Form.Control
                                                type="text"
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
                                            <Form.Label>Date/Time</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter Date/Time"
                                                name="dateTime"
                                                value={formData.dateTime}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.dateTime && <span className='error-text'>Enter Date/Time</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Health Care Provider Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Health Care Provider ID"
                                                name="healthCareProviderId"
                                                value={formData.healthCareProviderId}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.healthCareProviderId && <span className='error-text'>Enter Health Care Provider ID</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Purpose of Visit</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter Purpose of Visit"
                                                name="purposeOfVisit"
                                                value={formData.purposeOfVisit}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.purposeOfVisit && <span className='error-text'>Enter Purpose of Visit</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Notes</Form.Label>
                                            <Form.Control as="textarea" rows={1}
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                            />
                                            {error && !formData.notes && <span className='error-text'>Enter notes</span>}
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
                                <img src={doctor} className="image-css" width="100%" />
                            </Col>
                        </Row>
                    </Col>

                </Row>
            </Container>
        </>

    )
}

export default Doctor