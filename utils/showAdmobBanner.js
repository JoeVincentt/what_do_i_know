import React from "react";
import { Footer } from "native-base";
import Dimensions from "../constants/Layout";
import { Platform } from "react-native";
import { AdMobBanner } from "expo";

class AdComponent extends React.Component {
  render() {
    return (
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID={
          Platform.OS === "ios"
            ? "ca-app-pub-3081883372305625/3685548979"
            : "ca-app-pub-3081883372305625/9868362689"
        } // Test ID, Replace with your-admob-unit-id
        testDeviceID="EMULATOR"
        onDidFailToReceiveAdWithError={this.bannerError}
      />
    );
  }
}

export default AdComponent;
