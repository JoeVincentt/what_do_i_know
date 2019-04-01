import { createStackNavigator } from "react-navigation";
import LandingScreen from "../screens/LandingScreen";
import GameScreen from "../screens/GameScreen";

export default createStackNavigator(
  {
    Landing: LandingScreen,
    Game: GameScreen
  },
  {
    headerMode: "none",
    initialRouteName: "Game"
  }
);
