import React from "react";
import ErrorPhoto from "../assets/images/errorphoto.png";
import { NavLink } from "react-router-dom";

function ErrorPage() {
    const sectionStyle = {
        backgroundImage: `url(${ErrorPhoto})`,
        backgroundPosition: "center",
        height: "100%",
    };
    return (
        <div className="container">
            <div className="row mb-5">
                <div className="col-md-6">
                    <br />
                    <br />
                    <div style={sectionStyle}></div>
                </div>
                <div className="ml-4 col-md-5">
                    <br />
                    <br />
                    <br />
                    <div className="text-left">
                        <h3 className="">URL Incorrect / Page Not Found</h3>
                    </div>
                    <div className="text-left mt-4">
                        <p>
                            We can't figure out the page you are looking for.
                            <br />
                            You can either return to previous page, or visit the homepage
                        </p>
                        <NavLink to="/landing">
                            <button className="btn btn-primary">Visit Homepage</button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;
