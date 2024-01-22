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
function Patient() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        patientId: '',
        dob: '',
        phone: '',
        address: '',
        gender: '',
    });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { connectWallet } = useContext(AuthUserContext);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGenderChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, gender: value });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.fullName ||
                !formData.email ||
                !formData.patientId ||
                !formData.dob ||
                !formData.phone ||
                !formData.address ||
                !formData.gender) {
                setError(true)
                return false;
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                setLoading(true)
                const date = new Date(formData.dob)
                const unixTimestamp = Math.floor(date.getTime() / 1000);
                const web3 = window.web3;
                let healthcareContract = new web3.eth.Contract(
                    healthCareAbi,
                    healthCareAddress
                );
                let result = await healthcareContract.methods.registerPatient(
                    formData.patientId,
                    formData.fullName,
                    unixTimestamp,
                    formData.gender,
                    formData.address,
                    formData.phone,
                    formData.email,
                ).send({ from: connectWallet })
                setLoading(false)
                toast.success("Patient registered successfully.")
                setFormData({
                    fullName: '',
                    email: '',
                    patientId: '',
                    dob: '',
                    phone: '',
                    address: '',
                    gender: '',
                });
                setError(false)
            }
        } catch (e) {
            console.log("e", e);
            setLoading(false)
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
                        <h3 className='patient-h3'>Register Patient</h3>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12} md={5}>
                                <img src={patient} height="420px" width="100%" className="image-css" />
                            </Col>
                            <Col xs={12} md={7} className='mt-3'>
                                <Row className='d-flex justify-content-center '>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                placeholder="Enter Full Name"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.fullName && <span className='error-text'>Enter Full Name</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.email && <span className='error-text'>Enter email</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Patient ID</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Patient ID"
                                                name="patientId"
                                                value={formData.patientId}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.patientId && <span className='error-text'>Enter Patient ID</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Date Of Birth</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter Date of Birth"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.dob && <span className='error-text'>Enter Date of Birth</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Phone No.</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Phone No"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.phone && <span className='error-text'>Enter Phone No</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                            {error && !formData.address && <span className='error-text'>Enter Address</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group className="mb-3"
                                            controlId="formBasicEmail"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleGenderChange}
                                        >
                                            <Form.Label>Gender</Form.Label>
                                            <Form.Select aria-label="Default select example">
                                                <option>Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </Form.Select>
                                        </Form.Group>
                                        {error && !formData.gender && <span className='error-text'>Select Gender</span>}
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

export default Patient