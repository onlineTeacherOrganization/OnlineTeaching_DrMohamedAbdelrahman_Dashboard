import React, { Component } from "react";

import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
// import { createReadStream } from 'fs';
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

class AddNewSubject extends Component {
  state = {
    id: 0,
    Name: "",
    Price: 0,
    isAppear: "",
    LevelId: "",
    allLevels: [],
    loadintable: false,
    ImageOrFile: {},
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
    // const PASE_URL = "http://hossam1234-001-site1.ftempurl.com/api/";
    const PASE_URL = "https://localhost:44334/api/";

    axios
      .get(`${baseUrl}api/Levels`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status == 200) {
          this.setState({
            allLevels: res.data.items,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    const selectHandelChange = (value, action) => {
      this.setState({
        [action.name]: value.value,
      });
    };

    const handelUploadPicture = (e) => {
      this.setState({
        // picturePreview: URL.createObjectURL(e.target.files[0]),
        ImageOrFile: e.target.files[0],
      });
    };

    const subjectSubmitForm = async (e) => {
      e.preventDefault();
      this.setState({
        loadintable: true,
      });
      const formData = new FormData();
      const state = { ...this.state };
      delete state.allLevels;
      delete state.loadintable;
      formData.append("file", this.state.ImageOrFile);
      Object.keys(state).forEach((key) => {
        formData.append(key, this.state[key]);
      });
      await axios
        .post(
          // "http://hossam1234-001-site1.ftempurl.com/api/Subjects",
          `${baseUrl}api/Subjects`,
          formData,
          {
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
              "Content-Type": `multipart/form-data`,
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // boundary=${formData._boundary}
        .then((res) => {
          if (res.status == 200) {
            this.setState({
              loadintable: false,
            });
            toast.success("تم الاضفه بنجاح");
            this.props.history.replace("/subjects");
          }
        })
        .catch((er) => {
          console.log(er.response);
        });
    };

    const options = this.state.allLevels.map((leve) => ({
      value: leve.id,
      label: leve.levelName,
    }));

    const { Name, Price, LevelId, ImageOrFile, loadintable, isAppear } =
      this.state;
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>اضافة مادة جديدة</h5>
        </div>
        <div className="dashboard-content">
          <div className="dasboard-box">
            <form action="" onSubmit={subjectSubmitForm} className="formStyle">
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="subjecName">اسم المادة</label>
                    <input
                      type="text"
                      name="Name"
                      id="subjecName"
                      className="form-control"
                      placeholder="مثال:الرياضايات"
                      value={Name}
                      onChange={handelChange}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="mLevelId">المرحلة</label>
                    <Select
                      name="LevelId"
                      onChange={selectHandelChange}
                      placeholder="اختر المرحلة"
                      id="mLevelId"
                      options={options}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label htmlFor="mPrice">سعر المادة</label>
                    <input
                      type="number"
                      name="Price"
                      id="mPrice"
                      className="form-control"
                      placeholder="مثال: 50"
                      value={Price}
                      onChange={handelChange}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label htmlFor="mimage">صورة المادة</label>
                    <input
                      type="file"
                      // name="image"
                      id="mimage"
                      className="form-control"
                      placeholder="مثال: 50"
                      // value={image}
                      onChange={handelUploadPicture}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label htmlFor="courseVisibility">حالة المحاضرة</label>
                    <select
                      name="isAppear"
                      value={isAppear}
                      onChange={handelChange}
                      id="courseFree"
                      className="form-control"
                    >
                      <option value="">اختر</option>
                      <option value={true}>عرض</option>
                      <option value={false}>اخفاء</option>
                    </select>
                    {/* <span className="er">{errors.isAppear}</span> */}
                  </div>
                </div>
                {/* <div className="col-sm-12 col-md-3 col-lg-3">
                  <div className="pictureSubject">
                    <h5>معاينة صورة المادة</h5>
                    <div
                      className="card-img"
                      style={{
                        backgroundImage:
                          subjectpicture === ""
                            ? `url('./images/default-book.png')`
                            : `url('./images/${subjectpicture}')`,
                      }}
                      onChange={handelChange}
                    ></div>
                  </div>
                </div> */}
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

export default AddNewSubject;
