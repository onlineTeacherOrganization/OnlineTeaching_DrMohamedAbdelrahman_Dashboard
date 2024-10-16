import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

// import { createReadStream } from 'fs';
import GetUserToken from "../component/GetUserToken";
import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
const token = GetUserToken();

class EditSubject extends Component {
  state = {
    id: 0,
    Name: "",
    Price: 0,
    LevelId: "",
    levelName: "",
    ImageOrFile: {},
    allLevels: [],
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
    const subjectId = this.props.match.params.id;
    const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";

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

    axios
      .get(`${baseUrl}api/Subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            loadintable: false,
            id: res.data.id,
            Name: res.data.name,
            Price: res.data.price,
            LevelId: res.data.level.id,
            levelName: res.data.level.levelName,
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
      // console.log(createReadStream);

      this.setState({
        loadintable: true,
      });

      const formData = new FormData();
      formData.append("file", this.state.ImageOrFile);
      const state = { ...this.state };
      delete state.loadintable;
      delete state.allLevels;
      delete state.levelName;

      Object.keys(state).forEach((key) => {
        formData.append(key, this.state[key]);
      });

      const subjectId = this.props.match.params.id;
      await axios
        .put(`${baseUrl}api/Subjects/` + subjectId, formData, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data`,
            Authorization: `Bearer ${token}`,
          },
        })
        // boundary=${formData._boundary}
        .then((res) => {
          if (res.status == 200) {
            this.setState({
              loadintable: false,
            });
            toast.success("تم التعديل بنجاح");
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

    const { Name, Price, LevelId, loadintable, levelName } = this.state;
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h5>{Name}</h5>
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
                      placeholder={levelName}
                      id="mLevelId"
                      options={options}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
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
                <div className="col-sm-12 col-md-6 col-lg-6">
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
                    <button className="btn" type="submit">
                      تعديل
                    </button>
                    <button
                      className="btn btn-warning bg-warning ml-3"
                      onClick={() => {
                        this.props.history.replace("/subjects");
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

export default EditSubject;
