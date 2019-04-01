import React, { Component } from "react";
import { Button, Content } from "native-base";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import HeaderText from "../constants/HeaderText";
import Modal from "react-native-modal";
import { LinearGradient } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";
import LandingActionButton from "../components/LandingActionButton";
import BaseLayout from "../components/BaseLayout";

export default class LandingScreen extends Component {
  state = {
    isModalVisible: false
  };

  _modalOpen = () => {
    this.setState({ isModalVisible: true });
  };
  _updateBackground = (dark, light) => {
    this.context._backgroundColorChange(dark, light);
    this.setState({ isModalVisible: false });
  };

  render() {
    return (
      <BaseLayout>
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <LandingActionButton
            buttonText={" P L A Y   G A M E "}
            navigation={this.props.navigation}
            option={"newgame"}
          />

          <View style={{ marginVertical: 10 }} />

          <LandingActionButton
            buttonText={" S e t t i n g s "}
            navigation={this.props.navigation}
            modalOpen={this._modalOpen}
            option={"settings"}
          />
          <SettingsConsumer>
            {context => (
              <Modal
                isVisible={this.state.isModalVisible}
                ref={ref => {
                  this.context = context;
                }}
              >
                <LinearGradient
                  colors={[
                    context.backgroundColor.color1,
                    context.backgroundColor.color2,
                    context.backgroundColor.color3
                  ]}
                  style={{
                    padding: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20
                  }}
                >
                  <Button
                    dark
                    full
                    style={{ borderRadius: 20 }}
                    onPress={() => this._updateBackground("dark", null)}
                  >
                    <HeaderText>D a r k{"  "}t h e m e</HeaderText>
                  </Button>
                  <View style={{ marginVertical: 10 }} />
                  <Button
                    light
                    full
                    style={{ borderRadius: 20 }}
                    onPress={() => this._updateBackground(null, "light")}
                  >
                    <HeaderText>L i g h t{"  "}t h e m e</HeaderText>
                  </Button>
                </LinearGradient>
              </Modal>
            )}
          </SettingsConsumer>
        </Content>
      </BaseLayout>
    );
  }
}
