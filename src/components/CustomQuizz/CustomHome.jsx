import React, { useContext, useState, useRef, useCallback } from "react";
import Header from "../Header.jsx";
import Forms from "./Forms/Forms.jsx";
import BannerBackground from "./home-banner-background.png";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import "./CustomQuizz.css";
import { IconButton } from "@mui/material";
import QuizContext from "./context/QuizContext.js";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from "axios";
import LoginContext from "./context/LoginContext.js";
import Login from "../LoginRegister/Login.jsx";
import { BACK_URL } from "../backend.js";
const CustomHome = () => {
  const [isCreated, setisCreated] = useState(false);
  const [isgetCode, setisgetCode] = useState(false);
  const [quizId, setquizId] = useState('');
  const [iscopied, setisCopied] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [duration, setduration] = useState(0);
  const {form} = useContext(QuizContext);
  const { loginId } = useContext(LoginContext);
  const adminId = loginId !== null ? loginId.adminId: '';
  const quizCodeRef = useRef(null)

  const copyquizCodeToClipboard = useCallback(() => {
    setisCopied(true);
    quizCodeRef.current?.select();
    quizCodeRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(quizId)
  }, [quizId])

  const getQuizCode = () =>{
    var newval = !isgetCode;
    setisgetCode(newval);
    // console.log(quizId)
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth', // Optional: Adds a smooth scrolling effect
    });
  }

  const createQuiz = async() => {
    // console.log(form.questions[0].questionText);
    // const optionss = form.questions.map((ques,i)=>(ques.options.map((op,j)=>op.optionText)))
    // console.log(optionss)
    // const response ={
    //       name: name,
    //       description: desc,
    //       dateCreated: new Date(),
    //       startTime: startTime,
    //       endTime: endTime,
    //       duration: duration,
    //       createdBy: adminId,
    //       attemptedBy: usersId,
    //       questions: form.questions.map((ques,i)=>(
    //         {
    //           questionText: ques.questionText,
    //           questionType: ques.questionType,
    //           options: ques.options.map((op,j)=>op.optionText),
    //           correctAnswer: ques.questionType === 'multiple-choice' || ques.questionType === 'radio' ? ques.answerKey : "",
    //           marks: ques.points
    //         }
    //       ))
    //     }

    //     console.log(response);
    // console.log(loginId);
    if(!name || !startTime || !endTime || !duration){
    window.alert('Some fields are missing');
    return ;
    }
    try{
      const response = await axios.post(`${BACK_URL}/add-quiz`,{
        name: name,
        description: desc,
        dateCreated: new Date(),
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        createdBy: adminId,
        attemptedBy: [],
        questions: form.questions.map((ques,i)=>(
          {
            questionText: ques.questionText,
            questionType: ques.questionType,
            options: ques.options.map((op,j)=>op.optionText),
            correctAnswer: ques.questionType === 'multiple-choice' || ques.questionType === 'true-false' ? ques.answerKey : "",
            marks: ques.points
          }
        ))
      })

      if(response){
        setisCreated(true);
        window.alert('Quiz saved successfully...')
        setquizId(response.data.quizId);
        // console.log('quiz saved successfully...',response.data.quizId);
      }
    }
    catch(error){
      console.log("Some Error Occured during saving the quiz")
    }
  }

  return (
    <div>
      {loginId ? (<div>
      <Header />
      <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
      <div className="custom-mid" >
        <div className="custom-head">
          <div className="one">
            <div className="input1">
              <label>Name </label>
              <input
                className="inp"
                type="text"
                placeholder="Name of Quizz"
                required
                onChange={(event) => setName(event.target.value)}
              />

              <label>Description</label>
              <input
                type="text"
                placeholder="Description of Quizz"
                onChange={(event) => setDesc(event.target.value)}
              />
            </div>
          </div>
          <div className="one">
            <div className="input1">
              <label>Start Time</label>
              <input
                className="inp"
                type="datetime-local"
                required
                onChange={(event) => setstartTime(event.target.value)}
              />

              <label>End Time</label>
              <input
                type="datetime-local"
                required
                onChange={(event) => setendTime(event.target.value)}
              />
            </div>
          </div>
          <div className="one">
            <div className="input1">
              <label>Duration</label>
              <input
                className="inp"
                type="number"
                min="0"
                placeholder="Duration of Quizz"
                required
                onChange={(event) => setduration(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <Forms />

      <div className="custom-final" >
        <div>
          {!isCreated? (<button  className="button-32" role="button" onClick={createQuiz}>
          Create Quiz
        </button>): ""}
          
        {isCreated ?(<button  className="button-32" role="button" onClick={getQuizCode}>
          Get Quiz Code
        </button>): "" }
        
        </div>
        {isgetCode? (<div>
        <input type="text" value={quizId}ref={quizCodeRef} disabled/>
        <IconButton > {!iscopied ? (<ContentCopyIcon onClick={copyquizCodeToClipboard}/>): (<DoneAllIcon />)} </IconButton>
        </div>): ""}
        <div ></div>
      </div>
    </div>) : (<Login />)}
    
    </div>
  );
};

export default CustomHome;
