import React, { Component } from "react";

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

export default class ReOpenLectures extends Component {
  state = {
    data: [],
    loadintable: true,
    index: 0,
    size: 10,
    count: 0,
  };

  handlePaginationChange = (event, value) => {
    this.setState({
      loadintable: true,
    });
    axios
      .get(
        `${baseUrl}api/StudyLectures/Get_ReOpenWatchingRequests?index=${
          value - 1
        }&size=${this.state.size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
                onClick={() => this.acceptReOpen(dat)}
                color="red"
                className="tableOption op-done"
                size="sm"
              >
                <i className="fi-rr-check"></i>
              </button>
            </div>
          );
          dat.checkBox = (
            <input
              className="checkers"
              type="checkbox"
              onChange={(e) => this.onRowCheckChanged(e, index)}
              checked={dat.isChecked}
              name={index}
              id={index}
            />
          );
          dat.index = index + 1;
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
    if (
      sessionStorage.getItem("token") != null ||
      sessionStorage.getItem("token") != undefined
    ) {
      const user = jwt_decode(sessionStorage.getItem("token"));
      const userRole =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const userEmail =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
      const userName =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
      const userIdentifier =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
      const userRoleRes = user[`${userRole}`];
      const userEmailRes = user[`${userEmail}`];
      const userNameRes = user[`${userName}`];
      const userIDRes = user[`${userIdentifier}`];

      if (userRoleRes === "Admin") {
      } else {
        sessionStorage.clear();
        this.props.history.push("/");
        window.location.reload();
      }
    }
    document.querySelector('[aria-label="Previous"]').innerHTML = "السابق";
    document.querySelector('[aria-label="Next"]').innerHTML = "التالي";
    document.querySelector(
      ".dataTables_length label"
    ).childNodes[0].textContent = "أظهار الحقول";
    document.querySelector(".mdb-datatable-filter input").placeholder = "بحث";
    const token = GetUserToken();
    document.getElementsByClassName("pagination")[0].remove();
    axios
      .get(
        `${baseUrl}api/StudyLectures/Get_ReOpenWatchingRequests?index=${this.state.index}&size=${this.state.size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
                onClick={() => this.acceptReOpen(dat)}
                color="red"
                className="tableOption op-done"
                size="sm"
              >
                <i className="fi-rr-check"></i>
              </button>
            </div>
          );
          dat.checkBox = (
            <input
              className="checkers"
              type="checkbox"
              onChange={(e) => this.onRowCheckChanged(e, index)}
              checked={dat.isChecked}
              name={index}
              id={index}
            />
          );
          dat.index = index + 1;
        });
        this.setState({
          data: newData,
        });

        // if (res.status === 200) {
        //     this.setState({
        //         loadintable: false,
        //     });
        // }

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
        //             .get(`${baseUrl}api/StudyLectures/Get_ReOpenWatchingRequests?&index=${this.state.index}&size=${this.state.size}`, {
        //                 headers: {
        //                     Authorization: `Bearer ${token}`,
        //                 },
        //             })
        //             .then((ress) => {
        //                 var newData = ress.data.reverse();
        //                 newData.map((dat, index) => {
        //                     dat.option = (
        //                         <div className="option-parent">
        //                             <button
        //                                 onClick={() => this.acceptReOpen(dat)}
        //                                 color="red"
        //                                 className="tableOption op-done"
        //                                 size="sm"
        //                             >
        //                                 <i className="fi-rr-check"></i>
        //                             </button>
        //                         </div>
        //                     );
        //                     dat.index = index + 1;
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

        // var newData = res.data.items.reverse();
        // var newData = res.data.items.reverse();
        //                 newData.map((dat, index) => {
        //                     dat.option = (
        //                         <div className="option-parent">
        //                             <button
        //                                 onClick={() => this.acceptReOpen(dat)}
        //                                 color="red"
        //                                 className="tableOption op-done"
        //                                 size="sm"
        //                             >
        //                                 <i className="fi-rr-check"></i>
        //                             </button>
        //                         </div>
        //                     );
        //                     dat.index = index + 1;
        //                 });
        //                 this.setState({
        //                     data: newData,
        //                 });
      });
  }

  acceptReOpen = (dat) => {
    this.setState({
      loadintable: true,
    });

    const reobj = {
      studentID: parseInt(dat.studentID),
      lectureID: parseInt(dat.lectureID),
      lectureName: dat.lectureName,
      studentName: dat.studentName,
      isConfirmed: true,
      reason: dat.reason,
    };
    axios
      .post(`${baseUrl}api/StudyLectures/Confirm_OpenWatching `, reobj, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success("تم اعادة فتح المحاضرة");
          this.setState({ loadintable: false });
          window.location.reload();
        }
      })
      .catch((error) => {
        toast.error("يوجد مشكلة ما");
      });

    let newDate = this.state.data.filter((item) => item.id != dat.id);
    this.setState({
      data: newDate,
      loadintable: true,
    });
  };
  onRowCheckChanged = (e, index) => {
    const { id, checked } = e.target;
    console.log(e.target);
    if (id === "selectAll") {
      if (this.state.filteredData != null && this.state.filteredData != []) {
        let tempSubscribers = this.state.filteredData.map((subscriber) => {
          var x = subscriber;
          x["isChecked"] = checked;
          return x;
        });

        this.setState({ filteredData: tempSubscribers });
        var xx = document.getElementsByClassName("checkers");
        for (let i = 0; i < xx.length; i++) {
          xx[i].checked = checked;
        }
      } else {
        let tempSubscribers = this.state.data.map((subscriber) => {
          var x = subscriber;
          x["isChecked"] = checked;
          return x;
        });
        this.setState({ newData: tempSubscribers });

        var xx = document.getElementsByClassName("checkers");
        for (let i = 0; i < xx.length; i++) {
          xx[i].checked = checked;
        }
      }
    } else {
      if (this.state.filteredData != null && this.state.filteredData != []) {
        let tempSubscribers = this.state.filteredData.map(
          (subscriber, index2) => {
            if (index2 === index) {
              var x = subscriber;
              x["isChecked"] = checked;
              return x;
            } else {
              var x = subscriber;
              if (subscriber.isChecked != null) {
                x["isChecked"] = subscriber.isChecked;
              } else {
                x["isChecked"] = false;
              }
              return x;
            }
          }
        );
        this.setState({ filteredData: tempSubscribers });

        let truesAndFalses = [];
        this.state.filteredData.map((subscriber, index) => {
          truesAndFalses.push(subscriber.isChecked);
          if (truesAndFalses.includes(true) && truesAndFalses.includes(false)) {
            document.getElementById("selectAll").checked = false;
          } else {
            if (checked === true) {
              document.getElementById("selectAll").checked = true;
            } else {
              document.getElementById("selectAll").checked = false;
            }
          }
        });
      } else {
        let tempSubscribers = this.state.data.map((subscriber, index2) => {
          if (index2 === index) {
            var x = subscriber;
            x["isChecked"] = checked;
            return x;
          } else {
            var x = subscriber;
            if (subscriber.isChecked != null) {
              x["isChecked"] = subscriber.isChecked;
            } else {
              x["isChecked"] = false;
            }
            return x;
          }
        });
        this.setState({ newData: tempSubscribers });

        let truesAndFalses = [];
        console.log("this.state.newData", this.state.newData);
        this.state.data.map((subscriber, index) => {
          truesAndFalses.push(subscriber.isChecked);
          if (truesAndFalses.includes(true) && truesAndFalses.includes(false)) {
            document.getElementById("selectAll").checked = false;
          } else {
            if (checked === true) {
              document.getElementById("selectAll").checked = true;
            } else {
              document.getElementById("selectAll").checked = false;
            }
          }
        });
      }
    }
  };
  acceptMany = () => {
    console.log("this.state.newData", this.state.newData);
    const acceptArr = [];
    if (this.state.filteredData != null && this.state.filteredData != []) {
      this.state.filteredData.map((subscriber) => {
        if (subscriber) {
          if (subscriber.isChecked === true) {
            const acceptObject = {
              StudentID: subscriber.studentID,
              lectureID: parseInt(subscriber.lectureID),
              lectureName: subscriber.lectureName,
              studentName: subscriber.studentName,
              isConfirmed: true,
              reason: subscriber.reason,
            };
            acceptArr.push(acceptObject);
          }
        }
      });
    } else {
      this.state.newData.map((subscriber) => {
        if (subscriber) {
          if (subscriber.isChecked === true) {
            const acceptObject = {
              StudentID: subscriber.studentID,
              lectureID: parseInt(subscriber.lectureID),
              lectureName: subscriber.lectureName,
              studentName: subscriber.studentName,
              isConfirmed: true,
              reason: subscriber.reason,
            };
            acceptArr.push(acceptObject);
          }
        }
      });
    }
    console.log(acceptArr);
    try {
      fetch(`${baseUrl}api/StudyLectures/Confirm_OpenWatching`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(acceptArr),
      }).then((res) => {
        if (res.status === 200) {
          toast.success("تم اعادة فتح المحاضرة ");
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
    const { loadintable, count } = this.state;
    const datatable = {
      columns: [
        { label: "", field: "checkBox" },
        { label: "الترتيب", field: "index" },
        { label: " اسم المادة", field: "lectureName" },
        { label: "اسم الطالب", field: "studentName" },
        { label: "السبب", field: "reason" },
        { label: "الاختيارات", field: "option" },
      ],
      rows: this.state.data,
    };
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>اعادة فتح محاضرات</h5>
        </div>
        <div className="dashboard-content">
          <div className="dasboard-box">
            <>
              <input
                type="checkbox"
                name="selectAll"
                id="selectAll"
                onChange={(e) => this.onRowCheckChanged(e, e)}
                style={{
                  marginLeft: 5 + "px",
                }}
              />
              <span>تحديد الكل</span>

              <div className="option-parent">
                <button
                  onClick={() => this.acceptMany()}
                  className="tableOption op-done"
                >
                  <i className="fi-rr-check"></i>
                </button>

                <button
                  onClick={() => this.deleteMany()}
                  color="red"
                  className="tableOption op-delete"
                  size="sm"
                >
                  <i className="fi-rr-trash"></i>
                </button>
              </div>
            </>
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
              <Pagination
                style={{ direction: "ltr" }}
                count={count}
                shape="rounded"
                onChange={this.handlePaginationChange}
              />
            </Stack>
          </div>
        </div>
      </div>
    );
  }
}
