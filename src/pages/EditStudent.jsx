import React, { Component } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import joi from "joi-browser";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

export default class EditStudent extends Component {
  state = {
    code: "",
    name: "",
    phone: "",
    city: "",
    levelID: "",
    cities: [],
    levels: [],
    errors: {},
    loadintable: true,
  };

  schema = {
    name: joi.string().required(),
    phone: joi.string().required(),
    city: joi.string().required(),
    levelID: joi.string().required(),
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
    const studentId = this.props.match.params.id;
    const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
    axios
      .get(`${baseUrl}api/Students/` + studentId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          code: res.data.code,
          phone: res.data.phone,
          city: res.data.city,
          levelID: res.data.levelID,
          loadintable: false,
        });
      })
      .catch((er) => {
        console.log(er.response);
      });

    axios
      .get(`${baseUrl}api/Levels`)
      .then((res) => {
        this.setState({
          levels: res.data,
        });
      })
      .catch((er) => {
        console.log(er.response);
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
        const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        const state = { ...this.state };
        const studentId = this.props.match.params.id;
        delete state.loadintable;
        delete state.errors;
        state.code = studentId;

        axios
          .put(`${baseUrl}api/Students/${studentId}`, state, {
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

    const { name, phone, city, levelID, levels, loadintable, errors } =
      this.state;
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5> {name} </h5>
        </div>
        <div className="dashboard-content">
          <div className="dasboard-box">
            <form action="" onSubmit={newLevelSubmit} className="formStyle">
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="stname">الاسم</label>
                    <input
                      type="text"
                      name="name"
                      id="stname"
                      className="form-control"
                      placeholder="مثال:الرياضايات"
                      value={name}
                      onChange={handelChange}
                    />
                    <span className="er">{errors.name}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="stphone">رقم الهاتف</label>
                    <input
                      type="text"
                      name="phone"
                      id="stphone"
                      className="form-control"
                      value={phone}
                      onChange={handelChange}
                    />
                    <span className="er">{errors.phone}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="stcity">المدينة</label>
                    <input
                      type="text"
                      name="city"
                      id="stcity"
                      className="form-control"
                      placeholder="مثال: http://telegram/gg/f"
                      value={city}
                      onChange={handelChange}
                    />
                    <span className="er">{errors.city}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="stLevel">المرحلة</label>
                    <select
                      name="levelID"
                      id="stLevel"
                      className="form-control"
                      value={levelID}
                      onChange={handelChange}
                    >
                      {levels.map((lev) => (
                        <option value={lev.id}> {lev.levelName} </option>
                      ))}
                    </select>
                    <span className="er">{errors.levelID}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="btn-submit">
                    <button className="btn">اضافة</button>
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
