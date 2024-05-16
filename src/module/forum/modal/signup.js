import React, { useState } from "react";
import axios from "axios";
import {
    Alert,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { config } from "../../../configuration/config";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const ForumSignupModal = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [color, setColor] = useState("");
    const [msg, setMsg] = useState("")

    const signupModalToggle = () => {
        setEmail("");
        setPassword("");
        document.querySelector('body').style = 'overflow: visible';
        props.signupModalToggle();
    }

    const validator = (e) => {
        if (e.target.value.match(/^[A-Za-z ]*$/) && e.target.value.length < 25) {
            document.getElementById("spanName").classList.add("d-none");
        } else {

            document.getElementById("spanName").classList.remove("d-none");
        }
        nameChangeHandler(e);
    };
    const nameChangeHandler = (e) => {
        setName(e.target.value);
    }

    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    }

    const signUpHandler = async () => {
        try {
            setLoading(true);
            let obj = {
                name: name,
                email: email,
                password: password,
            };
            await axios.post(`${config.apiUrl}api/forum/user/signup`, obj);
            showAlert(
                'Account has been created successfully',
                'success',
                true
            );

        } catch (err) {
            console.log(err)
            showAlert(err.response?.data?.message, "danger");
        }
    }
    const showAlert = (msg, color, navigate) => {
        setLoading(false);
        setAlertOpen(true);
        setMsg(msg);
        setColor(color);
        setTimeout(() => {
            setAlertOpen(false);
            setMsg("");
            setColor("");
            if (navigate) {
                loginModalToggle();
            }
        }, 3000);
    }

    const loginModalToggle = () => {
        signupModalToggle();
        props.loginModalToggle();
    }

    return (
        <div>

            <Modal
                isOpen={props.signupModalOpen}
                toggle={signupModalToggle}
                className="primary"
            >
                <Backdrop
                    style={{
                        zIndex: "5",
                        paddingLeft: "235px",
                    }}
                    open={loading}
                >
                    <CircularProgress
                        size={60}
                        style={{
                            color: "#41732C",
                        }}
                    />
                </Backdrop>
                <Alert
                    isOpen={alertOpen}
                    color={color}
                    className="mt-2"
                >
                    {msg}
                </Alert>
                <ModalHeader
                    toggle={signupModalToggle}
                >
                    Sign up to Forum
                </ModalHeader>
                <ModalBody>

                    <div className="ms-3 me-3 mt-1">
                        <p className="text-gray-400 py-2 pt-2">Already have an account?
                            <a className="text-primary cursor-pointer" onClick={loginModalToggle}> Sign in!</a></p>
                        <div>
                            <label htmlFor="name">
                                Name
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-control"
                                onChange={validator}
                                placeholder="User Name"
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                required
                            />
                            <span id="spanName" className="d-none text-danger span-font">
                                Name Can not contain Numbers
                            </span>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="email">
                                {" "}
                                Email
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-control"
                                onChange={emailChangeHandler}
                                placeholder="you@company.com"
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                            />
                            <span
                                id="spanEmail"
                                className="d-none text-danger span-font "
                            >
                                Please enter a valid email
                            </span>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="password">
                                {" "}
                                Password
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-control"
                                onChange={passwordChangeHandler}
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                            />

                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        className="btn btn-primary"
                        onClick={signupModalToggle}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={signUpHandler}
                        className="btn btn-success"
                        disabled={!name || !email || !password}
                    >
                        Create Account
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ForumSignupModal;

