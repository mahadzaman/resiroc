import React, { useEffect } from "react";
import logo from "../assets/images/logo.png";
// import { Link } from "react-router-dom";
import { config } from "../configuration/config";
import { Navbar, Nav } from "react-bootstrap/";
import { useLocation, useNavigate } from "react-router-dom";

const nodePort = config.nodePort;

const Header = (props) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // const resolve = useResolvedPath();
  // class header extends React.Component {

  useEffect(() => {});

  const scrollToSection = (ref) => {
    if (pathname === "/landing") {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate("/landing");
    }
  };
  // render() {
  return (
    <header className="pt-0 pt-sm-3">
      <Navbar expand="lg" variat="light" bg="transparent" className="py-4 mx-5">
        <div className="logo">
          <Navbar.Brand href="/landing">
            <img src={logo} alt="logo" />
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        {nodePort === "Development" ? (
          <h5 className="text-primary  justify-content-center d-none d-sm-block">
            Resiroc Development
          </h5>
        ) : nodePort === "Staging" ? (
          <h5 className="text-primary d-none d-sm-block">Resiroc Staging</h5>
        ) : (
          ""
        )}
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="ms-auto mb-2 mb-lg-0">
            <Nav.Link
              className="mx-3"
              href="#"
              onClick={() => {
                scrollToSection(props.featureRef);
              }}
            >
              Features
            </Nav.Link>
            <Nav.Link
              className="mx-3"
              href="#"
              onClick={() => {
                scrollToSection(props.priceRef);
              }}
            >
              Pricing
            </Nav.Link>
            <Nav.Link
              className="mx-3"
              href="#"
              onClick={() => {
                scrollToSection(props.blogRef);
              }}
            >
              Blogs
            </Nav.Link>
            <Nav.Link className="mx-3" href="/landing/forum/questions">
              Forum
            </Nav.Link>
            <Nav.Link
              className="mx-3"
              href="#"
              onClick={() => {
                scrollToSection(props.contactRef);
              }}
            >
              Contact
            </Nav.Link>
          </Nav>
          <Nav.Link
            href="/login"
            className="primary-button mx-3"
            id="loginButton"
          >
            Login
          </Nav.Link>
          <Nav.Link
            href="/signup?joinFree=true"
            id="freeSignupButton"
            className="block decoration-none mx-3 mt-md-0 mt-2"
          >
            Start Free Trial
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
  // }
};

export default Header;
