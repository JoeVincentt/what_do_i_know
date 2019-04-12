import React from "react";
import { Footer } from "native-base";
import Dimensions from "../constants/Layout";
import { FacebookAds } from "expo";

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
        <FacebookAds.BannerAd
          placementId="398250697394647_398251067394610"
          type="standard"
          onPress={() => {
            this.props._getLifeAdd(20);
          }}
          onError={error => {}}
        />
      </Footer>
    );
  }
}

export default AdComponent;
