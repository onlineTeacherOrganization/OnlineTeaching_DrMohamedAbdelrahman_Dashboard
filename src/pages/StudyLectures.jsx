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

class StudyLectures extends Component {
    state = {
        data: [],
        loadintable: true,
        allMonth: [
            "يناير",
            "فبراير",
            "مارس",
            "ابريل",
            "مايو",
            "يونيو",
            "يوليو",
            "اغسطس",
            "سبتمبر",
            "اكتوبر",
            "نوفمبر",
            "ديسمبر",
        ],
        fileeData: null,
        size: 10,
        index: 0,
        count: 0,
        name: ""
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
        // const PASE_URL = "http://hossam1234-001-site1.ftempurl.com/api/";
        const PASE_URL = "https://localhost:44334/api/";

        axios
            .get(`${baseUrl}api/StudyLectures?&index=${this.state.index}&size=${this.state.size}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        loadintable: false,
                        count: res.data.pages,
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
                //             .get(`${baseUrl}api/StudyLectures?&index=${this.state.index}&size=${this.state.size}`, {
                //                 headers: {
                //                     Authorization: `Bearer ${token}`,
                //                 },
                //             })
                //             .then((ress) => {
                //                 var newData = ress.data.items.reverse();
                //                 newData.map((dat, index) => {
                //                     dat.option = (
                //                         <div className="option-parent">
                //                             <button
                //                                 onClick={() => this.deleteLecture(dat)}
                //                                 color="red"
                //                                 className="tableOption op-delete"
                //                                 size="sm"
                //                             >
                //                                 <i className="fi-rr-trash"></i>
                //                             </button>

                //                             <Link to={"/edit-study-lecture/" + dat.id} className="tableOption op-edit">
                //                                 <i className="fi-rr-edit"></i>
                //                             </Link>
                //                         </div>
                //                     );
                //                     dat.index = index + 1;
                //                     dat.isFree = dat.isFree ? "مجانيه" : "مدفوعه";
                //                     dat.isAppear = dat.isAppear ? "مرئيه" : "مخفيه";
                //                     if (dat.subject != null) {
                //                         dat.subjectName = dat.subject.name;
                //                     }
                //                     dat.month = this.state.allMonth[dat.month - 1];
                //                     dat.fileName = (
                //                         <span>
                //                             <a
                //                                 className="LINKSS"
                //                                 id={"filelink" + index}
                //                                 onClick={(e) => {
                //                                     axios
                //                                         .get(`${baseUrl}api/StudyLectures/Files/` + dat.id, {
                //                                             headers: { Authorization: `Bearer ${token}` },
                //                                         })

                //                                         .then((res) => {
                //                                             console.log(res);
                //                                             this.setState({ fileeData: res });
                //                                             console.log(res);
                //                                             var x = "filelink" + index;
                //                                             document
                //                                                 .getElementById(x)
                //                                                 .setAttribute("download", res.data.name);
                //                                             document
                //                                                 .getElementById(x)
                //                                                 .setAttribute("href", res.data.fileData);
                //                                         })
                //                                         .catch((errors) => {
                //                                             console.log(errors);
                //                                         });
                //                                 }}
                //                             >
                //                                 {dat.fileName}
                //                             </a>
                //                         </span>
                //                     );
                //                     dat.lectureLink = (
                //                         <a href={dat.lectureLink} target="_blank" className="lecture-link">
                //                             رابط المحاضرة
                //                         </a>
                //                     );

                //                     // dat.fileLink = (
                //                     //   <a href={dat.fileLink} target="_blank" className="file-link text-white">
                //                     //     رابط الملف
                //                     //   </a>
                //                     // );
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
                let x = document.getElementsByClassName("pagination")[0].remove();

                var newData = res.data.items.reverse();
                newData.map((dat, index) => {
                    dat.option = (
                        <div className="option-parent">
                            <button
                                onClick={() => this.deleteLecture(dat)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>

                            <Link to={"/edit-study-lecture/" + dat.id} className="tableOption op-edit">
                                <i className="fi-rr-edit"></i>
                            </Link>
                        </div>
                    );
                    dat.index = index + 1;
                    dat.isFree = dat.isFree ? "مجانيه" : "مدفوعه";
                    dat.isAppear = dat.isAppear ? "مرئيه" : "مخفيه";
                    if (dat.subject != null) {
                        dat.subjectName = dat.subject.name;
                    }
                    dat.month = this.state.allMonth[dat.month - 1];
                    dat.fileName = (
                        <span>
                            <a
                                className="LINKSS"
                                id={"filelink" + index}
                                onClick={(e) => {
                                    axios
                                        .get(`${baseUrl}api/StudyLectures/Files/` + dat.id, {
                                            headers: { Authorization: `Bearer ${token}` },
                                        })

                                        .then((res) => {
                                            console.log(res);
                                            this.setState({ fileeData: res });
                                            console.log(res);
                                            var x = "filelink" + index;
                                            document.getElementById(x).setAttribute("download", res.data.name);
                                            document.getElementById(x).setAttribute("href", res.data.fileData);
                                        })
                                        .catch((errors) => {
                                            console.log(errors);
                                        });
                                }}
                            >
                                {dat.fileName}
                            </a>
                        </span>
                    );
                    dat.lectureLink = (
                        <a href={dat.lectureLink} target="_blank" className="lecture-link">
                            رابط المحاضرة
                        </a>
                    );

                    // dat.fileLink = (
                    //   <a href={dat.fileLink} target="_blank" className="file-link text-white">
                    //     رابط الملف
                    //   </a>
                    // );
                });

                this.setState({
                    data: newData,
                });
            });
            
            const searchBox = document.querySelector('[aria-label="Search"]');
            searchBox.value = "";
    
            searchBox.addEventListener("keyup", () => {
                this.setState({ loadintable: true, name: searchBox.value });
                if (searchBox.value != "") {
                    axios
                        .get(`${baseUrl}api/StudyLectures/filter?&` + `name=${searchBox.value}&index=${this.state.index}&size=${this.state.size}`, {
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
                                    count: res.data.pages,
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
                            //             .get(`${baseUrl}api/StudyLectures?&index=${this.state.index}&size=${this.state.size}`, {
                            //                 headers: {
                            //                     Authorization: `Bearer ${token}`,
                            //                 },
                            //             })
                            //             .then((ress) => {
                            //                 var newData = ress.data.items.reverse();
                            //                 newData.map((dat, index) => {
                            //                     dat.option = (
                            //                         <div className="option-parent">
                            //                             <button
                            //                                 onClick={() => this.deleteLecture(dat)}
                            //                                 color="red"
                            //                                 className="tableOption op-delete"
                            //                                 size="sm"
                            //                             >
                            //                                 <i className="fi-rr-trash"></i>
                            //                             </button>
            
                            //                             <Link to={"/edit-study-lecture/" + dat.id} className="tableOption op-edit">
                            //                                 <i className="fi-rr-edit"></i>
                            //                             </Link>
                            //                         </div>
                            //                     );
                            //                     dat.index = index + 1;
                            //                     dat.isFree = dat.isFree ? "مجانيه" : "مدفوعه";
                            //                     dat.isAppear = dat.isAppear ? "مرئيه" : "مخفيه";
                            //                     if (dat.subject != null) {
                            //                         dat.subjectName = dat.subject.name;
                            //                     }
                            //                     dat.month = this.state.allMonth[dat.month - 1];
                            //                     dat.fileName = (
                            //                         <span>
                            //                             <a
                            //                                 className="LINKSS"
                            //                                 id={"filelink" + index}
                            //                                 onClick={(e) => {
                            //                                     axios
                            //                                         .get(`${baseUrl}api/StudyLectures/Files/` + dat.id, {
                            //                                             headers: { Authorization: `Bearer ${token}` },
                            //                                         })
            
                            //                                         .then((res) => {
                            //                                             console.log(res);
                            //                                             this.setState({ fileeData: res });
                            //                                             console.log(res);
                            //                                             var x = "filelink" + index;
                            //                                             document
                            //                                                 .getElementById(x)
                            //                                                 .setAttribute("download", res.data.name);
                            //                                             document
                            //                                                 .getElementById(x)
                            //                                                 .setAttribute("href", res.data.fileData);
                            //                                         })
                            //                                         .catch((errors) => {
                            //                                             console.log(errors);
                            //                                         });
                            //                                 }}
                            //                             >
                            //                                 {dat.fileName}
                            //                             </a>
                            //                         </span>
                            //                     );
                            //                     dat.lectureLink = (
                            //                         <a href={dat.lectureLink} target="_blank" className="lecture-link">
                            //                             رابط المحاضرة
                            //                         </a>
                            //                     );
            
                            //                     // dat.fileLink = (
                            //                     //   <a href={dat.fileLink} target="_blank" className="file-link text-white">
                            //                     //     رابط الملف
                            //                     //   </a>
                            //                     // );
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
                                            onClick={() => this.deleteLecture(dat)}
                                            color="red"
                                            className="tableOption op-delete"
                                            size="sm"
                                        >
                                            <i className="fi-rr-trash"></i>
                                        </button>
            
                                        <Link to={"/edit-study-lecture/" + dat.id} className="tableOption op-edit">
                                            <i className="fi-rr-edit"></i>
                                        </Link>
                                    </div>
                                );
                                dat.index = index + 1;
                                dat.isFree = dat.isFree ? "مجانيه" : "مدفوعه";
                                dat.isAppear = dat.isAppear ? "مرئيه" : "مخفيه";
                                if (dat.subject != null) {
                                    dat.subjectName = dat.subject.name;
                                }
                                dat.month = this.state.allMonth[dat.month - 1];
                                dat.fileName = (
                                    <span>
                                        <a
                                            className="LINKSS"
                                            id={"filelink" + index}
                                            onClick={(e) => {
                                                axios
                                                    .get(`${baseUrl}api/StudyLectures/Files/` + dat.id, {
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    })
            
                                                    .then((res) => {
                                                        console.log(res);
                                                        this.setState({ fileeData: res });
                                                        console.log(res);
                                                        var x = "filelink" + index;
                                                        document.getElementById(x).setAttribute("download", res.data.name);
                                                        document.getElementById(x).setAttribute("href", res.data.fileData);
                                                    })
                                                    .catch((errors) => {
                                                        console.log(errors);
                                                    });
                                            }}
                                        >
                                            {dat.fileName}
                                        </a>
                                    </span>
                                );
                                dat.lectureLink = (
                                    <a href={dat.lectureLink} target="_blank" className="lecture-link">
                                        رابط المحاضرة
                                    </a>
                                );
            
                                // dat.fileLink = (
                                //   <a href={dat.fileLink} target="_blank" className="file-link text-white">
                                //     رابط الملف
                                //   </a>
                                // );
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
                        .get(`${baseUrl}api/StudyLectures?&index=${this.state.index}&size=${this.state.size}`, {
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
                                    count: res.data.pages,
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
                            //             .get(`${baseUrl}api/StudyLectures?&index=${this.state.index}&size=${this.state.size}`, {
                            //                 headers: {
                            //                     Authorization: `Bearer ${token}`,
                            //                 },
                            //             })
                            //             .then((ress) => {
                            //                 var newData = ress.data.items.reverse();
                            //                 newData.map((dat, index) => {
                            //                     dat.option = (
                            //                         <div className="option-parent">
                            //                             <button
                            //                                 onClick={() => this.deleteLecture(dat)}
                            //                                 color="red"
                            //                                 className="tableOption op-delete"
                            //                                 size="sm"
                            //                             >
                            //                                 <i className="fi-rr-trash"></i>
                            //                             </button>
            
                            //                             <Link to={"/edit-study-lecture/" + dat.id} className="tableOption op-edit">
                            //                                 <i className="fi-rr-edit"></i>
                            //                             </Link>
                            //                         </div>
                            //                     );
                            //                     dat.index = index + 1;
                            //                     dat.isFree = dat.isFree ? "مجانيه" : "مدفوعه";
                            //                     dat.isAppear = dat.isAppear ? "مرئيه" : "مخفيه";
                            //                     if (dat.subject != null) {
                            //                         dat.subjectName = dat.subject.name;
                            //                     }
                            //                     dat.month = this.state.allMonth[dat.month - 1];
                            //                     dat.fileName = (
                            //                         <span>
                            //                             <a
                            //                                 className="LINKSS"
                            //                                 id={"filelink" + index}
                            //                                 onClick={(e) => {
                            //                                     axios
                            //                                         .get(`${baseUrl}api/StudyLectures/Files/` + dat.id, {
                            //                                             headers: { Authorization: `Bearer ${token}` },
                            //                                         })
            
                            //                                         .then((res) => {
                            //                                             console.log(res);
                            //                                             this.setState({ fileeData: res });
                            //                                             console.log(res);
                            //                                             var x = "filelink" + index;
                            //                                             document
                            //                                                 .getElementById(x)
                            //                                                 .setAttribute("download", res.data.name);
                            //                                             document
                            //                                                 .getElementById(x)
                            //                                                 .setAttribute("href", res.data.fileData);
                            //                                         })
                            //                                         .catch((errors) => {
                            //                                             console.log(errors);
                            //                                         });
                            //                                 }}
                            //                             >
                            //                                 {dat.fileName}
                            //                             </a>
                            //                         </span>
                            //                     );
                            //                     dat.lectureLink = (
                            //                         <a href={dat.lectureLink} target="_blank" className="lecture-link">
                            //                             رابط المحاضرة
                            //                         </a>
                            //                     );
            
                            //                     // dat.fileLink = (
                            //                     //   <a href={dat.fileLink} target="_blank" className="file-link text-white">
                            //                     //     رابط الملف
                            //                     //   </a>
                            //                     // );
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
                                            onClick={() => this.deleteLecture(dat)}
                                            color="red"
                                            className="tableOption op-delete"
                                            size="sm"
                                        >
                                            <i className="fi-rr-trash"></i>
                                        </button>
            
                                        <Link to={"/edit-study-lecture/" + dat.id} className="tableOption op-edit">
                                            <i className="fi-rr-edit"></i>
                                        </Link>
                                    </div>
                                );
                                dat.index = index + 1;
                                dat.isFree = dat.isFree ? "مجانيه" : "مدفوعه";
                                dat.isAppear = dat.isAppear ? "مرئيه" : "مخفيه";
                                if (dat.subject != null) {
                                    dat.subjectName = dat.subject.name;
                                }
                                dat.month = this.state.allMonth[dat.month - 1];
                                dat.fileName = (
                                    <span>
                                        <a
                                            className="LINKSS"
                                            id={"filelink" + index}
                                            onClick={(e) => {
                                                axios
                                                    .get(`${baseUrl}api/StudyLectures/Files/` + dat.id, {
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    })
            
                                                    .then((res) => {
                                                        console.log(res);
                                                        this.setState({ fileeData: res });
                                                        console.log(res);
                                                        var x = "filelink" + index;
                                                        document.getElementById(x).setAttribute("download", res.data.name);
                                                        document.getElementById(x).setAttribute("href", res.data.fileData);
                                                    })
                                                    .catch((errors) => {
                                                        console.log(errors);
                                                    });
                                            }}
                                        >
                                            {dat.fileName}
                                        </a>
                                    </span>
                                );
                                dat.lectureLink = (
                                    <a href={dat.lectureLink} target="_blank" className="lecture-link">
                                        رابط المحاضرة
                                    </a>
                                );
            
                                // dat.fileLink = (
                                //   <a href={dat.fileLink} target="_blank" className="file-link text-white">
                                //     رابط الملف
                                //   </a>
                                // );
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

    handlePaginationChange = (event, value) => {
        this.setState({
            loadintable: true,
        });
        var url = "";
        if(this.state.name == ""){
            url = `${baseUrl}api/StudyLectures?&index=${value - 1}&size=${this.state.size}`;
        } else{
            url = `${baseUrl}api/StudyLectures/Filter?&` + `index=${value - 1}&size=${this.state.size}&name=${this.state.name}`
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
                            <button
                                onClick={() => this.deleteLecture(dat)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>

                            <Link to={"/edit-study-lecture/" + dat.id} className="tableOption op-edit">
                                <i className="fi-rr-edit"></i>
                            </Link>
                        </div>
                    );
                    dat.index = index + 1;
                    dat.isFree = dat.isFree ? "مجانيه" : "مدفوعه";
                    dat.isAppear = dat.isAppear ? "مرئيه" : "مخفيه";
                    if (dat.subject != null) {
                        dat.subjectName = dat.subject.name;
                    }
                    dat.month = this.state.allMonth[dat.month - 1];
                    dat.fileName = (
                        <span>
                            <a
                                className="LINKSS"
                                id={"filelink" + index}
                                onClick={(e) => {
                                    axios
                                        .get(`${baseUrl}api/StudyLectures/Files/` + dat.id, {
                                            headers: { Authorization: `Bearer ${token}` },
                                        })

                                        .then((res) => {
                                            console.log(res);
                                            this.setState({ fileeData: res });
                                            console.log(res);
                                            var x = "filelink" + index;
                                            document.getElementById(x).setAttribute("download", res.data.name);
                                            document.getElementById(x).setAttribute("href", res.data.fileData);
                                        })
                                        .catch((errors) => {
                                            console.log(errors);
                                        });
                                }}
                            >
                                {dat.fileName}
                            </a>
                        </span>
                    );
                    dat.lectureLink = (
                        <a href={dat.lectureLink} target="_blank" className="lecture-link">
                            رابط المحاضرة
                        </a>
                    );

                    // dat.fileLink = (
                    //   <a href={dat.fileLink} target="_blank" className="file-link text-white">
                    //     رابط الملف
                    //   </a>
                    // );
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

      exportToExcel = () => {
        this.setState({
            loadintable: true,
        });
        axios.get(`${baseUrl}api/StudyLectures/DownloadInfo`, {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }).then(
            (res) => {
                const type = res.headers['content-type']
                const blob = new Blob([res.data], { type: type, encoding: 'UTF-8' })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = 'file.xlsx'
                link.click()
                this.setState({
                    loadintable: false,
                });
                toast.success("تم تحميل الملف بنجاح");
            }
          ).catch(error => {
            toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
            this.setState({
                loadintable: false,
            });
          });
        // axios
        //     .get(`${baseUrl}api/Subjects/DownloadInfo`, {
        //         headers: { Authorization: `Bearer ${token}` },
        //     })
        //     .then((res) => {
        //         if (res.status == 200) {
        //             this.setState({
        //                 loadintable: false,
        //                 exportedFile: res
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
    }

    deleteLecture = async (dat) => {
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
                .delete(`${baseUrl}api/StudyLectures/` + dat.id, {
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
        const { loadintable, fileeData, count } = this.state;
        const datatable = {
            columns: [
                { label: "الترتيب", field: "index" },
                { label: "الاسم", field: "name" },
                { label: "اسم الماده", field: "subjectName" },
                { label: "ملف المحاضرة", field: "fileName" },
                { label: "الرابط", field: "lectureLink" },
                // { label: "رابط الملف", field: "fileLink" },
                { label: "الشهر", field: "month" },
                { label: "النوع", field: "isFree" },
                { label: "الحاله", field: "isAppear" },
                { label: "الاختيارات", field: "option" },
            ],
            rows: this.state.data,
        };

        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>محاضرات الشرح</h5>
                    <div className="add-aNew">
                        <Link className="add-new-lnk" to="/add-new-study-lecture">
                            اضافة محاضرة شرح
                        </Link>
                        <br/>
                        {this.state.data.length > 0 ? (<a  style={{disabled: this.state.data}} disabled={!this.state.data} className="add-new-lnk" onClick={() => {this.exportToExcel()}}>
                            تصدير البيانات لملف Excel
                        </a>): null}
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
                         <Stack spacing={2}>
                            <Pagination style={{ direction: 'ltr' }} count={count} shape="rounded" onChange={this.handlePaginationChange}/>
                        </Stack>
                    </div>
                </div>
            </div>
        );
    }
}

export default StudyLectures;
