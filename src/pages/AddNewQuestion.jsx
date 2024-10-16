import React, { Component } from "react";

import axios from "axios";
import Select from "react-select";
import joi from "joi-browser";
import { toast, tost } from "react-toastify";
import GetUserToken from "../component/GetUserToken";
import "mathlive";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

export default class AddNewQuestion extends Component {
    state = {
        description: "",
        oneAnswer: "",
        secondAnswer: "",
        thirdAnswer: "",
        fourthAnswer: "",
        correctAnswer: "",
        FormFile: null,
        FileName: null,
        examID: 0,
        allExams: [],
        loadintable: false,
        errors: {},
        questionNumberToBeAdded: 0,
        questionWithEquation: "",
        mfOpen: true,
    };

    schema = {
        // description: joi.string().required(),
        oneAnswer: joi.string().required(),
        secondAnswer: joi.string().required(),
        thirdAnswer: joi.string().required(),
        fourthAnswer: joi.string().required(),
        correctAnswer: joi.string().required(),
        examID: joi.number().required(),
        FormFile: joi.any(),
        FileName: joi.any(),
    };

    componentDidMount() {
        if (sessionStorage.getItem("token") != null || sessionStorage.getItem("token") != undefined) {
            const user = jwt_decode(sessionStorage.getItem("token"));

            const userRole = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
            const userEmail = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
            const userName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
            const userIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
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
        var mathField = document.getElementById("mf");
        mathField.setOptions({ mathModeSpace: "\\:" });
        var textbox = document.getElementById("textbox");
        mathField.addEventListener("input", (e) => {
            textbox.value = mathField.value;
            this.setState({ questionWithEquation: textbox.value });
        });

        let prev_val = textbox.value;
        let prev = prev_val.length;
        textbox.addEventListener("input", (e) => {
            let new_len = e.target.value.length;
            let dif = new_len - prev;
            if (dif > 2) {
                e.target.value = e.target.value.replaceAll(" ", "\\:");
                mathField.value = e.target.value;
            } else {
                prev = new_len;
            }
            prev_val = e.target.value;
        });

        this.setState({
            loadintable: true,
        });
        const examid = this.props.match.params.id;
        axios
            .get(`${baseUrl}api/Exams/` + examid, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                this.setState({
                    questionNumberToBeAdded: res.data.questions.length + 1,
                });
            })
            .catch((error) => {
                console.log(error);
            });
        // const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        const URL_PASE = "https://localhost:44334/api/";
        axios
            .get(`${baseUrl}api/Exams`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        loadintable: false,
                        allExams: res.data.items,
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
        delete state.allExams;
        delete state.description;
        delete state.questionNumberToBeAdded;
        delete state.questionWithEquation;
        delete state.mfOpen;
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

    handleMathFieldChange(e) {
        var mathField = document.getElementById("mf");
        if (e.nativeEvent.data === " ") {
            mathField.value = mathField.value + "\\:";
        }
        if (e.target.value === "") {
            this.setState({ questionWithEquation: e.target.value });
            document.getElementById("mf").value = e.target.value;
        } else {
            document.getElementById("mf").value = e.target.value;
        }
    }

    handleToggleTextbox(e) {
        e.preventDefault();
        var mathField = document.getElementById("mf");
        var textbox = document.getElementById("textbox");
        if (mathField.style.display === "none") {
            mathField.style.display = "block";
            textbox.style.display = "none";
            this.setState({ mfOpen: true });
        } else {
            mathField.style.display = "none";
            textbox.style.display = "block";
            this.setState({ mfOpen: false });
        }
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

        const examid = this.props.match.params.id;

        const submitForm = (e) => {
            e.preventDefault();

            let x = document.getElementById("mf").value;

            this.setState({
                loadintable: true,
            });

            const errors = this.validate();
            if (errors === null) {
                // const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
                const URL_PASE = "https://localhost:44334/api/";
                const state = { ...this.state };
                delete state.loadintable;
                delete state.allExams;
                delete state.errors;
                state.examID = examid;

                state.description = x;

                const addedQuestionViewModel = new FormData();

                addedQuestionViewModel.append("correctAnswer", this.state.correctAnswer);
                addedQuestionViewModel.append("description", state.description);
                addedQuestionViewModel.append("ExamID", state.examID);
                addedQuestionViewModel.append("fourthAnswer", state.fourthAnswer);
                addedQuestionViewModel.append("oneAnswer", state.oneAnswer);
                addedQuestionViewModel.append("secondAnswer", state.secondAnswer);
                addedQuestionViewModel.append("thirdAnswer", state.thirdAnswer);
                addedQuestionViewModel.append("FormFile", state.FormFile);
                addedQuestionViewModel.append("FileName", "");

                axios
                    .post(`${baseUrl}api/Questions`, addedQuestionViewModel, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((res) => {
                        if (res.status == 200) {
                            this.setState({
                                loadintable: false,
                                description: "",
                                oneAnswer: "",
                                secondAnswer: "",
                                thirdAnswer: "",
                                fourthAnswer: "",
                                // examID: 0,
                                correctAnswer: "",
                            });

                            toast.success("تم الاضافه بنجاح");
                            this.props.history.replace(`/questions/${examid}`);
                        }
                    })
                    .catch((er) => {
                        console.log(er);
                        toast.error(`هناك بعض الاخطاء`);
                        this.setState({
                            loadintable: false,
                        });
                    });
            } else {
                toast.error(`هناك بعض الاخطاء`);
                this.setState({
                    loadintable: false,
                });
            }
        };

        const options = this.state.allExams.map((exam) => ({
            value: exam.id,
            label: exam.name,
        }));

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
            questionNumberToBeAdded,
        } = this.state;
        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5> أضافة سؤال رقم {questionNumberToBeAdded}</h5>
                </div>
                <div className="dashboard-content">
                    <div className="dasboard-box">
                        <form action="" onSubmit={submitForm} className="formStyle">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 col-lg-12">
                                    <div className="form-group">
                                        <math-field id="mf" virtual-keyboard-mode="manual"></math-field>
                                        <textarea
                                            id="textbox"
                                            type="text"
                                            onChange={(e) => this.handleMathFieldChange(e)}
                                        />
                                    </div>

                                    {/* <div className="form-group">
                    <label htmlFor="Qdescription">وصف السؤال</label>
                    <textarea type="text" name="description" value={description} onChange={handelChange} id="Qdescription" className="form-control" placeholder="وصف السؤال"></textarea>
                    <span className="er">{errors.description}</span>
                  </div> */}
                                </div>

                                <div className="col-sm-12 col-md-6 col-lg-12">
                                    <div className="btn-submit">
                                        <button
                                            className="btn  "
                                            style={{ marginBottom: 10 + "px" }}
                                            onClick={(e) => this.handleToggleTextbox(e)}
                                        >
                                            {this.state.mfOpen ? "العربى" : "المعادلات"}
                                        </button>
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
                                            className="form-control"
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
                                            className="form-control"
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
                                            className="form-control"
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
                                            className="form-control"
                                            placeholder="الجواب الرابع"
                                        />
                                        <span className="er">{errors.fourthAnswer}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="QAcorrect">رقم الجواب االصحيح</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="4"
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
                                <div className="col-sm-12 col-md-6 col-lg-6" style={{ display: "none" }}>
                                    <div className="form-group">
                                        <label htmlFor="EXID">الامتحان</label>
                                        <Select
                                            options={options}
                                            placeholder={examid}
                                            name="examID"
                                            onChange={selectChange}
                                        />
                                        <span className="er">{errors.examID}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="quesImage">أضافة صورة للسؤال</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => this.setFile(e)}
                                            name="quesImage"
                                            id="quesImage"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="btn-submit">
                                        <button className="btn">اضافة</button>
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
