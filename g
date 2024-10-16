import React, { Component } from 'react'

import { Link } from "react-router-dom";

// mdreact
import { MDBDataTable } from "mdbreact";

import { toast } from 'react-toastify';

import axios from 'axios';
import GetUserToken from '../component/GetUserToken';
const token = GetUserToken();

export default class ReExamOrders extends Component {

  state = {
    data: [],
    loadintable: true,
  }

  componentDidMount(){
    const token = GetUserToken();
    axios.get(`http://hossam1234-001-site1.ftempurl.com/api/Exams/Re open Exam Requests`, { headers: {"Authorization" : `Bearer ${token}`} }).then((res)=>{
      if(res.status == 200){
        console.log(res.data)
        this.setState({
          loadintable: false,
        })
      }
      var newData = res.data.reverse();
      newData.map((dat, index) => {
        dat.option = (
          <div className="option-parent">
            <button
              onClick={() => this.acceptReOpen(dat)}
              color="red"
              className="tableOption op-done"
              size="sm"
            >
              <i className="fi-rr-check"></i>
            </button>
          </div>
        );
        dat.index = index + 1;
      });
      this.setState(
        {
          data: newData,
        }
      );
    })
  }

  acceptReOpen = (dat)=>{
    console.log(dat.examID, dat.studentID);
    const reobj = {
      studentID: dat.studentID,
      examID: dat.examID,
      isAccept: true,
    }
    axios.post("http://hossam1234-001-site1.ftempurl.com/api/Exams/Accept Re open Exam ", reobj, { headers: {"Authorization" : `Bearer ${token}`} }).then((res)=>{
      if(res.status == 200){
        toast.success("تم اعادة الامتحان للطالب")
      }
    })
  }

  render() {
    const { loadintable } = this.state;
    const datatable = {
      columns: [
        { label: "الترتيب", field: "index" },
        { label: "اسم الامتحان", field: "examName" },
        { label: "اسم الطالب", field: "studentName" },
        { label: "السبب", field: "reasone" },
        { label: "الاختيارات", field: "option" },
      ],
      rows: this.state.data,
    };
    return (
      <div className="main-content" >
        <div className="dashboard-header">
          <h5>الامتحان</h5>
          <div className="add-aNew">
            <Link className="add-new-lnk" to="/add-new-exam">اضافة امتحان</Link>
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
    )
  }
}
