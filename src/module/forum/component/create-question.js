/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { config } from "../../../configuration/config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { ForumContext } from "../../../context/forum-context";


const CreateQuestion = () => {
    const navigate = useNavigate();
    let { forumUser } = useContext(ForumContext)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [color, setColor] = useState("");
    const [msg, setMsg] = useState("");

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
    const saveQuestionHandler = async () => {
        try {
            setLoading(true);
            const obj = {
                title: title,
                description: description,
                topic: topic,
                userId: forumUser._id
            }
            let res = await axios.post(`${config.apiUrl}api/forum/question`, obj);
            showAlert('Your Question has been post successfully', "success");
        } catch (err) {
            console.log(err);
            showAlert('Internal server error', "danger");
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
            navigate('/landing/forum/questions');
        }, 3000);
    }

    const changeDescriptionHandler = (value) => {
        setDescription(value);
    };

    const changeTopicHandler = async (e) => {
        setTopic(e.target.value);
    }

    const changeTextHandler = async (e) => {
        setTitle(e.target.value);
    }

    const backToQuestionHandler = () => {
        navigate(-1);
    }

    return (
        <>
            <div className="container">
                <div className="row mt-4 mb-4">
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
                    <div className="col">

                        <div className="w-75 center-cont">
                            <div className=" d-flex ">
                                <div className="h2 mb-0 float-start">Ask a Question </div>
                                <button className="btn btn-primary mb-2"
                                    style={{ marginLeft: 'auto' }}
                                    onClick={backToQuestionHandler}
                                >Back </button>
                            </div>
                            <div className="card p-4">
                                <div className="form-group mb-3">
                                    <label htmlFor="questionTitle">Question Title</label>
                                    <span className="text-danger">*</span>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        id="questionTitle"
                                        placeholder=""
                                        value={title}
                                        onChange={changeTextHandler}
                                    />
                                    <small className="text-muted">Try to keep this under 100 characters</small>
                                </div>

                                <div className="form-group mb-4">
                                    <label htmlFor="questionDescription">Description</label>
                                    <br />
                                    <ReactQuill
                                        onChange={changeDescriptionHandler}
                                        modules={modules}
                                        formats={formats}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="chooseTopic">Choose The Topic</label>
                                    <span className="text-danger">*</span>
                                    <br />
                                    <select className="form-select mt-1"
                                        aria-label="Default select example"
                                        onChange={changeTopicHandler}
                                    >
                                        <option value=""></option>
                                        <option value="Property">Property</option>
                                        <option value="Tenancy">Tenancy</option>
                                        <option value="Tenant">Tenant</option>
                                        <option value="Money">Money</option>
                                        <option value="Task">Task</option>
                                        <option value="Report">Report</option>
                                        <option value="Direct Debit">Direct Debit</option>
                                    </select>
                                </div>
                                <div className="row">
                                    <div className="col-4 col-md-4"></div>
                                    <div className="col-4 col-md-4 text-center">
                                        <button
                                            type="button"
                                            className="btn btn-success btn-md-lg"
                                            onClick={saveQuestionHandler}
                                            disabled={!title || !topic}
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <div className="col-4 col-md-4"></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateQuestion;
