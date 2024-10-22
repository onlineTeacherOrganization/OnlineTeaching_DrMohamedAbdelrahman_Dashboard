import React, { Component } from "react";

import { NavLink } from "react-router-dom";

import { Accordion, Card, Button } from "react-bootstrap";
import { sourceBaseForImage } from "../assets/source";

class SideNav extends Component {
  render() {
    const logOut = () => {
      sessionStorage.removeItem("token");
      window.location.reload();
    };

    return (
      <div>
        <div className="right-sidebar">
          <button
            className="closeSideMenue"
            onClick={this.props.closeSideMenue}
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="container">
            <div className="logo">
              <img src={`${sourceBaseForImage}/logo-icon.png`} alt="" />
            </div>
            <div className="sideLinkd">
              <ul className="list-unstyled">
                <li>
                  <NavLink exact to="/home" activeClassName="activeLink">
                    <i className="fas fa-home"></i>
                    <span>الرئيسية</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/students" activeClassName="activeLink">
                    <i className="fas fa-user"></i>
                    <span>الطلبة</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    to="/studentsGrades"
                    activeClassName="activeLink"
                  >
                    <i className="fas fa-user"></i>
                    <span>درجات الطلبة</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/subjects" activeClassName="activeLink">
                    <i className="fas fa-book-open"></i>
                    <span>المواد</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/fields" activeClassName="activeLink">
                    <i className="fas fa-layer-group"></i>
                    <span>التخصصات</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/levels" activeClassName="activeLink">
                    <i className="fas fa-layer-group"></i>
                    <span>المراحل</span>
                  </NavLink>
                </li>
                <li>
                  <Accordion>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="0"
                        >
                          <i className="fas fa-book"></i>
                          <span>المحاضرات</span>
                          <span className="arrow-left">
                            <i className="fas fa-chevron-down"></i>
                          </span>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <NavLink
                            exact
                            to="/study-lectures"
                            activeClassName="activeLink"
                          >
                            <i className="fas fa-chevron-left"></i>
                            <span>محاضرات شرح</span>
                          </NavLink>

                          <NavLink
                            exact
                            to="/online-lectures"
                            activeClassName="activeLink"
                          >
                            <i className="fas fa-chevron-left"></i>
                            <span>محاضرات البث المباشر</span>
                          </NavLink>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </li>
                <li>
                  <NavLink exact to="/exams" activeClassName="activeLink">
                    <i className="fas fa-sticky-note"></i>
                    <span>الامتحانات</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    to="/re-exam-orders"
                    activeClassName="activeLink"
                  >
                    <i className="fas fa-sticky-note"></i>
                    <span>طلبات اعادة الامتحان</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    to="/reopenlecture"
                    activeClassName="activeLink"
                  >
                    <i className="fas fa-sticky-note"></i>
                    <span>طلبات فتح المحاضرات</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/reviews" activeClassName="activeLink">
                    <i className="fas fa-star"></i>
                    <span>المراجعات</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    to="/subscribtions"
                    activeClassName="activeLink"
                  >
                    <i className="fas fa-user-plus"></i>
                    <span>الاشتراكات</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/settings" activeClassName="activeLink">
                    <i className="fas fa-cog"></i>
                    <span>الاعدادات</span>
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="log-out">
              <button className="btn btn-block" onClick={logOut}>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SideNav;
