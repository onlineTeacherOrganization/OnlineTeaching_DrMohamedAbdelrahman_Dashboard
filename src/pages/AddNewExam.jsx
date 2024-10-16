import React, { Component } from "react";

import Select from "react-select";

import axios from "axios";
import { toast } from "react-toastify";
import joi from "joi-browser";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";

const token = GetUserToken();

export default class AddNewExam extends Component {
    state = {
        id: 0,
        name: "",
        degree: "",
        duration: "",
        lectureID: "",
        loadintable: false,
        dateAndExamminationExpireTime: "",
        date: "",
        time: "",
        errors: {},
        eaxamType: null,
        allLectures: [],
        todayy: null,
    };

    schema = {
        name: joi.string().required(),
        degree: joi.string().required(),
        eaxamType: joi.string().required(),
        duration: joi.string().required(),
        date: joi.string().required(),
        time: joi.string().required(),
        lectureID: joi.required(),
        todayy: joi.string(),
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
        const URL_PASE = "https://localhost:44334/api/";
        // const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        axios
            .get(`${baseUrl}api/StudyLectures?size=1111`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        allLectures: res.data.items,
                        loadintable: false,
                    });
                }
            })
            .catch((er) => {
                console.log(er);
            });

        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var todayFormatted = "" + year + "-" + (month <= 9 ? "0" + month : month) + "-" + (day <= 9 ? "0" + day : day);

        this.setState({ todayy: todayFormatted });
    }

    validate = () => {
        let state = { ...this.state };
        delete state.errors;
        delete state.loadintable;
        delete state.id;
        delete state.allLectures;
        delete state.dateAndExamminationExpireTime;
        const res = joi.validate(state, this.schema, { abortEarly: false });

        if (res.error === null) {
            this.setState({
                errors: {},
            });

            return res.error;
        } else {
            console.log(res);
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

        const selectHandelChange = (value, action) => {
            // console.log(action);
            this.setState({
                [action.name]: value.value,
            });
        };

        const options = this.state.allLectures.map((sub) => ({
            value: sub.id,
            label: sub.name,
        }));

        const options2 = [
            { value: "0", label: "عادى" },
            { value: "1", label: "مراجعة" },
        ];

        const formSubmit = (e) => {
            e.preventDefault();

            e.preventDefault();
            this.setState({
                loadintable: true,
            });
            const errors = this.validate();
            // console.log(this.state);
            if (errors === null) {
                const token = GetUserToken();
                // const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
                const URL_PASE = "https://localhost:44334/api/";
                const state = { ...this.state };
                // console.log(state);
                state.dateAndExamminationExpireTime = state.date + "T" + state.time + "Z";
                state.lectureID = parseInt(state.lectureID);
                state.degree = parseInt(state.degree);
                state.duration = parseInt(state.duration);
                state.eaxamType = parseInt(state.eaxamType);
                delete state.loadintable;
                delete state.date;
                delete state.time;
                delete state.errors;

                axios
                    .post(`${baseUrl}api/Exams`, state, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((res) => {
                        toast.success(`تمت الاضافه بنجاح`);
                        this.setState({
                            loadintable: false,
                        });
                        if (res.status === 200) {
                            // console.log(res.data.id);
                            this.props.history.replace("/add-new-question/" + res.data.id);
                        }
                    })
                    .catch((error) => {
                        if (error.response.status === 400) {
                            var tifs = error.response.data.errors;
                            if (error.response.data.errors != null) {
                                Object.keys(tifs).map(function (key) {
                                    // console.log(tifs[key]);
                                    toast.error(`${tifs[key]}`);
                                });
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

        const { name, degree, lectureID, date, time, loadintable, errors, todayy, duration } = this.state;
        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>اضافة امتحان جديد</h5>
                </div>
                <div className="dashboard-content">
                    <div className="dasboard-box">
                        <form action="" onSubmit={formSubmit} className="formStyle">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="exName">اسم الامتحان</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="exName"
                                            className="form-control"
                                            placeholder="مثال: امتحان الصف الاول"
                                            value={name}
                                            onChange={handelChange}
                                        />
                                        <span className="er">{errors.name}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="exDegree">درجة الامتحان</label>
                                        <input
                                            type="number"
                                            name="degree"
                                            id="exDegree"
                                            className="form-control"
                                            placeholder="مثال:30"
                                            value={degree}
                                            onChange={handelChange}
                                        />
                                        <span className="er">{errors.degree}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="duration">مدة الأمتحان</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            id="duration"
                                            className="form-control"
                                            placeholder="مثال:30"
                                            value={duration}
                                            onChange={handelChange}
                                        />
                                        <span className="er">{errors.duration}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="lectureidi">المادة</label>
                                        <Select
                                            // value={options}
                                            name="lectureID"
                                            onChange={selectHandelChange}
                                            options={options}
                                            placeholder="اختار المحاضره"
                                            // id="lectureidi"
                                            clearable={true}
                                        />
                                        {/* <span className="er">{errors.lectureID}</span> */}
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="eaxamType">نوع الامتحان</label>
                                        <Select
                                            // value={options}
                                            name="eaxamType"
                                            onChange={selectHandelChange}
                                            options={options2}
                                            placeholder="اختر نوع الامتحان"
                                            // id="lectureidi"
                                            clearable={true}
                                        />
                                        {/* <span className="er">{errors.lectureID}</span> */}
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="exDate">التاريخ</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={date}
                                            min={todayy}
                                            onChange={handelChange}
                                            id="exDate"
                                            className="form-control"
                                        />
                                        <span className="er">{errors.date}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="exTime">الوقت</label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={time}
                                            onChange={handelChange}
                                            id="exTime"
                                            className="form-control"
                                        />
                                        <span className="er">{errors.time}</span>
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
