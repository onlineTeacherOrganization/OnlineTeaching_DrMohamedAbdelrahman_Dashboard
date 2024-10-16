import React, { Component } from "react";

// css
import "./assets/sass/style.css";

import {createBrowserHistory } from 'history'


// react router dom
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

// import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// component
import SideNav from "./component/SideNav";
import TopHead from "./component/TopHead";

// Pages
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import AddNewSubject from "./pages/AddNewSubject";
import EditSubject from "./pages/EditSubject";
import StudyLectures from "./pages/StudyLectures";
import AddNewStudyLecture from './pages/AddNewStudyLecture';
import AddNewOnlineLecture from './pages/AddNewOnlineLecture';
import OnlineLectures from "./pages/OnlineLectures";
import Levels from "./pages/Levels";
import AddNewLevels from "./pages/AddNewLevels";
import Review from "./pages/Review";
import Settings from "./pages/Setting";
import EditLevel from "./pages/EditLevel";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Students from "./pages/Students";
import EditStudent from "./pages/EditStudent";
import Exams from "./pages/Exams";
import AddNewExam from "./pages/AddNewExam";
import EditExam from "./pages/EditExam";
import AddNewQuestion from "./pages/AddNewQuestion";
import Questions from "./pages/Questions";
import EditQuestion from "./pages/EditQuestion";
import Subscriptions from "./pages/Subscriptions";
import EditStudyLecture from "./pages/EditStudyLecture";
import EditOnlineLecture from './pages/EditOnlineLecture';
import Subscription2 from "./pages/Subscription2";
import ReExamOrders from "./pages/ReExamOrders";
import ReOpenLectures from "./pages/ReopenLectures";
import StudentsGrades from "./pages/studentsGrades";

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});
class App extends Component {

  getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
   
    // const user =  jwt_decode(userToken);
    // var role = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    // if(role == "Admin"){

    // }
    const token =  userToken===null? false:true
    return token;
  }

  

  render() {

    const openMobSideMenu = () => {
      var sidebar = (document.querySelector(".right-sidebar").style.right = 0);
      var mainContent = document.querySelector(".main-content")
      if(mainContent.classList.contains("close2")){
        mainContent.classList.remove("close2");

      } else {
        mainContent.classList.add("close2");

      }
    };

    const closeSideMenue = () => {
      var sidebar = (document.querySelector(".right-sidebar").style.right =
        "-300px");
      var mainContent = document.querySelector(".main-content")
      if(mainContent.classList.contains("close2")){
        mainContent.classList.remove("close2");

      } else {
        mainContent.classList.add("close2");

      }
    };

    const token = this.getToken();
    console.log(token)
    if (!token) {
      return <> <ToastContainer autoClose={5000} theme="colored" /> <Router><Login /></Router> </>
    }
    
    return (
      <>
        <ToastContainer autoClose={5000} theme="colored" />
        <Router>
          <div>
            <SideNav closeSideMenue={closeSideMenue} />
            <TopHead openMobSideMenu={openMobSideMenu} />
            <Switch>
              <Route exact path="/subjects" component={Subjects} />
              <Route exact path="/add-new-subject" component={AddNewSubject} />
              <Route exact path="/edit-subject/:id" component={EditSubject} />
              <Route exact path="/study-lectures" component={StudyLectures} />
              <Route exact path="/add-new-study-lecture" component={AddNewStudyLecture} />
              <Route exact path="/edit-study-lecture/:id" component={EditStudyLecture} />
              <Route exact path="/online-lectures" component={OnlineLectures} />
              <Route exact path="/add-new-online-lecture" component={AddNewOnlineLecture} />
              <Route exact path="/edit-online-lecture/:id" component={EditOnlineLecture} />
              <Route exact path="/levels" component={Levels} />
              <Route exact path="/add-new-level" component={AddNewLevels} />
              <Route exact path="/edit-level/:id" component={EditLevel} />
              <Route exact path="/reviews" component={Review} />
              <Route exact path="/settings" component={Settings} />
              <Route exact path="/students"component={Students} />
              <Route exact path="/studentsGrades"component={StudentsGrades} />
              <Route exact path="/edit-student/:id" component={EditStudent} />
              <Route exact path="/exams" component={Exams} />
              <Route exact path="/add-new-exam" component={AddNewExam} />
              <Route exact path="/edit-exam/:id" component={EditExam} />
              <Route exact path="/questions/:id" component={Questions} />
              <Route exact path="/add-new-question/:id" component={AddNewQuestion} />
              <Route exact path="/edit-question/:exid/:id" component={EditQuestion} />
              <Route exact path="/re-exam-orders" component={ReExamOrders} />
              <Route exact path="/reopenlecture" component={ReOpenLectures} />
              <Route exact path="/subscribtions" component={Subscriptions} />
              <Route exact path="/subscribtions2" component={Subscription2} />
              <Route exact path="/home" component={Dashboard} />
              <Route exact path='*' component={NotFound} />
            </Switch>
          </div>
        </Router>
      </>
    );
  }
}

export default App;
