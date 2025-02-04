import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
import axiosInstance from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import './styles/SurveyList.css';  // Import your CSS file for styling
import AuthContext from '../context/AuthContext.js';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await axiosInstance.get('/api/surveys');
                setSurveys(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching surveys:', error);
            }
        };
        fetchSurveys();
    }, []);
    if (!auth || !auth.user) {
        return <div>Loading...</div>;
    }

    const { user } = auth;
    console.log('user', user);

    const handleComplete = (order) => {
        navigate(`/survey/${order}`);
    };

    const groupSurveys = (surveys) => {
        const parts = [];
        const surveysPerPart = 4;

        for (let i = 0; i < surveys.length; i += surveysPerPart) {
            parts.push(surveys.slice(i, i + surveysPerPart));
        }

        return parts;
    };

    const groupedSurveys = groupSurveys(surveys);

    return (
        <div className="survey-list">
            {groupedSurveys.map((part, partIndex) => (
                <div key={partIndex} className="survey-part">
                    <h1>Part {partIndex + 1}</h1>
                    <hr className="yellow-line" />
                    <div className="survey-grid">
                    {part.map((survey, index) => (
                        <div className="survey-card" key={index}>
                            <h2>{survey.title}</h2>
                            <p>{survey.description}</p>
                            {user.completedSurveyIndex + 1 === survey.order ? (
                                <button className="list-btn"onClick={() => handleComplete(survey._id)}>Complete Questionnaire</button>
                            ) : null}
                            {user.completedSurveyIndex + 1 > survey.order ? (
                                <button disabled className="disabled_btn list-btn">Questionnaire Completed</button>
                            ) : null}
                            {/* {user.completedSurveyIndex + 1 < survey.order ? (
                                <button disabled class="disabled_btn">Please Complete Previous Survey</button>
                            ) : null} */}
                        </div>
                    ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SurveyList;