import React, { Component } from "react";
import { TouchableOpacity, View, Image, Platform } from "react-native";
import { Item } from "native-base";
import HeaderText from "../constants/HeaderText";
import { _timerSettings } from "../utils/TimerSettings";

export const EmojiButton = ({ action, text, style, source, heart }) => (
  <Item style={{ borderBottomColor: "transparent", margin: 7, height: 60 }}>
    <Image
      source={source}
      style={{
        overflow: "visible",
        height: Platform.OS === "ios" ? 40 : heart ? 40 : 50,
        width: Platform.OS === "ios" ? 40 : 40
      }}
    />
    <TouchableOpacity onPress={() => action()}>
      <HeaderText
        style={[
          {
            shadowColor: "white",
            shadowRadius: 30,
            shadowOpacity: 3,
            elevation: 150,
            fontSize: 35
          },
          style
        ]}
      >
        {text}
      </HeaderText>
    </TouchableOpacity>
  </Item>
);
