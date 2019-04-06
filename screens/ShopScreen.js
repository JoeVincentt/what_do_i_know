import React, { Component } from "react";
import {
  Button,
  Content,
  Header,
  Left,
  Right,
  FooterTab,
  Footer,
  Spinner,
  Icon
} from "native-base";
import { View, YellowBox, Platform, Text, StyleSheet } from "react-native";
import * as firebase from "firebase";
require("firebase/firestore");
import HeaderText from "../constants/HeaderText";
import { LinearGradient, Constants } from "expo";
import Modal from "react-native-modal";
import { EmojiButton } from "../components/HintTimeAdd";
import BaseLayout from "../components/BaseLayout";
import { SettingsConsumer } from "../context/SettingsContext";
import Dimensions from "../constants/Layout";
import _ from "lodash";
import { getStatusBarHeight } from "react-native-status-bar-height";
const db = firebase.firestore();
import { AdMobBanner, PublisherBanner } from "expo";
import { showInterstitialAd, showRewardedAd } from "../utils/showAd";

export default class ShopScreen extends Component {
  state = {
    showInfoModal: false,
    loading: false
  };

  async componentWillMount() {
    //Ignore Warning on Android
    YellowBox.ignoreWarnings(["Setting a timer"]);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf("Setting a timer") <= -1) {
        _console.warn(message);
      }
    };
  }

  _get50crystalAd = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.context.reducers._getLifeAdd(50);
    }, 30000);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 30000);
    showInterstitialAd().catch(error => console.log(error));
    showRewardedAd().catch(error => {
      console.log(error);
    });
    setTimeout(() => {
      showInterstitialAd().catch(error => console.log(error));
    }, 10000);
    setTimeout(() => {
      showRewardedAd().catch(error => {
        console.log(error);
      });
    }, 20000);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 30000);
  };

  _get150crystalAd = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.context.reducers._getLifeAdd(150);
    }, 50000);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 60000);
    showInterstitialAd().catch(error => console.log(error));
    showRewardedAd().catch(error => {
      console.log(error);
    });
    setTimeout(() => {
      showInterstitialAd().catch(error => console.log(error));
    }, 10000);
    setTimeout(() => {
      showInterstitialAd().catch(error => console.log(error));
    }, 30000);
    setTimeout(() => {
      showInterstitialAd().catch(error => console.log(error));
    }, 55000);
    setTimeout(() => {
      showRewardedAd().catch(error => {
        console.log(error);
      });
    }, 20000);
    setTimeout(() => {
      showRewardedAd().catch(error => {
        console.log(error);
      });
    }, 40000);
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
                  <Button
                    large
                    transparent
                    onPress={() => this.props.navigation.pop()}
                    style={styles.headerLeftButton}
                  >
                    <HeaderText style={{ fontSize: 30 }}>
                      {" "}
                      back to 🎮{" "}
                    </HeaderText>
                  </Button>
                </Left>
                <Right style={styles.headerRight}>
                  <Button
                    large
                    transparent
                    onPress={() => this.setState({ showInfoModal: true })}
                    style={styles.headerLeftButton}
                  >
                    <HeaderText style={{ fontSize: 30 }}> click me </HeaderText>
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
                <View style={styles.adBox}>
                  <View>
                    <EmojiButton
                      action={this._get50crystalAd}
                      text={"   + 5 0 💎   watch 30 seconds  ad"}
                      style={styles.adText}
                    />
                    <EmojiButton
                      action={this._get150crystalAd}
                      text={"   + 1 5 0 💎   watch  1 minute  ad"}
                      style={styles.adText}
                    />
                  </View>
                </View>
              </Content>
              <Footer>
                {/* // Display a DFP Publisher banner */}
                <PublisherBanner
                  bannerSize="fullBanner"
                  adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                  testDeviceID="EMULATOR"
                  onDidFailToReceiveAdWithError={this.bannerError}
                  onAdMobDispatchAppEvent={this.adMobEvent}
                />
              </Footer>
              <Footer transparent style={{ backgroundColor: "transparent" }}>
                {/* // Display a banner */}
                <AdMobBanner
                  bannerSize="fullBanner"
                  adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                  testDeviceID="EMULATOR"
                  onDidFailToReceiveAdWithError={this.bannerError}
                />
              </Footer>
            </View>
          )}
        </SettingsConsumer>
        {/* rules modal */}
        <SettingsConsumer>
          {context => (
            <Modal
              isVisible={this.state.showInfoModal}
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
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <View style={{ paddingBottom: 10 }}>
                    <HeaderText> Thank you! </HeaderText>
                  </View>
                  <HeaderText>
                    {" "}
                    For playing "what do i know", we hope you are enjoying it!
                    please support creator watch and click ads. And use your
                    reward wisely 😉{" "}
                  </HeaderText>
                  <View>
                    <Button
                      large
                      transparent
                      onPress={() => this.setState({ showInfoModal: false })}
                    >
                      <HeaderText style={{ fontSize: 40 }}>❌</HeaderText>
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </SettingsConsumer>
        <Modal
          isVisible={this.state.loading}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          useNativeDriver={true}
          animationInTiming={500}
          animationOutTiming={500}
          backdropTransitionInTiming={500}
          backdropTransitionOutTiming={500}
        >
          <View style={styles.modalSpinnerBox}>
            <Spinner />
          </View>
        </Modal>
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
    height: 100,
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
  adBox: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  adText: { fontSize: 25 },
  modalBox: {
    flex: 1,
    backgroundColor: "transparent",
    height: 300,
    justifyContent: "center",
    alignItems: "center"
  },
  modalText: { fontSize: 20 }
});
