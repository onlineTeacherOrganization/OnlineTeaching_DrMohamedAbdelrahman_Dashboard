import React, { Component } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
import { sourceBaseForImage } from "../assets/source";
class Dashboard extends Component {
  state = {
    homeNymber: {},
    loading: true,
  };

  componentDidMount() {
    // axios.get(`http://hossam1234-001-site1.ftempurl.com/api/Home`).then((res) => {
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

    axios.get(`${baseUrl}api/Home`).then((res) => {
      if (res.status == 200) {
        this.setState({
          homeNymber: res.data,
          loading: false,
        });
      }
    });
  }

  render() {
    const { homeNymber, loading } = this.state;
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>الرئيسية</h5>
        </div>
        <div className="dashboard-content">
          <div className="statistics">
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-4">
                <div className="statics-card">
                  <h5 className="card-title">عدد الطلبه</h5>
                  <div className="card-body">
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <h5 className="card-number">
                          {homeNymber.studentsCount}
                        </h5>
                        <img
                          src={`${sourceBaseForImage}/download1.png`}
                          alt=""
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4">
                <div className="statics-card">
                  <h5 className="card-title">عدد الملفات</h5>
                  <div className="card-body">
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <h5 className="card-number">{homeNymber.filesCount}</h5>
                        <img
                          src={`${sourceBaseForImage}/download1.png`}
                          alt=""
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4">
                <div className="statics-card">
                  <h5 className="card-title">عدد المحاضرات</h5>
                  <div className="card-body">
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <h5 className="card-number">
                          {homeNymber.lecturesCount}
                        </h5>
                        <img
                          src={`${sourceBaseForImage}/download1.png`}
                          alt=""
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
