import React, { Component } from "react";

import HeaderText from "../constants/HeaderText";

export const _showModalText = (correctAnswer, timeExpired) => {
  if (correctAnswer === true) {
    return (
      <HeaderText
        style={{
          color: "#00e676",
          shadowColor: "green",
          shadowOpacity: 0.8,
          shadowRadius: 20,
          elevation: 1
        }}
      >
        🎉 C O R R E C T{" "}
      </HeaderText>
    );
  }
  if (correctAnswer === false) {
    return (
      <HeaderText
        style={{
          color: "#ef5350",
          shadowColor: "red",
          shadowOpacity: 0.8,
          shadowRadius: 20,
          elevation: 1
        }}
      >
        ❌ I N C O R R E C T{" "}
      </HeaderText>
    );
  }
  if (timeExpired) {
    return (
      <HeaderText
        style={{
          color: "#fdd835",
          shadowColor: "yellow",
          shadowOpacity: 0.8,
          shadowRadius: 20,
          elevation: 1
        }}
      >
        🛎 T I M E {"  "}E X P I R E D
      </HeaderText>
    );
  }
};
