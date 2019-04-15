import { showAdmobInterstitialAd, showAdmobRewardedAd } from "../utils/showAd";
import { _showToast } from "../utils/ShowToast";
import { soundPlay } from "./soundPlay";

export const _get150crystalAd = () => {
  soundPlay(require("../assets/sounds/click.wav"));
  showAdmobInterstitialAd().catch(error => {
    // _showToast("Error showing ad", 2000, "warning")
  });
  showAdmobRewardedAd().catch(error => {
    // _showToast("Error showing ad", 2000, "warning");
  });
};
