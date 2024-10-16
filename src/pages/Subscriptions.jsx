import React, { Component } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// mdreact
import { MDBDataTable } from "mdbreact";

import { toast } from "react-toastify";

// axios
import axios from "axios";

import { baseUrl } from "../assets/baseUrl";
import jwt_decode from "jwt-decode";
import GetUserToken from "../component/GetUserToken";
import { Pagination, Stack } from "@mui/material";
const token = GetUserToken();

class Subscription extends Component {
    state = {
        data: [],
        subscribers: [],
        loadintable: true,
        newData: null,
        dat: null,
        filteredData: null,
        rows: 0,
        index: 0,
        size: 10,
        count: 0,
        searchName: "",
        searchPhone: ""
    };

    handlePaginationChange = (event, value) => {
        this.setState({
            loadintable: true,
        });
        let url = "";
        if(this.state.searchName == "" && this.state.searchPhone == ""){
            url = `${baseUrl}api/Subscribtion?&` + `index=${value -1 }&size=${this.state.size}`;
        } else{
            url = `${baseUrl}api/Subscribtion/Filter?&` + `index=${value - 1}&size=${this.state.size}&studentName=${this.state.searchName}&phone=${this.state.searchPhone}`
        }
        axios
            .get(url, {
                headers: { Authorization: `Bearer ${token}` },
            })
        .then((res) => {
            if (res.status == 200) {
                this.setState({
                    count: res.data.pages,
                    loadintable: false,
                });
            }

            this.setState({
                count: res.data.pages,
                data: res.data.items.map((x) => {
                    return { ...x, isChecked: false };
                }),
                subscribers: res.data.items.map((x) => {
                    return { ...x, isChecked: false };
                }),
            });
            if (res.status == 200) {
                this.setState({
                    loadintable: false,
                });
            }
            var trueActive = res.data.items.filter((item) => {
                return item.isActive == true;
            });

            var falseActive = res.data.items.filter((item) => {
                return item.isActive == false;
            });
            this.setState({ newData: [...falseActive, ...trueActive] });
            document.getElementsByClassName("table")[0].setAttribute("entries", res.data.items.length);
            this.state.newData.map((data, index) => {
                this.setState({ dat: data });

                this.state.dat.option = (
                    <div className="option-parent" key={index}>
                        {data["isActive"] === true ? null : (
                            <button
                                onClick={(e) => {
                                    this.acceptSubscripe(data);
                                }}
                                className="tableOption op-done"
                            >
                                <i className="fi-rr-check"></i>
                            </button>
                        )}
                        {/* <button
            onClick={(e) => {
              this.acceptSubscripe(this.state.dat);
              console.log(this.state.dat);
            }}
            className="tableOption op-done"
          >
            <i className="fi-rr-check"></i>
          </button> */}

                        <button
                            onClick={() => this.deleteSubscripe(data)}
                            color="red"
                            className="tableOption op-delete"
                            size="sm"
                        >
                            <i className="fi-rr-trash"></i>
                        </button>
                    </div>
                );

                this.state.dat.checkBox = (
                    <input
                        className="checkers"
                        type="checkbox"
                        onChange={(e) => this.onRowCheckChanged(e, index)}
                        checked={this.state.dat.isChecked}
                        name={index}
                        id={index}
                    />
                );

                this.state.dat.index = index + 1;

                this.state.dat.phone = data.phone;
            });

            this.setState({
                data: this.state.newData,
                subscribers: this.state.newData,
            });
        })
        .catch((error) => {
            console.log(error);
            toast.error("هناك خطا ما")
            this.setState({
                loadintable: false,
            });
        });
      };

    componentDidMount() {
        if (sessionStorage.getItem("token") != null || sessionStorage.getItem("token") != undefined) {
            const user = jwt_decode(sessionStorage.getItem("token"));

            const userRole = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
            const userEmail = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
            const userName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
            const userIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
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
        document.querySelector('[aria-label="Previous"]').innerHTML = "السابق";
        document.querySelector('[aria-label="Next"]').innerHTML = "التالي";
        document.querySelector(".mdb-datatable-filter input").placeholder = "بحث";
        document.querySelector(".dataTables_length").style.display = "none";
        document.querySelector(".dataTables_length label").childNodes[0].textContent = "أظهار الحقول";

        let paginationElementsCount = document.querySelector("ul.pagination").children.length;
        console.log(paginationElementsCount);
        let paginationElements = document.querySelector("ul.pagination").children;
        console.log(paginationElements);
        // for (let i = 1; i < paginationElementsCount; i++) {
        //   document
        //     .querySelector("ul.pagination")
        //     .removeChild(paginationElements[i]);
        //   i--;
        //   paginationElementsCount--;
        // }

        const token = GetUserToken();
        // const URL_PASE = "http://hossam1234-001-site1.ftempurl.com/api/";
        const URL_PASE = "https://localhost:44334/api/";

        document.getElementsByClassName("pagination")[0].remove();
        axios
            .get(`${baseUrl}api/Subscribtion?&` + `index=${this.state.index}&size=${this.state.size}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                // var newPagination = document.createElement("ul");
                // newPagination.classList.add("pagination");
                // newPagination.style.flexWrap = "wrap";

                // for (let i = 0; i < res.data.pages; i++) {
                //     let li = document.createElement("li");
                //     li.classList.add(["page-item"]);
                //     if (i == 0) li.classList.add("active");
                //     li.addEventListener("click", (e) => {
                //         document.querySelectorAll(".page-item").forEach((element) => {
                //             element.classList.remove("active");
                //         });
                //         li.classList.add("active");
                //         this.setState({ index: i });
                //         axios
                //             .get(`${baseUrl}api/Subscribtion?&` + `index=${this.state.index}&size=${this.state.size}`, {
                //                 headers: {
                //                     Authorization: `Bearer ${token}`,
                //                 },
                //             })
                //             .then((ress) => {
                //                 this.setState({ rows: ress.data.items.length });
                //                 this.setState({
                //                     count: ress.data.count,
                //                     data: ress.data.items.map((x) => {
                //                         return { ...x, isChecked: false };
                //                     }),
                //                     subscribers: ress.data.items.map((x) => {
                //                         return { ...x, isChecked: false };
                //                     }),
                //                 });
                //                 if (ress.status == 200) {
                //                     this.setState({
                //                         loadintable: false,
                //                     });
                //                 }
                //                 var trueActive = ress.data.items.filter((item) => {
                //                     return item.isActive == true;
                //                 });

                //                 var falseActive = ress.data.items.filter((item) => {
                //                     return item.isActive == false;
                //                 });
                //                 this.setState({ newData: [...falseActive, ...trueActive] });
                //                 this.state.newData.map((data, index) => {
                //                     this.setState({ dat: data });

                //                     this.state.dat.option = (
                //                         <div className="option-parent" key={index}>
                //                             {data["isActive"] === true ? null : (
                //                                 <button
                //                                     onClick={(e) => {
                //                                         this.acceptSubscripe(data);
                //                                     }}
                //                                     className="tableOption op-done"
                //                                 >
                //                                     <i className="fi-rr-check"></i>
                //                                 </button>
                //                             )}
                //                             {/* <button
                //                 onClick={(e) => {
                //                   this.acceptSubscripe(this.state.dat);
                //                   console.log(this.state.dat);
                //                 }}
                //                 className="tableOption op-done"
                //               >
                //                 <i className="fi-rr-check"></i>
                //               </button> */}

                //                             <button
                //                                 onClick={() => this.deleteSubscripe(data)}
                //                                 color="red"
                //                                 className="tableOption op-delete"
                //                                 size="sm"
                //                             >
                //                                 <i className="fi-rr-trash"></i>
                //                             </button>
                //                         </div>
                //                     );

                //                     this.state.dat.checkBox = (
                //                         <input
                //                             className="checkers"
                //                             type="checkbox"
                //                             onChange={(e) => this.onRowCheckChanged(e, index)}
                //                             checked={this.state.dat.isChecked}
                //                             name={index}
                //                             id={index}
                //                         />
                //                     );

                //                     this.state.dat.index = index + 1;

                //                     this.state.dat.phone = data.phone;
                //                 });

                //                 this.setState({
                //                     data: this.state.newData,
                //                     subscribers: this.state.newData,
                //                 });
                //             });
                //     });
                //     let anch = document.createElement("a");
                //     anch.classList.add(["page-link"]);
                //     let textNode = document.createTextNode(i + 1);
                //     anch.appendChild(textNode);
                //     li.appendChild(anch);
                //     newPagination.appendChild(li);
                // }
                // document.getElementsByClassName("dataTables_paginate")[0].appendChild(newPagination);
                // let x = document.getElementsByClassName("pagination")[0].remove();

                this.setState({ rows: res.data.items.length });
                this.setState({
                    count: res.data.pages,
                    data: res.data.items.map((x) => {
                        return { ...x, isChecked: false };
                    }),
                    subscribers: res.data.items.map((x) => {
                        return { ...x, isChecked: false };
                    }),
                });
                if (res.status == 200) {
                    this.setState({
                        loadintable: false,
                    });
                }
                var trueActive = res.data.items.filter((item) => {
                    return item.isActive == true;
                });

                var falseActive = res.data.items.filter((item) => {
                    return item.isActive == false;
                });
                this.setState({ newData: [...falseActive, ...trueActive] });
                document.getElementsByClassName("table")[0].setAttribute("entries", res.data.items.length);
                this.state.newData.map((data, index) => {
                    this.setState({ dat: data });

                    this.state.dat.option = (
                        <div className="option-parent" key={index}>
                            {data["isActive"] === true ? null : (
                                <button
                                    onClick={(e) => {
                                        this.acceptSubscripe(data);
                                    }}
                                    className="tableOption op-done"
                                >
                                    <i className="fi-rr-check"></i>
                                </button>
                            )}
                            {/* <button
                onClick={(e) => {
                  this.acceptSubscripe(this.state.dat);
                  console.log(this.state.dat);
                }}
                className="tableOption op-done"
              >
                <i className="fi-rr-check"></i>
              </button> */}

                            <button
                                onClick={() => this.deleteSubscripe(data)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>
                        </div>
                    );

                    this.state.dat.checkBox = (
                        <input
                            className="checkers"
                            type="checkbox"
                            onChange={(e) => this.onRowCheckChanged(e, index)}
                            checked={this.state.dat.isChecked}
                            name={index}
                            id={index}
                        />
                    );

                    this.state.dat.index = index + 1;

                    this.state.dat.phone = data.phone;
                });

                this.setState({
                    data: this.state.newData,
                    subscribers: this.state.newData,
                });
            })
            .catch((error) => {
                toast.error("هناك خطأ ما");
                this.setState({loadintable: false});

                console.log(error);
            });

        const searchBox = document.querySelector('[aria-label="Search"]');
        searchBox.value = "";

        searchBox.addEventListener("keyup", () => {
            this.setState({loadintable: true, searchName: searchBox.value, searchPhone: searchBox.value});
            if (searchBox.value != "") {
                axios
                .get(`${baseUrl}api/Subscribtion/Filter?&` + `studentName=${searchBox.value}&phone=${searchBox.value}&index=${this.state.index}&size=${this.state.size}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    this.setState({loadintable: false});
                    // var newPagination = document.createElement("ul");
                    // newPagination.classList.add("pagination");
                    // newPagination.style.flexWrap = "wrap";
    
                    // for (let i = 0; i < res.data.pages; i++) {
                    //     let li = document.createElement("li");
                    //     li.classList.add(["page-item"]);
                    //     if (i == 0) li.classList.add("active");
                    //     li.addEventListener("click", (e) => {
                    //         document.querySelectorAll(".page-item").forEach((element) => {
                    //             element.classList.remove("active");
                    //         });
                    //         li.classList.add("active");
                    //         this.setState({ index: i });
                    //         axios
                    //         .get(`${baseUrl}api/Subscribtion/Filter?&` + `studentName=${searchBox.value}&phone=${searchBox.value}&index=${this.state.index}&size=${this.state.size}`, {
                    //                 headers: {
                    //                     Authorization: `Bearer ${token}`,
                    //                 },
                    //             })
                    //             .then((ress) => {
                    //                 this.setState({ rows: ress.data.items.length });
                    //                 this.setState({
                    //                     count: ress.data.count,
                    //                     data: ress.data.items.map((x) => {
                    //                         return { ...x, isChecked: false };
                    //                     }),
                    //                     subscribers: ress.data.items.map((x) => {
                    //                         return { ...x, isChecked: false };
                    //                     }),
                    //                 });
                    //                 if (ress.status == 200) {
                    //                     this.setState({
                    //                         loadintable: false,
                    //                     });
                    //                 }
                    //                 var trueActive = ress.data.items.filter((item) => {
                    //                     return item.isActive == true;
                    //                 });
    
                    //                 var falseActive = ress.data.items.filter((item) => {
                    //                     return item.isActive == false;
                    //                 });
                    //                 this.setState({ newData: [...falseActive, ...trueActive] });
                    //                 this.state.newData.map((data, index) => {
                    //                     this.setState({ dat: data });
    
                    //                     this.state.dat.option = (
                    //                         <div className="option-parent" key={index}>
                    //                             {data["isActive"] === true ? null : (
                    //                                 <button
                    //                                     onClick={(e) => {
                    //                                         this.acceptSubscripe(data);
                    //                                     }}
                    //                                     className="tableOption op-done"
                    //                                 >
                    //                                     <i className="fi-rr-check"></i>
                    //                                 </button>
                    //                             )}
                    //                             {/* <button
                    //                 onClick={(e) => {
                    //                   this.acceptSubscripe(this.state.dat);
                    //                   console.log(this.state.dat);
                    //                 }}
                    //                 className="tableOption op-done"
                    //               >
                    //                 <i className="fi-rr-check"></i>
                    //               </button> */}
    
                    //                             <button
                    //                                 onClick={() => this.deleteSubscripe(data)}
                    //                                 color="red"
                    //                                 className="tableOption op-delete"
                    //                                 size="sm"
                    //                             >
                    //                                 <i className="fi-rr-trash"></i>
                    //                             </button>
                    //                         </div>
                    //                     );
    
                    //                     this.state.dat.checkBox = (
                    //                         <input
                    //                             className="checkers"
                    //                             type="checkbox"
                    //                             onChange={(e) => this.onRowCheckChanged(e, index)}
                    //                             checked={this.state.dat.isChecked}
                    //                             name={index}
                    //                             id={index}
                    //                         />
                    //                     );
    
                    //                     this.state.dat.index = index + 1;
    
                    //                     this.state.dat.phone = data.phone;
                    //                 });
    
                    //                 this.setState({
                    //                     data: this.state.newData,
                    //                     subscribers: this.state.newData,
                    //                 });
                    //             });
                    //     });
                    //     let anch = document.createElement("a");
                    //     anch.classList.add(["page-link"]);
                    //     let textNode = document.createTextNode(i + 1);
                    //     anch.appendChild(textNode);
                    //     li.appendChild(anch);
                    //     newPagination.appendChild(li);
                    // }
                    // document.getElementsByClassName("dataTables_paginate")[0].appendChild(newPagination);
                    // let x = document.getElementsByClassName("pagination")[0].remove();
    
                    this.setState({ rows: res.data.items.length });
                    this.setState({
                        count: res.data.pages,
                        data: res.data.items.map((x) => {
                            return { ...x, isChecked: false };
                        }),
                        subscribers: res.data.items.map((x) => {
                            return { ...x, isChecked: false };
                        }),
                    });
                    if (res.status == 200) {
                        this.setState({
                            loadintable: false,
                        });
                    }
                    var trueActive = res.data.items.filter((item) => {
                        return item.isActive == true;
                    });
    
                    var falseActive = res.data.items.filter((item) => {
                        return item.isActive == false;
                    });
                    this.setState({ newData: [...falseActive, ...trueActive] });
                    document.getElementsByClassName("table")[0].setAttribute("entries", res.data.items.length);
                    this.state.newData.map((data, index) => {
                        this.setState({ dat: data });
    
                        this.state.dat.option = (
                            <div className="option-parent" key={index}>
                                {data["isActive"] === true ? null : (
                                    <button
                                        onClick={(e) => {
                                            this.acceptSubscripe(data);
                                        }}
                                        className="tableOption op-done"
                                    >
                                        <i className="fi-rr-check"></i>
                                    </button>
                                )}
                                {/* <button
                    onClick={(e) => {
                      this.acceptSubscripe(this.state.dat);
                      console.log(this.state.dat);
                    }}
                    className="tableOption op-done"
                  >
                    <i className="fi-rr-check"></i>
                  </button> */}
    
                                <button
                                    onClick={() => this.deleteSubscripe(data)}
                                    color="red"
                                    className="tableOption op-delete"
                                    size="sm"
                                >
                                    <i className="fi-rr-trash"></i>
                                </button>
                            </div>
                        );
    
                        this.state.dat.checkBox = (
                            <input
                                className="checkers"
                                type="checkbox"
                                onChange={(e) => this.onRowCheckChanged(e, index)}
                                checked={this.state.dat.isChecked}
                                name={index}
                                id={index}
                            />
                        );
    
                        this.state.dat.index = index + 1;
    
                        this.state.dat.phone = data.phone;
                    });
    
                    this.setState({
                        data: this.state.newData,
                        subscribers: this.state.newData,
                    });
                })
                .catch((error) => {
                    this.setState({loadintable: false});
                    toast.error("هناك خطأ ما")
                    console.log(error);
                });
            //     this.setState({
            //         filteredData: this.state.data.filter((data) => {
            //             return (
            //                 data.phone.includes(searchBox.value) ||
            //                 data.studentName.includes(searchBox.value) ||
            //                 data.subjectName.includes(searchBox.value)
            //             );
            //         }),
            //     });
            //     console.log(this.state.filteredData);
            } else {
                // this.setState({ filteredData: this.state.data });
                axios
            .get(`${baseUrl}api/Subscribtion?&` + `index=${this.state.index}&size=${this.state.size}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                // var newPagination = document.createElement("ul");
                // newPagination.classList.add("pagination");
                // newPagination.style.flexWrap = "wrap";

                // for (let i = 0; i < res.data.pages; i++) {
                //     let li = document.createElement("li");
                //     li.classList.add(["page-item"]);
                //     if (i == 0) li.classList.add("active");
                //     li.addEventListener("click", (e) => {
                //         document.querySelectorAll(".page-item").forEach((element) => {
                //             element.classList.remove("active");
                //         });
                //         li.classList.add("active");
                //         this.setState({ index: i });
                //         axios
                //             .get(`${baseUrl}api/Subscribtion?&` + `index=${this.state.index}&size=${this.state.size}`, {
                //                 headers: {
                //                     Authorization: `Bearer ${token}`,
                //                 },
                //             })
                //             .then((ress) => {
                //                 this.setState({ rows: ress.data.items.length });
                //                 this.setState({
                //                     count: ress.data.pages,
                //                     data: ress.data.items.map((x) => {
                //                         return { ...x, isChecked: false };
                //                     }),
                //                     subscribers: ress.data.items.map((x) => {
                //                         return { ...x, isChecked: false };
                //                     }),
                //                 });
                //                 if (ress.status == 200) {
                //                     this.setState({
                //                         loadintable: false,
                //                     });
                //                 }
                //                 var trueActive = ress.data.items.filter((item) => {
                //                     return item.isActive == true;
                //                 });

                //                 var falseActive = ress.data.items.filter((item) => {
                //                     return item.isActive == false;
                //                 });
                //                 this.setState({ newData: [...falseActive, ...trueActive] });
                //                 this.state.newData.map((data, index) => {
                //                     this.setState({ dat: data });

                //                     this.state.dat.option = (
                //                         <div className="option-parent" key={index}>
                //                             {data["isActive"] === true ? null : (
                //                                 <button
                //                                     onClick={(e) => {
                //                                         this.acceptSubscripe(data);
                //                                     }}
                //                                     className="tableOption op-done"
                //                                 >
                //                                     <i className="fi-rr-check"></i>
                //                                 </button>
                //                             )}
                //                             {/* <button
                //                 onClick={(e) => {
                //                   this.acceptSubscripe(this.state.dat);
                //                   console.log(this.state.dat);
                //                 }}
                //                 className="tableOption op-done"
                //               >
                //                 <i className="fi-rr-check"></i>
                //               </button> */}

                //                             <button
                //                                 onClick={() => this.deleteSubscripe(data)}
                //                                 color="red"
                //                                 className="tableOption op-delete"
                //                                 size="sm"
                //                             >
                //                                 <i className="fi-rr-trash"></i>
                //                             </button>
                //                         </div>
                //                     );

                //                     this.state.dat.checkBox = (
                //                         <input
                //                             className="checkers"
                //                             type="checkbox"
                //                             onChange={(e) => this.onRowCheckChanged(e, index)}
                //                             checked={this.state.dat.isChecked}
                //                             name={index}
                //                             id={index}
                //                         />
                //                     );

                //                     this.state.dat.index = index + 1;

                //                     this.state.dat.phone = data.phone;
                //                 });

                //                 this.setState({
                //                     data: this.state.newData,
                //                     subscribers: this.state.newData,
                //                 });
                //             });
                //     });
                //     let anch = document.createElement("a");
                //     anch.classList.add(["page-link"]);
                //     let textNode = document.createTextNode(i + 1);
                //     anch.appendChild(textNode);
                //     li.appendChild(anch);
                //     newPagination.appendChild(li);
                // }
                // document.getElementsByClassName("dataTables_paginate")[0].appendChild(newPagination);
                // let x = document.getElementsByClassName("pagination")[0].remove();

                this.setState({ rows: res.data.items.length });
                this.setState({
                    count: res.data.pages,
                    data: res.data.items.map((x) => {
                        return { ...x, isChecked: false };
                    }),
                    subscribers: res.data.items.map((x) => {
                        return { ...x, isChecked: false };
                    }),
                });
                if (res.status == 200) {
                    this.setState({
                        loadintable: false,
                    });
                }
                var trueActive = res.data.items.filter((item) => {
                    return item.isActive == true;
                });

                var falseActive = res.data.items.filter((item) => {
                    return item.isActive == false;
                });
                this.setState({ newData: [...falseActive, ...trueActive] });
                document.getElementsByClassName("table")[0].setAttribute("entries", res.data.items.length);
                this.state.newData.map((data, index) => {
                    this.setState({ dat: data });

                    this.state.dat.option = (
                        <div className="option-parent" key={index}>
                            {data["isActive"] === true ? null : (
                                <button
                                    onClick={(e) => {
                                        this.acceptSubscripe(data);
                                    }}
                                    className="tableOption op-done"
                                >
                                    <i className="fi-rr-check"></i>
                                </button>
                            )}
                            {/* <button
                onClick={(e) => {
                  this.acceptSubscripe(this.state.dat);
                  console.log(this.state.dat);
                }}
                className="tableOption op-done"
              >
                <i className="fi-rr-check"></i>
              </button> */}

                            <button
                                onClick={() => this.deleteSubscripe(data)}
                                color="red"
                                className="tableOption op-delete"
                                size="sm"
                            >
                                <i className="fi-rr-trash"></i>
                            </button>
                        </div>
                    );

                    this.state.dat.checkBox = (
                        <input
                            className="checkers"
                            type="checkbox"
                            onChange={(e) => this.onRowCheckChanged(e, index)}
                            checked={this.state.dat.isChecked}
                            name={index}
                            id={index}
                        />
                    );

                    this.state.dat.index = index + 1;

                    this.state.dat.phone = data.phone;
                });

                this.setState({
                    data: this.state.newData,
                    subscribers: this.state.newData,
                });
            })
            .catch((error) => {
                console.log(error);
            });
            }
            // var xx = document.getElementsByClassName("checkers");
            // for (let i = 0; i < xx.length; i++) {
            //     xx[i].checked = false;
            // }
            // let selectAll = document.getElementById("selectAll");
            // selectAll.checked = false;
        });
    }

    onRowCheckChanged = (e, index) => {
        const { id, checked } = e.target;
        console.log(e.target);
        if (id === "selectAll") {
            if (this.state.filteredData != null && this.state.filteredData != []) {
                let tempSubscribers = this.state.filteredData.map((subscriber) => {
                    var x = subscriber;
                    x["isChecked"] = checked;
                    return x;
                });

                this.setState({ filteredData: tempSubscribers });
                var xx = document.getElementsByClassName("checkers");
                for (let i = 0; i < xx.length; i++) {
                    xx[i].checked = checked;
                }
            } else {
                let tempSubscribers = this.state.data.map((subscriber) => {
                    var x = subscriber;
                    x["isChecked"] = checked;
                    return x;
                });
                this.setState({ newData: tempSubscribers });

                var xx = document.getElementsByClassName("checkers");
                for (let i = 0; i < xx.length; i++) {
                    xx[i].checked = checked;
                }
            }
        } else {
            if (this.state.filteredData != null && this.state.filteredData != []) {
                let tempSubscribers = this.state.filteredData.map((subscriber, index2) => {
                    if (index2 === index) {
                        var x = subscriber;
                        x["isChecked"] = checked;
                        return x;
                    } else {
                        var x = subscriber;
                        if (subscriber.isChecked != null) {
                            x["isChecked"] = subscriber.isChecked;
                        } else {
                            x["isChecked"] = false;
                        }
                        return x;
                    }
                });
                this.setState({ filteredData: tempSubscribers });

                let truesAndFalses = [];
                this.state.filteredData.map((subscriber, index) => {
                    truesAndFalses.push(subscriber.isChecked);
                    if (truesAndFalses.includes(true) && truesAndFalses.includes(false)) {
                        document.getElementById("selectAll").checked = false;
                    } else {
                        if (checked === true) {
                            document.getElementById("selectAll").checked = true;
                        } else {
                            document.getElementById("selectAll").checked = false;
                        }
                    }
                });
            } else {
                let tempSubscribers = this.state.data.map((subscriber, index2) => {
                    if (index2 === index) {
                        var x = subscriber;
                        x["isChecked"] = checked;
                        return x;
                    } else {
                        var x = subscriber;
                        if (subscriber.isChecked != null) {
                            x["isChecked"] = subscriber.isChecked;
                        } else {
                            x["isChecked"] = false;
                        }
                        return x;
                    }
                });
                this.setState({ newData: tempSubscribers });

                let truesAndFalses = [];
                this.state.newData.map((subscriber, index) => {
                    truesAndFalses.push(subscriber.isChecked);
                    if (truesAndFalses.includes(true) && truesAndFalses.includes(false)) {
                        document.getElementById("selectAll").checked = false;
                    } else {
                        if (checked === true) {
                            document.getElementById("selectAll").checked = true;
                        } else {
                            document.getElementById("selectAll").checked = false;
                        }
                    }
                });
            }
        }
    };

    exportToExcel = () => {
        this.setState({
            loadintable: true,
        });
        axios.get(`${baseUrl}api/Subscribtion/DownloadInfo`, {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }).then(
            (res) => {
                const type = res.headers['content-type']
                const blob = new Blob([res.data], { type: type, encoding: 'UTF-8' })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = 'file.xlsx'
                link.click()
                this.setState({
                    loadintable: false,
                });
                toast.success("تم تحميل الملف بنجاح");
            }
          ).catch(error => {
            toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
            this.setState({
                loadintable: false,
            });
          });
        // axios
        //     .get(`${baseUrl}api/Subjects/DownloadInfo`, {
        //         headers: { Authorization: `Bearer ${token}` },
        //     })
        //     .then((res) => {
        //         if (res.status == 200) {
        //             this.setState({
        //                 loadintable: false,
        //                 exportedFile: res
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
    }

    acceptSubscripe = (dat) => {
        console.log(dat);
        const acceptObject = {
            studentID: dat.studentID,
            subjectID: dat.subjectID,
            isActive: true,
        };
        const acceptArr = [];
        acceptArr.push(acceptObject);

        // const PASE_URL = "https://localhost:44334/api/";
        axios
            .put(
                // "http://hossam1234-001-site1.ftempurl.com/api/Subscribtion",
                `${baseUrl}api/Subscribtion`,
                // `${PASE_URL}Subscribtion`,
                acceptArr,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                if (res.status == 200) {
                    toast.success("تم الموافقه على الاشتراك بنجاح");
                }
                window.location.reload();
            });
    };

    deleteSubscripe = async (dat) => {
        this.setState({
            loadintable: true,
        });
        // // const PASE_URL = "http://hossam1234-001-site1.ftempurl.com/api/";
        // const PASE_URL = "https://localhost:44334/api/";

        // let oldData = [...this.state.data];

        // let newDate = this.state.data.filter((item) => item.id !== dat.id);
        // this.setState({
        //   data: newDate,
        //   loadintable: true,
        // });

        const deleteObject = {
            StudentID: dat.studentID,
            SubjectID: dat.subjectID,
        };

        const deleteArr = [];
        deleteArr.push(deleteObject);

        try {
            fetch(`${baseUrl}api/Subscribtion/Delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteArr),
            }).then((res) => {
                if (res.status === 200) {
                    toast.success("تم الحذف بنجاح");
                    this.setState({
                        loadintable: false,
                    });
                    window.location.reload();
                } else {
                    toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
                    this.setState({
                        loadintable: false,
                    });
                }
            });

            // await axios
            //   .delete(
            //     `${PASE_URL}Subscribtion/Delete`,
            //     { params: acceptArr },
            //     {
            //       headers: { Authorization: `Bearer ${token}` },
            //       data: {
            //         addSubscibtionViewModel: acceptArr,
            //       },
            //     }
            //   )
            //   .then((res) => {
            //     if (res.status === 200) {
            //       toast.success("تم الحذف بنجاح");
            //       this.setState({
            //         loadintable: false,
            //       });
            //     } else {
            //       toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
            //       this.setState({
            //         data: oldData,
            //         loadintable: false,
            //       });
            //     }
            //   });
        } catch (ex) {
            toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
            this.setState({
                loadintable: false,
            });
        }
    };

    acceptMany = () => {
        const acceptArr = [];
        if (this.state.filteredData != null && this.state.filteredData != []) {
            this.state.filteredData.map((subscriber) => {
                if (subscriber) {
                    if (subscriber.isChecked === true) {
                        const acceptObject = {
                            StudentID: subscriber.studentID,
                            SubjectID: subscriber.subjectID,
                            isActive: true,
                        };
                        acceptArr.push(acceptObject);
                    }
                }
            });
        } else {
            this.state.newData.map((subscriber) => {
                if (subscriber) {
                    if (subscriber.isChecked === true) {
                        const acceptObject = {
                            StudentID: subscriber.studentID,
                            SubjectID: subscriber.subjectID,
                            isActive: true,
                        };
                        acceptArr.push(acceptObject);
                    }
                }
            });
        }
        console.log(acceptArr);
        try {
            fetch(`${baseUrl}api/Subscribtion`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(acceptArr),
            }).then((res) => {
                if (res.status === 200) {
                    toast.success("تم الموافقه على الاشتراك بنجاح  ");
                    this.setState({
                        loadintable: false,
                    });
                    window.location.reload();
                } else {
                    toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
                    this.setState({
                        loadintable: false,
                    });
                }
            });
        } catch (ex) {
            toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
            this.setState({
                loadintable: false,
            });
        }
    };

    deleteMany = () => {
        const deleteArr = [];
        if (this.state.filteredData != null && this.state.filteredData != []) {
            this.state.filteredData.map((subscriber) => {
                if (subscriber) {
                    if (subscriber.isChecked === true) {
                        const deleteObject = {
                            StudentID: subscriber.studentID,
                            SubjectID: subscriber.subjectID,
                        };
                        deleteArr.push(deleteObject);
                    }
                }
            });
        } else {
            this.state.newData.map((subscriber) => {
                if (subscriber) {
                    if (subscriber.isChecked === true) {
                        const deleteObject = {
                            StudentID: subscriber.studentID,
                            SubjectID: subscriber.subjectID,
                        };
                        deleteArr.push(deleteObject);
                    }
                }
            });
        }

        try {
            fetch(`${baseUrl}api/Subscribtion/Delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteArr),
            }).then((res) => {
                if (res.status === 200) {
                    toast.success("تم الحذف بنجاح");
                    this.setState({
                        loadintable: false,
                    });
                    window.location.reload();
                } else {
                    toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
                    this.setState({
                        loadintable: false,
                    });
                }
            });
        } catch (ex) {
            toast.error("يوجد خطأ برجاء المحاولة مرة اخرى");
            this.setState({
                loadintable: false,
            });
        }
    };

    render() {
        const { loadintable, newData, searchBox, rows, count} = this.state;
        const datatable = {
            columns: [
                { label: "", field: "checkBox" },
                { label: "الترتيب", field: "index" },
                { label: "رقم التليفون", field: "phone" },
                { label: "الاسم", field: "studentName" },
                { label: "اسم الماده", field: "subjectName" },
                { label: "الاختيارات", field: "option" },
            ],
            rows: this.state.data,
        };
        return (
            <div className="main-content">
                <div className="dashboard-header">
                    <h5>الاشتراكات</h5>
                    
                    <div className="add-aNew"> {this.state.data.length > 0 ? (<a   className="add-new-lnk" onClick={() => {this.exportToExcel()}}>
                            تصدير البيانات لملف Excel
                        </a>): null}
                   </div>

                       
                    {/* <div className="add-aNew">
            <Link className="add-new-lnk" to="/add-new-subject">
              اضافة مادة
            </Link>
          </div> */}
                </div>
                <div className="dashboard-content">
                    <div className="dasboard-box">
                        <div>
                            {newData != null && newData.length > 0 ? (
                                <>
                                    <input
                                        type="checkbox"
                                        name="selectAll"
                                        id="selectAll"
                                        onChange={(e) => this.onRowCheckChanged(e, e)}
                                        style={{
                                            marginLeft: 5 + "px",
                                        }}
                                    />
                                    <span>تحديد الكل</span>

                                    <div className="option-parent">
                                        <button onClick={() => this.acceptMany()} className="tableOption op-done">
                                            <i className="fi-rr-check"></i>
                                        </button>

                                        <button
                                            onClick={() => this.deleteMany()}
                                            color="red"
                                            className="tableOption op-delete"
                                            size="sm"
                                        >
                                            <i className="fi-rr-trash"></i>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                        <MDBDataTable
                            className="subscribtionTable"
                            pagesAmount={4}
                            entries={50}
                            hover
                            large
                            responsive
                            data={datatable}
                        />
                        {loadintable ? (
                            <div className="loading-par">
                                <div class="sp sp-volume"></div>
                                <h5>برجاء الانتظار</h5>
                            </div>
                        ) : null}
                        <Stack spacing={2}>
                            <Pagination style={{ direction: 'ltr' }} count={count} shape="rounded" onChange={this.handlePaginationChange}/>
                        </Stack>
                    </div>
                </div>
            </div>
        );
    }
}

export default Subscription;
