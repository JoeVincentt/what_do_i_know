import React, { Component } from "react";
import HeaderText from "../constants/HeaderText";
import { TouchableWithoutFeedback } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo";
import Dimensions from "../constants/Layout";
import { SettingsConsumer } from "../context/SettingsContext";

class GameActionButton extends Component {
  state = {
    animatedButton: ""
  };
  handleViewRef = ref => (this.view = ref);

  bounce = async (option, modalOpen) => {
    await this.setState({ animatedButton: option });
    let nav;
    if (option === "newgame") {
      nav = "Mode";
    }
    if (option === "continue") {
      nav = "Game";
    }
    this.view
      .pulse(800)
      .then(endState =>
        endState.finished
          ? nav
            ? this.props.navigation.navigate(nav)
            : null
          : null
      );
    if (modalOpen) {
      modalOpen();
    }
  };

  render() {
    const { option, buttonText, modalOpen } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={
          modalOpen
            ? () => {
                this.bounce(option, modalOpen);
              }
            : () => this.bounce(option)
        }
      >
        <Animatable.View
          ref={this.state.animatedButton === option ? this.handleViewRef : null}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            elevation: 1,
            width: Dimensions.window.width / 1.4,
            height: Dimensions.window.height * 0.06,
            borderRadius: 30,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
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
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <HeaderText>{buttonText}</HeaderText>
              </LinearGradient>
            )}
          </SettingsConsumer>
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  }
}

GameActionButton.contextType = SettingsConsumer;
export default GameActionButton;
