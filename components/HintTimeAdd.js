import React, { Component } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Item } from "native-base";
import HeaderText from "../constants/HeaderText";
import { _timerSettings } from "../utils/TimerSettings";

export const EmojiButton = ({ action, text, style, source }) => (
  <Item style={{ borderBottomColor: "transparent", padding: 10 }}>
    <Image
      source={source}
      style={{
        overflow: "visible",
        height: 40,
        width: 40
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
