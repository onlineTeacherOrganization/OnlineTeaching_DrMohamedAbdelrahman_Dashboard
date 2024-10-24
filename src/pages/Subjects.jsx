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

class Subjects extends Component {
  state = {
    data: [],
    loadintable: true,
    exportedFile: null,
    size: 10,
    index: 0,
    count: 0,
  };

  handlePaginationChange = (event, value) => {
    this.setState({
      loadintable: true,
    });
    axios
      .get(
        `${baseUrl}api/Subjects?&index=${value - 1}&size=${this.state.size}`,
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
            <div className="option-parent" key={index}>
              <button
                onClick={() => this.deleteSubject(dat)}
                color="red"
                className="tableOption op-delete"
                size="sm"
              >
                <i className="fi-rr-trash"></i>
              </button>

              <Link
                to={"/edit-subject/" + dat.id}
                className="tableOption op-edit"
              >
                <i className="fi-rr-edit"></i>
              </Link>
            </div>
          );

          dat.theImage = (
            <div
              className="tableImg"
              style={{ backgroundImage: `url(${baseUrl + dat.imagePath})` }}
            ></div>
          );

          if (dat.level != null) {
            dat.levelname = dat.level.levelName;
          }

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

    // const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
    const URL_PASE = "https://localhost:44334/api/";
    let x = document.getElementsByClassName("pagination")[0].remove();

    axios
      .get(
        `${baseUrl}api/Subjects?&index=${this.state.index}&size=${this.state.size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          this.setState({
            loadintable: false,
            count: res.data.pages,
          });
        }

        var newData = res.data.items.reverse();
        newData.map((dat, index) => {
          dat.option = (
            <div className="option-parent" key={index}>
              <button
                onClick={() => this.deleteSubject(dat)}
                color="red"
                className="tableOption op-delete"
                size="sm"
              >
                <i className="fi-rr-trash"></i>
              </button>

              <Link
                to={"/edit-subject/" + dat.id}
                className="tableOption op-edit"
              >
                <i className="fi-rr-edit"></i>
              </Link>
            </div>
          );

          dat.theImage = (
            <div
              className="tableImg"
              style={{ backgroundImage: `url(${dat.imagePath})` }}
            ></div>
          );

          if (dat.level != null) {
            dat.levelname = dat.level.levelName;
          }

          dat.index = index + 1;
        });
        this.setState({
          data: newData,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  exportToExcel = () => {
    this.setState({
      loadintable: true,
    });
    axios
      .get(`${baseUrl}api/Subjects/DownloadInfo`, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const type = res.headers["content-type"];
        const blob = new Blob([res.data], { type: type, encoding: "UTF-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "file.xlsx";
        link.click();
        this.setState({
          loadintable: false,
        });
        toast.success("تم تحميل الملف بنجاح");
      })
      .catch((error) => {
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
  };

  deleteSubject = async (dat) => {
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
        .delete(`${baseUrl}api/Subjects/` + dat.id, {
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
        { label: "الصورة", field: "theImage" },
        { label: "الاسم", field: "name" },
        { label: "اسم المرحلة", field: "levelname" },
        { label: "الاختيارات", field: "option" },
      ],
      rows: this.state.data,
    };
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>المواد</h5>
          <div className="add-aNew">
            <Link className="add-new-lnk" to="/add-new-subject">
              اضافة مادة
            </Link>

            <br />
            {this.state.data.length > 0 ? (
              <a
                style={{ disabled: this.state.data }}
                disabled={!this.state.data}
                className="add-new-lnk"
                onClick={() => {
                  this.exportToExcel();
                }}
              >
                تصدير البيانات لملف Excel
              </a>
            ) : null}
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
                <div class="sp sp-volume"></div>
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

export default Subjects;
