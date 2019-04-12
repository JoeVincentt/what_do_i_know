import React from "react";
import { Footer } from "native-base";
import Dimensions from "../constants/Layout";
import { AdMobBanner } from "expo";

class AdComponent extends React.Component {
  render() {
    return (
      <Footer
        transparent
        style={{
          backgroundColor: "transparent",
          borderColor: "transparent",
          paddingBottom: Dimensions.window.height * 0.03
        }}
      >
        {/* // Display a banner */}

        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-3081883372305625/3685548979" // Test ID, Replace with your-admob-unit-id
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={this.bannerError}
        />
      </Footer>
    );
  }
}

export default AdComponent;
