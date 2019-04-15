import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import GameStack from "./GameStack";
import LandingScreen from "../screens/LandingScreen";
import FlagGame from "../screens/FlagGameScreen";

export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Landing: LandingScreen,
      Game: GameStack,
      FlagGame: FlagGame
    },
    {
      initialRouteName: "Landing"
    }
  )
);
