import React, { Component } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// mdreact
import { MDBDataTable } from "mdbreact";

import { toast } from "react-toastify";

import axios from "axios";
import GetUserToken from "../component/GetUserToken";
import TopHead from "../component/TopHead";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
import { Pagination, Stack } from "@mui/material";
const token = GetUserToken();

export default class Students extends Component {
    state = {
        data: [],
        loadintable: true,
        index: 0,
        size: 10,
        count: 0,
        searchName: "", 
        searchPhone: ""
    };
    

    handlePaginationChange = (event, value) => {
        this.setState({
            loadintable: true,
        });
        let url = "";
        if(this.state.searchName == "" && this.state.searchPhone == ""){
            
            url = `${baseUrl}api/Students?&index=${value - 1}&size=${this.state.size}`;
        } else{
            alert("S")
            url = `${baseUrl}api/Students/filter?&` + `index=${value - 1}&size=${5}&studentName=${this.state.searchName}&phone=${this.state.searchPhone}`
        }
        axios
            .get(url, {
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
                        {/* <button
          onClick={() => this.deleteStudent(dat)}
          color="red"
          className="tableOption op-delete"
          size="sm"
        >
          <i className="fi-rr-trash"></i>
        </button> */}

                        {/* <Link to={"/edit-student/" + dat.code} className="tableOption op-edit">
          <i className="fi-rr-edit"></i>
        </Link> */}
                    </div>
                );

                if (dat.image != null) {
                    dat.theImage = (
                        <div className="tableImg" style={{ backgroundImage: `url(${dat.image})` }}></div>
                    );
                }
                dat.email = dat.email;
                dat.index = index + 1;
                dat.levelID = dat.level.levelName;
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
        const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        document.getElementsByClassName("pagination")[0].remove();
        axios
            .get(`${baseUrl}api/Students?&index=${this.state.index}&size=${this.state.size}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        loadintable: false,
                        count: res.data.pages
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
                //         this.setState({ index: i, loadintable: true });
                //         axios
                //             .get(`${baseUrl}api/Students?&index=${this.state.index}&size=${this.state.size}`, {
                //                 headers: {
                //                     Authorization: `Bearer ${token}`,
                //                 },
                //             })
                //             .then((ress) => {
                //                 this.setState({ loadintable: false });

                //                 var newData = ress.data.items.reverse();
                //                 newData.map((dat, index) => {
                //                     dat.option = (
                //                         <div className="option-parent">
                //                             {/* <button
                //                     onClick={() => this.deleteStudent(dat)}
                //                     color="red"
                //                     className="tableOption op-delete"
                //                     size="sm"
                //                   >
                //                     <i className="fi-rr-trash"></i>
                //                   </button> */}

                //                             {/* <Link to={"/edit-student/" + dat.code} className="tableOption op-edit">
                //                     <i className="fi-rr-edit"></i>
                //                   </Link> */}
                //                         </div>
                //                     );

                //                     if (dat.image != null) {
                //                         dat.theImage = (
                //                             <div
                //                                 className="tableImg"
                //                                 style={{ backgroundImage: `url(${dat.image})` }}
                //                             ></div>
                //                         );
                //                     }
                //                     dat.email = dat.email;
                //                     dat.index = index + 1;
                //                     dat.levelID = dat.level.levelName;
                //                 });
                //                 this.setState({
                //                     data: newData,
                //                 });
                //             })
                //             .catch((error) => {
                //                 toast.error("حدث خطأ ما");
                //                 this.setState({ loadintable: false });
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
                            {/* <button
              onClick={() => this.deleteStudent(dat)}
              color="red"
              className="tableOption op-delete"
              size="sm"
            >
              <i className="fi-rr-trash"></i>
            </button> */}

                            {/* <Link to={"/edit-student/" + dat.code} className="tableOption op-edit">
              <i className="fi-rr-edit"></i>
            </Link> */}
                        </div>
                    );

                    if (dat.image != null) {
                        dat.theImage = (
                            <div className="tableImg" style={{ backgroundImage: `url(${dat.image})` }}></div>
                        );
                    }
                    dat.email = dat.email;
                    dat.index = index + 1;
                    dat.levelID = dat.level.levelName;
                });
                this.setState({
                    data: newData,
                });
            });

        const searchBox = document.querySelector('[aria-label="Search"]');
        searchBox.value = "";

        searchBox.addEventListener("keyup", () => {
            this.setState({ loadintable: true, searchName: searchBox.value, searchPhone: searchBox.value });
            if (searchBox.value != "") {
                axios
                    .get(`${baseUrl}api/Students/filter?&` + `studentName=${searchBox.value}&phone=${searchBox.value}&index=${5}&size=${this.state.size}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((res) => {
                        this.setState({ loadintable: false });
                        this.setState({ rows: res.data.items.length });
                        this.setState({
                            count: res.data.pages,
                            loadintable: false,
                        });
                        if (res.status == 200) {
                            this.setState({
                                loadintable: false,
                            });
                        }
                        var newData = res.data.items.reverse();
                newData.map((dat, index) => {
                    dat.option = (
                        <div className="option-parent">
                            {/* <button
              onClick={() => this.deleteStudent(dat)}
              color="red"
              className="tableOption op-delete"
              size="sm"
            >
              <i className="fi-rr-trash"></i>
            </button> */}

                            {/* <Link to={"/edit-student/" + dat.code} className="tableOption op-edit">
              <i className="fi-rr-edit"></i>
            </Link> */}
                        </div>
                    );

                    if (dat.image != null) {
                        dat.theImage = (
                            <div className="tableImg" style={{ backgroundImage: `url(${dat.image})` }}></div>
                        );
                    }
                    dat.email = dat.email;
                    dat.index = index + 1;
                    dat.levelID = dat.level.levelName;
                });
                this.setState({
                    data: newData,
                });
                    })
                    .catch((error) => {
                        this.setState({ loadintable: false });
                        toast.error("هناك خطأ ما")
                        console.log(error);
                    });
                //     this.setState({
                //         filteredData: this.state.data.filter((data) => {
                //             return (
                //                 data.phone.includes(searchBox.value) ||
                //                 data.studentName.includes(searchBox.value) ||
                //                 data.subjectName.includes(searchBox.value)
                //             );
                //         }),
                //     });
                //     console.log(this.state.filteredData);
            } else {
                // this.setState({ filteredData: this.state.data });
                axios
                    .get(`${baseUrl}api/Students?&` + `index=${this.state.index}&size=${this.state.size}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            this.setState({
                                loadintable: false,
                                count: res.data.pages
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
                        //         this.setState({ index: i, loadintable: true });
                        //         axios
                        //             .get(`${baseUrl}api/Students?&index=${this.state.index}&size=${this.state.size}`, {
                        //                 headers: {
                        //                     Authorization: `Bearer ${token}`,
                        //                 },
                        //             })
                        //             .then((ress) => {
                        //                 this.setState({ loadintable: false });
        
                        //                 var newData = ress.data.items.reverse();
                        //                 newData.map((dat, index) => {
                        //                     dat.option = (
                        //                         <div className="option-parent">
                        //                             {/* <button
                        //                     onClick={() => this.deleteStudent(dat)}
                        //                     color="red"
                        //                     className="tableOption op-delete"
                        //                     size="sm"
                        //                   >
                        //                     <i className="fi-rr-trash"></i>
                        //                   </button> */}
        
                        //                             {/* <Link to={"/edit-student/" + dat.code} className="tableOption op-edit">
                        //                     <i className="fi-rr-edit"></i>
                        //                   </Link> */}
                        //                         </div>
                        //                     );
        
                        //                     if (dat.image != null) {
                        //                         dat.theImage = (
                        //                             <div
                        //                                 className="tableImg"
                        //                                 style={{ backgroundImage: `url(${dat.image})` }}
                        //                             ></div>
                        //                         );
                        //                     }
                        //                     dat.email = dat.email;
                        //                     dat.index = index + 1;
                        //                     dat.levelID = dat.level.levelName;
                        //                 });
                        //                 this.setState({
                        //                     data: newData,
                        //                 });
                        //             })
                        //             .catch((error) => {
                        //                 toast.error("حدث خطأ ما");
                        //                 this.setState({ loadintable: false });
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
                                    {/* <button
                      onClick={() => this.deleteStudent(dat)}
                      color="red"
                      className="tableOption op-delete"
                      size="sm"
                    >
                      <i className="fi-rr-trash"></i>
                    </button> */}
        
                                    {/* <Link to={"/edit-student/" + dat.code} className="tableOption op-edit">
                      <i className="fi-rr-edit"></i>
                    </Link> */}
                                </div>
                            );
        
                            if (dat.image != null) {
                                dat.theImage = (
                                    <div className="tableImg" style={{ backgroundImage: `url(${dat.image})` }}></div>
                                );
                            }
                            dat.email = dat.email;
                            dat.index = index + 1;
                            dat.levelID = dat.level.levelName;
                        });
                        this.setState({
                            data: newData,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            // var xx = document.getElementsByClassName("checkers");
            // for (let i = 0; i < xx.length; i++) {
            //     xx[i].checked = false;
            // }
            // let selectAll = document.getElementById("selectAll");
            // selectAll.checked = false;
        });
    }

    deleteStudent = async (dat) => {
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
                .delete(`${baseUrl}api/Students` + dat.id, {
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

    render() {
        const { loadintable, count } = this.state;
        const datatable = {
            columns: [
                { label: "الترتيب", field: "index" },
                { label: "البريد الالكترونى", field: "email" },
                { label: "الاسم", field: "name" },
                { label: "رقم الهاتف", field: "phone" },
                { label: "المدينة", field: "city" },
                { label: "المرحلة", field: "levelID" },
                // { label: "الاختيارات", field: "option" },
            ],
            rows: this.state.data,
        };
        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>الطلاب</h5>
                    {/* <div className="add-aNew">
            <Link className="add-new-lnk" to="/add-new-level">اضافة طالب</Link>
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
                                <div className="sp sp-volume"></div>
                                <h5>برجاء الانتظار</h5>
                            </div>
                        ) : null}

                        <Stack spacing={2}>
                            <Pagination style={{ direction: 'ltr' }} count={count} shape="rounded" onChange={this.handlePaginationChange} />
                        </Stack>
                    </div>
                </div>
            </div>
        );
    }
}
