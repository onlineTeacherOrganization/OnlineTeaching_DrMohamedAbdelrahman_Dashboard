import React, { Component } from "react";

class TopHead extends Component {
  render() {
    return (
      <div>
          <div className="top-head">
          <div className="mob-icon">
            <button className="mobileIcon" onClick={this.props.openMobSideMenu}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
          </div>
      </div>
    );
  }
}

export default TopHead;
