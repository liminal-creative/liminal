import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/SurveyPage.css';
import AuthContext from '../context/AuthContext.js';

const SurveyPage = () => {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const navigate = useNavigate();
    const { auth, updateUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(`/api/surveys/${id}`);
                setSurvey(response.data);
                // Reset submission success when a new survey is loaded
                setSubmissionSuccess(false);
                setAnswers({});
            } catch (error) {
                console.error('Error fetching survey:', error);
            }
        };

        fetchSurvey();
    }, [id]);
    
    const handleChange = (questionId, value, questionType) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: { type: questionType, answer: value }
        }));
    };

    const handleSubmit = async (e) => {

        const surveyData = { //NEW
            userId: auth.user._id,
            surveyId: id,
            answers: Object.keys(answers).map((questionId, index) => ({
                question: survey.questions[index].question,
                answer: answers[questionId].answer
            }))
        };


        e.preventDefault();
        try {
            const response = await axios.post('/api/surveys/submit-survey', {
                userId: auth.user._id,
                surveyId: id,
                answers: Object.keys(answers).map(questionId => ({
                    type: answers[questionId].type,
                    answer: answers[questionId].answer
                }))
            });
            console.log(response.data);
            updateUser({
                ...auth.user,
                completedSurveyIndex: survey.order
            });
            setSubmissionSuccess(true);

            const emailContent = `
                <div style="padding: 0px">
                    <p style="background-color: #e0f7ff; padding: 5px; margin: 0px" ><strong>Name</strong> </p>
                    <p style="padding: 2px 2px 2px 15px;"> ${auth.user.name}</p>
                    
                    <p style="background-color: #e0f7ff; padding: 5px"><strong>Email</strong> </p>
                    <p style="padding: 2px 2px 2px 15px;"> ${auth.user.email}</p>
                    
                    <p style="background-color: #e0f7ff; padding: 5px"><strong>Organization</strong> </p>
                    <p style="padding: 2px 2px 2px 15px;"> ${auth.company}</p>
                    
                    ${surveyData.answers.map(qa => `
                    <p style="background-color: #e0f7ff; padding: 5px"><strong>Question:</strong> ${qa.question}</p>
                    <p style="padding: 2px 2px 2px 15px;">Answer: ${qa.answer}</p>
                    `).join('')}
                </div>
            `;


            // Send survey content via email
            const emailResponse = await axios.post('/api/send-email', {
                to: 'stephanie@meetliminal.com',
                subject: `Survey Submission: ${survey.title}`,
                text: surveyData.answers.map(qa => `Question: ${qa.question}\nAnswer: ${qa.answer}`).join('\n\n'),
                html: emailContent
            });

            console.log('Email sent:', emailResponse.data);

        } catch (error) {
            console.error('Error submitting survey:', error);
        }
    };

    const handleNextSurvey = () => {
        if (survey.nextSurvey) {
            navigate(`/survey/${survey.nextSurvey}`);
        }
    };

    if (!survey) {
        return <div>Loading...</div>;
    }

    if (submissionSuccess) {
        return (
            <div className="survey-page">
                <h1>Thank you for completing this survey</h1>
                <div className="checkmark">&#10003;</div>
                <div className="navigation-buttons">
                    <button onClick={() => navigate('/surveys')}>&larr; Back to surveys</button>
                    {survey.nextSurvey && (
                        <button onClick={handleNextSurvey}>Next survey &rarr;</button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="survey-page">
            <h1>{survey.title} Questionnaire</h1>
            <form onSubmit={handleSubmit}>
                {survey.questions.map((question, index) => (
                    <div key={index} className="question">
                        <label>{question.question}</label>
                        {question.type === 'short answer' && (
                            <input
                                type="text"
                                value={answers[question._id]?.answer || ''}
                                onChange={(e) => handleChange(question._id, e.target.value, question.type)}
                            />
                        )}
                        {question.type === 'long answer' && (
                            <textarea
                                value={answers[question._id]?.answer || ''}
                                onChange={(e) => handleChange(question._id, e.target.value, question.type)}
                            />
                        )}
                        {question.type === 'multiple choice' && question.options.map((option, idx) => (
                            <div key={idx}>
                                <input
                                    type="radio"
                                    name={question._id}
                                    value={option}
                                    checked={answers[question._id]?.answer === option}
                                    onChange={(e) => handleChange(question._id, e.target.value, question.type)}
                                />
                                <label>{option}</label>
                            </div>
                        ))}
                        {question.type === 'radio' && question.options.map((option, idx) => (
                            <div key={idx}>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={answers[question._id]?.answer?.includes(option) || false}
                                    onChange={(e) => {
                                        const currentAnswers = answers[question._id]?.answer || [];
                                        if (currentAnswers.includes(option)) {
                                            handleChange(question._id, currentAnswers.filter(a => a !== option), question.type);
                                        } else {
                                            handleChange(question._id, [...currentAnswers, option], question.type);
                                        }
                                    }}
                                />
                                <label>{option}</label>
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SurveyPage;
