import React, { Component } from "react";
import { Content, Header, Left, Right, Footer, Spinner } from "native-base";
import {
  View,
  YellowBox,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { soundPlay } from "../utils/soundPlay";
import HeaderText from "../constants/HeaderText";
import Modal from "react-native-modal";
import { EmojiButton } from "../components/HintTimeAdd";
import BaseLayout from "../components/BaseLayout";
import { SettingsConsumer } from "../context/SettingsContext";
import Dimensions from "../constants/Layout";
import _ from "lodash";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  AdMobBanner,
  PublisherBanner,
  AdMobInterstitial,
  AdMobRewarded
} from "expo";
import { showInterstitialAd, showRewardedAd } from "../utils/showAd";

export default class ShopScreen extends Component {
  state = {
    showInfoModal: false
  };

  componentDidMount() {
    // Interstitial ad
    AdMobInterstitial.addEventListener("interstitialDidLoad", () => {});
    AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () => {});
    AdMobInterstitial.addEventListener("interstitialDidOpen", () => {});
    AdMobInterstitial.addEventListener("interstitialDidClose", () => {
      soundPlay(require("../assets/sounds/success.wav"));
      this.props.navigation.navigate("Shop");
      this.context.reducers._getLifeAdd(40);
    });
    AdMobInterstitial.addEventListener(
      "interstitialWillLeaveApplication",
      () => {}
    );

    //Rewarded Add

    AdMobRewarded.addEventListener("rewardedVideoDidRewardUser", () => {
      soundPlay(require("../assets/sounds/success.wav"));
      this.context.reducers._getLifeAdd(110);
    });
    AdMobRewarded.addEventListener("rewardedVideoDidLoad", () => {});
    AdMobRewarded.addEventListener("rewardedVideoDidStart", () => {});
    AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", () => {});
    AdMobRewarded.addEventListener("rewardedVideoDidOpen", () => {});
    AdMobRewarded.addEventListener("rewardedVideoDidClose", () => {});
    AdMobRewarded.addEventListener(
      "rewardedVideoWillLeaveApplication",
      () => {}
    );
  }

  componentWillUnmount() {
    // console.log("compomnent Unmounted");
    AdMobInterstitial.removeAllListeners();
    AdMobRewarded.removeAllListeners();
  }

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

  _get150crystalAd = () => {
    soundPlay(require("../assets/sounds/click.wav"));
    showInterstitialAd().catch(error => console.log(error));
    showRewardedAd().catch(error => {
      console.log(error);
    });
  };

  _bannerAd = () => {
    soundPlay(require("../assets/sounds/success.wav"));
    this.context.reducers._getLifeAdd(20);
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
                      this.props.navigation.pop();
                      soundPlay(require("../assets/sounds/click.wav"));
                    }}
                  >
                    <View style={styles.headerLeftButton}>
                      <HeaderText style={{ fontSize: 30 }}>
                        {" "}
                        go{"   "}back{" "}
                      </HeaderText>
                    </View>
                  </TouchableOpacity>
                </Left>
                <Right style={styles.headerRight}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showInfoModal: true });
                      soundPlay(require("../assets/sounds/click.wav"));
                    }}
                  >
                    <View style={styles.headerLeftButton}>
                      <Image
                        source={require("../assets/images/info.png")}
                        style={{
                          height: 40,
                          width: 40
                        }}
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
                <View style={styles.adBox}>
                  <View>
                    <EmojiButton
                      source={require("../assets/images/crystal.png")}
                      action={this._get150crystalAd}
                      text={"  get  1 5 0    "}
                      style={styles.adText}
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("AddQuestion");
                      }}
                    >
                      <View>
                        <HeaderText> add own question </HeaderText>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Content>

              <Footer
                Footer
                transparent
                style={{
                  backgroundColor: "transparent",
                  borderColor: "transparent"
                }}
              >
                {/* // Display a DFP Publisher banner */}
                <View style={{ flexDirection: "row" }}>
                  <HeaderText> + 20{"   "}</HeaderText>
                  <Image
                    source={require("../assets/images/crystal.png")}
                    style={{
                      overflow: "visible",
                      height: 30,
                      width: 30
                    }}
                  />
                  <HeaderText>{"   "}per banner click </HeaderText>
                </View>
              </Footer>
              <TouchableOpacity onPress={() => this._bannerAd()}>
                <Footer
                  Footer
                  transparent
                  style={{ backgroundColor: "transparent" }}
                >
                  {/* // Display a DFP Publisher banner */}
                  <PublisherBanner
                    bannerSize="fullBanner"
                    adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                    testDeviceID="EMULATOR"
                    onDidFailToReceiveAdWithError={this.bannerError}
                    onAdMobDispatchAppEvent={this.adMobEvent}
                  />
                </Footer>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._bannerAd()}>
                <Footer transparent style={{ backgroundColor: "transparent" }}>
                  {/* // Display a banner */}

                  <AdMobBanner
                    bannerSize="fullBanner"
                    adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                    testDeviceID="EMULATOR"
                    onDidFailToReceiveAdWithError={this.bannerError}
                  />
                </Footer>
              </TouchableOpacity>
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
                    For playing "what do i know ?", we hope you are enjoying it!
                    please support creator watch and click ads. And use your
                    reward wisely.{" "}
                  </HeaderText>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ showInfoModal: false });
                        soundPlay(require("../assets/sounds/click.wav"));
                      }}
                    >
                      <View>
                        <Image
                          source={require("../assets/images/cross.png")}
                          style={{
                            height: 40,
                            width: 40,
                            overflow: "visible"
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
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
