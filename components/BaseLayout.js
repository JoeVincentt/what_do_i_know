import React, { Component } from "react";
import { Container, Content } from "native-base";
import { LinearGradient } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";

export default class BaseLayout extends Component {
  render() {
    return (
      <SettingsConsumer>
        {context => (
          <Container
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
                flex: 1,
                padding: 0
                // alignItems: "center",
                // justifyContent: "center"
              }}
            >
              {this.props.children}
            </LinearGradient>
          </Container>
        )}
      </SettingsConsumer>
    );
  }
}
