import React, { Component } from "react";

import { Link } from "react-router-dom";

// mdreact
import { MDBDataTable } from "mdbreact";

import { toast } from "react-toastify";

import axios from "axios";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

export default class ReExamOrders extends Component {
    state = {
        data: [],
        loadintable: true,
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
        const token = GetUserToken();
        axios
            .get(`${baseUrl}api/Exams/Re open Exam Requests`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        loadintable: false,
                    });
                }
                var newData = res.data.reverse();
                newData.map((dat, index) => {
                    dat.option = (
                        <div className="option-parent">
                            <button
                                onClick={() => this.acceptReOpen(dat)}
                                color="red"
                                className="tableOption op-done"
                                size="sm"
                            >
                                <i className="fi-rr-check"></i>
                            </button>
                        </div>
                    );
                    dat.index = index + 1;
                });
                this.setState({
                    data: newData,
                });
            });
    }

    acceptReOpen = (dat) => {
        this.setState({
            loadintable: true,
        });

        const reobj = {
            studentID: parseInt(dat.studentID),
            examID: parseInt(dat.examID),
            isAccept: true,
        };
        axios
            .post(`${baseUrl}api/Exams/Accept Re open Exam `, reobj, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    toast.success("تم اعادة الامتحان للطالب");
                    this.setState({ loadintable: false });
                }
            })
            .catch((error) => {
                toast.error("يوجد مشكلة ما");
            });

        let newDate = this.state.data.filter((item) => item.id !== dat.id);
        this.setState({
            data: newDate,
            loadintable: true,
        });
        window.location.reload();
    };

    render() {
        const { loadintable } = this.state;
        const datatable = {
            columns: [
                { label: "الترتيب", field: "index" },
                { label: "اسم الامتحان", field: "examName" },
                { label: "اسم الطالب", field: "studentName" },
                { label: "السبب", field: "reasone" },
                { label: "الاختيارات", field: "option" },
            ],
            rows: this.state.data,
        };
        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>الامتحان</h5>
                    <div className="add-aNew">
                        <Link className="add-new-lnk" to="/add-new-exam">
                            اضافة امتحان
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
