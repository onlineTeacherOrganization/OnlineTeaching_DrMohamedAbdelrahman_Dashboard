import React from "react";
import { MDBDataTableV5 } from "mdbreact";
import { useEffect } from "react";
import { toast } from "react-toastify";

// axios
import axios from "axios";
import GetUserToken from "../component/GetUserToken";
// const token = GetUserToken();
// import Result from '../components/result';

export default function WithMultipleCheckboxes() {
  const token = GetUserToken();
  var obg = [];
  const [data, setData] = React.useState({});
  var dataObject;
  useEffect(() => {
    // console.log("hi")
    axios
      .get(`${URL_PASE}Subscribtion`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // console.log(res.data);
        if (res.status == 200) {
          // setData();
          dataObject = {
            columns: [
              {
                label: "الصورة",
                field: "studentName",
                width: 150,
              },
              {
                label: "الاسم",
                field: "subjectName",
                width: 270,
              },
              {
                label: "اسم الماده",
                field: "id",
                width: 200,
              },
            ],
            rows: res.data,
          };
          setData(dataObject);
          // obg = ;
        }
      });
  }, []);
  const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";

  // const [datatable, setDatatable] = React.useState({});
  // console.log(datatable)
  const [checkbox1, setCheckbox1] = React.useState([]);

  const showLogs2 = (e) => {
    setCheckbox1(e);
  };

  return (
    <>
      <div className="main-content">
        <div className="dashboard-header">
          <h5>الاشتراكات</h5>
          <div className="add-aNew">
            {/* <Link className="add-new-lnk" to="/add-new-subject">
              اضافة مادة
            </Link> */}
          </div>
        </div>
        <div className="dashboard-content">
          <div className="dasboard-box">
            <MDBDataTableV5
              hover
              entriesOptions={[5, 20, 25]}
              entries={5}
              pagesAmount={4}
              data={data}
              checkbox
              headCheckboxID="id6"
              bodyCheckboxID="checkboxes6"
              getValueCheckBox={(e) => {
                showLogs2(e);
              }}
              getValueAllCheckBoxes={(e) => {
                showLogs2(e);
              }}
              multipleCheckboxes
            />
          </div>
        </div>
      </div>

      {/* <Result>
        {' '}
        {checkbox1 && (
          <p>
            {JSON.stringify(
              checkbox1.map((e) => {
                console.log(e);
                delete e.checkbox;
                return e;
              }) && checkbox1
            )}
          </p>
        )}
      </Result> */}
    </>
  );
}
