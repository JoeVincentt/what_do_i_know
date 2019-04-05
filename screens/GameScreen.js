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

import Modal from "react-native-modal";
import { View, Text, Platform, Vibration, StyleSheet } from "react-native";
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
import { showRewardedAd } from "../utils/showAd";
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
    loadingQuestion: false,
    maxNumOfQuestions: 4
  };

  componentDidMount() {
    this.setState({ loading: false });
    this.setState({ maxNumOfQuestions: this.context.maxNumOfQuestions });
  }

  async componentWillMount() {
    await this._loadQuestion();
  }

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  _loadQuestion = async () => {
    let maxNumOfQuestions = this.state.maxNumOfQuestions;
    let questionId = await this.getRandomInt(0, maxNumOfQuestions);
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
        Vibration.vibrate(300);
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
    Vibration.vibrate(600);
    _showToast(" 🛎 T I M E   E X P I R E D ", 500, "warning", "bottom");
    this.context.reducers._removeLife();
    this._loadQuestion();
  };

  _getLifeAdd = () => {
    this.setState({ loadingQuestion: true, choiceMade: true });
    this.context.reducers._getLifeAdd();
    setTimeout(() => this._loadQuestion(), 7000);
    showRewardedAd()
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
  };

  _buyLife = () => {
    if (this.context.loggedIn) {
      if (this.context.user.crystal < 35) {
        _showToast(" Need 35 💎 ", 3000);
        return;
      }
    }
    if (!this.context.loggedIn) {
      if (this.context.crystal < 35) {
        _showToast(" Need 35 💎 ", 3000);
        return;
      }
    }
    this.context.reducers._addLife();
    _showToast(" + 1 ❤️ ", 3000, "success");
  };

  _addTime = () => {
    if (this.context.loggedIn) {
      if (this.context.user.crystal < 10) {
        _showToast(" Need 10 💎 ", 3000);
        return;
      }
    }
    if (!this.context.loggedIn) {
      if (this.context.crystal < 10) {
        _showToast(" Need 10 💎 ", 3000);
        return;
      }
    }
    this.setState({ time: this.state.time + this.getRandomInt(5000, 15000) });
    this.context.reducers._addTime();
    _showToast(" +⏳   t i m e   a d d e d ", 3000, "success");
  };

  _showHint = () => {
    if (this.context.loggedIn) {
      if (this.context.user.crystal < 20) {
        _showToast(" Need 20 💎 ", 3000);
        return;
      }
    }
    if (!this.context.loggedIn) {
      if (this.context.crystal < 20) {
        _showToast(" Need 20 💎 ", 3000);
        return;
      }
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
              {/* If no lifes left */}
              {context.endGame ? (
                <View
                  style={{
                    flex: 1
                  }}
                >
                  <Header
                    transparent
                    style={{
                      paddingTop: getStatusBarHeight(),
                      height: 54 + getStatusBarHeight()
                    }}
                  >
                    <Left style={styles.endGameHeaderLeft}>
                      <HeaderText>
                        {" "}
                        s c o r e :{" "}
                        {context.loggedIn
                          ? context.user.scores
                          : context.scores}{" "}
                      </HeaderText>
                    </Left>

                    <Right>
                      <HeaderText style={styles.endGameHeaderRight}>
                        💎{" "}
                        {context.loggedIn
                          ? context.user.crystal
                          : context.crystal}{" "}
                      </HeaderText>
                    </Right>
                  </Header>
                  <View style={styles.endGameBox}>
                    <EmojiButton
                      action={this._unlockGame}
                      text={"   🔥    s t a r t   a    n e w  g a m e "}
                      style={styles.endGameText}
                    />

                    <EmojiButton
                      action={this._getLifeAdd}
                      text={"   + 1 0 💎   w a t c h   a d "}
                      style={styles.endGameText}
                    />
                    <EmojiButton
                      action={this._buyLife}
                      text={"   + 1 ❤️   t r a d e  35 💎"}
                      style={styles.endGameText}
                    />
                  </View>
                </View>
              ) : (
                // game screen below
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
                      <HeaderText style={styles.gameHeaderBody}>
                        🏆{" "}
                        {context.loggedIn
                          ? context.overallBestScores.gold.bestScores
                          : context.bestScores}{" "}
                      </HeaderText>
                    </Body>
                    <Right>
                      <HeaderText style={styles.gameHeaderRight}>
                        ❤️ {context.loggedIn ? context.user.life : context.life}{" "}
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
                      <View>
                        <View>
                          <HeaderText>
                            Score:{" "}
                            {context.loggedIn
                              ? context.user.scores
                              : context.scores}{" "}
                          </HeaderText>

                          <HeaderText>
                            💎{" "}
                            {context.loggedIn
                              ? context.user.crystal
                              : context.crystal}{" "}
                          </HeaderText>
                        </View>
                      </View>
                      <View
                        style={{
                          width: Dimensions.window.width * 0.5
                        }}
                      >
                        <View style={styles.starRatingBox}>
                          <StarRating
                            containerStyle={styles.starRating}
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
                            fontSize: 20,
                            fontWeight: "500",
                            margin: 10
                          }}
                        >
                          {question}
                        </Text>
                      )}
                    </View>
                    {/* answers boxes start here */}
                    <View style={styles.answerBox}>
                      <View>
                        <View style={styles.answerGroup}>
                          <AnswerBoxes
                            answer={answers[0]}
                            _checkAnswer={this._checkAnswer}
                          />
                          <AnswerBoxes
                            answer={answers[1]}
                            _checkAnswer={this._checkAnswer}
                          />
                        </View>
                        <View style={styles.answerGroup}>
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
                    </View>
                  </Content>
                </View>
              )}
              <Modal
                isVisible={this.state.loading}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                useNativeDriver={true}
                animationInTiming={500}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
              >
                <View style={styles.modalSpinnerBox}>
                  <Spinner />
                </View>
              </Modal>
            </View>
          )}
        </SettingsConsumer>
      </BaseLayout>
    );
  }
}

const styles = StyleSheet.create({
  endGameHeaderLeft: {
    flex: 1,
    marginLeft: Dimensions.window.width * 0.02,
    marginTop: Platform.OS === "ios" ? 0 : Dimensions.window.height * 0.05
  },
  endGameHeaderRight: {
    marginRight: Dimensions.window.width * 0.05,
    marginTop: Platform.OS === "ios" ? 0 : Dimensions.window.height * 0.05
  },
  endGameBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  endGameText: { fontSize: 25 },
  gameHeaderBody: {
    paddingBottom: Platform.OS === "ios" ? Dimensions.window.height * 0.12 : 0,
    paddingLeft: Platform.OS === "ios" ? 0 : Dimensions.window.width * 0.23,
    paddingTop: Platform.OS === "ios" ? 0 : Dimensions.window.width * 0.05
  },
  gameHeaderRight: {
    marginRight: Dimensions.window.width * 0.05,
    marginTop: Platform.OS === "ios" ? 0 : Dimensions.window.height * 0.05
  },
  starRatingBox: {
    shadowColor: "red",
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 40,
    alignItems: "flex-end",
    marginRight: Dimensions.window.width * 0.03
  },
  starRating: {
    alignItems: "flex-start",
    justifyContent: "center",
    alignContent: "flex-start"
  },
  answerBox: {
    width: Dimensions.window.width / 2,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  answerGroup: {
    flexDirection: "row",
    padding: 10
  },
  modalSpinnerBox: {
    flex: 1,
    backgroundColor: "transparent",
    height: 300,
    justifyContent: "center",
    alignItems: "center"
  },

  baseBox: {
    width: Dimensions.window.width * 0.9,
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between",
    paddingVertical: Dimensions.window.height * 0.01
  },
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
