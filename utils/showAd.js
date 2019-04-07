import { AdMobInterstitial, AdMobRewarded, Constants } from "expo";

const INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";
const REWARDED_ID = "ca-app-pub-3940256099942544/5224354917";

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
