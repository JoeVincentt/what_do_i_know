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
  Toast,
  Spinner
} from "native-base";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback
} from "react-native";
import StarRating from "react-native-star-rating";
import HeaderText from "../constants/HeaderText";
import BaseLayout from "../components/BaseLayout";
import { _showModalText } from "../components/ShowModalText";
import Dimensions from "../constants/Layout";
import { LinearGradient } from "expo";
import { SettingsConsumer } from "../context/SettingsContext";
import { db } from "../db/db";
import TimerCountdown from "react-native-timer-countdown";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AnswerBoxes from "../components/AnswerBoxes";
import { _timerSettings } from "../utils/TimerSettings";

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
    timeExpired: false,
    notEnoughCrystals: null,
    showToast: false
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
      time: 1000000
    });
  };

  _checkAnswer = async answer => {
    if (!this.state.choiceMade) {
      if (this.state.actualAnswer === answer) {
        this.context._addScore(this.state.rating);
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
        this.context._removeLife();
      }
    }
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
  _getLifeAdd = async () => {
    this.context._getLifeAdd();
  };
  _buyLife = async () => {
    if (this.context.crystal < 35) {
      await Toast.show({
        text: <HeaderText> Need 35 💎</HeaderText>,
        buttonText: " ❌ ",
        duration: 3000,
        position: "bottom",
        type: ""
      });
      return;
    }
    this.context._addLife();
    await Toast.show({
      text: <HeaderText> + 1 ❤️ </HeaderText>,
      buttonText: " ❌ ",
      duration: 4000,
      position: "bottom",
      type: "success"
    });
  };
  _addTime = async () => {
    if (this.context.crystal < 15) {
      await Toast.show({
        text: <HeaderText> Need 15 💎</HeaderText>,
        buttonText: " ❌ ",
        duration: 3000,
        position: "bottom",
        type: ""
      });
      return;
    }
    this.setState({ time: this.state.time + 10000 });
    this.context._addTime();
    await Toast.show({
      text: <HeaderText> + 10 ⏳ </HeaderText>,
      buttonText: " ❌ ",
      duration: 3000,
      position: "bottom",
      type: "success"
    });
  };

  _showHint = async () => {
    if (this.context.crystal < 15) {
      await Toast.show({
        text: <HeaderText> Need 15 💎</HeaderText>,
        buttonText: " ❌ ",
        duration: 3000,
        position: "bottom",
        type: ""
      });
      return;
    }
    this.context._getHint();
    await Toast.show({
      text: <HeaderText> {this.state.actualAnswer} </HeaderText>,
      buttonText: " ❌ ",
      duration: 4000,
      position: "bottom",
      type: "success"
    });
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
          <SettingsConsumer>
            {context => (
              <Header
                ref={ref => {
                  this.context = context;
                }}
                transparent
                style={{
                  paddingTop: getStatusBarHeight(),
                  height: 54 + getStatusBarHeight()
                }}
              >
                <Left style={{ marginLeft: Dimensions.window.width * 0.02 }}>
                  <Button onPress={() => this._buyLife()} transparent>
                    <HeaderText style={{}}> +❤️ </HeaderText>
                  </Button>
                </Left>
                <Body>
                  <HeaderText
                    style={{
                      paddingBottom:
                        Platform.OS === "ios"
                          ? Dimensions.window.height * 0.12
                          : 0,
                      paddingLeft:
                        Platform.OS === "ios"
                          ? 0
                          : Dimensions.window.width * 0.2
                    }}
                  >
                    🏆 {context.bestScores}{" "}
                  </HeaderText>
                </Body>
                <Right>
                  <HeaderText
                    style={{
                      marginRight: Dimensions.window.width * 0.05,
                      marginTop:
                        Platform.OS === "ios"
                          ? 0
                          : Dimensions.window.height * 0.05
                    }}
                  >
                    ❤️ {context.life}{" "}
                  </HeaderText>
                </Right>
              </Header>
            )}
          </SettingsConsumer>
          <Content
            contentContainerStyle={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start"
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

                      <HeaderText style={{}}>💎 {context.crystal} </HeaderText>
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
                    shadowRadius: 7,
                    elevation: 40,
                    alignItems: "flex-end",
                    marginRight: Dimensions.window.width * 0.03
                  }}
                >
                  <StarRating
                    containerStyle={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      alignContent: "flex-start"
                    }}
                    starStyle={{ marginTop: Platform.OS === "ios" ? 0 : 16 }}
                    disabled={true}
                    maxStars={3}
                    rating={rating}
                    starSize={35}
                    fullStarColor="#ff8f00"
                  />
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
                        _timerSettings(milliseconds)
                      }
                      allowFontScaling={true}
                      style={styles.timerStyle}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.questionBox}>
              <Text style={{ fontSize: 25, fontWeight: "500", margin: 10 }}>
                {question}
              </Text>
            </View>
            {/* answers boxes start here */}
            <View
              style={{
                width: Dimensions.window.width / 2,
                flexDirection: "row",
                justifyContent: "space-evenly"
              }}
            >
              <View style={{}}>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10
                  }}
                >
                  <AnswerBoxes
                    answer={answers[0]}
                    _checkAnswer={this._checkAnswer}
                  />
                  <AnswerBoxes
                    answer={answers[1]}
                    _checkAnswer={this._checkAnswer}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10
                  }}
                >
                  <AnswerBoxes
                    answer={answers[2]}
                    _checkAnswer={this._checkAnswer}
                  />
                  <AnswerBoxes
                    answer={answers[3]}
                    _checkAnswer={this._checkAnswer}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: Dimensions.window.height * 0.1,
                flexDirection: "row"
              }}
            >
              <Button
                style={{ padding: 20 }}
                transparent
                onPress={() => this._showHint()}
              >
                <HeaderText
                  style={{
                    shadowColor: "white",
                    shadowRadius: 20,
                    shadowOpacity: 0.9,
                    elevation: 30
                  }}
                >
                  {" "}
                  🗝{" "}
                </HeaderText>
              </Button>

              <Button
                style={{ padding: 20 }}
                transparent
                onPress={() => this._addTime()}
              >
                <HeaderText
                  style={{
                    shadowColor: "white",
                    shadowRadius: 20,
                    shadowOpacity: 0.9,
                    elevation: 30
                  }}
                >
                  {" "}
                  +⏳{" "}
                </HeaderText>
              </Button>
              <Button
                style={{ padding: 20 }}
                transparent
                onPress={() => this._getLifeAdd()}
              >
                <HeaderText
                  style={{
                    shadowColor: "white",
                    shadowRadius: 20,
                    shadowOpacity: 0.9,
                    elevation: 30
                  }}
                >
                  {" "}
                  💝{" "}
                </HeaderText>
              </Button>
            </View>
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
          </Content>
        </BaseLayout>
      );
    }
  }
}

const styles = StyleSheet.create({
  questionBox: {
    width: Dimensions.window.width * 0.9,
    height: Dimensions.window.height * 0.2,
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "black",
    elevation: 20,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    margin: Dimensions.window.height * 0.03
  },

  baseBox: {
    width: Dimensions.window.width * 0.9,
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between",
    paddingVertical: Dimensions.window.height * 0.01
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
