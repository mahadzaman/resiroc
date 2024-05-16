/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import Pagination from "react-js-pagination";
import logo from "../../../assets/images/logo.png";
import moment from "moment";
import Avatar from "@material-ui/core/Avatar";
import { hotjar } from "react-hotjar";
import axios from "axios";
import { config } from "../../../configuration/config";
import SignupModal from '../modal/signup';
import LoginModal from '../modal/login';
import { useNavigate } from "react-router-dom";
import { ForumContext } from "../../../context/forum-context";

function postContent(content) {
    return { __html: content };
}

const QuestionsThread = () => {
    const navigate = useNavigate();
    let { forumUser } = useContext(ForumContext);
    const recordPerPage = 10;
    const [questions, setQuestions] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [topic, setTopic] = useState("");
    const [searchText, setSearchText] = useState("");
    const [topRatedUsers, setTopRatedUsers] = useState([]);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [loginRoute, setLoginRoute] = useState("");
    useEffect(() => {
        getQuestions();

    }, [pageNumber, topic, searchText]);

    useEffect(() => {
        getTopRatedUsers();
    }, []);

    const getTopRatedUsers = async () => {
        try {
            const { data } = await axios.get(`${config.apiUrl}api/forum/user/top-rated`, {
                params: {
                },
            });
            setTopRatedUsers(data.topRatedUsers);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        hotjar.initialize(config.hotjarSiteId, config.hotjarHJsvId);
        hotjar.stateChange("/landing/blogs");
    }, []);

    const handlePageChange = (_page) => {
        setPageNumber(_page);
    };

    const getQuestions = async () => {
        try {
            const { data } = await axios.get(`${config.apiUrl}api/forum/question`, {
                params: {
                    recordPerPage: recordPerPage,
                    pageNo: pageNumber,
                    topic: topic,
                    searchText: searchText
                },
            });
            setQuestionCount(data.questionCount);
            setQuestions(data.questions);

        } catch (err) {
            console.log(err);
        }
    };

    const changeTopicHandler = async (e) => {
        setTopic(e.target.innerHTML);
        setPageNumber(1);
    }

    const changeSearchTextHandler = async (e) => {
        setSearchText(e.target.value);
        setPageNumber(1);
    }

    const handlerRemoveFilter = async () => {
        setTopic("");
        setPageNumber(1);
    }

    const askQuestionHandler = async () => {
        if (forumUser && forumUser._id) {
            navigate('/landing/forum/create/question');
        } else {
            setLoginRoute('/landing/forum/create/question');
            signupModalToggle();
        }

    }

    const signupModalToggle = () => {
        setSignupModalOpen(!signupModalOpen)
    }

    const loginModalToggle = () => {
        setLoginModalOpen(!loginModalOpen)
    }

    const questionDetailHandler = async (questionId, views) => {
        try {
            const obj = {
                viewCount: views + 1,
            }
            let res = await axios.patch(`${config.apiUrl}api/forum/question/${questionId}`, obj);
            navigate(`/landing/forum/question/${questionId}`);
        } catch (err) {

        }
    }

    return (
        <>
            <div className="py-4 bg-light border-bottom mb-4 bg-img">
                <div className="container">
                    <div className="text-left my-5 ms-5">
                        <h1 className="fw-bolder text-light">Get Help from the Resiroc Community</h1>
                        <input
                            className="input-width form-control mt-4"
                            type="text" placeholder="Search For Anything..."
                            name="search"
                            value={searchText}
                            onChange={changeSearchTextHandler}
                        />
                    </div>
                </div>
            </div>
            <div className="border-bottom">
                <div className="container">
                    <div className="row">
                        <div className=" text-left pb-2 d-none d-md-inline tab-content text-nowrap">
                            {!topic ?
                                <div className="d-flex flex-row">
                                    <h5 className="me-4">Filter By: </h5>
                                    <p className="me-2" onClick={changeTopicHandler}>Property</p>
                                    <span className="me-2" >-</span>
                                    <p className="me-2" onClick={changeTopicHandler} href="#">Tenant</p>
                                    <span className="me-2" >-</span>
                                    <p className="me-2" onClick={changeTopicHandler} href="#">Tenancy</p>
                                    <span className="me-2" >-</span>
                                    <p className="me-2" onClick={changeTopicHandler} href="#">Money</p>
                                    <span className="me-2" >-</span>
                                    <p className="me-2" onClick={changeTopicHandler} href="#">Task</p>
                                    <span className="me-2" >-</span>
                                    <p className="me-2" onClick={changeTopicHandler} href="#">Report</p>
                                    <span className="me-2" >-</span>
                                    <p className="me-2" onClick={changeTopicHandler} href="#">Direct Debit</p>
                                </div> : ""
                            }

                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row mt-4">

                    <div className="col-lg-9">
                        {topic ?
                            <div className="d-flex tab-content">
                                <p style={{ color: "#0d6efd" }} className="me-2"
                                    onClick={handlerRemoveFilter}
                                >
                                    All Questions
                                </p>
                                {'>'}
                                <span className="ms-1" style={{ color: "#0d6efd" }}> {topic} </span>
                            </div> : ""}
                        <div className="card mb-4">
                            {questions.length ?
                                <div className="card-header pe-2 ">Latest {topic} Questions</div>
                                :
                                <div className="card-header pe-2 text-center">No Question Found</div>
                            }
                            {questions.map((question, index) => {
                                return (
                                    <div key={`forum-${index}`}>
                                        <div className="card-body d-flex flex-row border-bottom-1 mt-0">
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
                                                    <div className="h6 text-dark me-0 me-md-3">{question.userId?.name}</div>
                                                    <div className="h6 text-muted">- Asked in {question.topic} - Topic</div>
                                                </div>
                                                <h4 className="card-title"
                                                    onClick={() => questionDetailHandler(question._id, question.view)}
                                                    style={{ cursor: 'pointer' }}
                                                >{question.title}</h4>
                                                <div
                                                    className="ms-3"
                                                    dangerouslySetInnerHTML={postContent(question.description)}
                                                ></div>
                                                <div className="d-flex flex-row mt-2">
                                                    <div className="h6 text-muted me-3">{question.view} {question.view > 1 ? `views` : 'view'}</div>
                                                    <div className="h6 text-muted me-3">{question.answerCount} {question.answerCount > 1 ? `replies` : 'reply'}</div>
                                                    <div className="h6 text-muted">{moment(question.createdAt).fromNow()}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {index + 1 !== questions.length ? <hr /> : ""}
                                    </div>
                                )
                            })}
                        </div>
                        {questions.length ?
                            <div className="row">
                                <div className="col-md-5 col-3"></div>
                                <div className="col-md-4 col-6">
                                    <Pagination
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        totalItemsCount={questionCount}
                                        onChange={handlePageChange}
                                        activePage={pageNumber}
                                        itemsCountPerPage={recordPerPage}
                                        pageRangeDisplayed={5}
                                    />
                                </div>
                                <div className="col-md-3 col-3"></div>
                            </div> : ""
                        }

                    </div>

                    <div className="col-lg-3">

                        <div className="card mb-3">
                            <button type="button"
                                className="btn btn-success p-3"
                                onClick={askQuestionHandler}

                            >Ask a Question</button>
                        </div>

                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="text-center"><img className="center-block w-25 mb-4" src={logo} /></div>
                                <h5 className="fw-bold">Welcome to the Resiroc!</h5>
                                <p className="text-muted">This is a place to ask property, tenant, tenancy, money, direct debit payments, reports related questions. Feel free to ask anything about resiroc property management system!</p>
                            </div>
                        </div>

                        <div className="mt-4 mb-2" >
                            <h5 className="fw-bold">The Smartest People We Know</h5>
                            <span className="text-decoration-underline">All Time</span>
                            {topRatedUsers.map((user, index) => {
                                return (
                                    <div key={`topRated-${index}`}>
                                        <div className="d-flex align-items-center flex-row mt-4 pb-4 border-bottom">
                                            <div className="col-sm-1 col-1">
                                                <h5>{index + 1}</h5>
                                            </div>
                                            <div className="col-sm-3 col-2">
                                                <Avatar
                                                    src={""}
                                                    alt="R Sharp"
                                                    className="me-2"
                                                />
                                            </div>
                                            <div className="col-sm-8 col-9">
                                                <div className="d-flex flex-row">
                                                    <div className="h6 text-dark me-3 mt-4">{user.name}</div>
                                                </div>
                                                <div className="d-flex flex-row">
                                                    <div className="h6 text-muted me-3">{user.kudos} {user.kudos > 1 ? `points` : 'point'}</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })
                            }
                        </div>

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

export default QuestionsThread;
