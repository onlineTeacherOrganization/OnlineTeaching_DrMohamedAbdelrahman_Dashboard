import React, { Component } from "react";

import joi from "joi-browser";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

class EditStudyLecture extends Component {
    state = {
        id: 0,
        name: "",
        subjectId: "",
        lectureLink: "",
        description: "",
        ImageOrFile: "",
        month: "",
        isAppear: "",
        isFree: "",
        errors: {},
        loadintable: false,
        allSubjects: [],
        allLectures: [],
        previousLecturesOptions: [],
        previousLecture: "-1",
        subjectname: "",
    };

    schema = {
        name: joi.string().required(),
        subjectId: joi.number().required(),
        lectureLink: joi.string().required(),
        description: joi.string().required(),
        // ImageOrFile: joi.string().required(),
        month: joi.number().required(),
        isAppear: joi.boolean().required(),
        isFree: joi.boolean().required(),
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
        const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        const lectureId = this.props.match.params.id;
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

           

        axios
            .get(`${baseUrl}api/StudyLectures/GetByAdmin/${lectureId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        loadintable: false,
                        id: res.data.id,
                        name: res.data.name,
                        subjectId: res.data.subject.id,
                        subjectname: res.data.subject.name,
                        lectureLink: res.data.lectureLink,
                        description: res.data.description,
                        ImageOrFile: res.data.fileName,
                        month: res.data.month,
                        isAppear: res.data.isAppear,
                        isFree: res.data.isFree,
                    });
                }
                // axios
                // .get(`${baseUrl}api/StudyLectures/GetAllLectures/${this.state.subjectId}`, {
                //     headers: { Authorization: `Bearer ${token}` },
                // })
                // .then((res) => {
                //     if (res.status == 200) {
                //         this.setState({
                //             allLectures: res.data,
                //             loadintable: false, 
                //         });
                //     }
                //     var previousLecturesOptions = this.state.allLectures.map((sub) => ({
                //         value: sub.id,
                //         label: sub.name,
                //     })) 

                //     previousLecturesOptions = previousLecturesOptions.filter(pl => pl.value != this.state.id)
                //     this.setState({previousLecturesOptions : previousLecturesOptions})
                //     console.table(previousLecturesOptions)
                // })
                // .catch((er) => {
                //     console.log(er);
                // });
            })
            .catch((error) => {
                console.log(error)
                if (error.response && error.response.status === 400) {
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
    }

    validate = () => {
        let state = { ...this.state };
        delete state.errors;
        delete state.loadintable;
        delete state.id;
        delete state.allSubjects;
        delete state.ImageOrFile;
        delete state.subjectname;
        delete state.previousLecture;
        delete state.allLectures;
        delete state.previousLecturesOptions;
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

        const handelSelect = (value, action) => {
            this.setState({
                [action.name]: value.value,
            });
        };

        const months = [
            { name: "يناير", id: 1 },
            { name: "فبراير", id: 2 },
            { name: "مارس", id: 3 },
            { name: "ابريل", id: 4 },
            { name: "مايو", id: 5 },
            { name: "يونيو", id: 6 },
            { name: "يوليو", id: 7 },
            { name: "اغسطس", id: 8 },
            { name: "سبتمبر", id: 9 },
            { name: "اكتوبر", id: 10 },
            { name: "نوفمبر", id: 11 },
            { name: "ديسمبر", id: 12 },
        ];

        const {
            subjectId,
            month,
            name,
            lectureLink,
            description,
            ImageOrFile,
            isAppear,
            isFree,
            loadintable,
            errors,
            subjectname, previousLecturesOptions
            ,previousLecture
        } = this.state;

        const options = this.state.allSubjects.map((sub) => ({
            value: sub.id,
            label: sub.name,
        }));
        

        const handelUploadPicture = (e) => {
            this.setState({
                // picturePreview: URL.createObjectURL(e.target.files[0]),
                ImageOrFile: e.target.files[0],
            });
        };

        const stringToBoolean = (string) => {
            switch (string) {
                case "true":
                case "yes":
                case "1":
                    return true;
                case "false":
                case "no":
                case "0":
                case null:
                    return false;
                default:
                    return Boolean(string);
            }
        };

        const submitForm = (e) => {
            e.preventDefault();
            this.setState({
                loadintable: true,
            });
            const state = { ...this.state };
            const PASE_URL = "http://hossam1234-001-site1.ftempurl.com/api/";
            const lectureId = this.props.match.params.id;
            delete state.errors;
            delete state.loadintable;
            delete state.allSubjects;
            delete state.subjectname;
            delete state.allLectures;
            delete state.previousLecturesOptions;
            
            state.isAppear = stringToBoolean(state.isAppear);
            state.isFree = stringToBoolean(state.isFree);
            state.month = parseInt(state.month);

            const errors = this.validate();
            // console.log(errors);
            if (errors == null) {
                const formData = new FormData();
                formData.append("file", this.state.ImageOrFile);
                Object.keys(state).forEach((key) => {
                    formData.append(key, this.state[key]);
                });
                // console.log(state);
                axios
                    .put(`${baseUrl}api/StudyLectures/${lectureId}`, formData, {
                        headers: {
                            accept: "application/json",
                            "Accept-Language": "en-US,en;q=0.8",
                            "Content-Type": `multipart/form-data`,
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        if (res.status == 200) {
                            this.setState({
                                loadintable: false,
                            });
                            toast.success("تم التعديل بنجاح");
                            this.props.history.replace("/study-lectures");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.setState({
                            loadintable: false,
                        });
                    });
            } else {
                toast.error("هناك بعض الاخطاء");
                this.setState({
                    loadintable: false,
                });
            }
        };

        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>{name}</h5>
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
                                            onChange={handelSelect}
                                            name="subjectId"
                                            options={options}
                                            placeholder={subjectname}
                                            id="courseSubject"
                                        />
                                        <span className="er">{errors.subjectId}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="courseFree">هل المحاضرة</label>
                                        <select
                                            name="isFree"
                                            value={isFree}
                                            onChange={handelChange}
                                            id="courseFree"
                                            className="form-control"
                                        >
                                            <option value="">اختر</option>
                                            <option value={true}>مجانية</option>
                                            <option value={false}>مدفوعة</option>
                                        </select>
                                        <span className="er">{errors.isFree}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-9">
                                    <div className="form-group">
                                        <label htmlFor="courseLink">ادخال رابط فيديو المحاضرة</label>
                                        <input
                                            type="text"
                                            name="lectureLink"
                                            id="courseLink"
                                            className="form-control"
                                            placeholder="رابط المحاضرة"
                                            value={lectureLink}
                                            onChange={handelChange}
                                        />
                                        <span className="er">{errors.lectureLink}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="mimage">ملف المحاضره</label>
                                        <input
                                            type="file"
                                            // name="image"
                                            id="mimage"
                                            className="form-control"
                                            // placeholder="مثال: 50"
                                            // value={image}
                                            onChange={handelUploadPicture}
                                        />
                                        <span className="er">{errors.ImageOrFile}</span>
                                    </div>
                                </div>
                                {/* <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="courseSubject">  المحاضرة السابقة</label>
                                        <Select
                                            // value={selectedOption}
                                            onChange={handelSelect}
                                            name="previousLecture"
                                            options={previousLecturesOptions}
                                            placeholder={previousLecture}
                                            id="previousLectureId"
                                        />
                                        <span className="er">{errors.previousLecture}</span>
                                    </div>
                                </div> */}
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="courseMonth">الشهر التابع للمحاضرة</label>
                                        <select
                                            name="month"
                                            value={month}
                                            onChange={handelChange}
                                            className="form-control"
                                            id="courseMonth"
                                        >
                                            <option value="">اختر الشهر</option>
                                            {months.map((mon) => (
                                                <option value={mon.id}> {mon.name} </option>
                                            ))}
                                        </select>
                                        <span className="er">{errors.month}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="courseVisibility">حالة المحاضرة</label>
                                        <select
                                            name="isAppear"
                                            value={isAppear}
                                            onChange={handelChange}
                                            id="courseFree"
                                            className="form-control"
                                        >
                                            <option value="">اختر</option>
                                            <option value={true}>عرض</option>
                                            <option value={false}>اخفاء</option>
                                        </select>
                                        <span className="er">{errors.isAppear}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-12">
                                    <div className="form-group">
                                        <label htmlFor="coursrDetails">تفاصيل المحاضرة</label>
                                        <textarea
                                            id="coursrDetails"
                                            placeholder="تفاصيل المحاضرة"
                                            className="form-control"
                                            value={description}
                                            name="description"
                                            onChange={handelChange}
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
                                                this.props.history.replace("/study-lectures");
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

export default EditStudyLecture;
