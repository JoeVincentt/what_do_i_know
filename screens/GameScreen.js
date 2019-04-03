import React, { Component } from "react";
import {
  Header,
  Content,
  Button,
  Left,
  Right,
  Body,
  Toast,
  Spinner
} from "native-base";
import { StyleSheet } from "react-native";
import { View, Text, Platform } from "react-native";
import { _showToast } from "../utils/ShowToast";
import StarRating from "react-native-star-rating";
import HeaderText from "../constants/HeaderText";
import BaseLayout from "../components/BaseLayout";
import Dimensions from "../constants/Layout";
import { SettingsConsumer } from "../context/SettingsContext";
import TimerCountdown from "react-native-timer-countdown";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AnswerBoxes from "../components/AnswerBoxes";
import { _timerSettings } from "../utils/TimerSettings";
import { EmojiButton } from "../components/HintTimeAdd";
import * as firebase from "firebase";
require("firebase/firestore");

const db = firebase.firestore();

export default class LandingScreen extends Component {
  state = {
    choiceMade: false,
    actualAnswer: "",
    question: null,
    answers: [],
    loading: true,
    rating: null,
    time: 0,
    notEnoughCrystals: null,
    showToast: false,
    loadingQuestion: false
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  async componentWillMount() {
    await this._loadQuestion();
  }

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  _loadQuestion = async () => {
    let questionId = await this.getRandomInt(0, 5);
    this.setState({ loadingQuestion: true, choiceMade: true });
    try {
      const docRef = db.collection("questions").doc(`${questionId}`);
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            let question = doc.data();
            this.setState({
              choiceMade: false,
              question: question.question,
              actualAnswer: question.rightAnswer,
              answers: question.answers,
              rating: Number(question.rating),
              time: 60000,
              loadingQuestion: false
            });
          } else {
            // doc.data() will be undefined in this case
            this._loadQuestion();

            // console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  _checkAnswer = answer => {
    if (!this.state.choiceMade) {
      if (this.state.actualAnswer === answer) {
        this.context.reducers._addScore(this.state.rating);
        this.setState({
          choiceMade: true,
          time: 0
        });
        _showToast(" 🎉 C O R R E C T ", 500, "success");
        this._loadQuestion();
      }
      if (this.state.actualAnswer !== answer) {
        this.setState({
          choiceMade: true,
          time: 0
        });
        _showToast(" ❌ I N C O R R E C T ", 500, "danger", "top");
        this.context.reducers._removeLife();
        this._loadQuestion();
      }
    }
  };

  _timeExpired = () => {
    this.setState({
      time: 0
    });
    _showToast(" 🛎 T I M E   E X P I R E D ", 500, "warning", "bottom");
    this._loadQuestion();
  };
  _getLifeAdd = () => {
    this.context.reducers._getLifeAdd();
    this._loadQuestion();
  };
  _showToast = (maintext, duration, type, position) => {
    Toast.show({
      text: <HeaderText> {maintext}</HeaderText>,
      buttonText: " ❌ ",
      duration: duration,
      position: position ? position : "bottom",
      type: type ? type : ""
    });
  };
  _buyLife = () => {
    if (this.context.crystal < 35) {
      _showToast(" Need 35 💎 ", 3000);
      return;
    }
    this.context.reducers._addLife();
    _showToast(" + 1 ❤️ ", 3000, "success");
  };
  _addTime = () => {
    if (this.context.crystal < 15) {
      _showToast(" Need 15 💎 ", 3000);
      return;
    }
    this.setState({ time: this.state.time + this.getRandomInt(5000, 15000) });
    this.context.reducers._addTime();
    _showToast(" +⏳   t i m e   a d d e d ", 3000, "success");
  };

  _showHint = () => {
    if (this.context.crystal < 15) {
      _showToast(" Need 15 💎 ", 3000);
      return;
    }
    this.context.reducers._getHint();
    _showToast(this.state.actualAnswer, 3000, "success");
  };

  _unlockGame = () => {
    this.context.reducers._unlockGame();
  };

  render() {
    const {
      question,
      answers,
      loading,
      correctAnswer,
      rating,
      time,
      timeExpired,
      loadingQuestion
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
              <View
                ref={ref => {
                  this.context = context;
                }}
                style={{ flex: 1 }}
              >
                {context.endGame ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <EmojiButton action={this._unlockGame} text={" 🎞 "} />
                    </View>
                  </View>
                ) : (
                  <View style={{ flex: 1 }}>
                    <Header
                      transparent
                      style={{
                        paddingTop: getStatusBarHeight(),
                        height: 54 + getStatusBarHeight()
                      }}
                    >
                      <Left
                        style={{ marginLeft: Dimensions.window.width * 0.02 }}
                      >
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

                    <Content
                      contentContainerStyle={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "flex-start"
                      }}
                    >
                      <View style={styles.baseBox}>
                        <View style={{}}>
                          <View>
                            <HeaderText style={{}}>
                              Score: {context.scores}{" "}
                            </HeaderText>

                            <HeaderText style={{}}>
                              💎 {context.crystal}{" "}
                            </HeaderText>
                          </View>
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
                              starStyle={{
                                marginTop: Platform.OS === "ios" ? 0 : 16
                              }}
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
                              style={{
                                marginHorizontal: Dimensions.window.width * 0.01
                              }}
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
                        {loadingQuestion ? (
                          <Spinner />
                        ) : (
                          <Text
                            style={{
                              fontSize: 25,
                              fontWeight: "500",
                              margin: 10
                            }}
                          >
                            {question}
                          </Text>
                        )}
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
                      {/* answer boxes ends here */}
                      <View
                        style={{
                          marginTop: Dimensions.window.height * 0.1,
                          flexDirection: "row"
                        }}
                      >
                        <EmojiButton action={this._showHint} text={" 🗝 "} />
                        <EmojiButton action={this._addTime} text={" +⏳ "} />
                        <EmojiButton action={this._getLifeAdd} text={" 💝 "} />
                      </View>
                    </Content>
                  </View>
                )}
              </View>
            )}
          </SettingsConsumer>
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
