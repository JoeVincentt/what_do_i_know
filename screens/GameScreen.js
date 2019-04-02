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
import { View, Text, TouchableOpacity, Platform } from "react-native";
import StarRating from "react-native-star-rating";
import HeaderText from "../constants/HeaderText";
import BaseLayout from "../components/BaseLayout";

import Dimensions from "../constants/Layout";
import { LinearGradient } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";
import { db } from "../db/db";
import TimerCountdown from "react-native-timer-countdown";

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
    rating: null,
    time: 0,
    timeExpired: false
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  async componentWillMount() {
    await this._loadQuestion();
  }

  _openModal = () => {
    this.setState({ showModal: true });
  };

  _closeModal = async () => {
    this.setState({ showModal: false, choiceMade: false });
    await this._loadQuestion();
  };

  _loadQuestion = async () => {
    getRandomInt = max => {
      return Math.floor(Math.random() * Math.floor(max));
    };
    const question = db[getRandomInt(4)];
    await this.setState({
      question: question.question,
      actualAnswer: question.rightAnswer,
      answers: question.answers,
      rating: question.rating,
      time: 10000
    });
  };

  _timeExpired = async () => {
    await this.setState({
      choiceMade: false,
      showModal: true,
      timeExpired: true,
      correctAnswer: null,
      time: 0
    });
  };

  _checkAnswer = async (answer, indicator) => {
    if (!this.state.choiceMade) {
      if (this.state.actualAnswer === answer) {
        this.context._addScore(this.context.scores);
        await this.setState({
          choiceMade: true,
          showModal: true,
          correctAnswer: true,
          time: 0
        });
      }
      if (this.state.actualAnswer !== answer) {
        await this.setState({
          choiceMade: true,
          showModal: true,
          correctAnswer: false,
          time: 0
        });
      }
    }
  };

  _timerSettings = milliseconds => {
    const remainingSec = Math.round(milliseconds / 1000);
    const seconds = parseInt((remainingSec % 60).toString(), 10);
    const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
    const hours = parseInt((remainingSec / 3600).toString(), 10);
    const s = seconds < 10 ? "0" + seconds : seconds;
    const m = minutes < 10 ? "0" + minutes : minutes;
    let h = hours < 10 ? "0" + hours : hours;
    h = h === "00" ? "" : h + ":";
    return h + m + ":" + s;
  };

  render() {
    const {
      question,
      answers,
      loading,
      correctAnswer,
      rating,
      time,
      timeExpired
    } = this.state;
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
              paddingTop: Dimensions.window.height * 0.05,
              marginBotom: Dimensions.window.height / 1.5
            }}
          >
            <View style={styles.baseBox}>
              <View style={{}}>
                <SettingsConsumer>
                  {context => (
                    <View
                      ref={ref => {
                        this.context = context;
                      }}
                    >
                      <HeaderText style={{}}>
                        Score: {context.scores}{" "}
                      </HeaderText>

                      <HeaderText style={{}}>
                        🏆 {context.bestScores}{" "}
                      </HeaderText>
                    </View>
                  )}
                </SettingsConsumer>
              </View>
              <View
                style={{
                  width: Dimensions.window.width * 0.5
                }}
              >
                <View
                  style={{
                    shadowColor: "red",
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 40
                  }}
                >
                  <View>
                    <StarRating
                      starStyle={{ marginTop: Platform.OS === "ios" ? 0 : 16 }}
                      disabled={true}
                      maxStars={5}
                      rating={rating}
                      starSize={35}
                      fullStarColor="#ff8f00"
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: Dimensions.window.width * 0.2
                  }}
                >
                  <HeaderText
                    style={{ marginHorizontal: Dimensions.window.width * 0.01 }}
                  >
                    ⏳
                  </HeaderText>
                  <View>
                    <TimerCountdown
                      initialMilliseconds={time}
                      onExpire={() => this._timeExpired()}
                      formatMilliseconds={milliseconds =>
                        this._timerSettings(milliseconds)
                      }
                      allowFontScaling={true}
                      style={styles.timerStyle}
                    />
                  </View>
                </View>
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
              {answers.map((answer, i) => (
                <React.Fragment key={i}>
                  <TouchableOpacity
                    onPress={() => this._checkAnswer(answer, true)}
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
                            <HeaderText>{answer} </HeaderText>
                          </LinearGradient>
                        )}
                      </SettingsConsumer>
                    </View>
                  </TouchableOpacity>
                  <View style={{ marginVertical: 10 }} />
                </React.Fragment>
              ))}
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
                      {_showModalText(correctAnswer, timeExpired)}

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
    elevation: 40,
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
    elevation: 20,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Dimensions.window.width * 0.05,
    marginVertical: Dimensions.window.height * 0.06
  },
  answerBox: {
    width: Dimensions.window.width / 1.5,
    height: Dimensions.window.height * 0.06,
    justifyContent: "center",
    alignItems: "center",
    elevation: 30,
    borderRadius: 10
  },
  baseBox: {
    width: Dimensions.window.width * 0.9,
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between"
  },
  timerStyle: {
    color: "white",
    fontFamily: "bangers",
    fontSize: 30,
    textShadowColor: "#424242",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
    marginRight: Dimensions.window.width * 0.1
  }
});

const _showModalText = (correctAnswer, timeExpired) => {
  if (correctAnswer === true) {
    return (
      <HeaderText
        style={{
          color: "#00e676",
          shadowColor: "green",
          shadowOpacity: 0.8,
          shadowRadius: 20,
          elevation: 1
        }}
      >
        🎉 C O R R E C T{" "}
      </HeaderText>
    );
  }
  if (correctAnswer === false) {
    return (
      <HeaderText
        style={{
          color: "#ef5350",
          shadowColor: "red",
          shadowOpacity: 0.8,
          shadowRadius: 20,
          elevation: 1
        }}
      >
        ❌ I N C O R R E C T{" "}
      </HeaderText>
    );
  }
  if (timeExpired) {
    return (
      <HeaderText
        style={{
          color: "#fdd835",
          shadowColor: "yellow",
          shadowOpacity: 0.8,
          shadowRadius: 20,
          elevation: 1
        }}
      >
        🛎 T I M E {"  "}E X P I R E D
      </HeaderText>
    );
  }
};
