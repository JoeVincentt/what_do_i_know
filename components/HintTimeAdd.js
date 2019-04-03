import React, { Component } from "react";
import { Button } from "native-base";

import HeaderText from "../constants/HeaderText";

import { _showModalText } from "../components/ShowModalText";

import { _timerSettings } from "../utils/TimerSettings";

export const EmojiButton = ({ action, text }) => (
  <Button style={{ padding: 20 }} transparent onPress={() => action()}>
    <HeaderText
      style={{
        shadowColor: "white",
        shadowRadius: 20,
        shadowOpacity: 0.9,
        elevation: 30
      }}
    >
      {text}
    </HeaderText>
  </Button>
);
