import React, { Component } from "react";
import { Content, Header, Left, Footer } from "native-base";
import {
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import StarRating from "react-native-star-rating";
import { soundPlay } from "../utils/soundPlay";
import { _showToast } from "../utils/ShowToast";
import { auth } from "firebase";
import HeaderText from "../constants/HeaderText";
import BaseLayout from "../components/BaseLayout";
import { SettingsConsumer } from "../context/SettingsContext";
import Dimensions from "../constants/Layout";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { AdMobInterstitial } from "expo";
import { showAdmobInterstitialAd } from "../utils/showAd";
import AdmobBanner from "../utils/showAdmobBanner";

export default class ShopScreen extends Component {
  state = {
    showInfoModal: false,
    question: "",
    choice1: "",
    choice2: "",
    choice3: "",
    choice4: "",
    answer: "",
    starCount: 1,
    bannerClicked: false
  };

  componentDidMount() {}

  componentWillUnmount() {}

  _bannerAd = () => {
    if (this.state.bannerClicked) {
      return;
    }
    this.setState({ bannerClicked: true });
    soundPlay(require("../assets/sounds/success.wav"));
    this.context.reducers._getLifeAdd(20);
  };

  onStarRatingPress = rating => {
    this.setState({
      starCount: rating
    });
  };

  postQuestion = async () => {
    const user = auth().currentUser;
    let answers = [];
    answers.push(this.state.choice1.trim());
    answers.push(this.state.choice2.trim());
    answers.push(this.state.choice3.trim());
    answers.push(this.state.choice4.trim());
    if (user) {
      if (
        this.state.question.trim().length >= 4 &&
        this.state.answer.trim().length !== 0 &&
        this.state.choice1.trim().length !== 0 &&
        this.state.choice2.trim().length !== 0 &&
        this.state.choice3.trim().length !== 0 &&
        this.state.choice4.trim().length !== 0
      ) {
        await this.context.reducers._suggestQuestion(
          this.state.question,
          answers,
          this.state.answer,
          this.state.starCount,
          user.email
        );
        await this.setState({
          question: "",
          choice1: "",
          choice2: "",
          choice3: "",
          choice4: "",
          answer: "",
          starCount: 1
        });

        soundPlay(require("../assets/sounds/success.wav"));
        this.context.reducers._getLifeAdd(35);
        _showToast("Question added. Thank you!", 3000, "success");
        showAdmobInterstitialAd().catch(error =>
          _showToast("Error showing ad", 2000, "warning")
        );
      } else {
        soundPlay(require("../assets/sounds/wrong.wav"));
        _showToast("fill in all the fields please!", 3000, "warning");
      }
    } else {
      _showToast("Please sing in!", 3000, "danger");
    }
  };

  render() {
    return (
      <BaseLayout>
        <SettingsConsumer>
          {context => (
            <>
              <View
                style={{ flex: 1 }}
                ref={ref => {
                  this.context = context;
                }}
              >
                <Header
                  transparent
                  style={{
                    paddingTop: getStatusBarHeight(),
                    height: 54 + getStatusBarHeight()
                  }}
                >
                  <Left style={styles.headerLeft}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.pop();
                        soundPlay(require("../assets/sounds/click.wav"));
                      }}
                    >
                      <View style={styles.headerLeftButton}>
                        <HeaderText style={{ fontSize: 30 }}>
                          {" "}
                          go{"   "}back{" "}
                        </HeaderText>
                      </View>
                    </TouchableOpacity>
                  </Left>
                </Header>
                {/* action buttons area */}
                <Content contentContainerStyle={{}}>
                  <View
                    style={{
                      alignItems: "center",
                      shadowColor: "grey",
                      shadowOpacity: 0.5,
                      shadowRadius: 2,
                      elevation: 40,
                      marginTop:
                        Platform.OS === "ios"
                          ? 0
                          : Dimensions.window.height * 0.025
                    }}
                  >
                    <StarRating
                      starSize={35}
                      fullStarColor="#ff8f00"
                      starStyle={{ padding: 3 }}
                      disabled={false}
                      maxStars={3}
                      rating={this.state.starCount}
                      selectedStar={rating => this.onStarRatingPress(rating)}
                    />
                  </View>

                  <View>
                    <View style={styles.questionBox}>
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 20,
                          fontWeight: "500",
                          margin: 10
                        }}
                        placeholder="Your question..."
                        editable={true}
                        defaultValue={this.state.question}
                        maxLength={100}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={question => this.setState({ question })}
                      />
                    </View>
                    <View>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <View style={styles.answerBox}>
                            <TextInput
                              style={styles.answerPlaceholder}
                              placeholder="CHOICE 1"
                              editable={true}
                              multiline={true}
                              defaultValue={this.state.choice1}
                              maxLength={14}
                              onChangeText={choice1 =>
                                this.setState({ choice1 })
                              }
                            />
                          </View>

                          <View style={styles.answerBox}>
                            <TextInput
                              style={styles.answerPlaceholder}
                              placeholder="CHOICE 2"
                              editable={true}
                              maxLength={14}
                              defaultValue={this.state.choice2}
                              multiline={true}
                              onChangeText={choice2 =>
                                this.setState({ choice2 })
                              }
                            />
                          </View>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <View style={styles.answerBox}>
                            <TextInput
                              style={styles.answerPlaceholder}
                              placeholder="CHOICE 3"
                              editable={true}
                              maxLength={14}
                              defaultValue={this.state.choice3}
                              multiline={true}
                              onChangeText={choice3 =>
                                this.setState({ choice3 })
                              }
                            />
                          </View>

                          <View style={styles.answerBox}>
                            <TextInput
                              style={styles.answerPlaceholder}
                              placeholder="CHOICE 4"
                              editable={true}
                              maxLength={14}
                              defaultValue={this.state.choice4}
                              multiline={true}
                              onChangeText={choice4 =>
                                this.setState({ choice4 })
                              }
                            />
                          </View>

                          <View style={{ marginVertical: 10 }} />
                        </View>
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <View style={styles.answerBox}>
                          <TextInput
                            style={styles.answerPlaceholder}
                            placeholder="RIGHT ANSWER"
                            editable={true}
                            maxLength={14}
                            defaultValue={this.state.answer}
                            multiline={true}
                            onChangeText={answer => this.setState({ answer })}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.postQuestion();
                          }}
                        >
                          <View style={styles.submitButton}>
                            <HeaderText style={{ fontSize: 20 }}>
                              {" "}
                              submit{" "}
                            </HeaderText>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Content>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this._bannerAd();
                }}
              >
                <AdmobBanner />
              </TouchableOpacity>
              <View style={{ marginBottom: Dimensions.window.height * 0.05 }} />
            </>
          )}
        </SettingsConsumer>
      </BaseLayout>
    );
  }
}

const styles = StyleSheet.create({
  headerLeft: {
    flex: 1,
    marginLeft: Dimensions.window.width * 0.05,
    marginTop: Platform.OS === "ios" ? 0 : Dimensions.window.height * 0.05
  },
  headerLeftButton: {
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 100
  },
  answerBox: {
    width: Dimensions.window.width * 0.4,
    height:
      Platform.OS === "ios"
        ? Dimensions.window.height * 0.06
        : Dimensions.window.height * 0.08,
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "black",
    elevation: 20,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Dimensions.window.width * 0.01,
    marginVertical: Dimensions.window.height * 0.005
  },
  submitButton: {
    width: Dimensions.window.width * 0.4,
    height: Dimensions.window.height * 0.06,
    shadowColor: "green",
    shadowOpacity: 0.6,
    shadowRadius: 3,
    backgroundColor: "green",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.window.height * 0.03
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
    margin: Dimensions.window.height * 0.03
  },
  answerPlaceholder: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    margin: 10
  }
});
