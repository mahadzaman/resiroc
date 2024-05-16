import React from "react";
import footerLogo from "../assets/images/footer-logo.svg";
import { Link } from "react-router-dom";
import supply from "../assets/docs/supply_of_services_V1.docx";

class footer extends React.Component {
  /* constructor(props) {
        super(props);
    } */
  state = {};
  render() {
    return (
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="flex-wrapped align-center">
                <div className="footer-logo">
                  <img src={footerLogo} alt="Resiroc Logo" />
                </div>
                <div className="social-links flex-wrapped just-center mar-l-15">
                  <div className="item">
                    <a
                      href="https://twitter.com/resiroc"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {/* <img src={twitter} alt="twitter" /> */}
                      <i className="fa fa-twitter-square" />
                    </a>
                  </div>
                  <div className="item">
                    <a
                      href="https://www.facebook.com/Resiroc-100125362862941/?ref=page_internal"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {/* <img src={facebook} alt="facebook" /> */}
                      <i className="fa fa-facebook-square" />
                    </a>
                  </div>
                  <div className="item">
                    <a
                      href="https://www.instagram.com/resiroc_info/"
                      target={"_blank"}
                    >
                      {/* <img src={insta} alt="insta" /> */}
                      <i className="fa fa-instagram" />
                    </a>
                  </div>
                  <div className="item linked-in">
                    <a
                      href="https://www.linkedin.com/company/89510327/"
                      target={"_blank"}
                    >
                      {/* <img src={insta} alt="insta" /> */}
                      <i className="fa fa-linkedin-square" />
                    </a>
                  </div>
                </div>
                <div className="flex-dir-col mar-l-auto">
                  <ul className="footer-links">
                    <li>
                      <Link to="landing/terms">Terms & Conditions</Link>
                    </li>
                    <li>
                      <Link to="landing/privacy-policy">Privacy Policy</Link>
                    </li>
                    <li>
                      <a href={supply} download>
                        Supply of Services
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="copyright-wrapper">
            <div className="row">
              <div className="col-md-12">
                <div className="copyright-text">
                  <p>Resiroc Ltd {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default footer;
