import { createStackNavigator } from "react-navigation";
import LandingScreen from "../screens/LandingScreen";
import ModeScreen from "../screens/ModeScreen";
import GameScreen from "../screens/GameScreen";
import SettingsScreen from "../screens/SettingsScreen";

export default createStackNavigator(
  {
    Landing: LandingScreen,
    Mode: ModeScreen,
    Game: GameScreen,
    Settings: SettingsScreen
  },
  {
    headerMode: "none",
    initialRouteName: "Game"
  }
);
