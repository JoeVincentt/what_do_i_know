import React, { Component } from "react";

import { StyleSheet } from "react-native";

import { View, Text, TouchableOpacity, Platform } from "react-native";

import HeaderText from "../constants/HeaderText";

import { _showModalText } from "../components/ShowModalText";
import Dimensions from "../constants/Layout";
import { LinearGradient } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";

export default (AnswerBoxes = ({ answer, _checkAnswer }) => (
  <React.Fragment key={Math.random()}>
    <TouchableOpacity onPress={() => _checkAnswer(answer)}>
      <View style={styles.animatedBox}>
        <SettingsConsumer>
          {context => (
            <LinearGradient
              ref={ref => {
                this.context = context;
              }}
              colors={[
                context.buttonColors.color1,
                context.buttonColors.color2
              ]}
              style={styles.answerBox}
            >
              <HeaderText style={{ fontSize: 20 }}>{answer} </HeaderText>
            </LinearGradient>
          )}
        </SettingsConsumer>
      </View>
    </TouchableOpacity>
    <View style={{ marginVertical: 10 }} />
  </React.Fragment>
));

const styles = StyleSheet.create({
  animatedBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 40,
    height: Dimensions.window.height * 0.06,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },

  answerBox: {
    width: Dimensions.window.width / 2.5,
    height: Dimensions.window.height * 0.06,
    justifyContent: "center",
    alignItems: "center",
    elevation: 30,
    borderRadius: 10
  }
});
