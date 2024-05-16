/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext } from "react";
import axios from "axios";
import { config } from "../../../configuration/config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    Alert,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { ForumContext } from "../../../context/forum-context";
import SignupModal from '../modal/signup';
import LoginModal from '../modal/login';

function postContent(content) {
    return { __html: content };
}

const modules = {
    clipboard: {
        matchVisual: false,
    },

    toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        ["clean"],
    ],
};
const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "id",
    "input",
    "table",
    "span",
];

const ReplySection = (props) => {
    const navigate = useNavigate();
    let { forumUser } = useContext(ForumContext)
    const [showReplyEdit, setShowReplyEdit] = useState(false);
    const [answerDescription, setAnswerDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [color, setColor] = useState("");
    const [msg, setMsg] = useState("");
    const [postAnswer, setPostAnswer] = useState("");
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [loginRoute, setLoginRoute] = useState("");

    const saveReplyHandler = async (answerId) => {
        try {
            setLoading(true);
            const obj = {
                answer: answerDescription,
            }
            let res = await axios.patch(`${config.apiUrl}api/forum/answer/${answerId}`, obj);

            showAlert('Answer has been updated successfully', "success");
            showEditReplyHandler();
            props.getQuestionDetailHandler();
        } catch (err) {
            console.log(err);
            showAlert('Internal server error', "danger");
        }
    }

    const showAlert = (msg, color, moveBack) => {
        setLoading(false);
        setAlertOpen(true);
        setMsg(msg);
        setColor(color);
        setTimeout(() => {
            setAlertOpen(false);
            if (moveBack) {
                navigate(-1);
            }
            setMsg("");
            setColor("");
        }, 3000);
    }

    const deleteReplyHandler = async (answerId) => {
        try {
            setLoading(true);

            let res = await axios.delete(`${config.apiUrl}api/forum/answer/${answerId}`,);

            showAlert('Answer has been deleted successfully', "success");
            props.getQuestionDetailHandler();

        } catch (err) {
            console.log(err);
            showAlert('Internal server error', "danger");
        }
    }

    const showEditReplyHandler = () => {
        setShowReplyEdit(!showReplyEdit)
    };

    const changeAnswerHandler = (value) => {
        setAnswerDescription(value);
    };

    const changeReplyHandler = (value) => {
        setPostAnswer(value);
    }

    const postAnswerHandler = async () => {

        try {
            if (forumUser && forumUser._id) {
                setLoading(true);
                const obj = {
                    answer: postAnswer,
                    questionId: props.question._id,
                    answerBy: forumUser._id
                }
                await axios.post(`${config.apiUrl}api/forum/answer/`, obj);
                showAlert('Your Answer has been post successfully', "success");
                const element = document.getElementsByClassName("ql-editor");
                element[0].innerHTML = "";
                props.getQuestionDetailHandler();
            } else {
                signupModalToggle();
                setLoginRoute(`/landing/forum/question/${props.question._id}`);
            }

        } catch (err) {
            console.log(err);
            showAlert('Internal server error', "danger");
        }
    }

    const updateKudosHandler = async (replyId, answerBy) => {
        try {
            if (forumUser && forumUser._id) {
                const obj = {
                    kudosUpdate: true,
                    answerBy: answerBy._id,
                    userId: forumUser._id
                }
                await axios.patch(`${config.apiUrl}api/forum/answer/${replyId}`, obj);
                props.getQuestionDetailHandler();
            } else {
                signupModalToggle();
                setLoginRoute(`/landing/forum/question/${props.question._id}`);
            }

        } catch (err) {
            console.log(err);
            showAlert('Internal server error', "danger");
        }
    }

    const signupModalToggle = () => {
        setSignupModalOpen(!signupModalOpen)
    }

    const loginModalToggle = () => {
        setLoginModalOpen(!loginModalOpen)
    }

    return (
        <>
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
            <div className="card mb-4">
                <div className="card-header pe-2">{props.replies?.length} {props.replies.length > 1 ? `replies` : 'reply'}</div>
                {props.replies?.length ?
                    props.replies.map((answer, index) => {
                        return (
                            <div key={`answer-${index}`}>
                                <div className="card-body d-flex flex-row border-bottom-1 mt-3">
                                    <div className="col-sm-1">
                                        <Avatar
                                            src={""}
                                            id="avatarHeader"
                                            alt="R Sharp"
                                            className="me-md-2 me-2"
                                        />
                                    </div>
                                    <div className="col-sm-11">
                                        <div className="d-flex flex-row mb-1">
                                            <div className="h6 text-dark me-3">{answer.answerBy?.name}</div>
                                        </div>
                                        {!showReplyEdit ?
                                            <>
                                                <div
                                                    className="ms-3"
                                                    dangerouslySetInnerHTML={postContent(answer?.answer)}
                                                ></div>
                                                {forumUser._id !== answer.answerBy._id ?

                                                    <div className="d-flex flex-row mt-2">
                                                        <i className={answer.kudosByUsers?.includes(forumUser._id?.toString()) ? "fa fa-star-o kudosExistClass" : "fa fa-star-o kudosClass"}
                                                            onClick={() => updateKudosHandler(answer._id, answer.answerBy)}></i>
                                                        <p className=" text-muted ms-2">{answer.kudosByUsers?.length ? `${answer.kudosByUsers.length} people gave this answer kudos` : "Found this useful? Give kudos!"}</p>
                                                    </div> : ""
                                                }
                                                {forumUser && forumUser._id && forumUser._id === answer.answerBy?._id ?
                                                    <div className="d-flex flex-row mb-4 edit-icons">
                                                        <i className="fa fa-edit" onClick={showEditReplyHandler}></i>
                                                        <i className="fa fa-trash"
                                                            aria-hidden="true"
                                                            onClick={() => deleteReplyHandler(answer._id)}
                                                        >
                                                        </i>
                                                    </div> : ""
                                                }
                                            </>
                                            :
                                            <>
                                                <ReactQuill
                                                    onChange={changeAnswerHandler}
                                                    modules={modules}
                                                    formats={formats}
                                                    defaultValue={answer?.answer}
                                                />
                                                <div className="d-flex align-items-center flex-row just-right mb-3 mt-1">

                                                    <div className="btn-right-cancel">
                                                        <button className="btn btn-light btn-s" onClick={showEditReplyHandler}>Cancel</button>
                                                    </div>
                                                    <div className="btn-right-save">
                                                        <button type="button" onClick={() => saveReplyHandler(answer._id)} className="btn btn-success btn-s">Save</button>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>

                                </div>
                                {index + 1 !== props.replies.length ? <hr /> : ""}
                            </div>
                        )
                    }) : ""
                }
            </div>

            <div className="card mb-4">
                <div className="h6 card-header pe-2">Got the answer? Help {props.question?.userId?.name} out.</div>
                <div className="card-body border-bottom-1 mt-3">
                    <ReactQuill
                        onChange={changeReplyHandler}
                        modules={modules}
                        formats={formats}
                        defaultValue={postAnswer}
                    />
                    <div className="text-left mt-2 float-end">
                        <button className="btn btn-success btn-lg"
                            onClick={postAnswerHandler}
                            disabled={!postAnswer}
                        >Reply</button>
                    </div>
                </div>
            </div>
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
};

export default ReplySection;
