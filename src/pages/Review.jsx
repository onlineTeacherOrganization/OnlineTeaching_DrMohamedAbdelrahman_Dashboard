import React, { Component } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// mdreact
import { MDBDataTable } from "mdbreact";

import { toast } from "react-toastify";

// axios
import axios from "axios";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
import { Pagination, Stack } from "@mui/material";
const token = GetUserToken();

export default class Review extends Component {
    state = {
        data: [],
        loadintable: false,
        size: 10,
        index: 0,
        count: 0
    };

    handlePaginationChange = (event, value) => {
        this.setState({
            loadintable: true,
        });
        axios
        .get(`${baseUrl}api/Reviews/Admin/Confirm?&index=${value - 1}&size=${this.state.size}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            if (res.status == 200) {
                this.setState({
                    count: res.data.pages,
                    loadintable: false,
                });
            }
            
            var newData = res.data.items.reverse();
                newData.map((dat, index) => {
                    dat.option = (
                        <div className="option-parent">
                            <button
                                onClick={() => this.deleteReview(dat)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>
                            {dat["isAppear"] === true ? null : (
                                <button
                                    onClick={() => this.reviewAccept(dat)}
                                    color="red"
                                    className="tableOption op-accept"
                                    size="sm"
                                >
                                    <i className="fi-rr-check"></i>
                                </button>
                            )}
                        </div>
                    );
                    dat.index = index + 1;
                    dat.isAppear = dat.isAppear ? "ظاهرة" : "مخفيه";
                });
                this.setState({
                    data: newData,
                });
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                loadintable: false,
            });
        });
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
        document.getElementsByClassName("pagination")[0].remove();
        axios
            .get(`${baseUrl}api/Reviews/Admin/Confirm?&index=${this.state.index}&size=${this.state.size}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        count: res.data.pages,
                        loadintable: false,
                    });
                }
                // var newPagination = document.createElement("ul");
                // newPagination.classList.add("pagination");
                // newPagination.style.flexWrap = "wrap";

                // for (let i = 0; i < res.data.pages; i++) {
                //     let li = document.createElement("li");
                //     li.classList.add(["page-item"]);
                //     if (i == 0) li.classList.add("active");
                //     li.addEventListener("click", (e) => {
                //         document.querySelectorAll(".page-item").forEach((element) => {
                //             element.classList.remove("active");
                //         });
                //         li.classList.add("active");
                //         this.setState({ index: i });
                //         axios
                //             .get(
                //                 `${baseUrl}api/Reviews/Admin/Confirm?&index=${this.state.index}&size=${this.state.size}`,
                //                 {
                //                     headers: {
                //                         Authorization: `Bearer ${token}`,
                //                     },
                //                 }
                //             )
                //             .then((ress) => {
                //                 var newData = ress.data.items.reverse();
                //                 newData.map((dat, index) => {
                //                     dat.option = (
                //                         <div className="option-parent">
                //                             <button
                //                                 onClick={() => this.deleteReview(dat)}
                //                                 color="red"
                //                                 className="tableOption op-delete"
                //                                 size="sm"
                //                             >
                //                                 <i className="fi-rr-trash"></i>
                //                             </button>
                //                             {dat["isAppear"] === true ? null : (
                //                                 <button
                //                                     onClick={() => this.reviewAccept(dat)}
                //                                     color="red"
                //                                     className="tableOption op-accept"
                //                                     size="sm"
                //                                 >
                //                                     <i className="fi-rr-check"></i>
                //                                 </button>
                //                             )}
                //                         </div>
                //                     );
                //                     dat.index = index + 1;
                //                     dat.isAppear = dat.isAppear ? "ظاهرة" : "مخفيه";
                //                 });
                //                 this.setState({
                //                     data: newData,
                //                 });
                //             });
                //     });
                //     let anch = document.createElement("a");
                //     anch.classList.add(["page-link"]);
                //     let textNode = document.createTextNode(i + 1);
                //     anch.appendChild(textNode);
                //     li.appendChild(anch);
                //     newPagination.appendChild(li);
                // }
                // document.getElementsByClassName("dataTables_paginate")[0].appendChild(newPagination);
                // let x = document.getElementsByClassName("pagination")[0].remove();

                var newData = res.data.items.reverse();
                newData.map((dat, index) => {
                    dat.option = (
                        <div className="option-parent">
                            <button
                                onClick={() => this.deleteReview(dat)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>
                            {dat["isAppear"] === true ? null : (
                                <button
                                    onClick={() => this.reviewAccept(dat)}
                                    color="red"
                                    className="tableOption op-accept"
                                    size="sm"
                                >
                                    <i className="fi-rr-check"></i>
                                </button>
                            )}
                        </div>
                    );
                    dat.index = index + 1;
                    dat.isAppear = dat.isAppear ? "ظاهرة" : "مخفيه";
                });
                this.setState({
                    data: newData,
                });
            });
    }

    deleteReview = async (dat) => {
        this.setState({
            loadintable: true,
        });
        const PASE_URL = "http://hossam1234-001-site1.ftempurl.com/api/";

        let oldData = [...this.state.data];

        let newDate = this.state.data.filter((item) => item.id !== dat.id);
        this.setState({
            data: newDate,
            loadintable: true,
        });

        try {
            await axios
                .delete(`${baseUrl}api/Reviews/` + dat.id, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success("تم الحذف بنجاح");
                        this.setState({
                            loadintable: false,
                        });
                    } else {
                        toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
                        this.setState({
                            data: oldData,
                            loadintable: false,
                        });
                    }
                });
        } catch (ex) {
            toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
            this.setState({
                data: oldData,
                loadintable: false,
            });
        }
    };

    reviewAccept = (dat) => {
        this.setState({
            loadintable: true,
        });
        const PASE_URL = "http://hossam1234-001-site1.ftempurl.com/api/";
        axios
            .put(
                `${baseUrl}api/Reviews/` + dat.id,
                {
                    id: dat.id,
                    isAppear: true,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                if (res.status === 200) {
                    toast.success("تم الموافقه بنجاح");
                    this.setState({
                        loadintable: false,
                    });
                    window.location.reload();
                }
            })
            .catch((er) => {
                console.log(er);
            });
    };

    render() {
        const { loadintable, count } = this.state;
        const datatable = {
            columns: [
                { label: "الترتيب", field: "index" },
                { label: "نص المراجعه", field: "description" },
                { label: "الحاله", field: "isAppear" },
                { label: "الاختيارات", field: "option" },
            ],
            rows: this.state.data,
        };
        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>المراجعات</h5>
                    {/* <div className="add-aNew">
            <Link className="add-new-lnk" to="/add-new-subject">اضافة مراجعه</Link>
          </div> */}
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
                                <div class="sp sp-volume"></div>
                                <h5>برجاء الانتظار</h5>
                            </div>
                        ) : null}
                        <Stack spacing={2}>
                            <Pagination style={{ direction: 'ltr' }} count={count} shape="rounded" onChange={this.handlePaginationChange}/>
                        </Stack>
                    </div>
                </div>
            </div>
        );
    }
}
