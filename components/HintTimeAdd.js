import React, { Component } from "react";
import { Button } from "native-base";

import HeaderText from "../constants/HeaderText";

import { _showModalText } from "../components/ShowModalText";

import { _timerSettings } from "../utils/TimerSettings";

export const EmojiButton = ({ action, text }) => (
  <Button transparent large style={{ padding: 30 }} onPress={() => action()}>
    <HeaderText
      style={{
        shadowColor: "white",
        shadowRadius: 30,
        shadowOpacity: 3,
        elevation: 150,
        fontSize: 40
      }}
    >
      {text}
    </HeaderText>
  </Button>
);
