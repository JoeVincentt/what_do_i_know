import React from "react";
import { Footer } from "native-base";
import Dimensions from "../constants/Layout";
import { Platform } from "react-native";
import { FacebookAds } from "expo";

class AdComponent extends React.Component {
  render() {
    return (
      <FacebookAds.BannerAd
        placementId={
          Platform.OS === "ios"
            ? "398250697394647_398251067394610"
            : "285214675737797_285214855737779"
        }
        type="standard"
        onPress={() => {
          this.props._getLifeAdd(20);
        }}
        onError={error => {}}
      />
    );
  }
}

export default AdComponent;
