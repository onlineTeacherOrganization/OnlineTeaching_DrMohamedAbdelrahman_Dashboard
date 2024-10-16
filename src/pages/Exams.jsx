import React, { Component } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// mdreact
import { MDBDataTable } from "mdbreact";

import { toast } from "react-toastify";

import axios from "axios";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
import { Pagination, Stack } from "@mui/material";
const token = GetUserToken();

export default class Exams extends Component {
    state = {
        data: [],
        loadintable: true,
        index: 0,
        size: 10,
        count: 0,
        searchName: ""
    };
    
    handlePaginationChange = (event, value) => {
        
        // this.setState({
        //     loadintable: true,
        // });

        // axios
        //     .get(`${baseUrl}api/Exams?&index=${value-1}&size=${this.state.size}`, {
        //         headers: { Authorization: `Bearer ${token}` },
        //     })
        //     .then((res) => {
        //         if (res.status === 200) {
        //             this.setState({
        //                 loadintable: false,
        //                 count: res.data.pages
        //             });
        //         }
                

        //         var newData = res.data.items.reverse();
        //         newData.map((dat, index) => {
        //             dat.option = (
        //                 <div className="option-parent">
        //                     <button
        //                         onClick={() => this.deleteExam(dat)}
        //                         color="red"
        //                         className="tableOption op-delete"
        //                         size="sm"
        //                     >
        //                         <i className="fi-rr-trash"></i>
        //                     </button>

        //                     <Link to={"/edit-exam/" + dat.id} className="tableOption op-edit">
        //                         <i className="fi-rr-edit"></i>
        //                     </Link>
        //                 </div>
        //             );
        //             dat.questions = (
        //                 <Link className="btn btn-info text-white btn-question-goto" to={"/questions/" + dat.id}>
        //                     الدخول للاسئله
        //                 </Link>
        //             );
        //             dat.index = index + 1;
        //             dat.telegeramLink = (
        //                 <div>
        //                     <a target="_blank" href={dat.telegeramLink}>
        //                         {dat.telegeramLink}
        //                     </a>
        //                 </div>
        //             );

        //             dat.date = dat.dateAndExamminationExpireTime.split("T")[0];

        //             // dat.time = dat.dateAndExamminationExpireTime.split("T")[1];
        //             var time = dat.dateAndExamminationExpireTime.split("T")[1];
        //             var splittedString = time.split(":");
        //             time = splittedString.slice(0, -1).join(":");
        //             time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        //             dat.lectureID = dat.lecture.name;
        //             if (time.length > 1) {
        //                 // If time format correct
        //                 time = time.slice(1); // Remove full string match value
        //                 // time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        //                 time[0] = +time[0] % 12 || 12; // Adjust hours
        //             }
        //             time.join("");
        //             dat.time = time;
        //         });
        //         this.setState({
        //             data: newData,
        //         });
        //     })
        // .catch((error) => {
        //     console.log(error);
        //     this.setState({
        //         loadintable: false,
        //     });
        // });

        this.setState({
            loadintable: true,
        });
        let url = "";
        if(this.state.searchName == ""){
            url = `${baseUrl}api/Exams?&index=${value-1}&size=${this.state.size}`;
        } else{
            url = `${baseUrl}api/Exams/Search?&` + `examName=${this.state.searchName}&index=${value-1}&size=${this.state.size}`
        }
        axios
            .get(url, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        loadintable: false,
                        count: res.data.pages
                    });
                }
                

                var newData = res.data.items.reverse();
                newData.map((dat, index) => {
                    dat.option = (
                        <div className="option-parent">
                            <button
                                onClick={() => this.deleteExam(dat)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>

                            <Link to={"/edit-exam/" + dat.id} className="tableOption op-edit">
                                <i className="fi-rr-edit"></i>
                            </Link>
                        </div>
                    );
                    dat.questions = (
                        <Link className="btn btn-info text-white btn-question-goto" to={"/questions/" + dat.id}>
                            الدخول للاسئله
                        </Link>
                    );
                    dat.index = index + 1;
                    dat.telegeramLink = (
                        <div>
                            <a target="_blank" href={dat.telegeramLink}>
                                {dat.telegeramLink}
                            </a>
                        </div>
                    );

                    dat.date = dat.dateAndExamminationExpireTime.split("T")[0];

                    // dat.time = dat.dateAndExamminationExpireTime.split("T")[1];
                    var time = dat.dateAndExamminationExpireTime.split("T")[1];
                    var splittedString = time.split(":");
                    time = splittedString.slice(0, -1).join(":");
                    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                    dat.lectureID = dat.lecture.name;
                    if (time.length > 1) {
                        // If time format correct
                        time = time.slice(1); // Remove full string match value
                        // time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                        time[0] = +time[0] % 12 || 12; // Adjust hours
                    }
                    time.join("");
                    dat.time = time;
                });
                this.setState({
                    data: newData,
                });
            })
        .catch((error) => {
            console.log(error);
            toast.error("هناك خطا ما")
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
        // const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";

        let x = document.getElementsByClassName("pagination")[0].remove();
        const URL_PASE = "https://localhost:44334/api/";
        axios
            .get(`${baseUrl}api/Exams?&index=${this.state.index}&size=${this.state.size}`, {
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
                //         this.setState({ index: i });
                //         axios
                //             .get(`${baseUrl}api/Exams?&index=${this.state.index}&size=${this.state.size}`, {
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
                //                                 onClick={() => this.deleteExam(dat)}
                //                                 color="red"
                //                                 className="tableOption op-delete"
                //                                 size="sm"
                //                             >
                //                                 <i className="fi-rr-trash"></i>
                //                             </button>

                //                             <Link to={"/edit-exam/" + dat.id} className="tableOption op-edit">
                //                                 <i className="fi-rr-edit"></i>
                //                             </Link>
                //                         </div>
                //                     );
                //                     dat.questions = (
                //                         <Link
                //                             className="btn btn-info text-white btn-question-goto"
                //                             to={"/questions/" + dat.id}
                //                         >
                //                             الدخول للاسئله
                //                         </Link>
                //                     );
                //                     dat.index = index + 1;
                //                     dat.telegeramLink = (
                //                         <div>
                //                             <a target="_blank" href={dat.telegeramLink}>
                //                                 {dat.telegeramLink}
                //                             </a>
                //                         </div>
                //                     );

                //                     dat.date = dat.dateAndExamminationExpireTime.split("T")[0];

                //                     // dat.time = dat.dateAndExamminationExpireTime.split("T")[1];
                //                     var time = dat.dateAndExamminationExpireTime.split("T")[1];
                //                     var splittedString = time.split(":");
                //                     time = splittedString.slice(0, -1).join(":");
                //                     time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                //                     dat.lectureID = dat.lecture.name;
                //                     if (time.length > 1) {
                //                         // If time format correct
                //                         time = time.slice(1); // Remove full string match value
                //                         // time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                //                         time[0] = +time[0] % 12 || 12; // Adjust hours
                //                     }
                //                     time.join("");
                //                     dat.time = time;
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
                                onClick={() => this.deleteExam(dat)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>

                            <Link to={"/edit-exam/" + dat.id} className="tableOption op-edit">
                                <i className="fi-rr-edit"></i>
                            </Link>
                        </div>
                    );
                    dat.questions = (
                        <Link className="btn btn-info text-white btn-question-goto" to={"/questions/" + dat.id}>
                            الدخول للاسئله
                        </Link>
                    );
                    dat.index = index + 1;
                    dat.telegeramLink = (
                        <div>
                            <a target="_blank" href={dat.telegeramLink}>
                                {dat.telegeramLink}
                            </a>
                        </div>
                    );

                    dat.date = dat.dateAndExamminationExpireTime.split("T")[0];

                    // dat.time = dat.dateAndExamminationExpireTime.split("T")[1];
                    var time = dat.dateAndExamminationExpireTime.split("T")[1];
                    var splittedString = time.split(":");
                    time = splittedString.slice(0, -1).join(":");
                    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                    dat.lectureID = dat.lecture.name;
                    if (time.length > 1) {
                        // If time format correct
                        time = time.slice(1); // Remove full string match value
                        // time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                        time[0] = +time[0] % 12 || 12; // Adjust hours
                    }
                    time.join("");
                    dat.time = time;
                });
                this.setState({
                    data: newData,
                });
            });

            const searchBox = document.querySelector('[aria-label="Search"]');
            searchBox.value = "";
    
            searchBox.addEventListener("keyup", () => {
                this.setState({ loadintable: true, searchName: searchBox.value });
                if (searchBox.value != "") {
                    axios
                    .get(`${baseUrl}api/Exams/Search?&` + `examName=${searchBox.value}&index=${this.state.index}&size=${this.state.size}`, {
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
                            //         this.setState({ index: i });
                            //         axios
                            //             .get(`${baseUrl}api/Exams?&index=${this.state.index}&size=${this.state.size}`, {
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
                            //                                 onClick={() => this.deleteExam(dat)}
                            //                                 color="red"
                            //                                 className="tableOption op-delete"
                            //                                 size="sm"
                            //                             >
                            //                                 <i className="fi-rr-trash"></i>
                            //                             </button>
            
                            //                             <Link to={"/edit-exam/" + dat.id} className="tableOption op-edit">
                            //                                 <i className="fi-rr-edit"></i>
                            //                             </Link>
                            //                         </div>
                            //                     );
                            //                     dat.questions = (
                            //                         <Link
                            //                             className="btn btn-info text-white btn-question-goto"
                            //                             to={"/questions/" + dat.id}
                            //                         >
                            //                             الدخول للاسئله
                            //                         </Link>
                            //                     );
                            //                     dat.index = index + 1;
                            //                     dat.telegeramLink = (
                            //                         <div>
                            //                             <a target="_blank" href={dat.telegeramLink}>
                            //                                 {dat.telegeramLink}
                            //                             </a>
                            //                         </div>
                            //                     );
            
                            //                     dat.date = dat.dateAndExamminationExpireTime.split("T")[0];
            
                            //                     // dat.time = dat.dateAndExamminationExpireTime.split("T")[1];
                            //                     var time = dat.dateAndExamminationExpireTime.split("T")[1];
                            //                     var splittedString = time.split(":");
                            //                     time = splittedString.slice(0, -1).join(":");
                            //                     time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                            //                     dat.lectureID = dat.lecture.name;
                            //                     if (time.length > 1) {
                            //                         // If time format correct
                            //                         time = time.slice(1); // Remove full string match value
                            //                         // time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                            //                         time[0] = +time[0] % 12 || 12; // Adjust hours
                            //                     }
                            //                     time.join("");
                            //                     dat.time = time;
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
                                            onClick={() => this.deleteExam(dat)}
                                            color="red"
                                            className="tableOption op-delete"
                                            size="sm"
                                        >
                                            <i className="fi-rr-trash"></i>
                                        </button>
            
                                        <Link to={"/edit-exam/" + dat.id} className="tableOption op-edit">
                                            <i className="fi-rr-edit"></i>
                                        </Link>
                                    </div>
                                );
                                dat.questions = (
                                    <Link className="btn btn-info text-white btn-question-goto" to={"/questions/" + dat.id}>
                                        الدخول للاسئله
                                    </Link>
                                );
                                dat.index = index + 1;
                                dat.telegeramLink = (
                                    <div>
                                        <a target="_blank" href={dat.telegeramLink}>
                                            {dat.telegeramLink}
                                        </a>
                                    </div>
                                );
            
                                dat.date = dat.dateAndExamminationExpireTime.split("T")[0];
            
                                // dat.time = dat.dateAndExamminationExpireTime.split("T")[1];
                                var time = dat.dateAndExamminationExpireTime.split("T")[1];
                                var splittedString = time.split(":");
                                time = splittedString.slice(0, -1).join(":");
                                time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                                dat.lectureID = dat.lecture.name;
                                if (time.length > 1) {
                                    // If time format correct
                                    time = time.slice(1); // Remove full string match value
                                    // time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                                    time[0] = +time[0] % 12 || 12; // Adjust hours
                                }
                                time.join("");
                                dat.time = time;
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
                } else {
                    // this.setState({ filteredData: this.state.data });
                    axios
                    .get(`${baseUrl}api/Exams?&index=${this.state.index}&size=${this.state.size}`, {
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
                            //         this.setState({ index: i });
                            //         axios
                            //             .get(`${baseUrl}api/Exams?&index=${this.state.index}&size=${this.state.size}`, {
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
                            //                                 onClick={() => this.deleteExam(dat)}
                            //                                 color="red"
                            //                                 className="tableOption op-delete"
                            //                                 size="sm"
                            //                             >
                            //                                 <i className="fi-rr-trash"></i>
                            //                             </button>
            
                            //                             <Link to={"/edit-exam/" + dat.id} className="tableOption op-edit">
                            //                                 <i className="fi-rr-edit"></i>
                            //                             </Link>
                            //                         </div>
                            //                     );
                            //                     dat.questions = (
                            //                         <Link
                            //                             className="btn btn-info text-white btn-question-goto"
                            //                             to={"/questions/" + dat.id}
                            //                         >
                            //                             الدخول للاسئله
                            //                         </Link>
                            //                     );
                            //                     dat.index = index + 1;
                            //                     dat.telegeramLink = (
                            //                         <div>
                            //                             <a target="_blank" href={dat.telegeramLink}>
                            //                                 {dat.telegeramLink}
                            //                             </a>
                            //                         </div>
                            //                     );
            
                            //                     dat.date = dat.dateAndExamminationExpireTime.split("T")[0];
            
                            //                     // dat.time = dat.dateAndExamminationExpireTime.split("T")[1];
                            //                     var time = dat.dateAndExamminationExpireTime.split("T")[1];
                            //                     var splittedString = time.split(":");
                            //                     time = splittedString.slice(0, -1).join(":");
                            //                     time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                            //                     dat.lectureID = dat.lecture.name;
                            //                     if (time.length > 1) {
                            //                         // If time format correct
                            //                         time = time.slice(1); // Remove full string match value
                            //                         // time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                            //                         time[0] = +time[0] % 12 || 12; // Adjust hours
                            //                     }
                            //                     time.join("");
                            //                     dat.time = time;
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
                                            onClick={() => this.deleteExam(dat)}
                                            color="red"
                                            className="tableOption op-delete"
                                            size="sm"
                                        >
                                            <i className="fi-rr-trash"></i>
                                        </button>
            
                                        <Link to={"/edit-exam/" + dat.id} className="tableOption op-edit">
                                            <i className="fi-rr-edit"></i>
                                        </Link>
                                    </div>
                                );
                                dat.questions = (
                                    <Link className="btn btn-info text-white btn-question-goto" to={"/questions/" + dat.id}>
                                        الدخول للاسئله
                                    </Link>
                                );
                                dat.index = index + 1;
                                dat.telegeramLink = (
                                    <div>
                                        <a target="_blank" href={dat.telegeramLink}>
                                            {dat.telegeramLink}
                                        </a>
                                    </div>
                                );
            
                                dat.date = dat.dateAndExamminationExpireTime.split("T")[0];
            
                                // dat.time = dat.dateAndExamminationExpireTime.split("T")[1];
                                var time = dat.dateAndExamminationExpireTime.split("T")[1];
                                var splittedString = time.split(":");
                                time = splittedString.slice(0, -1).join(":");
                                time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                                dat.lectureID = dat.lecture.name;
                                if (time.length > 1) {
                                    // If time format correct
                                    time = time.slice(1); // Remove full string match value
                                    // time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                                    time[0] = +time[0] % 12 || 12; // Adjust hours
                                }
                                time.join("");
                                dat.time = time;
                            });
                            this.setState({
                                data: newData,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            });
    }

    deleteExam = async (dat) => {
        this.setState({
            loadintable: true,
        });
        // const PASE_URL = "http://hossam1234-001-site1.ftempurl.com/api/";
        const PASE_URL = "https://localhost:44334/api/";

        let oldData = [...this.state.data];

        let newDate = this.state.data.filter((item) => item.id !== dat.id);
        this.setState({
            data: newDate,
            loadintable: true,
        });

        try {
            await axios
                .delete(`${baseUrl}api/Exams/` + dat.id, {
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
                { label: "الاسم", field: "name" },
                { label: "الدرجه", field: "degree" },
                { label: "المحاضرة", field: "lectureID" },
                { label: "الاسئله", field: "questions" },
                { label: "التاريخ", field: "date" },
                { label: "الوقت", field: "time" },
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
                        <Stack spacing={2}>
                            <Pagination style={{ direction: 'ltr' }} count={count} shape="rounded" onChange={this.handlePaginationChange}/>
                        </Stack>
                    </div>
                </div>
            </div>
        );
    }
}
