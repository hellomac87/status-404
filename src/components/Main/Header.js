import React, { Component } from "react";
import { withUi } from "../../context/UiContext";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { ReactComponent as ChevronDown } from "../../img/chevron-down.svg";
import { ReactComponent as Hambergur } from "../../img/grabber.svg";

const cx = classNames.bind(styles);

class Header extends Component {
  componentWillUnmount() {
    const { handleBodyOnModal } = this.props;
    handleBodyOnModal("close");
  }
  render() {
    const {
      handleBodyOnModal,
      address,
      onUserModal,
      onAddressSearch
    } = this.props;
    return (
      <div className={cx("header")}>
        <Hambergur
          className={cx("hambergur")}
          onClick={() => {
            handleBodyOnModal("open");
            onUserModal();
          }}
        />

        <div onClick={onAddressSearch} className={cx("addressInput")}>
          <span className={cx("address")}>
            {address ? address[0].address.address_name : "조회중입니다."}
          </span>
          <ChevronDown className={cx("icon")} alt="down" />
        </div>
      </div>
    );
  }
}

export default withUi(Header);
