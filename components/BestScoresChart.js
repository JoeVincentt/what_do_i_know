import React, { Component } from "react";
import { Spinner, Item } from "native-base";
import { View, Platform, StyleSheet, Image } from "react-native";
import HeaderText from "../constants/HeaderText";
import { SettingsConsumer } from "../context/SettingsContext";
import BaseLayout from "./BaseLayout";
import Dimensions from "../constants/Layout";
import AnimTextView from "./AnimViewText";

export default class BestScoreChart extends Component {
  render() {
    return (
      <SettingsConsumer>
        {context => (
          <View
            ref={ref => {
              this.context = context;
            }}
            style={{
              height: Dimensions.window.height * 0.3,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {context.overallBestScores.gold.username !== "" ? (
              <AnimTextView style={styles.topChartBox}>
                <View style={{ paddingBottom: 10 }}>
                  <HeaderText>b e s t{"   "}r e s u l t s : </HeaderText>
                </View>
                <View style={{}}>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/goldmedal.png")}
                      style={{ height: 35, width: 25 }}
                    />
                    <HeaderText style={{ fontSize: 26 }}>
                      {"   "}
                      {context.overallBestScores.gold.bestScores}
                      {"   "}
                      {context.overallBestScores.gold.username}{" "}
                    </HeaderText>
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/silvermedal.png")}
                      style={{ height: 34, width: 24 }}
                    />
                    <HeaderText style={{ fontSize: 25 }}>
                      {"   "}
                      {context.overallBestScores.silver.bestScores}
                      {"   "}
                      {context.overallBestScores.silver.username}{" "}
                    </HeaderText>
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Image
                      source={require("../assets/images/bronzemedal.png")}
                      style={{ height: 33, width: 23 }}
                    />
                    <HeaderText style={{ fontSize: 24 }}>
                      {"   "}
                      {context.overallBestScores.bronze.bestScores}
                      {"   "}
                      {context.overallBestScores.bronze.username}{" "}
                    </HeaderText>
                  </Item>
                </View>
              </AnimTextView>
            ) : (
              <View
                style={{
                  height: Dimensions.window.height * 0.3,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Spinner color="#000" />
              </View>
            )}
          </View>
        )}
      </SettingsConsumer>
    );
  }
}

const styles = StyleSheet.create({
  topChartBox: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 }
  },
  itemStyle: {
    borderBottomColor: "transparent",
    padding: 3
  }
});
