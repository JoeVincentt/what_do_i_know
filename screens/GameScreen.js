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
  Icon
} from "native-base";
import { View, Text } from "react-native";
import HeaderText from "../constants/HeaderText";
import BaseLayout from "../components/BaseLayout";
import GameActionButton from "../components/GameActionButton";
import Dimensions from "../constants/Layout";
export default class LandingScreen extends Component {
  render() {
    return (
      <BaseLayout>
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <Header transparent />
          <View
            style={{
              width: Dimensions.window.width * 0.9,
              flexDirection: "row",
              alignContent: "space-between",
              justifyContent: "space-between"
            }}
          >
            <HeaderText>Score: 5</HeaderText>
            <HeaderText>Time: 10</HeaderText>
          </View>
          <View
            style={{
              width: Dimensions.window.width * 0.9,
              height: Dimensions.window.height * 0.3,
              backgroundColor: "white",
              borderRadius: 30,
              shadowColor: "black",
              shadowOpacity: 0.8,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              margin: 30
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "500", margin: 10 }}>
              The study of insects is called what?
            </Text>
          </View>
          <View>
            <HeaderText>O n e</HeaderText>
          </View>
        </Content>
      </BaseLayout>
    );
  }
}
