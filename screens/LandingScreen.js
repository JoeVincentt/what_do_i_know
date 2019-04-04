import React, { Component } from "react";
import {
  Button,
  Content,
  Icon,
  Spinner,
  Header,
  Body,
  Left,
  Right,
  Container
} from "native-base";
import { View, YellowBox, Platform, Text } from "react-native";
import * as firebase from "firebase";
require("firebase/firestore");
import HeaderText from "../constants/HeaderText";
import Modal from "react-native-modal";
import { LinearGradient, Constants } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";
import LandingActionButton from "../components/LandingActionButton";
import BaseLayout from "../components/BaseLayout";
import Dimensions from "../constants/Layout";
import _ from "lodash";
import { getStatusBarHeight } from "react-native-status-bar-height";

const db = firebase.firestore();

export default class LandingScreen extends Component {
  state = {
    isRulesModalVisible: false,
    isModalVisible: false,
    darkTheme: false
  };

  _modalOpen = () => {
    this.setState({ isModalVisible: true });
  };

  _updateBackground = (dark, light) => {
    this.context.reducers._backgroundColorChange(dark, light);
    this.setState({ isModalVisible: false });
  };
  componentWillMount() {
    //Ignore Warning on Android
    YellowBox.ignoreWarnings(["Setting a timer"]);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf("Setting a timer") <= -1) {
        _console.warn(message);
      }
    };
  }

  _alreadyLoggedCheck = async () => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        try {
          const userRef = db
            .collection("users")
            .doc(firebase.auth().currentUser.uid);
          let userData;
          const user = await userRef.get();
          if (user.exists) {
            existingUserData = await user.data();
            userData = {
              id: existingUserData.id,
              email: existingUserData.email,
              username: existingUserData.username,
              avatar: existingUserData.avatar,
              life: existingUserData.life,
              scores: existingUserData.scores,
              bestScores: existingUserData.bestScores,
              crystal: existingUserData.crystal
            };
          } else {
            //if user doesnt exist
            console.log("error fetching user");
          }
          this.context.reducers._logInUser(userData);
          this.props.navigation.navigate("Game");
        } catch (error) {
          console.log(error);
        }
      } else {
        this._facebookLogIn();
      }
    });
  };

  _facebookLogIn = async () => {
    // const key = Constants.manifest.extra.fbkey;
    //Check if user logged in already(has token)

    try {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
        Constants.manifest.facebookAppId,
        {
          permissions: ["email", "public_profile"]
        }
      );
      if (type === "success") {
        // Build Firebase credential with the Facebook access token.
        const credential = await firebase.auth.FacebookAuthProvider.credential(
          token
        );
        // Sign in with credential from the Facebook user.
        try {
          const data = await firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential);
          if (data) {
            const usersRef = db.collection("users");
            const userDoc = usersRef.doc(firebase.auth().currentUser.uid);
            try {
              const userRef = db
                .collection("users")
                .doc(firebase.auth().currentUser.uid);
              let userData;
              const user = await userRef.get();
              if (user.exists) {
                existingUserData = await user.data();
                userData = {
                  id: existingUserData.id,
                  email: existingUserData.email,
                  username: existingUserData.username,
                  avatar: existingUserData.avatar,
                  life: existingUserData.life - 1,
                  scores: existingUserData.scores,
                  bestScores: existingUserData.bestScores,
                  crystal: existingUserData.crystal
                };
              } else {
                //if user doesnt exist
                userData = {
                  id: firebase.auth().currentUser.uid,
                  email: data.additionalUserInfo.profile.email,
                  username: data.additionalUserInfo.profile.name,
                  avatar: data.additionalUserInfo.profile.picture.data.url,
                  life: 3,
                  scores: 0,
                  bestScores: 0,
                  crystal: 0
                };
                userDoc.set(userData);
              }
              this.context.reducers._logInUser(userData);
              this.props.navigation.navigate("Game");
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        // type === 'cancel'
        console.log("cancel");
      }
    } catch ({ message }) {
      console.log(message);
      alert(`Facebook Login Error: ${message}`);
    }
  };

  render() {
    return (
      <BaseLayout>
        <SettingsConsumer>
          {context => (
            <View
              style={{ flex: 1 }}
              ref={ref => {
                this.context = context;
              }}
            >
              <Header
                transparent
                style={{
                  paddingTop: getStatusBarHeight(),
                  height: 54 + getStatusBarHeight()
                }}
              >
                <Left
                  style={{
                    flex: 1,
                    marginLeft: Dimensions.window.width * 0.05
                  }}
                >
                  <Button
                    large
                    transparent
                    onPress={() =>
                      this.setState({
                        isRulesModalVisible: true
                      })
                    }
                    style={{
                      shadowColor: "black",
                      shadowOpacity: 0.4,
                      shadowRadius: 5,
                      elevation: 100
                    }}
                  >
                    <HeaderText style={{ fontSize: 40 }}> 📜 </HeaderText>
                  </Button>
                </Left>
                <Right
                  style={{
                    marginRight: Dimensions.window.width * 0.05,
                    marginTop:
                      Platform.OS === "ios"
                        ? 0
                        : Dimensions.window.height * 0.05
                  }}
                >
                  <Button
                    large
                    transparent
                    onPress={() => console.log("shop")}
                    style={{
                      shadowColor: "black",
                      shadowOpacity: 0.4,
                      shadowRadius: 5,
                      elevation: 100
                    }}
                  >
                    <HeaderText style={{ fontSize: 40 }}> 🛒 </HeaderText>
                  </Button>
                </Right>
              </Header>
              {/* action buttons area */}
              <Content
                contentContainerStyle={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <LandingActionButton
                  buttonText={" P L A Y   o f f l i n e "}
                  navigation={this.props.navigation}
                  option={"newgame"}
                />
                <View style={{ marginVertical: 10 }} />
                <LandingActionButton
                  style={{ backgroundColor: "transparent" }}
                  buttonText={`${
                    Platform.OS === "ios" ? "⚙️" : "🔧"
                  } c o l o r   t h e m e  `}
                  navigation={this.props.navigation}
                  modalOpen={this._modalOpen}
                  option={"settings"}
                />
                <View
                  style={{
                    marginVertical: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 7,
                    elevation: 100,
                    borderRadius: 30,
                    borderColor: "transparent",
                    backgroundColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Button
                    onPress={() => this._alreadyLoggedCheck()}
                    style={{ borderRadius: 10 }}
                  >
                    <Icon name="logo-facebook" style={{ fontSize: 30 }} />
                    <HeaderText>o n l i n e{"  "}</HeaderText>
                  </Button>
                </View>

                {/* best results chart */}
                <View>
                  {context.overallBestScores.gold.username !== "" ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                        marginVertical: 20,
                        borderWidth: 2,
                        borderColor: "white",
                        shadowColor: "blue",
                        shadowOpacity: 0.3,
                        shadowRadius: 7,
                        shadowOffset: { width: 0, height: 1 },
                        elevation: 200
                      }}
                    >
                      <View style={{ paddingBottom: 10 }}>
                        <HeaderText>b e s t{"   "}r e s u l t s : </HeaderText>
                      </View>
                      <View style={{}}>
                        <HeaderText style={{ fontSize: 30 }}>
                          🥇{"   "}
                          {context.overallBestScores.gold.bestScores}
                          {"   "}
                          {context.overallBestScores.gold.username}{" "}
                        </HeaderText>
                        <HeaderText style={{ fontSize: 30 }}>
                          🥈{"   "}
                          {context.overallBestScores.silver.bestScores}
                          {"   "}
                          {context.overallBestScores.silver.username}{" "}
                        </HeaderText>
                        <HeaderText style={{ fontSize: 30 }}>
                          🥉{"   "}
                          {context.overallBestScores.bronze.bestScores}
                          {"   "}
                          {context.overallBestScores.bronze.username}{" "}
                        </HeaderText>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        height: Dimensions.window.height * 0.3,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Spinner color="#000" />
                    </View>
                  )}
                </View>

                {/* rules modal */}
                <SettingsConsumer>
                  {context => (
                    <Modal
                      isVisible={this.state.isRulesModalVisible}
                      ref={ref => {
                        this.context = context;
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "transparent",
                          height: 300,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <View>
                          <HeaderText>Hello there here is rules</HeaderText>
                          <HeaderText>Hello there here is rules</HeaderText>
                          <HeaderText>Hello there here is rules</HeaderText>
                          <HeaderText>Hello there here is rules</HeaderText>
                          <HeaderText>Hello there here is rules</HeaderText>
                          <HeaderText>Hello there here is rules</HeaderText>
                          <HeaderText>Hello there here is rules</HeaderText>
                        </View>
                        <View>
                          <Button
                            large
                            transparent
                            onPress={() =>
                              this.setState({ isRulesModalVisible: false })
                            }
                          >
                            <HeaderText style={{ fontSize: 40 }}>❌</HeaderText>
                          </Button>
                        </View>
                      </View>
                    </Modal>
                  )}
                </SettingsConsumer>
                {/* color modal */}
                <SettingsConsumer>
                  {context => (
                    <Modal
                      isVisible={this.state.isModalVisible}
                      ref={ref => {
                        this.context = context;
                      }}
                    >
                      <LinearGradient
                        colors={[
                          context.backgroundColor.color1,
                          context.backgroundColor.color2,
                          context.backgroundColor.color3
                        ]}
                        style={{
                          padding: 15,
                          alignItems: "center",
                          justifyContent: "flex-start",
                          borderRadius: 20
                        }}
                      >
                        <Button
                          dark
                          full
                          style={{ borderRadius: 20 }}
                          onPress={() => this._updateBackground("dark", null)}
                        >
                          <HeaderText>D a r k{"  "}t h e m e</HeaderText>
                        </Button>
                        <View style={{ marginVertical: 10 }} />
                        <Button
                          light
                          full
                          style={{ borderRadius: 20 }}
                          onPress={() => this._updateBackground(null, "light")}
                        >
                          <HeaderText>L i g h t{"  "}t h e m e</HeaderText>
                        </Button>
                      </LinearGradient>
                    </Modal>
                  )}
                </SettingsConsumer>
              </Content>
            </View>
          )}
        </SettingsConsumer>
      </BaseLayout>
    );
  }
}
