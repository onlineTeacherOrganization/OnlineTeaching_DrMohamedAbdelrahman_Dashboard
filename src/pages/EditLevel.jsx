import React, { Component } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import joi from "joi-browser";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

export default class EditLevel extends Component {
  state = {
    id: 0,
    levelName: "",
    telegeramLink: "",
    loadintable: true,
    errors: {},
  };

  schema = {
    levelName: joi.string().required(),
    telegeramLink: joi.string().required(),
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
    const levelId = this.props.match.params.id;
    // const token = GetUserToken();
    const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
    axios
      .get(`${baseUrl}api/Levels/` + levelId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        this.setState({
          levelName: res.data.levelName,
          telegeramLink: res.data.telegeramLink,
          loadintable: false,
        });
      });
  }

  validate = () => {
    let state = { ...this.state };
    delete state.errors;
    delete state.loadintable;
    delete state.id;
    const res = joi.validate(state, this.schema, { abortEarly: false });
    if (res.error === null) {
      this.setState({
        errors: {},
      });
      return res.error;
    }

    let newError = {};
    res.error.details.map((er) => {
      er.message = "هذا الحقل مطلوب";
      newError[er.path] = er.message;
    });
    this.setState({
      errors: newError,
    });

    return res.error;
  };

  render() {
    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    const newLevelSubmit = (e) => {
      e.preventDefault();
      this.setState({
        loadintable: true,
      });
      const errors = this.validate();
      if (errors === null) {
        // const token = GetUserToken();
        const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        const state = { ...this.state };
        const levelId = this.props.match.params.id;
        delete state.loadintable;
        delete state.errors;
        state.id = levelId;

        axios
          .put(`${baseUrl}api/Levels/${levelId}`, state, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            toast.success(`${res.data}`);
            this.setState({
              loadintable: false,
            });
            if (res.status === 200) {
              this.props.history.replace("/levels");
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              var tifs = error.response.data.errors;
              if (tifs != null) {
                Object.keys(tifs).map(function (key) {
                  toast.error(`${tifs[key]}`);
                });
              } else {
                toast.error("تاكد من البيانات");
              }
              this.setState({
                loadintable: false,
              });
            }
          });
      } else {
        toast.error(`هناك بعض الاخطاء`);
        this.setState({
          loadintable: false,
        });
      }
    };

    const { levelName, telegeramLink, loadintable, errors } = this.state;
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5> تعديل المرحلة {levelName} </h5>
        </div>
        <div className="dashboard-content">
          <div className="dasboard-box">
            <form action="" onSubmit={newLevelSubmit} className="formStyle">
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="levelname">اسم المرحله</label>
                    <input
                      type="text"
                      name="levelName"
                      id="levelname"
                      className="form-control"
                      placeholder="مثال:الرياضايات"
                      value={levelName}
                      onChange={handelChange}
                    />
                    <span className="er">{errors.levelName}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="teleglink">رابط تيلجرام</label>
                    <input
                      type="text"
                      name="telegeramLink"
                      id="teleglink"
                      className="form-control"
                      placeholder="مثال: http://telegram/gg/f"
                      value={telegeramLink}
                      onChange={handelChange}
                    />
                    <span className="er">{errors.telegeramLink}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="btn-submit">
                    <button className="btn" type="submit">
                      تعديل
                    </button>
                    <button
                      className="btn btn-warning bg-warning ml-3"
                      onClick={() => {
                        this.props.history.replace("/levels");
                      }}
                    >
                      الغاء
                    </button>
                  </div>
                </div>
              </div>
            </form>
            {loadintable ? (
              <div className="loading-par">
                <div class="sp sp-volume"></div>
                <h5>برجاء الانتظار</h5>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
