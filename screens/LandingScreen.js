import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text
} from "native-base";
import { TouchableWithoutFeedback } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo";
import Dimensions from "../constants/Layout";

export default class LandingScreen extends Component {
  state = {
    animatedButton: ""
  };
  handleViewRef = ref => (this.view = ref);

  bounce = async option => {
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
        endState.finished ? this.props.navigation.navigate(nav) : null
      );
  };

  render() {
    return (
      <Container>
        <LinearGradient
          colors={["#ffff00", "#ffcc00", "#ff9933"]}
          style={{
            flex: 1,
            padding: 15,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Content
            contentContainerStyle={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.bounce("newgame")}>
              <Animatable.View
                ref={
                  this.state.animatedButton === "newgame"
                    ? this.handleViewRef
                    : null
                }
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
                <LinearGradient
                  colors={["#ff9900", "#cc6600"]}
                  style={{
                    width: Dimensions.window.width / 1.5,
                    height: Dimensions.window.height * 0.06,
                    borderRadius: 30,
                    backgroundColor: "#b35900",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "bangers",
                      fontSize: 30,
                      textShadowColor: "#424242",
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 5
                    }}
                  >
                    N e w{"    "}G a m e
                  </Text>
                </LinearGradient>
              </Animatable.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.bounce("continue")}>
              <Animatable.View
                ref={
                  this.state.animatedButton === "continue"
                    ? this.handleViewRef
                    : null
                }
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
                  alignItems: "center",
                  marginVertical: 20
                }}
              >
                <LinearGradient
                  colors={["#ff9900", "#cc6600"]}
                  style={{
                    width: Dimensions.window.width / 1.5,
                    height: Dimensions.window.height * 0.06,
                    borderRadius: 30,
                    backgroundColor: "#b35900",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "bangers",
                      fontSize: 30,
                      textShadowColor: "#424242",
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 5
                    }}
                  >
                    C O N T I N U E
                  </Text>
                </LinearGradient>
              </Animatable.View>
            </TouchableWithoutFeedback>
          </Content>
        </LinearGradient>
      </Container>
    );
  }
}
