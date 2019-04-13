import React from "react";
import { Footer } from "native-base";
import Dimensions from "../constants/Layout";
import { Platform } from "react-native";
import { AdMobInterstitial, AdMobRewarded, Constants, FacebookAds } from "expo";

FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash);

const INTERSTITIAL_ID =
  Platform.OS === "ios"
    ? "ca-app-pub-3081883372305625/1790745894"
    : "ca-app-pub-3081883372305625/6531752906";
const REWARDED_ID =
  Platform.OS === "ios"
    ? "ca-app-pub-3081883372305625/8434893915"
    : "ca-app-pub-3081883372305625/1415157597";
const FB_INTERSTITIAL_ID =
  Platform.OS === "ios"
    ? "398250697394647_398254807394236"
    : "285214675737797_285216045737660";

AdMobInterstitial.setAdUnitID(INTERSTITIAL_ID);
AdMobInterstitial.setTestDeviceID("EMULATOR");
AdMobRewarded.setAdUnitID(REWARDED_ID);
AdMobRewarded.setTestDeviceID("EMULATOR");
// console.disableYellowBox = true;

export const showAdmobRewardedAd = async () => {
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
};

export const showAdmobInterstitialAd = async () => {
  await AdMobInterstitial.requestAdAsync();
  await AdMobInterstitial.showAdAsync();
};

export const showFacebookInterstitialAd = async () => {
  FacebookAds.InterstitialAdManager.showAd(FB_INTERSTITIAL_ID)
    .then(didClick => {})
    .catch(error => {});
};
