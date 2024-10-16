import React, { Component } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// mdreact
import { MDBDataTable } from "mdbreact";
import "mathlive";
import { toast } from "react-toastify";

import axios from "axios";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

export default class Questions extends Component {
    state = {
        data: [],
        File: "",
        loadintable: false,
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
        document.querySelector('[aria-label="Previous"]').innerHTML = "السابق";
        document.querySelector('[aria-label="Next"]').innerHTML = "التالي";
        document.querySelector(".dataTables_length label").childNodes[0].textContent = "أظهار الحقول";
        document.querySelector(".mdb-datatable-filter input").placeholder = "بحث";
        this.setState({
            loadintable: true,
        });
        // const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        const URL_PASE = "https://localhost:44334/api/";
        const examId = this.props.match.params.id;
        axios
            .get(`${baseUrl}api/Exams/` + examId, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        loadintable: false,
                        data: res.data.questions,
                    });
                }
                var newData = res.data.questions.reverse();
                newData.map((dat, index) => {
                    dat.option = (
                        <div className="option-parent">
                            <button
                                onClick={() => this.deleteQuestion(dat)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>

                            <Link to={"/edit-question/" + examId + "/" + dat.id} className="tableOption op-edit">
                                <i className="fi-rr-edit"></i>
                            </Link>
                        </div>
                    );
                    dat.index = index + 1;

                    dat.description = <math-field read-only> {dat.description} </math-field>;
                    dat.image = <span>{dat.file}</span>;
                });
                this.setState({
                    data: newData,
                });
            });
    }

    deleteQuestion = async (dat) => {
        this.setState({
            loadintable: true,
        });
        const examId = this.props.match.params.id;

        try {
            await axios
                .delete(`${baseUrl}api/Questions/` + dat.id, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success("تم الحذف بنجاح");
                        this.setState({
                            loadintable: false,
                        });
                        window.location.reload();
                    } else {
                        toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
                        this.setState({
                            loadintable: false,
                        });
                    }
                });
        } catch (ex) {
            toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
            this.setState({
                loadintable: false,
            });
        }
    };

    render() {
        const { loadintable } = this.state;
        const examId = this.props.match.params.id;
        const datatable = {
            columns: [
                { label: "الترتيب", field: "index" },
                { label: "السؤال", field: "description" },
                { label: "الاختيارات", field: "option" },
                { label: "صورة السؤال", field: "image" },
            ],
            rows: this.state.data,
        };
        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>الامتحان</h5>
                    <div className="add-aNew">
                        <Link className="add-new-lnk" to={"/add-new-question/" + examId}>
                            اضافة سؤال
                        </Link>
                    </div>
                </div>
                <div className="dashboard-content">
                    <div className="dasboard-box">
                        <MDBDataTable
                            entriesOptions={[5, 10, 15, 20]}
                            entries={10}
                            pagesAmount={4}
                            hover
                            large
                            responsive
                            data={datatable}
                        />
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
