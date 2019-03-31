import { createStackNavigator } from "react-navigation";
import LandingScreen from "../screens/LandingScreen";
import ModeScreen from "../screens/ModeScreen";
import GameScreen from "../screens/GameScreen";

export default createStackNavigator(
  {
    Landing: LandingScreen,
    Mode: ModeScreen,
    Game: GameScreen
  },
  {
    headerMode: "none"
    // initialRouteName: "Game"
  }
);
