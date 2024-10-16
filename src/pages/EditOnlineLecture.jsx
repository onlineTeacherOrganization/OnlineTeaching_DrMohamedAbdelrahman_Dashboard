import axios from "axios";
import React, { Component } from "react";

import Select from "react-select";
import { toast } from "react-toastify";
import joi from "joi-browser";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

class AddNewLecture extends Component {
    state = {
        id: 0,
        name: "",
        subjectId: "",
        lectureLink: "",
        // fileLink: "",
        description: "",
        dateTime: "",
        date: "",
        time: "",
        subjectName: "",
        errors: {},
        allSubjects: [],
        loadintable: true,
        today: null,
    };

    schema = {
        name: joi.string().required(),
        subjectId: joi.number().required(),
        lectureLink: joi.string().required(),
        description: joi.string().required(),
        // fileLink: joi.string().required(),
        date: joi.string().required(),
        time: joi.string().required(),
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
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var todayFormatted = "" + year + "-" + (month <= 9 ? "0" + month : month) + "-" + (day <= 9 ? "0" + day : day);
        this.setState({ today: todayFormatted });
        const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        axios
            .get(`${baseUrl}api/Subjects`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        allSubjects: res.data.items,
                        loadintable: false,
                    });
                }
            })
            .catch((er) => {
                console.log(er);
            });

        const lecureid = this.props.match.params.id;
        axios
            .get(`${baseUrl}api/OnlineLectures/GetByAdmin/${lecureid}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        id: res.data.id,
                        name: res.data.name,
                        lectureLink: res.data.lectureLink,
                        description: res.data.description,
                        dateTime: res.data.dateTime,
                        subjectName: res.data.subject.name,
                        subjectId: res.data.subject.id,
                        date: res.data.dateTime.split("T")[0],
                        time: res.data.dateTime.split("T")[1],
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    validate = () => {
        let state = { ...this.state };
        delete state.errors;
        delete state.id;
        delete state.allSubjects;
        delete state.dateTime;
        delete state.loadintable;
        delete state.subjectName;
        delete state.today;
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

    render() {
        const handelChange = (e) => {
            this.setState({
                [e.target.name]: e.target.value,
            });
        };

        const submitForm = (e) => {
            e.preventDefault();
            this.setState({
                loadintable: true,
            });
            const errors = this.validate();
            const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
            const lecureid = this.props.match.params.id;

            if (errors == null) {
                const state = { ...this.state };
                state.dateTime = state.date + "T" + state.time + "Z";
                delete state.errors;
                delete state.allSubjects;
                delete state.loadintable;
                delete state.subjectName;
                delete state.date;
                delete state.time;

                axios
                    .put(`${baseUrl}api/OnlineLectures/${lecureid}`, state, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((res) => {
                        if (res.status == 200) {
                            this.setState({
                                loadintable: false,
                            });
                            toast.success("تم التعديل بنجاح");
                            this.props.history.replace("/online-lectures");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        if (error.response.status === 400) {
                            if (error.response.data.errors != null) {
                                var tifs = error.response.data.errors;
                                Object.keys(tifs).map(function (key) {
                                    toast.error(`${tifs[key]}`);
                                });
                            }
                            this.setState({
                                loadintable: false,
                            });
                        }
                    });
            } else {
                toast.error("هناك اخطاء");
                this.setState({
                    loadintable: false,
                });
            }
        };

        const handelSelect = (value, action) => {
            this.setState({
                [action.name]: value.value,
            });
        };

        const options = this.state.allSubjects.map((sub) => ({
            value: sub.id,
            label: sub.name,
        }));

        const { name, subjectId, lectureLink, description, date, time, errors, loadintable, subjectName } = this.state;
        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>تعديل المحاضرة المباشرة {name}</h5>
                </div>

                <div className="dashboard-content">
                    <div className="dasboard-box">
                        <form action="" onSubmit={submitForm} className="formStyle">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="courseName">اسم المحاضرة</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="courseName"
                                            className="form-control"
                                            placeholder="مثال:محاضرة شرح الجبر"
                                            value={name}
                                            onChange={handelChange}
                                        />
                                        <span className="er">{errors.name}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="courseSubject">المادة التابعه لها</label>
                                        <Select
                                            // value={selectedOption}
                                            name="subjectId"
                                            onChange={handelSelect}
                                            options={options}
                                            placeholder={subjectName}
                                            // seleced = {subjectId}
                                            id="courseSubject"
                                        />
                                        <span className="er">{errors.subjectId}</span>
                                    </div>
                                </div>
                                {/* <div className="col-sm-12 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="courseFree">هل المحاضرة</label>
                    <select name="" id="courseFree" className="form-control">
                      <option value="free">مجانية</option>
                      <option value="paid">مدفوعة</option>
                    </select>
                  </div>
                </div> */}
                                <div className="col-sm-12 col-md-3 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="courseLiveLink">ادخل لينك المحاضرة</label>
                                        <input
                                            type="text"
                                            name="lectureLink"
                                            id=""
                                            onChange={handelChange}
                                            value={lectureLink}
                                            className="form-control"
                                            placeholder="ادخال لينك المحاضرة"
                                        />
                                        <span className="er">{errors.lectureLink}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="courseLiveDate">ادخل تاريخ المحاضرة</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={date}
                                            onChange={handelChange}
                                            min={this.state.today}
                                            id=""
                                            className="form-control"
                                            placeholder="ادخال لينك المحاضرة"
                                        />
                                        <span className="er">{errors.date}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="courseLiveDate">ادخل وقت المحاضرة</label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={time}
                                            onChange={handelChange}
                                            id=""
                                            className="form-control"
                                            placeholder="ادخال لينك المحاضرة"
                                        />
                                        <span className="er">{errors.time}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-12">
                                    <div className="form-group">
                                        <label htmlFor="coursrDetails">تفاصيل المحاضرة</label>
                                        <textarea
                                            name="description"
                                            onChange={handelChange}
                                            value={description}
                                            id="coursrDetails"
                                            placeholder="تفاصيل المحاضرة"
                                            className="form-control"
                                        ></textarea>
                                        <span className="er">{errors.description}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="btn-submit">
                                        <button className="btn" type="submit">
                                            تعديل
                                        </button>
                                        <button
                                            className="btn btn-warning bg-warning ml-3"
                                            onClick={() => {
                                                this.props.history.replace("/online-lectures");
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
                                <div className="sp sp-volume"></div>
                                <h5>برجاء الانتظار</h5>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default AddNewLecture;
