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
const token = GetUserToken();

export default class Levels extends Component {
  state = {
    data: [],
    loadintable: true,
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
    document.querySelector(
      ".dataTables_length label"
    ).childNodes[0].textContent = "أظهار الحقول";
    document.querySelector(".mdb-datatable-filter input").placeholder = "بحث";
    const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
    axios
      .get(`${baseUrl}api/Levels`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            loadintable: false,
          });
        }
        var newData = res.data.items.reverse();
        newData.map((dat, index) => {
          dat.option = (
            <div className="option-parent">
              {/* <button
              onClick={() => this.deleteLevels(dat)}
              color="red"
              className="tableOption op-delete"
              size="sm"
            >
              <i className="fi-rr-trash"></i>
            </button> */}

              <Link
                to={"/edit-level/" + dat.id}
                className="tableOption op-edit"
              >
                <i className="fi-rr-edit"></i>
              </Link>
            </div>
          );
          dat.index = index + 1;
          dat.telegeramLink = (
            <a
              className="btn btn-info text-white btn-question-goto"
              target="_blank"
              href={dat.telegeramLink}
            >
              رابط تيلجرام
            </a>
          );
        });
        this.setState({
          data: newData,
        });
      });
  }

  deleteLevels = async (dat) => {
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
        .delete(`${baseUrl}api/Levels/` + dat.id, {
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
    const { loadintable } = this.state;
    const datatable = {
      columns: [
        { label: "الترتيب", field: "index" },
        { label: "الاسم", field: "levelName" },
        { label: "رابط تيليجرام", field: "telegeramLink" },
        { label: "الاختيارات", field: "option" },
      ],
      rows: this.state.data,
    };
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>المراحل</h5>
          <div className="add-aNew">
            <Link className="add-new-lnk" to="/add-new-level">
              اضافة مرحلة
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
