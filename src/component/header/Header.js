import React , {useContext, useState} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./header.css"
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { AuthUserContext} from "../../context"
import {loadWeb3} from "../../utils/Api/api"
function Header() {
  const { setConnectWallet } = useContext(AuthUserContext);
  const [address, setAddress] = useState("Connect Wallet")
  const handleConnect = async()=>{
    try{
      let acc = await loadWeb3();
      if (acc === "No Wallet") {
        setConnectWallet("No Wallet");
        setAddress("Wrong Network");
      } else if (acc === "Wrong Network") {
        setConnectWallet("Wrong Network");
        setAddress("Wrong Network");
      } else {
        setAddress(acc.substring(0, 4) + "..." + acc.substring(acc.length - 4))
        setConnectWallet(acc);
      }
    }catch(err){
      console.log("err", err);
    }
  }
  return (
    <Navbar collapseOnSelect expand="lg" className=" navbar-main" >
      <Container>
        <Navbar.Brand href="#home" className='nav-text'>Health Care</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav>
          <Link to="/" style={{textDecoration: "none"}}><Nav.Link href="#memes" className='nav-text'>Home</Nav.Link></Link>
            <NavDropdown title="Services" id="basic-nav-dropdown" className='nav-text'>
              <Link to="/add-billing-information" style={{textDecoration: "none"}}><NavDropdown.Item href="#action/3.1">Add Billing Information</NavDropdown.Item></Link>
              <Link to="/add-insurance-information" style={{textDecoration: "none"}}><NavDropdown.Item href="#action/3.2">Add Insurance Information</NavDropdown.Item></Link>
              <Link to="/add-medical-record" style={{textDecoration: "none"}}><NavDropdown.Item href="#action/3.3">Add Medical Record</NavDropdown.Item></Link>
              <Link to="/add-prescription" style={{textDecoration: "none"}}><NavDropdown.Item href="#action/3.3">Add Prescription</NavDropdown.Item></Link>
            </NavDropdown>
            <Link to="/patient-appointment" style={{textDecoration: "none"}}><Nav.Link href="#deets" className='nav-text'>Register Patient</Nav.Link></Link>
            <Link to="/doctor-appointment" style={{textDecoration: "none"}}><Nav.Link href="#DoctorAppointment" className='nav-text '>Add Appointment</Nav.Link></Link>
            <Button className="btn btn-connect ms-2" size="sm" onClick={handleConnect}>{address}</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header