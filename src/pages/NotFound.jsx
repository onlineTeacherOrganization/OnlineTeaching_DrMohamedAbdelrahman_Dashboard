import React, { Component } from "react";

import { Link } from "react-router-dom";
import { sourceBaseForImage } from "../assets/source";

export default class NotFound extends Component {
  render() {
    return (
      <div className="notfound">
        <img src={`${sourceBaseForImage}/404.svg`} alt="" />
        <h5>الصفحة غير موجوده</h5>
        <Link className="return-home" to="/home">
          العودة للرئيسية
        </Link>
      </div>
    );
  }
}
