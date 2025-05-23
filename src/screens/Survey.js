import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig.js';
import './styles/SurveyPage.css';
import AuthContext from '../context/AuthContext.js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FileUpload from '../components/FileUpload.js';

const SurveyPage = () => {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [files, setFiles] = useState([]);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const navigate = useNavigate();
    const { auth, updateUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axiosInstance.get(`/api/surveys/${id}`);
                setSurvey(response.data);

                const initialAnswers = {};
                response.data.questions.forEach(q => {
                    initialAnswers[q._id] = {
                        type: q.type,
                        answer: q.type === 'ranking' ? [...q.options] : ''
                    };
                });

                setAnswers(initialAnswers);
                setSubmissionSuccess(false);
            } catch (error) {
                console.error('Error fetching survey:', error);
            }
        };

        fetchSurvey();
    }, [id]);

    const handleChange = (questionId, value, questionType) => {
        // Update answers
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: { type: questionType, answer: value }
        }));

        // Dynamically update the slider background and value position
        const slider = document.querySelector(`input[type="range"][data-id="${questionId}"]`);
        if (slider) {
            slider.style.setProperty("--value", value);
        }
    };

    const handleFileChange = (file) => {
        setFiles(prevFiles => [...prevFiles, file]);
    };
    // const handleFileChange = (index, file) => {
    //     setFiles(prevFiles => {
    //         const updatedFiles = [...prevFiles];
    //         updatedFiles[index] = file;
    //         return updatedFiles;
    //     });
    // };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const questionId = result.source.droppableId.replace('droppable-', '');

        let currentOptions =
            answers[questionId]?.answer ||
            survey.questions.find(q => q._id === questionId)?.options ||
            [];

        const reorderedOptions = [...currentOptions];
        const [movedOption] = reorderedOptions.splice(result.source.index, 1);
        reorderedOptions.splice(result.destination.index, 0, movedOption);

        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: { type: 'ranking', answer: reorderedOptions },
        }));

        console.log(answers)
    };

    // const handleSubmit = async (e) => {

    //     e.preventDefault();
    //     try {
    //         const formData = new FormData();

    //         // Append all selected files to FormData
    //         for (let i = 0; i < files.length; i++) {
    //             if (files[i]) {
    //                 formData.append('files', files[i]); // Append multiple files
    //             }
    //         }

    //         // Append organization ID
    //         console.log('companyId:', auth.user.organizationId._id);
    //         formData.append('companyId', auth.user.organizationId._id);

    //         // Send all files in a single request
    //         const fileResponse = await axiosInstance.post('/api/files/upload-multiple', formData, {
    //             headers: { 'Content-Type': 'multipart/form-data' },
    //         });

    //         const uploadedFileUrls = fileResponse.data.fileUrls;

    //         // Submit survey along with uploaded file URLs
    //         const surveyData = {
    //             userId: auth.user._id,
    //             surveyId: id,
    //             answers: Object.keys(answers).map(questionId => ({
    //                 type: answers[questionId].type,
    //                 answer: answers[questionId].answer
    //             })),
    //             uploadedFiles: uploadedFileUrls // Store file URLs in survey submission
    //         };

    //         const response = await axiosInstance.post('/api/surveys/submit-survey', surveyData);

    //         console.log(response.data);
    //         updateUser({
    //             ...auth.user,
    //             completedSurveyIndex: survey.order
    //         });
    //         setSubmissionSuccess(true);

    //         const emailContent = `
    //             <div style="padding: 0px">
    //                 <p style="background-color: #e0f7ff; padding: 5px; margin: 0px" ><strong>Name</strong> </p>
    //                 <p style="padding: 2px 2px 2px 15px;"> ${auth.user.name}</p>

    //                 <p style="background-color: #e0f7ff; padding: 5px"><strong>Email</strong> </p>
    //                 <p style="padding: 2px 2px 2px 15px;"> ${auth.user.email}</p>

    //                 <p style="background-color: #e0f7ff; padding: 5px"><strong>Organization</strong> </p>
    //                 <p style="padding: 2px 2px 2px 15px;"> ${auth.company}</p>

    //                 ${surveyData.answers.map(qa => `
    //                     <p style="background-color: #e0f7ff; padding: 5px"><strong>Question:</strong> ${qa.question}</p>
    //                     <p style="padding: 2px 2px 2px 15px;">Answer: ${Array.isArray(qa.answer) ? qa.answer.join(', ') : qa.answer}</p>
    //                 `).join('')}                    
    //             </div>
    //         `;

    //         const emailResponse = await axiosInstance.post('/api/send-email', {
    //             to: auth.user.email,
    //             subject: `Survey Submission: ${survey.title}`,
    //             text: surveyData.answers.map(qa => `Question: ${qa.question}\nAnswer: ${Array.isArray(qa.answer) ? qa.answer.join(', ') : qa.answer}`).join('\n\n'),
    //             html: emailContent
    //         });

    //         console.log('Email sent:', emailResponse.data);

    //     } catch (error) {
    //         console.error('Error submitting survey:', error);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            // Append all selected files
            files.forEach(file => formData.append('files', file));

            // Append other form data
            formData.append('companyId', auth.user.organizationId._id);
            formData.append('userId', auth.user._id);
            formData.append('surveyId', id);
            formData.append('answers', JSON.stringify(Object.keys(answers).map(questionId => ({
                type: answers[questionId].type,
                answer: answers[questionId].answer
            }))));

            // formData.append('answers', Object.keys(answers).map(questionId => ({
            //     type: answers[questionId].type,
            //     answer: answers[questionId].answer
            // })));   
            console.log('formData', formData)

            // Submit everything in one request
            const response = await axiosInstance.post('/api/surveys/submit-with-files-and-email', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log(response.data);
            updateUser({
                ...auth.user,
                completedSurveyIndex: survey.order
            });
            setSubmissionSuccess(true);

        } catch (error) {
            console.error('Error submitting survey:', error);
            alert(error.response?.data?.message || 'Error submitting survey');
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
                        {question.type === 'label' ? (
                            <div className="label-text">
                                <p>{question.question}</p>
                            </div>
                        ) : (
                            <>
                                <label>{question.question}</label>
                                {question.subText && <p>{question.subText}</p>}
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
                                {question.type === 'scale' && (
                                    <div className="scale-question">
                                        <div className="slider-container">
                                            <span className="slider-value" style={{ left: `${((answers[question._id]?.answer || 5) - 1) * 11.11}%`, transform: 'translateX(-50%)' }}>
                                                {answers[question._id]?.answer || 5}
                                            </span>
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={answers[question._id]?.answer || 5}
                                                onChange={(e) => handleChange(question._id, parseInt(e.target.value, 10), question.type)}
                                                className="slider"
                                                style={{
                                                    '--slider-value': `${((answers[question._id]?.answer || 5) - 1) * 11.11}%`,
                                                    background: `linear-gradient(to right, #00bcd4 ${((answers[question._id]?.answer || 5) - 1) * 11.11}%, #e0e0e0 ${((answers[question._id]?.answer || 5) - 1) * 11.11}%)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {question.type === 'ranking' && (
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId={`droppable-${question._id}`}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.droppableProps} className="ranking-container">
                                                    {(answers[question._id]?.answer || question.options).map((option, idx) => (
                                                        <Draggable key={`${question._id}-${idx}`} draggableId={`${question._id}-${idx}`} index={idx}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="ranking-item"
                                                                >
                                                                    {option}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                )}
                                {question.type === 'files' && (
                                    <div className="file-upload-section">
                                        {[0, 1, 2].map((index) => (
                                            <div key={index} className="file-upload-column">
                                                <label>Upload File {index + 1}</label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e.target.files[0])}
                                                />
                                                {files[index] && <p>{files[index].name}</p>}
                                            </div>
                                        ))}
                                    </div>)}

                            </>
                        )}
                        {question.type === 'conditional file' && (
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        name={question._id}
                                        value="Yes"
                                        checked={answers[question._id]?.answer === "Yes"}
                                        onChange={(e) => handleChange(question._id, e.target.value, question.type)}
                                    />
                                    <label>Yes</label>

                                    <input
                                        type="radio"
                                        name={question._id}
                                        value="No"
                                        checked={answers[question._id]?.answer === "No"}
                                        onChange={(e) => handleChange(question._id, e.target.value, question.type)}
                                    />
                                    <label>No</label>
                                </div>

                                {/* Show file upload only if "Yes" is selected */}
                                {answers[question._id]?.answer === "Yes" && (
                                    <>
                                        {question.conditionalText && <p>{question.conditionalText}</p>}
                                        <div className="file-upload-section">

                                            <div key={index} className="file-upload-column">
                                                <label>Upload File: </label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e.target.files[0])}
                                                />
                                                {files[index] && <p>{files[index].name}</p>}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}



                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SurveyPage;
