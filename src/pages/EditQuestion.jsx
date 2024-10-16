import React, { Component } from "react";

import axios from "axios";
import Select from "react-select";
import joi from "joi-browser";
import { toast } from "react-toastify";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

export default class EditQuestion extends Component {
  state = {
    id: "",
    description: "",
    oneAnswer: "",
    secondAnswer: "",
    thirdAnswer: "",
    fourthAnswer: "",
    correctAnswer: "0",
    FormFile: null,
    FileName: null,
    File: "",
    loadintable: false,
    examID: "",
    errors: {},
    questionNumber: 0,
  };

  schema = {
    description: joi.string().required(),
    oneAnswer: joi.string().required(),
    secondAnswer: joi.string().required(),
    thirdAnswer: joi.string().required(),
    fourthAnswer: joi.string().required(),
    correctAnswer: joi.string().alphanum().min(1).max(1).required(),
    FormFile: joi.any(),
    FileName: joi.any(),
  };

  componentDidMount() {
    if (
      sessionStorage.getItem("token") != null ||
      sessionStorage.getItem("token") != undefined
    ) {
      const user = jwt_decode(sessionStorage.getItem("token"));

      const userRole =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const userEmail =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
      const userName =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
      const userIdentifier =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
      const userRoleRes = user[`${userRole}`];
      const userEmailRes = user[`${userEmail}`];
      const userNameRes = user[`${userName}`];
      const userIDRes = user[`${userIdentifier}`];

      if (
        userRoleRes === "Admin"
      ) {
      } else {
        sessionStorage.clear();
        this.props.history.push("/");
        window.location.reload();
      }
    }
    this.setState({
      loadintable: true,
    });
    const URL_PASE = "https://localhost:44334/api/";

    const questionId = this.props.match.params.id;
    this.setState({ questionNumber: questionId });
    const examid = this.props.match.params.exid;
    axios
      .get(`${baseUrl}api/Questions/` + questionId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status == 200) {
          this.setState({
            loadintable: false,
            description: res.data.description,
            oneAnswer: res.data.oneAnswer,
            secondAnswer: res.data.secondAnswer,
            thirdAnswer: res.data.thirdAnswer,
            fourthAnswer: res.data.fourthAnswer,
            correctAnswer: res.data.correctAnswer,
            FormFile: res.data.formFile,
            File: res.data.file,
            id: res.data.id,
            examID: examid,
          });
        }
      })
      .catch((er) => {
        console.log(er);
      });
  }

  validate = () => {
    let state = { ...this.state };
    delete state.errors;
    delete state.loadintable;
    delete state.id;
    delete state.examID;
    delete state.questionNumber;
    delete state.File;
    const res = joi.validate(state, this.schema, { abortEarly: false });

    if (res.error === null) {
      this.setState({
        errors: {},
      });
      return res.error;
    }

    let newError = {};
    res.error.details.map((er) => {
      er.message = "هذا الحقل مطلوب";
      newError[er.path] = er.message;
    });
    this.setState({
      errors: newError,
    });

    return res.error;
  };

  setFile(e) {
    this.setState({ FormFile: e.target.files[0] });
  }

  render() {
    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    const selectChange = (value, action) => {
      this.setState({
        [action.name]: value.value,
      });
    };

    const submitForm = (e) => {
      e.preventDefault();

      this.setState({
        loadintable: true,
      });

      const examid = this.props.match.params.exid;
      const errors = this.validate();

      if (errors === null) {
        const URL_PASE = "https://localhost:44334/api/";
        const state = { ...this.state };
        delete state.loadintable;
        delete state.errors;
        state.examID = parseInt(state.examID);
        const questionId = this.props.match.params.id;

        const editedQuestionViewModel = new FormData();
        editedQuestionViewModel.append("correctAnswer", state.correctAnswer);
        editedQuestionViewModel.append("description", state.description);
        editedQuestionViewModel.append("ExamID", state.examID);
        editedQuestionViewModel.append("fourthAnswer", state.fourthAnswer);
        editedQuestionViewModel.append("oneAnswer", state.oneAnswer);
        editedQuestionViewModel.append("secondAnswer", state.secondAnswer);
        editedQuestionViewModel.append("thirdAnswer", state.thirdAnswer);
        editedQuestionViewModel.append("FormFile", state.FormFile);
        editedQuestionViewModel.append("FileName", "");
        editedQuestionViewModel.append("ID", questionId);

        axios
          .put(
            `${baseUrl}api/Questions/` + questionId,
            editedQuestionViewModel,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              this.setState({
                loadintable: false,
                description: "",
                oneAnswer: "",
                secondAnswer: "",
                thirdAnswer: "",
                fourthAnswer: "",
                correctAnswer: "",
              });
              toast.success("تم التعديل بنجاح");
              this.props.history.push("/questions/" + examid);
            }
          })
          .catch((error) => {
            toast.error(error.response.data.message);
            if (error.response.status === 400) {
              var tifs = error.response.data.errors;

              if (tifs != null) {
                Object.keys(tifs).map(function (key) {
                  toast.error(`${tifs[key]}`);
                });
              } else {
                toast.error("تاكد من البيانات");
              }
              this.setState({
                loadintable: false,
              });
            }
          });
      } else {
        toast.error(`هناك بعض الاخطاء`);
        this.setState({
          loadintable: false,
        });
      }
    };

    const {
      description,
      oneAnswer,
      secondAnswer,
      thirdAnswer,
      fourthAnswer,
      correctAnswer,
      examID,
      loadintable,
      errors,
      File,
      questionNumber,
    } = this.state;
    const questionId = this.props.match.params.id;
    const examid = this.props.match.params.exid;

    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>تعديل السؤال رقم {questionNumber}</h5>
        </div>
        <div className="dashboard-content">
          <div className="dasboard-box">
            <form action="" onSubmit={submitForm} className="formStyle">
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-12">
                  <div className="form-group">
                    <label htmlFor="Qdescription">وصف السؤال</label>
                    <textarea
                      type="text"
                      name="description"
                      value={description}
                      onChange={handelChange}
                      id="Qdescription"
                      className="form-control"
                      placeholder="وصف السؤال"
                    ></textarea>
                    <span className="er">{errors.description}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="QAn1">الجواب الاول</label>
                    <input
                      type="text"
                      name="oneAnswer"
                      value={oneAnswer}
                      onChange={handelChange}
                      id="QAn1"
                      className={`form-control ${
                        correctAnswer == 1 ? "correctA" : null
                      }`}
                      placeholder="الجواب الاول"
                    />
                    <span className="er">{errors.oneAnswer}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="QAn2">الجواب الثاني</label>
                    <input
                      type="text"
                      name="secondAnswer"
                      value={secondAnswer}
                      onChange={handelChange}
                      id="QAn2"
                      className={`form-control ${
                        correctAnswer == 2 ? "correctA" : null
                      }`}
                      placeholder="الجواب الثاني"
                    />
                    <span className="er">{errors.secondAnswer}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="QAn3">الجواب الثالث</label>
                    <input
                      type="text"
                      name="thirdAnswer"
                      value={thirdAnswer}
                      onChange={handelChange}
                      id="QAn3"
                      className={`form-control ${
                        correctAnswer == 3 ? "correctA" : null
                      }`}
                      placeholder="الجواب الثالث"
                    />
                    <span className="er">{errors.thirdAnswer}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="QAn4">الجواب الرابع</label>
                    <input
                      type="text"
                      name="fourthAnswer"
                      value={fourthAnswer}
                      onChange={handelChange}
                      id="QAn4"
                      className={`form-control ${
                        correctAnswer == 4 ? "correctA" : null
                      }`}
                      placeholder="الجواب الرابع"
                    />
                    <span className="er">{errors.fourthAnswer}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="quesImage">تعديل صورة السؤال</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => this.setFile(e)}
                      name="quesImage"
                      id="quesImage"
                      className="form-control"
                    />
                    <span>{File}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 mx-auto">
                  <div className="form-group">
                    <label htmlFor="QAcorrect">رقم الجواب االصحيح</label>
                    <input
                      type="number"
                      name="correctAnswer"
                      value={correctAnswer}
                      onChange={handelChange}
                      id="QAcorrect"
                      className="form-control"
                      placeholder="رقم الجواب الصحيح"
                    />
                    <span className="er">{errors.correctAnswer}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="btn-submit">
                    <button className="btn">تعديل</button>
                    <button
                      className="btn btn-warning bg-warning ml-3"
                      onClick={() => {
                        this.props.history.replace("/questions/" + examid);
                      }}
                    >
                      الغاء
                    </button>
                  </div>
                </div>
              </div>
            </form>
            {loadintable ? (
              <div className="loading-par">
                <div class="sp sp-volume"></div>
                <h5>برجاء الانتظار</h5>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
