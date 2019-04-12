import React from "react";
import { Footer } from "native-base";
import Dimensions from "../constants/Layout";
import { AdMobInterstitial, AdMobRewarded, Constants, FacebookAds } from "expo";

FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash);

const INTERSTITIAL_ID = "ca-app-pub-3081883372305625/1790745894";
const REWARDED_ID = "ca-app-pub-3081883372305625/8434893915";
const FB_INTERSTITIAL_ID = "398250697394647_398254807394236";

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
