import React, { Component } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// mdreact
import { MDBDataTable } from "mdbreact";

import joi from "joi-browser";

// axios
import axios from "axios";
import { toast } from "react-toastify";
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

export default class Settings extends Component {
  state = {
    id: 0,
    name: "",
    description: "",
    address: "",
    phoneNumber: "",
    secretarialPhoneNumber: "",
    vodafonCachPhoneNumber: "",
    activationSubscriptionPhoneNumber: "",
    facebookLink: "",
    whatsappLink: "",
    telegramLink: "",
    FormFile: null,
    FileName: "",
    File: "",
    loadintable: true,
    errors: {},
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
    this.setState({
      loadintable: true,
    });
    // const PASE_URL = "http://hossam1234-001-site1.ftempurl.com/api/";
    const PASE_URL = "https://localhost:44334/api/";

    axios
      .get(`${baseUrl}api/Setting`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const newData = res.data;

        this.setState({
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          address: res.data.address,
          phoneNumber: res.data.phoneNumber,
          secretarialPhoneNumber: res.data.secretarialPhoneNumber,
          vodafonCachPhoneNumber: res.data.vodafonCachPhoneNumber,
          activationSubscriptionPhoneNumber:
            res.data.activationSubscriptionPhoneNumber,
          facebookLink: res.data.facebookLink,
          whatsappLink: res.data.whatsappLink,
          telegramLink: res.data.telegramLink,
          File: res.data.file,
          FileName: res.data.fileName,
        });
        if (res.status === 200) {
          this.setState({
            loadintable: false,
          });
        }
      });
  }

  schema = {
    name: joi.string().required(),
    description: joi.string().required(),
    address: joi.string().required(),
    phoneNumber: joi.string().required(),
    secretarialPhoneNumber: joi.string().required(),
    vodafonCachPhoneNumber: joi.string().required(),
    activationSubscriptionPhoneNumber: joi.string().required(),
    facebookLink: joi.string().required(),
    whatsappLink: joi.string().required(),
    telegramLink: joi.string().required(),

    FormFile: joi.any(),
  };

  validate = () => {
    let state = { ...this.state };
    delete state.errors;
    delete state.loadintable;
    delete state.id;
    delete state.File;
    delete state.FileName;
    const res = joi.validate(state, this.schema, { abortEarly: false });
    if (res.error === null) {
      this.setState({
        errors: {},
      });
      return res.error;
    } else {
      console.log(res.error);
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

  setFile(e) {
    this.setState({ FormFile: e.target.files[0] });
  }

  render() {
    const {
      name,
      description,
      address,
      phoneNumber,
      secretarialPhoneNumber,
      vodafonCachPhoneNumber,
      activationSubscriptionPhoneNumber,
      facebookLink,
      whatsappLink,
      telegramLink,
      filename,
      loadintable,
      File,
    } = this.state;

    const settingSubmit = (e) => {
      e.preventDefault();
      this.setState({
        loadintable: true,
      });
      const errors = this.validate();
      const state = { ...this.state };

      delete state.loadintable;
      delete state.errors;

      const addedQuestionViewModel = new FormData();
      addedQuestionViewModel.append("Name", state.name);
      addedQuestionViewModel.append("Email", "");
      addedQuestionViewModel.append("Description", state.description);
      addedQuestionViewModel.append("Address", state.address);
      addedQuestionViewModel.append("PhoneNumber", state.phoneNumber);
      addedQuestionViewModel.append(
        "SecretarialPhoneNumber",
        state.secretarialPhoneNumber
      );
      addedQuestionViewModel.append(
        "VodafonCachPhoneNumber",
        state.vodafonCachPhoneNumber
      );
      addedQuestionViewModel.append(
        "ActivationSubscriptionPhoneNumber",
        state.activationSubscriptionPhoneNumber
      );
      addedQuestionViewModel.append("FacebookLink", state.facebookLink);
      addedQuestionViewModel.append("WhatsappLink", state.whatsappLink);
      addedQuestionViewModel.append("TelegramLink", state.telegramLink);
      addedQuestionViewModel.append("FormFile", state.FormFile);
      addedQuestionViewModel.append("FileName", state.FileName);
      if (errors === null) {
        axios
          .put(
            // `http://hossam1234-001-site1.ftempurl.com/api/Setting/1`,
            `${baseUrl}api/Setting/1`,
            addedQuestionViewModel,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              this.setState({
                loadintable: false,
              });
              toast.success(`${res.data}`);
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error("هناك خطا ما");
            this.setState({
              loadintable: false,
            });
          });
      } else {
        this.setState({ loadintable: false });
      }
    };

    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>الأعدادات</h5>
          {/* <div className="add-aNew">
            <Link className="add-new-lnk" to="/add-new-subject">
              اضافة مادة
            </Link>
          </div> */}
        </div>
        <div className="dashboard-content">
          <div className="dasboard-box">
            <form
              action=""
              onSubmit={settingSubmit}
              className="formStyle"
              encType="multipart/form-data"
            >
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="sname">الاسم</label>
                    <input
                      type="text"
                      onChange={handelChange}
                      name="name"
                      id="sname"
                      value={name}
                      className="form-control"
                    />
                  </div>
                  <span className="er"> {this.state.errors.name} </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="sdescription">الوصف</label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={description}
                      name="description"
                      id="sdescription"
                      className="form-control"
                    />
                  </div>
                  <span className="er"> {this.state.errors.description} </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="saddress">العنوان</label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={address}
                      name="address"
                      id="saddress"
                      className="form-control"
                    />
                  </div>
                  <span className="er"> {this.state.errors.address} </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="sphoneNumber">الهاتف</label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={phoneNumber}
                      name="phoneNumber"
                      id="sphoneNumber"
                      className="form-control"
                    />
                  </div>
                  <span className="er"> {this.state.errors.phoneNumber} </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="ssecretarialPhoneNumber">
                      رقم السكرتاريه
                    </label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={secretarialPhoneNumber}
                      name="secretarialPhoneNumber"
                      id="ssecretarialPhoneNumber"
                      className="form-control"
                    />
                  </div>
                  <span className="er">
                    {" "}
                    {this.state.errors.secretarialPhoneNumber}{" "}
                  </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="svodafonCachPhoneNumber">فودافون كاش</label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={vodafonCachPhoneNumber}
                      name="vodafonCachPhoneNumber"
                      id="svodafonCachPhoneNumber"
                      className="form-control"
                    />
                  </div>
                  <span className="er">
                    {" "}
                    {this.state.errors.vodafonCachPhoneNumber}{" "}
                  </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="sactivationSubscriptionPhoneNumber">
                      رقم هاتف الاشتراك
                    </label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={activationSubscriptionPhoneNumber}
                      name="activationSubscriptionPhoneNumber"
                      id="sactivationSubscriptionPhoneNumber"
                      className="form-control"
                    />
                  </div>
                  <span className="er">
                    {" "}
                    {this.state.errors.activationSubscriptionPhoneNumber}{" "}
                  </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="sfacebookLink">رابط الفيسبوك</label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={facebookLink}
                      name="facebookLink"
                      id="sfacebookLink"
                      className="form-control"
                    />
                  </div>
                  <span className="er"> {this.state.errors.facebookLink} </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="swhatsappLink">رابط لينكدان</label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={whatsappLink}
                      name="whatsappLink"
                      id="swhatsappLink"
                      className="form-control"
                    />
                  </div>
                  <span className="er"> {this.state.errors.whatsappLink} </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="stelegramLink">رابط الواتس اب</label>
                    <input
                      type="text"
                      onChange={handelChange}
                      value={telegramLink}
                      name="telegramLink"
                      id="stelegramLink"
                      className="form-control"
                    />
                  </div>
                  <span className="er"> {this.state.errors.telegramLink} </span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <div className="form-group">
                    <label htmlFor="upload">رفع صورة</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => this.setFile(e)}
                      name="upload"
                      id="upload"
                      className="form-control"
                    />
                    <span>{File}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="btn-submit">
                    <button className="btn">حفظ</button>
                    <button
                      className="btn btn-warning bg-warning ml-3"
                      onClick={() => {
                        this.props.history.replace("/home");
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
