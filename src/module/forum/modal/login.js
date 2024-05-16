import React, { useState, useContext } from "react";
import axios from "axios";
import {
    Alert,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { config } from "../../../configuration/config";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ForumContext } from "../../../context/forum-context";

const ForumLoginModal = (props) => {
    let { updateUser } = useContext(ForumContext)
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [color, setColor] = useState("");
    const [msg, setMsg] = useState("");

    const loginModalToggle = () => {
        setEmail("");
        setPassword("");
        document.querySelector('body').classList.remove('modal-open');
        document.querySelector('body').style = 'overflow: visible';
        // css("overflow", "auto")
        props.loginModalToggle();
    }

    const signupModalToggle = () => {
        loginModalToggle();
        props.signupModalToggle();
    }

    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    }

    const loginHandler = async () => {
        try {
            setLoading(true);
            let obj = {
                email: email,
                password: password,
            };
            let res = await axios.post(`${config.apiUrl}api/forum/user/login`, obj);

            localStorage.setItem(
                "forumToken",
                JSON.stringify({
                    forumToken: res.data.token,
                })
            );
            setLoading(false);
            loginModalToggle();
            updateUser(res.data.user);
            if (props.loginRoute) {
                navigate(props.loginRoute);
            }
        } catch (err) {
            console.log(err)
            showAlert(err.response?.data?.message, "danger");
        }
    }
    const showAlert = (msg, color) => {
        setLoading(false);
        setAlertOpen(true);
        setMsg(msg);
        setColor(color);
        setTimeout(() => {
            setAlertOpen(false);
            setMsg("");
            setColor("");
        }, 3000);
    }

    return (
        <div>

            <Modal
                isOpen={props.loginModalOpen}
                toggle={loginModalToggle}
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
                    toggle={loginModalToggle}
                >
                    Please login to your account
                </ModalHeader>
                <ModalBody>

                    <div className="ms-3 me-3 mt-1">
                        <p className="text-gray-400 py-2 pt-2">Don't have a an account?
                            <a className="text-primary cursor-pointer" onClick={signupModalToggle}> Sign up!</a></p>

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
                    <div className="justify-content-center">
                        <button
                            className="btn btn-primary me-1"
                            onClick={loginModalToggle}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={loginHandler}
                            className="btn btn-success"
                            disabled={!email || !password}
                        >
                            Login
                        </button>
                    </div>

                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ForumLoginModal;

