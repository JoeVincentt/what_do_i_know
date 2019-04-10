import React, { Component } from "react";
import {
  Button,
  Content,
  Icon,
  Spinner,
  Header,
  Left,
  Right,
  Item
} from "native-base";
import {
  View,
  YellowBox,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { firestore, auth, database } from "firebase";
require("firebase/firestore");
import HeaderText from "../constants/HeaderText";
import { LinearGradient, Constants, Audio } from "expo";
import { soundPlay } from "../utils/soundPlay";
import { SettingsConsumer } from "../context/SettingsContext";
import LandingActionButton from "../components/LandingActionButton";
import BaseLayout from "../components/BaseLayout";
import Dimensions from "../constants/Layout";
import _ from "lodash";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AnimTextView from "../components/AnimViewText";
import { _showToast } from "../utils/ShowToast";
import RulesModal from "../components/RulesModal";
import BestScoresChart from "../components/BestScoresChart";
import AnnouncementModal from "../components/AnnouncementModal";

const db = firestore();

export default class LandingScreen extends Component {
  state = {
    isRulesModalVisible: false,
    isAnnouncementModalVisible: false,
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
  componentWillUnmount() {}

  _alreadyLoggedCheck = async () => {
    auth().onAuthStateChanged(async user => {
      if (user != null) {
        const userId = auth().currentUser.uid;
        try {
          let userData;
          database()
            .ref("/users/" + userId)
            .once("value")
            .then(userExists => {
              const existingUserData = userExists.val();
              if (existingUserData !== null) {
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
                this.context.reducers._logInUser(userData);
              }
            });
        } catch (error) {
          _showToast("error occurred", 3000, "warning");
        }
      } else {
        this._facebookLogIn();
      }
    });
  };

  _facebookLogIn = async () => {
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
            const userId = auth().currentUser.uid;
            try {
              database()
                .ref("/users/" + userId)
                .once("value")
                .then(userExists => {
                  const existingUserData = userExists.val();
                  let userData;
                  if (existingUserData !== null) {
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
                    database()
                      .ref("users/" + userId)
                      .set(userData);
                    this.setState({
                      username: data.additionalUserInfo.profile.name
                    });
                    this.context.reducers._logInUser(userData);
                  }
                })
                .catch(error => _showToast("error occurred", 3000, "warning"));
            } catch (error) {
              _showToast("error occurred", 3000, "warning");
            }
          }
        } catch (error) {
          _showToast("error occurred", 3000, "warning");
        }
      } else {
        // type === 'cancel'
        _showToast("log in to play online", 3000, "warning");
      }
    } catch ({ message }) {
      // alert(`Facebook Login Error: ${message}`);
      _showToast(`${message}`, 3000, "warning");
    }
  };

  _logOut = () => {
    auth().signOut();
    this.setState({ username: "" });
    this.context.reducers._logOutUser();
  };

  userLoginControl = () => {
    if (this.state.username !== "") {
      soundPlay(require("../assets/sounds/click.wav"));
      return this._logOut();
    }
    this._alreadyLoggedCheck();
    soundPlay(require("../assets/sounds/click.wav"));
  };

  closeRulesModal = () => {
    this.setState({ isRulesModalVisible: false });
    soundPlay(require("../assets/sounds/click.wav"));
  };
  closeAnnouncementModal = () => {
    this.setState({ isAnnouncementModalVisible: false });
    soundPlay(require("../assets/sounds/click.wav"));
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
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        isAnnouncementModalVisible: true
                      }),
                        soundPlay(require("../assets/sounds/click.wav"));
                    }}
                  >
                    <View style={styles.headerLeftButton}>
                      <Image
                        source={require("../assets/images/announcement.png")}
                        style={{ height: 45, width: 45 }}
                      />
                    </View>
                  </TouchableOpacity>
                </Left>
                <Right style={styles.headerRight}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        isRulesModalVisible: true
                      }),
                        soundPlay(require("../assets/sounds/click.wav"));
                    }}
                  >
                    <View style={styles.headerRightButton}>
                      <Image
                        source={require("../assets/images/info.png")}
                        style={{ height: 45, width: 45 }}
                      />
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
                <View style={{ height: Dimensions.window.height * 0.17 }}>
                  {this.state.username !== "" ? (
                    <AnimTextView
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: Dimensions.window.height * 0.15
                      }}
                    >
                      <HeaderText> Welcome </HeaderText>
                      <HeaderText> {this.state.username} </HeaderText>
                    </AnimTextView>
                  ) : (
                    <View style={{ height: Dimensions.window.height * 0.17 }} />
                  )}
                </View>

                <LandingActionButton
                  buttonText={" p l a y   g a m e "}
                  navigation={this.props.navigation}
                />

                <View style={styles.mainBox}>
                  <Button
                    onPress={() => this.userLoginControl()}
                    style={{ borderRadius: 10 }}
                  >
                    <Icon name="logo-facebook" style={{ fontSize: 30 }} />
                    <HeaderText>
                      {" "}
                      l o g{"  "} {this.state.username !== "" ? "out" : "in"}
                      {"   "}
                    </HeaderText>
                  </Button>
                </View>
                {/* //* best results chart */}
                <BestScoresChart />
              </Content>
              {/* rules modal */}
              <RulesModal
                closeRulesModal={this.closeRulesModal}
                isRulesModalVisible={this.state.isRulesModalVisible}
              />
              {/* announcement modal */}
              <AnnouncementModal
                closeAnnouncementModal={this.closeAnnouncementModal}
                isAnnouncementModalVisible={
                  this.state.isAnnouncementModalVisible
                }
              />
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
    fontSize: 40,
    shadowColor: "#424242",
    shadowOpacity: 0.3,
    shadowRadius: 1,
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
  }
});
