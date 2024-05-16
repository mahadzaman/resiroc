import React from "react";
import { Routes, Route } from "react-router-dom";
import ForumHeader from "./component/header";
import '../../forum.css';
import QuestionsThread from './component/questions-thread';
import CreateQuestion from './component/create-question';
import QuestionDetail from './component/question-detail';
import ForumContextProvider from "../../context/forum-context";
import ErrorPage from '../../pages/error-page'

const Forum = () => {

    return (
        <>
            <title>Resiroc | Forum</title>
            <ForumContextProvider>
                <ForumHeader />
                <Routes>
                    <Route exact path="/questions" element={             
                        <QuestionsThread />
                    } />
                    <Route exact path="/create/question" element={
                        <CreateQuestion />
                    }>
                    </Route>
                    <Route exact path="/question/:id" element={ 
                        <QuestionDetail />
                    } />
                     <Route path="*" element={<ErrorPage />} />
                </Routes>
            </ForumContextProvider>

        </>
    );
};

export default Forum;
