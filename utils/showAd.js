import { AdMobInterstitial, AdMobRewarded, Constants } from "expo";

export const showRewardedAd = async () => {
  AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test ID, Replace with your-admob-unit-id
  AdMobRewarded.setTestDeviceID("EMULATOR");
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
};

export const showInterstitialAd = async () => {
  AdMobInterstitial.setAdUnitID("ca-app-pub-3940256099942544/1033173712"); // Test ID, Replace with your-admob-unit-id
  AdMobInterstitial.setTestDeviceID("EMULATOR");
  await AdMobInterstitial.requestAdAsync();
  await AdMobInterstitial.showAdAsync();
};
