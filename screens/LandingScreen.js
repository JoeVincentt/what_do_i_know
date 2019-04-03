import React, { Component } from "react";
import { Button, Content } from "native-base";
import { View } from "react-native";
import * as firebase from "firebase";
firebase.initializeApp(Constants.manifest.extra.firebaseConfig);
require("firebase/firestore");
import HeaderText from "../constants/HeaderText";
import Modal from "react-native-modal";
import { LinearGradient, Constants } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";
import LandingActionButton from "../components/LandingActionButton";
import BaseLayout from "../components/BaseLayout";
import Dimensions from "../constants/Layout";

const db = firebase.firestore();

export default class LandingScreen extends Component {
  state = {
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

  _facebookLogIn = async () => {
    // const key = Constants.manifest.extra.fbkey;
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
            const userDoc = usersRef.doc(data.additionalUserInfo.profile.id);
            try {
              const userRef = db
                .collection("users")
                .doc(data.additionalUserInfo.profile.id);
              let userData;
              const user = await userRef.get();
              if (user.exists) {
                existingUserData = await user.data();
                userData = {
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
                userData = {
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
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <LandingActionButton
            buttonText={" P L A Y   G A M E "}
            navigation={this.props.navigation}
            option={"newgame"}
          />
          <View style={{ marginVertical: 10 }} />
          <LandingActionButton
            buttonText={" S e t t i n g s "}
            navigation={this.props.navigation}
            modalOpen={this._modalOpen}
            option={"settings"}
          />
          <View style={{ marginVertical: 10 }} />
          <Button
            onPress={() => this._facebookLogIn()}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 7,
              elevation: 100,
              width: Dimensions.window.width / 1.5,
              height: Dimensions.window.height * 0.06,
              borderRadius: 30,
              borderColor: "transparent",
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <HeaderText>Facebook login</HeaderText>
          </Button>
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
      </BaseLayout>
    );
  }
}
