import React, { Component } from "react";
import { Header, Content, Left, Right, Spinner, Item } from "native-base";
import Modal from "react-native-modal";
import {
  View,
  Platform,
  Vibration,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
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
import { soundPlay } from "../utils/soundPlay";
import { database } from "firebase";
import { AdMobInterstitial, AdMobRewarded } from "expo";
import { _get150crystalAd } from "../utils/get105crystals";
import { showAdmobInterstitialAd } from "../utils/showAd";
import AdmobBanner from "../utils/showAdmobBanner";
import AdmobBanner2 from "../utils/showAdmobBanner2";

export default class LandingScreen extends Component {
  state = {
    choiceMade: false,
    actualAnswer: "",
    imageUrl: "",
    answers: [],
    loading: true,
    rating: null,
    time: 25000,
    loadingQuestion: false,
    previousQuestionNumber: null,
    answeredQuestions: []
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  async componentWillMount() {
    await this._loadQuestion();
  }
  componentWillUnmount() {}

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  _loadQuestion = async () => {
    let questionId = await this.getRandomInt(0, 176);

    //return new quesstion if prev question id the same as new one
    if (this.state.answeredQuestions.length === 176) {
      this.setState({ answeredQuestions: [] });
    }
    if (
      this.state.previousQuestionNumber === questionId ||
      this.state.answeredQuestions.indexOf(questionId) !== -1
    ) {
      return this._loadQuestion();
    }
    //set state and get questions
    this.setState({
      loadingQuestion: true,
      choiceMade: true,
      previousQuestionNumber: questionId
    });
    try {
      const docRef = database().ref(`countryQuestions/${questionId}`);
      docRef
        .once("value")
        .then(doc => {
          const question = doc.val();

          if (question !== null) {
            this.setState({
              choiceMade: false,
              actualAnswer: question.rightAnswer,
              answers: question.answers,
              rating: Number(question.rating),
              time: 25000,
              imageUrl: question.url,
              loadingQuestion: false
            });
          } else {
            // doc.data() will be undefined in this case
            this._loadQuestion();
          }
        })
        .catch(error => {
          _showToast(`error occurred`, 2000, "danger");
          // console.log("Error getting document:", error);
        });
    } catch (error) {
      _showToast(`error occurred`, 2000, "danger");
      // console.log(error);
    }
  };

  _checkAnswer = async answer => {
    if (!this.state.choiceMade) {
      if (this.state.actualAnswer === answer) {
        this.context.reducers._addScore(this.state.rating);
        await this.setState({
          choiceMade: true,
          answeredQuestions: this.state.answeredQuestions.concat(
            this.state.previousQuestionNumber
          )
        });
        soundPlay(require("../assets/sounds/success.wav"));
        _showToast("  C O R R E C T ", 500, "success");
        this._loadQuestion();
      }
      if (this.state.actualAnswer !== answer) {
        this.setState({
          choiceMade: true
        });

        Vibration.vibrate(300);
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast("  I N C O R R E C T ", 500, "danger", "top");
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
    soundPlay(require("../assets/sounds/wrong.wav"));
    _showToast("  T I M E   E X P I R E D ", 500, "warning", "bottom");
    this.context.reducers._removeLife();
    this._loadQuestion();
  };

  _buyLife = () => {
    if (this.context.loggedIn) {
      if (this.context.user.crystal < 35) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 35 crystals ", 1500);
        return;
      }
    }
    if (!this.context.loggedIn) {
      if (this.context.crystal < 35) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 35 crystals ", 1500);
        return;
      }
    }
    soundPlay(require("../assets/sounds/hint.wav"));
    this.context.reducers._addLife();
    _showToast(" + 1 life ", 1500, "success");
  };

  _buyLifeEndGame = () => {
    if (this.context.loggedIn) {
      if (this.context.user.crystal < 35) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 35 crystals ", 1500);
        return;
      }
    }
    if (!this.context.loggedIn) {
      if (this.context.crystal < 35) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 35 crystals ", 1500);
        return;
      }
    }
    soundPlay(require("../assets/sounds/success.wav"));
    this._loadQuestion();
    this.context.reducers._addLife();
    _showToast(" + 1 life ", 1500, "success");
  };

  _addTime = () => {
    if (this.context.loggedIn) {
      if (this.context.user.crystal < 10) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 10 crystals ", 1500);
        return;
      }
    }
    if (!this.context.loggedIn) {
      if (this.context.crystal < 10) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 10 crystals ", 1500);
        return;
      }
    }
    soundPlay(require("../assets/sounds/hint.wav"));
    this.context.reducers._addTime();
    _showToast(" t i m e   a d d e d ", 1500, "success");
  };

  _showHint = () => {
    if (this.context.loggedIn) {
      if (this.context.user.crystal < 50) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 50 crystals ", 1500);
        return;
      }
    }
    if (!this.context.loggedIn) {
      if (this.context.crystal < 50) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 50 crystals ", 1500);
        return;
      }
    }
    soundPlay(require("../assets/sounds/hint.wav"));
    this.context.reducers._getHint();
    _showToast(this.state.actualAnswer, 1500, "success");
  };

  _skipQuestion = () => {
    if (this.context.loggedIn) {
      if (this.context.user.crystal < 15) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 15 crystals ", 1500);
        return;
      }
    }
    if (!this.context.loggedIn) {
      if (this.context.crystal < 15) {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast(" Need 15 crystals ", 1500);
        return;
      }
    }
    soundPlay(require("../assets/sounds/hint.wav"));
    this._loadQuestion();
    this.context.reducers._skipQuestion();
    _showToast("Question skipped", 1500, "success");
  };

  _unlockGame = () => {
    soundPlay(require("../assets/sounds/success.wav"));
    this.context.reducers._unlockGame();
  };

  _timeLowSound = () => {
    soundPlay(require("../assets/sounds/ticking.wav"));
  };

  canGoBack = () => {
    this.props.navigation.navigate("Game");
    soundPlay(require("../assets/sounds/click.wav"));

    showAdmobInterstitialAd();
  };

  render() {
    const {
      imageUrl,
      answers,
      loading,
      rating,
      time,
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
                <>
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
                        <Item style={{ borderBottomColor: "transparent" }}>
                          <Image
                            source={require("../assets/images/crystal.png")}
                            style={{
                              overflow: "visible",
                              height: 40,
                              width: 30,
                              marginTop:
                                Platform.OS === "ios"
                                  ? 0
                                  : Dimensions.window.height * 0.05
                            }}
                          />
                          <HeaderText style={styles.endGameHeaderRight}>
                            {" "}
                            {context.loggedIn
                              ? context.user.crystal
                              : context.crystal}{" "}
                          </HeaderText>
                        </Item>
                      </Right>
                    </Header>
                    <View style={styles.endGameBox}>
                      <View>
                        <EmojiButton
                          action={this._unlockGame}
                          source={require("../assets/images/newgame.png")}
                          text={"   s t a r t   a    n e w  g a m e "}
                          style={styles.endGameText}
                        />
                        <EmojiButton
                          source={require("../assets/images/heart.png")}
                          action={this._buyLifeEndGame}
                          heart={true}
                          text={"  t r a d e  35  c r y s t a l s "}
                          style={styles.endGameText}
                        />
                        <EmojiButton
                          source={require("../assets/images/crystal.png")}
                          action={_get150crystalAd}
                          text={"  get  1 0 5    "}
                          style={styles.adText}
                        />
                        <View
                          style={{
                            margin: 40,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <TouchableOpacity onPress={() => this.canGoBack()}>
                            <HeaderText style={styles.mineText}>
                              {"  "}Play mixed{" "}
                            </HeaderText>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  <AdmobBanner />

                  <AdmobBanner2 />

                  <View
                    style={{ marginBottom: Dimensions.window.height * 0.05 }}
                  />
                </>
              ) : (
                // game screen below
                <>
                  <View style={{ flex: 1 }}>
                    <Header
                      transparent
                      style={{
                        paddingTop: getStatusBarHeight(),
                        height: 54 + getStatusBarHeight()
                      }}
                    >
                      <Left
                        style={{
                          flex: 1,
                          marginLeft: Dimensions.window.width * 0.05,
                          marginTop:
                            Platform.OS === "ios"
                              ? 0
                              : Dimensions.window.height * 0.05
                        }}
                      >
                        <Item style={{ borderBottomColor: "transparent" }}>
                          <Image
                            source={require("../assets/images/crystal.png")}
                            style={{
                              height: 40,
                              width: 30,
                              overflow: "visible"
                            }}
                          />
                          <HeaderText>
                            {"  "}
                            {context.loggedIn
                              ? context.user.crystal + " "
                              : context.crystal + " "}
                            {"  "}
                          </HeaderText>
                        </Item>
                      </Left>

                      <Right
                        style={{
                          flex: 1,
                          marginRight:
                            Platform.OS === "ios"
                              ? 0
                              : Dimensions.window.width * 0.05,
                          marginTop:
                            Platform.OS === "ios"
                              ? 0
                              : Dimensions.window.height * 0.05
                        }}
                      >
                        <Item style={{ borderBottomColor: "transparent" }}>
                          <Image
                            source={require("../assets/images/heart.png")}
                            style={{
                              height: Platform.OS === "ios" ? 40 : 40,
                              width: Platform.OS === "ios" ? 20 : 40,
                              overflow: "visible",
                              marginTop:
                                Platform.OS === "ios"
                                  ? 0
                                  : Dimensions.window.height * 0.015
                            }}
                          />
                          <HeaderText style={styles.gameHeaderRight}>
                            {"   "}
                            {context.loggedIn
                              ? context.user.life
                              : context.life}{" "}
                          </HeaderText>
                        </Item>
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
                          </View>
                        </View>
                        <View
                          style={{
                            width: Dimensions.window.width * 0.3
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
                              marginTop: Dimensions.window.height * 0.01
                            }}
                          >
                            <View>
                              <Item
                                style={{
                                  borderBottomColor: "transparent",
                                  marginRight: Dimensions.window.width * 0.015,
                                  marginLeft: Dimensions.window.width * 0.035,
                                  marginTop:
                                    Platform.OS === "ios"
                                      ? 0
                                      : Dimensions.window.height * 0.017
                                }}
                              >
                                <Image
                                  source={require("../assets/images/timer.png")}
                                  style={{
                                    height: 35,
                                    width: 20,
                                    overflow: "visible"
                                  }}
                                />
                              </Item>
                            </View>

                            <View>
                              <TimerCountdown
                                onTick={milliseconds =>
                                  milliseconds <= 5000
                                    ? this._timeLowSound()
                                    : null
                                }
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
                          <View
                            style={{
                              width: Dimensions.window.width * 0.7,
                              height: Dimensions.window.height * 0.17,
                              shadowRadius: 3,
                              shadowOpacity: 0.3,
                              shadowColor: "black"
                            }}
                          >
                            <Image
                              style={{
                                width: Dimensions.window.width * 0.7,
                                height: Dimensions.window.height * 0.17
                              }}
                              source={
                                imageUrl !== "" ? { url: imageUrl } : null
                              }
                            />
                          </View>
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
                          marginTop: Dimensions.window.height * 0.05,
                          flexDirection: "row"
                        }}
                      >
                        <TouchableOpacity onPress={() => this._showHint()}>
                          <View
                            style={{
                              shadowColor: "white",
                              shadowRadius: 30,
                              shadowOpacity: 3,
                              elevation: 150,
                              fontSize: 35,
                              paddingHorizontal: 20
                            }}
                          >
                            <Image
                              source={require("../assets/images/key.png")}
                              style={{
                                height: Platform.OS === "ios" ? 40 : 45,
                                width: 40
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._addTime()}>
                          <View
                            style={{
                              shadowColor: "white",
                              shadowRadius: 30,
                              shadowOpacity: 3,
                              elevation: 150,
                              fontSize: 35,
                              paddingHorizontal: 20
                            }}
                          >
                            <Image
                              source={require("../assets/images/timer.png")}
                              style={{
                                height: Platform.OS === "ios" ? 40 : 45,
                                width: 40
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._buyLife()}>
                          <View
                            style={{
                              shadowColor: "white",
                              shadowRadius: 30,
                              shadowOpacity: 3,
                              elevation: 150,
                              fontSize: 35,
                              paddingHorizontal: 20
                            }}
                          >
                            <Image
                              source={require("../assets/images/heart.png")}
                              style={{
                                height: Platform.OS === "ios" ? 40 : 45,
                                width: Platform.OS === "ios" ? 40 : 45
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._skipQuestion()}>
                          <View
                            style={{
                              shadowColor: "white",
                              shadowRadius: 30,
                              shadowOpacity: 3,
                              elevation: 150,
                              fontSize: 35,
                              paddingHorizontal: 20
                            }}
                          >
                            <Image
                              source={require("../assets/images/skip.png")}
                              style={{
                                height: Platform.OS === "ios" ? 40 : 45,
                                width: 40
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </Content>
                  </View>
                  {Dimensions.window.height >= 650 ? (
                    <>
                      <AdmobBanner />
                      <View
                        style={{
                          marginBottom: Dimensions.window.height * 0.02,
                          backgroundColor: "transparent"
                        }}
                      />
                    </>
                  ) : null}
                </>
              )}
              <Modal
                isVisible={
                  loading || context.isInternetConnected === false
                    ? true
                    : false
                }
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
  mineText: {
    fontSize: 25,
    shadowColor: "white",
    shadowRadius: 30,
    shadowOpacity: 3,
    elevation: 150
  },
  gameHeaderBody: {
    paddingBottom: Platform.OS === "ios" ? Dimensions.window.height * 0.12 : 0,
    paddingLeft: Platform.OS === "ios" ? 0 : Dimensions.window.width * 0.1
  },
  gameHeaderRight: {
    marginRight: Dimensions.window.width * 0.04
  },
  starRatingBox: {
    shadowColor: "grey",
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
    padding: 20
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
    textShadowRadius: 5
  }
});
