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
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";

import HeaderText from "../constants/HeaderText";
import BaseLayout from "../components/BaseLayout";

import Dimensions from "../constants/Layout";
import { LinearGradient } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";

const db = [
  {
    question: "The study of insects is called what?",
    answers: ["Entomology", "Biology", "Saintology", "Biology"],
    rightAnswer: "Entomology"
  },
  {
    question: "The study of insects is called what?",
    answers: ["Entomology", "Biology", "Saintology", "Biology"],
    rightAnswer: "Entomology"
  },
  {
    question: "The study of insects is called what?",
    answers: ["Entomology", "Biology", "Saintology", "Biology"],
    rightAnswer: "Entomology"
  },
  {
    question: "The study of insects is called what?",
    answers: ["Entomology", "Biology", "Saintology", "Biology"],
    rightAnswer: "Entomology"
  },
  {
    question: "The study of insects is called what?",
    answers: ["Entomology", "Biology", "Saintology", "Biology"],
    rightAnswer: "Entomology"
  }
];

export default class LandingScreen extends Component {
  state = {
    successButtonColors: ["#69f0ae", "#00c853"],
    wrongButtonColors: ["#e53935", "#b71c1c"],
    choiceMade: false,
    actualAnswer: db[0].rightAnswer,
    question: null,
    answers: [],
    loading: true
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  async componentWillMount() {
    getRandomInt = max => {
      return Math.floor(Math.random() * Math.floor(max));
    };
    const question = db[getRandomInt(4)];
    await this.setState({
      question: question.question,
      actualAnswer: question.rightAnswer,
      answers: question.answers,
      loading: true
    });
  }

  _checkAnswer = async (answer, indicator) => {
    if (!this.state.choiceMade) {
      if (this.state.actualAnswer === answer) {
        console.log("right answer");
        this.context._addScore();
        await this.setState({
          choiceMade: true
          //to do
        });
      }
      if (this.state.actualAnswer !== answer) {
        console.log("wrong answer");
        await this.setState({
          choiceMade: true
          //to do
        });
      }
    }
  };

  render() {
    const { question, answers } = this.state;
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
          {this.state.loading ? (
            <Text>Loading</Text>
          ) : (
            <>
              <View style={styles.baseBox}>
                <SettingsConsumer>
                  {context => (
                    <View
                      ref={ref => {
                        this.context = context;
                      }}
                    >
                      <HeaderText>Score: {context.scores}</HeaderText>
                    </View>
                  )}
                </SettingsConsumer>
                <HeaderText>Time: 10</HeaderText>
              </View>
              <View style={styles.questionBox}>
                <Text style={{ fontSize: 30, fontWeight: "500", margin: 10 }}>
                  {question}
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.window.width
                }}
              >
                <TouchableOpacity
                  onPress={() => this._checkAnswer(answers[0], true)}
                >
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
                          <HeaderText>{answers[0]}</HeaderText>
                        </LinearGradient>
                      )}
                    </SettingsConsumer>
                  </View>
                </TouchableOpacity>
                <View style={{ marginVertical: 10 }} />
                <TouchableOpacity
                  onPress={() => this._checkAnswer(answers[1], false)}
                >
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
                          <HeaderText>{answers[1]}</HeaderText>
                        </LinearGradient>
                      )}
                    </SettingsConsumer>
                  </View>
                </TouchableOpacity>
                <View style={{ marginVertical: 10 }} />
                <TouchableOpacity
                  onPress={() => this._checkAnswer(answers[2], false)}
                >
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
                          <HeaderText>{answers[2]}</HeaderText>
                        </LinearGradient>
                      )}
                    </SettingsConsumer>
                  </View>
                </TouchableOpacity>
                <View style={{ marginVertical: 10 }} />
                <TouchableOpacity
                  onPress={() => this._checkAnswer(answers[3], false)}
                >
                  <View
                    ref={
                      this.state.animatedButton === 4
                        ? this.handleViewRef
                        : null
                    }
                    style={styles.animatedBox}
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
                          style={styles.answerBox}
                        >
                          <HeaderText>{answers[3]}</HeaderText>
                        </LinearGradient>
                      )}
                    </SettingsConsumer>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Content>
      </BaseLayout>
    );
  }
}

const styles = StyleSheet.create({
  animatedBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
    width: Dimensions.window.width,
    height: Dimensions.window.height * 0.06,
    borderRadius: 30,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  questionBox: {
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
    margin: 60
  },
  answerBox: {
    width: Dimensions.window.width * 0.8,
    height: Dimensions.window.height * 0.06,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  baseBox: {
    width: Dimensions.window.width * 0.9,
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between"
  }
});
