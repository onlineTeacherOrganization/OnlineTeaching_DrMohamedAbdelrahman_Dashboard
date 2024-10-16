import axios from "axios";
import ShowIcon from "@material-ui/icons/Visibility";
import ShowOffIcon from "@material-ui/icons/VisibilityOff";
import React, { Component } from "react";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { baseUrl } from "../assets/baseUrl";
import { sourceBaseForImage } from "../assets/source";

class Login extends Component {
  state = {
    token: "",
    email: "",
    password: "",
    loadintable: false,
    showPassword: false,
  };

  render() {
    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    const loginSubmit = async (e) => {
      this.setState({
        loadintable: true,
      });

      e.preventDefault();
      // this.props.history.push("/dashboard")

      // const propToken = this.props.token;

      const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
      const state = { ...this.state };
      delete state.token;
      delete state.loadintable;
      await axios
        .post(`${baseUrl}api/Auth/Login`, state)
        .then((res) => {
          const user = jwt_decode(res.data.message);
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
            this.setState({
              token: res.data.message,
              loadintable: false,
            });
            sessionStorage.setItem("token", JSON.stringify(this.state.token));
            toast.success("تم تسجيل الدخول بنجاح");
            this.props.history.push("/home");
            window.location.reload();
            console.log("login");
          }
        })
        .catch((er) => {
          if (er.response.status === 400) {
            //toast.error(`${er.response.data.message}`);
          }
          this.setState({
            loadintable: false,
          });
        });
    };

    const { email, password, loadintable } = this.state;

    return (
      <div>
        <div className="login">
          <img
            src={`${sourceBaseForImage}/login-af.png`}
            className="loginImgBf"
            alt=""
          />
          <div className="container">
            <div className="form-parent">
              <form onSubmit={loginSubmit} className="login-form">
                <h5 className="login-head">تسجيل الدخول للاعضاء</h5>
                <div className="row">
                  <div className="col-sm-12 col-lg-12">
                    <div className="form-group">
                      <input
                        type="text"
                        name="email"
                        id=""
                        className="form-control"
                        placeholder="اسم المستخدم"
                        onChange={handelChange}
                        value={email}
                      />
                    </div>
                  </div>
                  <div
                    className="col-sm-12 col-lg-12"
                    style={{ marginBottom: 10 + "px" }}
                  >
                    <div className="input-group">
                      <input
                        type={this.state.showPassword ? "text" : "password"}
                        name="password"
                        id=""
                        className="form-control"
                        placeholder="كلمة المرور"
                        onChange={handelChange}
                        value={password}
                      />
                      <button
                        className="btn "
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({
                            showPassword: !this.state.showPassword,
                          });
                        }}
                      >
                        {" "}
                        {this.state.showPassword ? (
                          <ShowOffIcon />
                        ) : (
                          <ShowIcon />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-12">
                    <div className="btn-subm">
                      <button type="submit" className="btn btn-block btn-black">
                        تسجيل الدخول
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {loadintable ? (
                <div className="loading-par">
                  <div className="sp sp-volume"></div>
                  <h5>برجاء الانتظار</h5>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
