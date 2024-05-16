import React from "react";
import logo from "../assets/images/logo.png";
// import { Link } from "react-router-dom";
import { config } from "../configuration/config";
import { Navbar, Nav } from "react-bootstrap/";
const nodePort = config.nodePort;
class headerBlogs extends React.Component {
  /* constructor(props) {
        super(props);
    } */
  state = {};
  render() {
    return (
      <header className="pt-0 pt-sm-3 strip-header">
        <Navbar
          expand="lg"
          variat="light"
          bg="transparent"
          className="py-4 mx-5"
        >
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
              {/* <Nav.Link className="mx-3" href="/landing#feature">
                Features
              </Nav.Link>
              <Nav.Link className="mx-3" href="/landing#price">
                Pricing
              </Nav.Link>
              <Nav.Link className="mx-3" href="/landing/blogs">
                Blogs
              </Nav.Link>
              <Nav.Link className="mx-3" href="/landing#contact">
                Contact
              </Nav.Link> */}
            </Nav>
            <Nav.Link
              href="/login"
              className="primary-button mx-3"
              id="loginButton"
            >
              Login
            </Nav.Link>
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}

export default headerBlogs;
