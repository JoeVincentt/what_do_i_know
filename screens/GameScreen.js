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
  Spinner
} from "native-base";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity } from "react-native";
import StarRating from "react-native-star-rating";
import HeaderText from "../constants/HeaderText";
import BaseLayout from "../components/BaseLayout";

import Dimensions from "../constants/Layout";
import { LinearGradient } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";
import { db } from "../db/db";

export default class LandingScreen extends Component {
  state = {
    successButtonColors: ["#69f0ae", "#00c853"],
    wrongButtonColors: ["#e53935", "#b71c1c"],
    choiceMade: false,
    actualAnswer: db[0].rightAnswer,
    question: null,
    answers: [],
    loading: true,
    showModal: false,
    correctAnswer: null,
    rating: null
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
      rating: question.rating,
      loading: true
    });
  }

  _openModal = () => {
    this.setState({ showModal: true });
  };

  _closeModal = async () => {
    this.setState({ showModal: false, choiceMade: false });
    getRandomInt = max => {
      return Math.floor(Math.random() * Math.floor(max));
    };
    const question = db[getRandomInt(4)];
    await this.setState({
      question: question.question,
      actualAnswer: question.rightAnswer,
      answers: question.answers,
      rating: question.rating
    });
  };

  _checkAnswer = async (answer, indicator) => {
    if (!this.state.choiceMade) {
      if (this.state.actualAnswer === answer) {
        this.context._addScore(this.context.scores);
        await this.setState({
          choiceMade: true,
          showModal: true,
          correctAnswer: true
        });
      }
      if (this.state.actualAnswer !== answer) {
        await this.setState({
          choiceMade: true,
          showModal: true,
          correctAnswer: false
        });
      }
    }
  };

  render() {
    const { question, answers, loading, correctAnswer, rating } = this.state;
    if (loading) {
      return (
        <BaseLayout>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Spinner color="#6a1b9a" />
          </View>
        </BaseLayout>
      );
    } else {
      return (
        <BaseLayout>
          <Content
            contentContainerStyle={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10
            }}
          >
            <View style={styles.baseBox}>
              <SettingsConsumer>
                {context => (
                  <View
                    ref={ref => {
                      this.context = context;
                    }}
                  >
                    <HeaderText>Score: {context.scores} </HeaderText>

                    <HeaderText>🏆 {context.bestScores} </HeaderText>
                  </View>
                )}
              </SettingsConsumer>
              <View
                style={{
                  shadowColor: "red",
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 1
                }}
              >
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={rating}
                  fullStarColor="#ff8f00"
                />
              </View>
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
              {/* answers boxes start here */}
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
                        <HeaderText>{answers[0]} </HeaderText>
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
                        <HeaderText>{answers[1]} </HeaderText>
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
                        <HeaderText>{answers[2]} </HeaderText>
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
                    this.state.animatedButton === 4 ? this.handleViewRef : null
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
                        <HeaderText>{answers[3]} </HeaderText>
                      </LinearGradient>
                    )}
                  </SettingsConsumer>
                </View>
              </TouchableOpacity>
              {/* answer boxes ends here */}
              {/* Modal starts here */}
              <SettingsConsumer>
                {context => (
                  <Modal
                    isVisible={this.state.showModal}
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
                      {correctAnswer ? (
                        <HeaderText
                          style={{
                            color: "#00e676",
                            shadowColor: "green",
                            shadowOpacity: 0.8,
                            shadowRadius: 20,
                            elevation: 1
                          }}
                        >
                          C O R R E C T{" "}
                        </HeaderText>
                      ) : (
                        <HeaderText
                          style={{
                            color: "#ef5350",
                            shadowColor: "red",
                            shadowOpacity: 0.8,
                            shadowRadius: 20,
                            elevation: 1
                          }}
                        >
                          I N C O R R E C T{" "}
                        </HeaderText>
                      )}

                      <Button
                        dark
                        full
                        style={{ borderRadius: 20, marginTop: 20 }}
                        onPress={() => this._closeModal()}
                      >
                        <HeaderText> c o n t i n u e </HeaderText>
                      </Button>
                      <View style={{ marginVertical: 10 }} />
                    </LinearGradient>
                  </Modal>
                )}
              </SettingsConsumer>
              {/* modal ends here */}
            </View>
          </Content>
        </BaseLayout>
      );
    }
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
    elevation: 1,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    margin: 60
  },
  answerBox: {
    width: Dimensions.window.width,
    height: Dimensions.window.height * 0.06,
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
