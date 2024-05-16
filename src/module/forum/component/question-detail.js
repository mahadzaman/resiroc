/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { config } from "../../../configuration/config";
import logo from "../../../assets/images/logo.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    Alert,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import ReplySection from './reply-section';
import { ForumContext } from "../../../context/forum-context";

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

const QuestionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    let { forumUser } = useContext(ForumContext)
    const [question, setQuestion] = useState("");
    const [replies, setReplies] = useState([]);
    const [relatedQuestions, setRelatedQuestions] = useState([]);
    const [description, setDescription] = useState("");
    const [showQuestionEdit, setShowQuestionEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [color, setColor] = useState("");
    const [msg, setMsg] = useState("");
    // const [hitRelatedQuestion, setHitRelatedQuestion]

    useEffect(() => {
        getQuestionDetailHandler();
        getRelatedQuestions();
    }, [id]);

    const getQuestionDetailHandler = async () => {
        try {
            let res = await axios.get(`${config.apiUrl}api/forum/question/${id}`);
            setQuestion(res.data.question);
            setReplies(res.data.question.answers)
        } catch (err) {
            console.log(err)
        }
    }

    const getRelatedQuestions = async () => {
        try {
            let res = await axios.get(`${config.apiUrl}api/forum/question/related-questions`, {
                params: {
                    questionId: id
                }
            });
            setRelatedQuestions(res.data.relatedQuestions);
        } catch (err) {

        }
    }

    const saveQuestionHandler = async () => {
        try {
            setLoading(true);
            const obj = {
                description: description,
            }
            let res = await axios.patch(`${config.apiUrl}api/forum/question/${id}`, obj);

            showAlert('Question has been updated successfully', "success");
            editQuestionHandler();
            getQuestionDetailHandler();
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

    const changeDescriptionHandler = (value) => {
        setDescription(value);
    };

    const backToQuestionHandler = () => {
        navigate(-1);
    }

    const editQuestionHandler = () => {
        setShowQuestionEdit(!showQuestionEdit);
    }

    const deleteQuestionHandler = async () => {
        try {
            setLoading(true);

            let res = await axios.delete(`${config.apiUrl}api/forum/question/${id}`,);

            showAlert('Question has been deleted successfully', "success", true);

        } catch (err) {
            console.log(err);
            showAlert('Internal server error', "danger");
        }
    }

    const moveToRelatedQuestionHandler = (questionId) => {
        navigate(`/landing/forum/question/${questionId}`, { replace: true });
    }

    return (
        <>
            <div className="container">
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
                <div className="row mt-4">
                    <div className="col-lg-9">
                        <div className="card mb-4">
                            <div className="card-body d-flex flex-row border-bottom-1 mt-3">

                                <div className="col">
                                    <label className="quest-label">Question</label>

                                    <h4 className="card-title mt-3">{question?.title}</h4>
                                    <div className="d-flex flex-row mt-3 border-bottom-1">
                                        <div className="h6 text-muted me-3">{question?.view} {question?.view > 1 ? `views` : 'view'}</div>
                                        <div className="h6 text-muted me-3">{question?.answers?.length} {question?.answers?.length > 1 ? `replies` : 'reply'}</div>
                                        <div className="h6 text-muted">{moment(question.createdAt).fromNow()}</div>
                                    </div>
                                    <hr />
                                    <div className="d-flex align-items-center flex-row mt-3 mb-4">
                                        <div className="col-sm-1">
                                            <Avatar
                                                src={""}
                                                id="avatarHeader"
                                                alt="R Sharp"
                                                className="me-md-2 me-2"
                                            />
                                        </div>
                                        <div className="col-sm-11">
                                            <div className="h6 text-dark me-3">{question?.userId?.name}</div>
                                        </div>
                                    </div>

                                    <div className="mt-2 ms-4">
                                        {!showQuestionEdit ?
                                            <>
                                                <div
                                                    className="ms-3"
                                                    dangerouslySetInnerHTML={postContent(question?.description)}
                                                ></div>
                                                {forumUser && forumUser._id && forumUser._id === question.userId?._id ?
                                                    <div className="d-flex flex-row mb-4 edit-icons">
                                                        <i className="fa fa-edit" onClick={editQuestionHandler}></i>
                                                        <i className="fa fa-trash" aria-hidden="true" onClick={deleteQuestionHandler}></i>

                                                    </div> : ""
                                                }

                                            </>
                                            :
                                            <>
                                                <ReactQuill
                                                    onChange={changeDescriptionHandler}
                                                    modules={modules}
                                                    formats={formats}
                                                    defaultValue={question?.description}
                                                />
                                                <div className="d-flex align-items-center flex-row just-right mb-3 mt-1">

                                                    <div className="btn-right-cancel">
                                                        <button className="btn btn-light btn-s" onClick={editQuestionHandler}>Cancel</button>
                                                    </div>
                                                    <div className="btn-right-save">
                                                        <button type="button" onClick={saveQuestionHandler} className="btn btn-success btn-s">Save</button>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                        <ReplySection
                            replies={replies}
                            getQuestionDetailHandler={getQuestionDetailHandler}
                            question={question}
                        />
                    </div>
                    <div className="col-lg-3">
                        <div className="card mb-1">
                            <button type="button" className="btn btn-success " onClick={backToQuestionHandler}>Back</button>
                        </div>

                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="text-center"><img className="center-block w-25 mb-4" src={logo} /></div>
                                <h5 className="fw-bold">Welcome to the Resiroc!</h5>
                                <p className="text-muted">This is a place to ask property, tenant, tenancy, money, direct debit payments, reports related questions. Feel free to ask anything about resiroc property management system!</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h5>Related Questions</h5>
                            {relatedQuestions.map((relatedQuestion, index) => {
                                return (
                                    <p className="text-muted"
                                        style={{ cursor: 'pointer' }}
                                        key={`relatedQuestion-${index}`}
                                        onClick={() => moveToRelatedQuestionHandler(relatedQuestion._id)}
                                    >
                                        {relatedQuestion.title}
                                    </p>
                                )

                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionDetail;
