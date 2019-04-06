import React, { Component } from "react";
import { Toast } from "native-base";
import HeaderText from "../constants/HeaderText";

export const _showToast = (maintext, duration, type, position) => {
  Toast.show({
    text: <HeaderText> {maintext}</HeaderText>,
    // buttonText: " ❌ ",
    duration: duration,
    position: position ? position : "bottom",
    type: type ? type : ""
  });
};
