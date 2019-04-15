import { createStackNavigator } from "react-navigation";
import GameScreen from "../screens/GameScreen";
import SuggestQuestionScreen from "../screens/SuggestQuestionScreen";

export default createStackNavigator(
  {
    Game: GameScreen,
    AddQuestion: SuggestQuestionScreen
  },
  {
    headerMode: "none",
    initialRouteName: "Game"
  }
);
