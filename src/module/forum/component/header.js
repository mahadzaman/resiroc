import React, { useContext, useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import { config } from "../../../configuration/config";
import { useNavigate } from "react-router-dom";
import { ForumContext } from "../../../context/forum-context";
import SignupModal from '../modal/signup';
import LoginModal from '../modal/login';
const nodePort = config.nodePort;


const ForumHeader = () => {
    const navigate = useNavigate();
    const { forumUser, updateUser } = useContext(ForumContext);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [loginRoute, setLoginRoute] = useState("");

    const backToHomeHandler = () => {
        navigate('/landing/');
    }

    const signOutHandler = () => {
        localStorage.removeItem('forumToken');
        updateUser({});
        navigate('/landing/');
    }

    const signInHandler = () => {
        loginModalToggle()
    }

    const signupModalToggle = () => {

        setSignupModalOpen(!signupModalOpen)
    }

    const loginModalToggle = () => {
        setLoginModalOpen(!loginModalOpen)
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-0">
                <a className="navbar-brand  ms-5" href="#!"><img onClick={backToHomeHandler} src={logo} alt="..." /></a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon">
                    </span>
                </button>
                <div className="navbar-collapse mbl-resp collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-3">
                        <li className="nav-item">
                            {forumUser && forumUser._id ?
                                <button className="btn btn-success" onClick={signOutHandler}>Sign out</button> :
                                <button className="btn btn-success" onClick={signInHandler}>Sign in</button>
                            }

                        </li>
                    </ul>
                </div>
            </nav>
            <SignupModal
                signupModalOpen={signupModalOpen}
                signupModalToggle={signupModalToggle}
                loginModalToggle={loginModalToggle}
            />
            <LoginModal
                loginModalOpen={loginModalOpen}
                loginModalToggle={loginModalToggle}
                signupModalToggle={signupModalToggle}
                loginRoute={loginRoute}
            />
        </>

    );

}

export default ForumHeader;
