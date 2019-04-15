import React, { Component } from "react";
import HeaderText from "../constants/HeaderText";
import { TouchableOpacity, StyleSheet, Platform, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo";
import Dimensions from "../constants/Layout";
import { SettingsConsumer } from "../context/SettingsContext";
import { soundPlay } from "../utils/soundPlay";

class LandingActionButton extends Component {
  render() {
    const { buttonText } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.flags
            ? this.props.navigation.navigate("FlagGame")
            : this.props.navigation.navigate("Game");
          soundPlay(require("../assets/sounds/click.wav"));
        }}
      >
        <View style={styles.defaultStyle}>
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
                style={{
                  width: Dimensions.window.width / 1.5,
                  height: Dimensions.window.height * 0.06,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <HeaderText
                  style={{ paddingBottom: Platform.OS === "ios" ? 0 : 10 }}
                >
                  {buttonText}
                </HeaderText>
              </LinearGradient>
            )}
          </SettingsConsumer>
        </View>
      </TouchableOpacity>
    );
  }
}

LandingActionButton.contextType = SettingsConsumer;
export default LandingActionButton;

const styles = StyleSheet.create({
  // ... add your default style here
  defaultStyle: {
    margin: Dimensions.window.height * 0.007,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 7,
    elevation: 100,
    width: Dimensions.window.width / 1.5,
    height: Dimensions.window.height * 0.06,
    borderRadius: 10,
    borderColor: "transparent",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  }
});
