import { createStackNavigator } from "react-navigation";
import LandingScreen from "../screens/LandingScreen";
import GameScreen from "../screens/GameScreen";
import ShopScreen from "../screens/ShopScreen";

export default createStackNavigator(
  {
    Landing: LandingScreen,
    Game: GameScreen,
    Shop: ShopScreen
  },
  {
    headerMode: "none",
    initialRouteName: "Landing"
  }
);
