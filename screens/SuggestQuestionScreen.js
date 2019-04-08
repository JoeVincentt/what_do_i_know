import React, { Component } from "react";
import { Content, Header, Left, Footer, Spinner } from "native-base";
import {
  View,
  YellowBox,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  LinearGradient
} from "react-native";
import { soundPlay } from "../utils/soundPlay";
import HeaderText from "../constants/HeaderText";
import BaseLayout from "../components/BaseLayout";
import { SettingsConsumer } from "../context/SettingsContext";
import Dimensions from "../constants/Layout";
import _ from "lodash";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { AdMobBanner, PublisherBanner, AdMobInterstitial } from "expo";
import { showInterstitialAd } from "../utils/showAd";

export default class ShopScreen extends Component {
  state = {
    showInfoModal: false,
    text: ""
  };

  componentDidMount() {
    // showInterstitialAd().catch(error => console.log(error));
    // Interstitial ad
    AdMobInterstitial.addEventListener("interstitialDidLoad", () => {});
    AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () => {});
    AdMobInterstitial.addEventListener("interstitialDidOpen", () => {});
    AdMobInterstitial.addEventListener("interstitialDidClose", () => {
      soundPlay(require("../assets/sounds/success.wav"));
      this.props.navigation.navigate("AddQuestion");
    });
    AdMobInterstitial.addEventListener(
      "interstitialWillLeaveApplication",
      () => {}
    );

    //Rewarded Add
  }

  componentWillUnmount() {
    // console.log("compomnent Unmounted");
    AdMobInterstitial.removeAllListeners();
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
              </Header>
              {/* action buttons area */}
              <Content contentContainerStyle={{}}>
                <View>
                  <View
                    style={{
                      width: Dimensions.window.width * 0.9,
                      height: Dimensions.window.height * 0.2,
                      backgroundColor: "white",
                      borderRadius: 30,
                      shadowColor: "black",
                      elevation: 20,
                      shadowOpacity: 0.8,
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 15,
                      margin: Dimensions.window.height * 0.03
                    }}
                  >
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 20,
                        fontWeight: "500",
                        margin: 10
                      }}
                      editable={true}
                      maxLength={100}
                      multiline={true}
                      numberOfLines={4}
                      onChangeText={text => this.setState({ text })}
                      value={this.state.text}
                    />
                  </View>
                  <View>
                    <View>
                      <View>
                        <TouchableOpacity onPress={() => {}}>
                          <View>
                            <HeaderText style={{ fontSize: 20 }}>
                              four
                            </HeaderText>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {}}>
                          <View>
                            <HeaderText style={{ fontSize: 20 }}>
                              one
                            </HeaderText>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <TouchableOpacity onPress={() => {}}>
                          <View>
                            <HeaderText style={{ fontSize: 20 }}>
                              two
                            </HeaderText>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {}}>
                          <View>
                            <HeaderText style={{ fontSize: 20 }}>
                              three
                            </HeaderText>
                          </View>
                        </TouchableOpacity>
                        <View style={{ marginVertical: 10 }} />
                      </View>
                    </View>
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
  }
});
