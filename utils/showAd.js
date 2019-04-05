import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  Constants
} from "expo";

export const showRewardedAd = async () => {
  AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test ID, Replace with your-admob-unit-id
  AdMobRewarded.setTestDeviceID("EMULATOR");
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
};
