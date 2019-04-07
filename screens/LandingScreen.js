import React, { Component } from "react";
import {
  Button,
  Content,
  Icon,
  Spinner,
  Header,
  Left,
  Right
} from "native-base";
import {
  View,
  YellowBox,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { firestore, auth } from "firebase";
require("firebase/firestore");
import HeaderText from "../constants/HeaderText";
import Modal from "react-native-modal";
import { LinearGradient, Constants, Audio } from "expo";
import { soundPlay } from "../utils/soundPlay";
import { SettingsConsumer } from "../context/SettingsContext";
import LandingActionButton from "../components/LandingActionButton";
import BaseLayout from "../components/BaseLayout";
import Dimensions from "../constants/Layout";
import _ from "lodash";
import { getStatusBarHeight } from "react-native-status-bar-height";

const db = firestore();

export default class LandingScreen extends Component {
  state = {
    isRulesModalVisible: false,
    username: ""
  };

  componentWillMount() {
    this._alreadyLoggedCheck();
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
    auth().onAuthStateChanged(async user => {
      if (user != null) {
        try {
          const userRef = db.collection("users").doc(auth().currentUser.uid);
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
            this.setState({ username: existingUserData.username });
          } else {
            //if user doesnt exist
            console.log("error fetching user");
          }
          this.context.reducers._logInUser(userData);
          // this.props.navigation.navigate("Game");
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
        const credential = await auth.FacebookAuthProvider.credential(token);
        // Sign in with credential from the Facebook user.
        try {
          const data = await auth().signInAndRetrieveDataWithCredential(
            credential
          );
          if (data) {
            const usersRef = db.collection("users");
            const userDoc = usersRef.doc(auth().currentUser.uid);
            try {
              const userRef = db
                .collection("users")
                .doc(auth().currentUser.uid);
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
                this.setState({ username: existingUserData.username });
              } else {
                //if user doesnt exist
                userData = {
                  id: auth().currentUser.uid,
                  email: data.additionalUserInfo.profile.email,
                  username: data.additionalUserInfo.profile.name,
                  avatar: data.additionalUserInfo.profile.picture.data.url,
                  life: 3,
                  scores: 0,
                  bestScores: 0,
                  crystal: 0
                };
                userDoc.set(userData);
                this.setState({
                  username: data.additionalUserInfo.profile.name
                });
              }
              this.context.reducers._logInUser(userData);
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

  _logOut = () => {
    auth().signOut();
    this.context.reducers._logOutUser();
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
                <Left style={styles.headerLeft}>
                  <TouchableOpacity onPress={() => this._logOut()}>
                    <View style={styles.headerLeftButton}>
                      <Icon name="log-out" style={{ fontSize: 40 }} />
                    </View>
                  </TouchableOpacity>
                </Left>
                <Right style={styles.headerRight}>
                  <TouchableOpacity
                    onPress={async () => {
                      this.setState({
                        isRulesModalVisible: true
                      }),
                        soundPlay(require("../assets/sounds/click.wav"));
                    }}
                  >
                    <View style={styles.headerRightButton}>
                      <HeaderText style={{ fontSize: 30 }}>
                        {" "}
                        {`${Platform.OS === "ios" ? "📜" : "💡"}`}{" "}
                      </HeaderText>
                    </View>
                  </TouchableOpacity>
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
                {this.state.username !== "" ? (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: Dimensions.window.height * 0.15
                    }}
                  >
                    <HeaderText> Welcome </HeaderText>
                    <HeaderText> {this.state.username} </HeaderText>
                  </View>
                ) : (
                  <View style={{ height: Dimensions.window.height * 0.15 }} />
                )}

                <LandingActionButton
                  buttonText={" p l a y   g a m e "}
                  navigation={this.props.navigation}
                />

                <View style={styles.mainBox}>
                  <Button
                    onPress={() => {
                      this._alreadyLoggedCheck();
                      soundPlay(require("../assets/sounds/click.wav"));
                    }}
                    style={{ borderRadius: 10 }}
                  >
                    <Icon name="logo-facebook" style={{ fontSize: 30 }} />
                    <HeaderText>
                      {" "}
                      l o g{"  "}i n{"   "}
                    </HeaderText>
                  </Button>
                </View>

                {/* //* best results chart */}
                <View>
                  {context.overallBestScores.gold.username !== "" ? (
                    <View style={styles.topChartBox}>
                      <View style={{ paddingBottom: 10 }}>
                        <HeaderText>b e s t{"   "}r e s u l t s : </HeaderText>
                      </View>
                      <View style={{}}>
                        <HeaderText style={{ fontSize: 26 }}>
                          🥇{"   "}
                          {context.overallBestScores.gold.bestScores}
                          {"   "}
                          {context.overallBestScores.gold.username}{" "}
                        </HeaderText>
                        <HeaderText style={{ fontSize: 25 }}>
                          🥈{"   "}
                          {context.overallBestScores.silver.bestScores}
                          {"   "}
                          {context.overallBestScores.silver.username}{" "}
                        </HeaderText>
                        <HeaderText style={{ fontSize: 24 }}>
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
              </Content>
              {/* rules modal */}
              <SettingsConsumer>
                {context => (
                  <Modal
                    isVisible={this.state.isRulesModalVisible}
                    ref={ref => {
                      this.context = context;
                    }}
                    backdropColor={context.backgroundColor.color2}
                    backdropOpacity={0.95}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                  >
                    <View style={styles.modalBox}>
                      <View>
                        <View style={{ paddingBottom: 10 }}>
                          <HeaderText> g a m e{"  "}r u l e s : </HeaderText>
                        </View>

                        <HeaderText style={styles.modalText}>
                          {" "}
                          ❔ answer questions{" "}
                        </HeaderText>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          🏆 get the best score{" "}
                        </HeaderText>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          🎯 get in top chart{"  "}
                        </HeaderText>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          🗝 get hint for 20 💎{" "}
                        </HeaderText>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          +⏳ reset countdown for 10 💎{" "}
                        </HeaderText>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          + 1 ❤️ for 35 💎
                        </HeaderText>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          ⏩ skip question for 15 💎
                        </HeaderText>

                        <View
                          style={{
                            paddingTop: 20,
                            paddingBottom: 10
                          }}
                        >
                          <HeaderText> Question difficulty : </HeaderText>
                        </View>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          ⭐️ +1 score{" "}
                        </HeaderText>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          ⭐️⭐️ +2 score{" "}
                        </HeaderText>
                        <HeaderText style={styles.modalText}>
                          {" "}
                          ⭐️⭐️⭐️ +3 score{" "}
                        </HeaderText>
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ isRulesModalVisible: false });
                            soundPlay(require("../assets/sounds/click.wav"));
                          }}
                        >
                          <View>
                            <HeaderText style={{ fontSize: 40 }}>❌</HeaderText>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                )}
              </SettingsConsumer>
            </View>
          )}
        </SettingsConsumer>
      </BaseLayout>
    );
  }
}

const styles = StyleSheet.create({
  headerLeft: {
    flex: 1,
    marginLeft: Dimensions.window.width * 0.05,
    marginTop: Platform.OS === "ios" ? 0 : Dimensions.window.height * 0.05
  },
  headerLeftButton: {
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 100
  },
  headerRight: {
    marginRight: Dimensions.window.width * 0.05,
    marginTop: Platform.OS === "ios" ? 0 : Dimensions.window.height * 0.05
  },
  headerRightButton: {
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 100
  },
  mainBox: {
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
  },
  topChartBox: {
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
    elevation: 100
  },
  modalBox: {
    flex: 1,
    backgroundColor: "transparent",
    height: 300,
    justifyContent: "center",
    alignItems: "center"
  },
  modalText: { fontSize: 20 }
});
