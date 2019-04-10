import { createStackNavigator } from "react-navigation";
import LandingScreen from "../screens/LandingScreen";
import GameScreen from "../screens/GameScreen";
import ShopScreen from "../screens/ShopScreen";
import SuggestQuestionScreen from "../screens/SuggestQuestionScreen";

export default createStackNavigator(
  {
    Game: GameScreen,
    Shop: ShopScreen,
    AddQuestion: SuggestQuestionScreen
  },
  {
    headerMode: "none",
    initialRouteName: "Game"
  }
);
