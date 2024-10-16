import React, { Component } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import joi from "joi-browser";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

export default class AddNewLevels extends Component {
  state = {
    id: 0,
    description: "",
    loadintable: false,
    errors: {},
  };

  schema = {
    description: joi.string().required(),
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
        delete state.loadintable;

        axios
          .post(`${baseUrl}api/Reviews`, state, {
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
              Object.keys(tifs).map(function (key) {
                console.log(tifs[key]);
                toast.error(`${tifs[key]}`);
              });
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

    const { description, loadintable, errors } = this.state;
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>اضافة مرحله جديدة</h5>
        </div>
        <div className="dashboard-content">
          <div className="dasboard-box">
            <form action="" onSubmit={newLevelSubmit} className="formStyle">
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="mdescription">الوصف</label>
                    <input
                      type="text"
                      name="description"
                      id="mdescription"
                      className="form-control"
                      placeholder="مثال:الرياضايات"
                      value={description}
                      onChange={handelChange}
                    />
                    <span className="er">{errors.description}</span>
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
