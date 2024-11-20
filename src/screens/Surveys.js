import React from 'react';
import SurveyList from '../components/SurveyList.js';
import './styles/SurveysPage.css';

const Surveys = () => {
  return (
    <div>
      <div className="hero">
        <h1>Brand Strategy Process</h1>
        <p>Our brand strategy process is designed to establish the most important and foundational core messaging your organization will use to describe who you are, what you do, and, most importantly, why you do it. <br/><br/>
          When completed, your brand strategy will serve as the filter through which all of your internal and external content and messaging flows, regardless of the medium. It will also serve as an essential resource for vetting and onboarding future board and staff members, to ensure alignment around the key messaging that describes your work.<br/><br/>
          Please invest quality time completing the questionnaires for each section listed below and our team will gather the information and make suggestions based on your responses.</p>
      </div>

      <SurveyList />
    </div>
  );
};

export default Surveys;