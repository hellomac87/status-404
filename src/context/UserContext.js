import React, { Component } from "react";
import { kakaoAPI, mainAPI } from "../api";

const { Provider, Consumer } = React.createContext();

class UserProvider extends Component {
  state = {
    user: {
      pk: null,
      username: null,
      nickname: null,
      phone: null,
      img_profile: null
    },
    address: null,
    /* 
        address : [
            {
                address_name: "서울 강동구 천호동 225-15",
                main_address_no: "225",
                mountain_yn: "N",
                region_1depth_name: "서울",
                region_2depth_name: "강동구",
                region_3depth_name: "천호동",
                sub_address_no: "15",
                zip_code: ""
            }
        ]
        */
    login: this.login.bind(this),
    logout: this.logout.bind(this),
    join: this.join.bind(this),
    socialLogin: this.socialLogin.bind(this),
    googleLogin: this.googleLogin.bind(this)
  };

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      // TODO : axios로 토큰가지고 유저 데이터 끌고 오기
      //
      this.getAddress(/* 유저 이름 */);
    } else {
      this.getAddress("default");
    }
    console.log(this.state);
  }

  getAddress(username) {
    const address = JSON.parse(localStorage.getItem("address"));
    console.log("getaddress");
    if (address && address[username]) {
      this.setState({
        address: address[username]
      });
    } else {
      console.log("getaddress2");
      this.getPosition(username);
    }
  }

  getPosition(username) {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { longitude, latitude } }) => {
        console.log("lon", longitude, "lat", latitude);

        const {
          data: { documents }
        } = await kakaoAPI.get("", {
          params: {
            x: longitude,
            y: latitude,
            input_coord: "WGS84"
          }
        });
        console.log(documents[0]);

        this.setState({
          address: [documents[0]]
        });
        /* 
             address : {
                 test :  [
                  {
              address_name: "서울 강동구 천호동 225-15",
              main_address_no: "225",
              mountain_yn: "N",
              region_1depth_name: "서울",
              region_2depth_name: "강동구",
              region_3depth_name: "천호동",
              sub_address_no: "15",
              zip_code: ""
          }
              ]
             }
          */
        localStorage.setItem(
          "address",
          JSON.stringify({
            [username]: [documents[0]]
          })
        );
      }
    );
  }

  async login({ username, password }) {
    const { user, token } = await mainAPI.post("/members/auth/", {
      username,
      password
    });
    this.getAddress(user.username);
    localStorage.setItem("token", token);
  }

  logout() {
    localStorage.removeItem("token");
    this.setState({
      user: null
    });
    this.getAddress("default");
  }
  async join({ username, password, nickname, phone }) {
    await mainAPI.post("/members/register/", {
      username,
      password,
      nickname,
      phone
    });
  }
  socialLogin(result, history) {
    console.log(result);
    
    if (result != null) {
      this.setState({
        user: {
          /* 
          pk: null,
        username: null,
        nickname: null,
        phone: null,
        img_profile: null
        */
          username: result.email,
          nickname: result.name,
          img_profile: result.picture.data.url
        }
      });
      history.push("/");
    } else {
      console.log("facebook error");
    }
  }
  googleLogin({ profileObj: { email, googleId, imageUrl, name } }) {
    if (email) {
      this.setState({
        user: {
          pk: googleId,
          username: email,
          nickname: name,
          phone: null,
          img_profile: imageUrl
        }
      });
    } else {
      console.log("Google login fail");
    }
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}

const withUser = WrappedComponent => props => (
  <Consumer>{value => <WrappedComponent {...value} {...props} />}</Consumer>
);
export { UserProvider, Consumer as UserConsumber, withUser };
