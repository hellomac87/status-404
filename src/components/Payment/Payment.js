import React, { Component } from "react";
import styles from "./Payment.module.scss";
import classNames from "classnames/bind";
import Nothing from "../Nothing";
import BackHeader from "../BackHeader";
import HighLight from "../HighLight";
import Detail from "../Detail";
import CustomInput from "../CustomInput";
import RightNothing from "../RightNothing";
import CustomCheckBox from "../CustomCheckBox";
import Folding from "../Folding";
import PaymentMethod from "../PaymentMethod";

const cx = classNames.bind(styles);

class Payment extends Component {
  payList = [
    "네이버페이",
    "배민페이",
    "배민페이 계좌이체",
    "카드결제",
    "휴대폰결제",
    "페이코",
    "카카오페이"
  ];
  generalList = ["만나서 카드결제", "만나서 현금결제"];
  state = {
    popup: false,
    method: this.payList[0],
    // API로 디데일 주소 + 전화번호 받아오기
    detail: "",
    tel: "",
    request: ""
  };
  componentDidMount() {
    var IMP = window.IMP; // 생략가능
    IMP.init("imp19043807");
  }
  handlePay = () => {
    const {history} = this.props;
    // TODO: 사용자 정보를 받아서 표시해야 함
    window.IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: "merchant_" + new Date().getTime(),
        name: "주문명:결제테스트",
        amount: 1000,
        buyer_email: "iamport@siot.do",
        buyer_name: "구매자이름",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456"
      },
      function(rsp) {
        if (rsp.success) {
          var msg = "결제가 완료되었습니다.";
          msg += "고유ID : " + rsp.imp_uid;
          msg += "상점 거래ID : " + rsp.merchant_uid;
          msg += "결제 금액 : " + rsp.paid_amount;
          msg += "카드 승인번호 : " + rsp.apply_num;
        } else {
          msg = "결제에 실패하였습니다.";
          msg += "에러내용 : " + rsp.error_msg;
        }
        console.dir('결제',rsp);
        alert(msg);
        history.replace('/');
      }
    );
  };
  handlePopup = () => {
    this.setState({
      popup: !this.state.popup
    });
  };
  handleToggle = method => {
    this.setState({ method, popup: !this.state.popup });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  render() {
    return (
      <div className={cx("payment")}>
        <BackHeader backURL="/cart" title="" />
        <HighLight
          title="배달정보"
          style={{ marginTop: "5rem", paddingTop: "0.5rem" }}
        />
        <Detail main="노원구 상계동 666" sub="(도로명) 노원로 564" />
        <CustomInput
          type="text"
          value={this.state.detail}
          name="detail"
          onChange={this.handleChange}
          placeholder="상세주소를 입력해주세요"
        />
        <CustomInput
          type="tel"
          value={this.state.tel}
          name="tel"
          onChange={this.handleChange}
          placeholder="전화번호를 입력해주세요"
        />
        <CustomCheckBox text="안심번호 사용" />
        <CustomInput
          type="text"
          value={this.state.request}
          name="request"
          onChange={this.handleChange}
          placeholder="요청사항을 입력해주세요"
        />
        <CustomCheckBox
          text="요청사항 저장"
          right={`${this.state.request.length}/40`}
        />
        <HighLight title="결제금액" />
        <Detail main="23400원" sub="주문금액 20400원 + 배달팁 3000원" />
        <RightNothing
          title={this.state.method}
          right="변경"
          handleClick={this.handlePopup}
          style={{ cursor: "pointer" }}
        />
        <Folding
          title="배달상품 주의사항"
          content="레알 배달의 민족이 아닙니다. 만약 끌리셨다면 yoeubi28@gmail.com 으로 연락주세요"
        />
        <Nothing
          style={{
            color: "#999",
            fontSize: "1.5rem",
            marginBottom: "6rem"
          }}
        >
          위 내용을 확인하였으며 결제에 동의합니다.
        </Nothing>
        <Nothing
          style={{
            background: "#2fc0be",
            color: "#fff",
            fontSize: "1.7rem",
            position: "fixed",
            bottom: "0",
            left: "0"
          }}
          onClick={this.handlePay}
        >
          23400원 결제하기
        </Nothing>
        <PaymentMethod
          payList={this.payList}
          generalList={this.generalList}
          method={this.state.method}
          handlePopup={this.handlePopup}
          popup={this.state.popup}
          handleToggle={this.handleToggle}
        />
      </div>
    );
  }
}

export default Payment;
