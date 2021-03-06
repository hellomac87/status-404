import React, { Component } from "react";
import ReviewWriteModal from "../components/RestaurantDetail/ReviewWriteModal";
import ReviewWrite from "../components/RestaurantDetail/ReviewWrite";

export default class ReviewModalContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 리뷰 작성 모달 내의 페이지 상태
      reviewWritePage: false
    };
  }
  // 리뷰 작성 모달에서의 페이지 상태를 제어하는 함수
  handleReviewWritePage = () => {
    this.setState(prevState => ({
      reviewWritePage: !prevState.reviewWritePage
    }));
  };

  render() {
    const {
      show,
      name,
      onReviewWriteModal,
      onUserInput,
      onSubmitBtn
    } = this.props;
    const { review } = this.state;
    return (
      <>
        {this.state.reviewWritePage === false ? (
          <ReviewWriteModal
            name={name}
            show={show}
            onReviewWriteModal={onReviewWriteModal}
            onReviewWritePage={() => this.handleReviewWritePage()}
          />
        ) : this.state.reviewWritePage === true ? (
          <ReviewWrite
            name={name}
            review={review}
            onReviewWritePage={() => this.handleReviewWritePage()}
            onUserInput={onUserInput}
            onSubmitBtn={onSubmitBtn}
          />
        ) : null}
      </>
    );
  }
}
