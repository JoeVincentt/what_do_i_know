import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";
import HeaderText from "../constants/HeaderText";
import { _timerSettings } from "../utils/TimerSettings";

export const EmojiButton = ({ action, text, style }) => (
  <TouchableOpacity onPress={() => action()}>
    <View
      style={{ padding: 15, justifyContent: "center", alignItems: "center" }}
    >
      <HeaderText
        style={[
          {
            shadowColor: "white",
            shadowRadius: 30,
            shadowOpacity: 3,
            elevation: 150,
            fontSize: 30
          },
          style
        ]}
      >
        {text}
      </HeaderText>
    </View>
  </TouchableOpacity>
  // <Button
  //   transparent
  //   large
  //   style={{ padding: 15, justifyContent: "center", alignItems: "center" }}
  //   onPress={() => action()}
  // >
  //   <HeaderText
  //     style={[
  //       {
  //         shadowColor: "white",
  //         shadowRadius: 30,
  //         shadowOpacity: 3,
  //         elevation: 150,
  //         fontSize: 30
  //       },
  //       style
  //     ]}
  //   >
  //     {text}
  //   </HeaderText>
  // </Button>
);
