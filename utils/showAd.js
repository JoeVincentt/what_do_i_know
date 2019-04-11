import { AdMobInterstitial, AdMobRewarded, Constants } from "expo";

const INTERSTITIAL_ID = "ca-app-pub-3081883372305625/1790745894";
const REWARDED_ID = "ca-app-pub-3081883372305625/8434893915";

AdMobInterstitial.setAdUnitID(INTERSTITIAL_ID);
AdMobInterstitial.setTestDeviceID("EMULATOR");
AdMobRewarded.setAdUnitID(REWARDED_ID);
AdMobRewarded.setTestDeviceID("EMULATOR");
// console.disableYellowBox = true;

export const showRewardedAd = async () => {
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
};

export const showInterstitialAd = async () => {
  await AdMobInterstitial.requestAdAsync();
  await AdMobInterstitial.showAdAsync();
};
