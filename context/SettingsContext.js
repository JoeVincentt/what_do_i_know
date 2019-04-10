import React from "react";
import { Constants } from "expo";
import { NetInfo } from "react-native";
import { _showToast } from "../utils/ShowToast";
import { initializeApp, firestore, database } from "firebase";
initializeApp(Constants.manifest.extra.firebaseConfig);
require("firebase/firestore");
const db = firestore();

//Create context
export const SettingsContext = React.createContext();
export const SettingsConsumer = SettingsContext.Consumer;

const saveDataToDatabase = async (userId, key, value) => {
  var usersUpdate = {};
  usersUpdate[`${key}`] = value;
  database()
    .ref("users/" + userId)
    .update(usersUpdate);
};

//Save and retrieve data from local storage
const saveDataToSecureStorage = async (key, item) =>
  await Expo.SecureStore.setItemAsync(key, JSON.stringify(item));

const retrieveDataFromSecureStorage = async key =>
  await Expo.SecureStore.getItemAsync(key);

export class SettingsProvider extends React.Component {
  state = {
    isInternetConnected: false,
    loggedIn: false,
    maxNumOfQuestions: 1000,
    overallBestScores: {
      gold: {
        username: "",
        bestScores: ""
      },
      silver: {
        username: "",
        bestScores: ""
      },
      bronze: {
        username: "",
        bestScores: ""
      }
    },
    announcement: {
      header: "",
      message: "",
      footer: ""
    },
    user: {
      avatar: "",
      bestScores: null,
      crystal: null,
      email: "",
      id: "",
      life: null,
      scores: null,
      username: ""
    },
    scores: 0,
    bestScores: 0,
    crystal: 0,
    life: 3,
    endGame: false,
    reducers: {
      //Loged in ?
      _logInUser: user => {
        this.setState({ loggedIn: true, user });
      },
      _logOutUser: () => {
        this.setState({
          loggedIn: false,
          user: {
            avatar: "",
            bestScores: null,
            crystal: null,
            email: "",
            id: "",
            life: null,
            scores: null,
            username: ""
          }
        });
      },
      //End game
      _unlockGame: async () => {
        if (this.state.loggedIn) {
          await this.setState({
            endGame: false,
            user: { ...this.state.user, scores: 0, life: 3, crystal: 0 }
          });
          saveDataToDatabase(this.state.user.id, "life", this.state.user.life);
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
          saveDataToDatabase(
            this.state.user.id,
            "scores",
            this.state.user.scores
          );
        } else {
          await this.setState({
            endGame: false,
            scores: 0,
            life: 3,
            crystal: 0
          });
          saveDataToSecureStorage("WordsMeaningLife", this.state.life);
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      //Adding time
      _addTime: async () => {
        if (this.state.loggedIn) {
          await this.setState({
            user: { ...this.state.user, crystal: this.state.user.crystal - 10 }
          });
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
        } else {
          await this.setState({
            crystal: this.state.crystal - 10
          });
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      //Getting Hint
      _getHint: async () => {
        if (this.state.loggedIn) {
          await this.setState({
            user: { ...this.state.user, crystal: this.state.user.crystal - 20 }
          });
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
        } else {
          await this.setState({
            crystal: this.state.crystal - 20
          });
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      //Getting Hint
      _skipQuestion: async () => {
        if (this.state.loggedIn) {
          await this.setState({
            user: { ...this.state.user, crystal: this.state.user.crystal - 15 }
          });
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
        } else {
          await this.setState({
            crystal: this.state.crystal - 15
          });
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      //Get life thru add
      _getLifeAdd: async amount => {
        if (this.state.loggedIn) {
          await this.setState({
            user: {
              ...this.state.user,
              crystal: this.state.user.crystal + amount
            }
          });
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
        } else {
          await this.setState({ crystal: this.state.crystal + amount });
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },

      //remove life
      _removeLife: async () => {
        if (this.state.loggedIn) {
          if (this.state.user.life >= 1) {
            await this.setState({
              user: { ...this.state.user, life: this.state.user.life - 1 }
            });
            saveDataToDatabase(
              this.state.user.id,
              "life",
              this.state.user.life
            );
          } else {
            this.setState({ endGame: true });
          }
        } else {
          if (this.state.life >= 1) {
            await this.setState({ life: this.state.life - 1 });
            //Set life to ss
            saveDataToSecureStorage("WordsMeaningLife", this.state.life);
          } else {
            this.setState({ endGame: true });
          }
        }
      },
      //add life
      _addLife: async () => {
        if (this.state.loggedIn) {
          await this.setState({
            user: {
              ...this.state.user,
              life: this.state.user.life + 1,
              crystal: this.state.user.crystal - 35
            },
            endGame: false
          });
          saveDataToDatabase(this.state.user.id, "life", this.state.user.life);
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
        } else {
          await this.setState({
            life: this.state.life + 1,
            crystal: this.state.crystal - 35,
            endGame: false
          });
          //Set life to ss
          saveDataToSecureStorage("WordsMeaningLife", this.state.life);
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      _suggestQuestion: async (question, answers, answer, rating, author) => {
        database()
          .ref(`suggestedQuestions/${Date.now().toString()}`)
          .set({
            question: question,
            answers: answers,
            rightAnswer: answer,
            rating: rating,
            author: author
          });
      },
      //add score and update score in DB or LocalStorage
      _addScore: async rating => {
        if (this.state.loggedIn) {
          await this.setState({
            user: {
              ...this.state.user,
              scores: this.state.user.scores + 1,
              crystal: this.state.user.crystal + (rating + 1)
            }
          });
          saveDataToDatabase(
            this.state.user.id,
            "scores",
            this.state.user.scores
          );
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );

          //Set bestScore in DB
          if (
            this.state.user.scores >
            this.state.overallBestScores.bronze.bestScores
          ) {
            this.state.reducers._updateBestScores("bronze");
          }
          if (
            this.state.user.scores >
            this.state.overallBestScores.silver.bestScores
          ) {
            this.state.reducers._updateBestScores("silver");
          }
          if (
            this.state.user.scores >
            this.state.overallBestScores.gold.bestScores
          ) {
            this.state.reducers._updateBestScores("gold");
          }
        } else {
          //Update score + crystal
          await this.setState({
            scores: this.state.scores + 1,
            crystal: this.state.crystal + rating
          });
          //Set crystals to ss
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);

          //Set bestScore
          if (this.state.scores > this.state.bestScores) {
            await this.setState({ bestScores: this.state.scores });
            saveDataToSecureStorage("WordsMeaningBest", this.state.scores);
          }
        }
      },
      _loadBestScores: parameter => {
        database()
          .ref(`/bestScores/${parameter}`)
          .once("value")
          .then(data => {
            const rawData = data.val();
            this.setState({
              overallBestScores: {
                ...this.state.overallBestScores,
                [parameter]: {
                  bestScores: rawData.bestScores,
                  username: rawData.username
                }
              }
            });
          });
      },
      _updateBestScores: parameter => {
        const dataRef = database().ref("bestScores/" + parameter);
        dataRef.once("value").then(data => {
          const rawData = data.val();
          if (rawData.bestScores < this.state.user.scores) {
            dataRef.update({
              username: this.state.user.username,
              bestScores: this.state.user.scores
            });
          }
        });
      }
    }
    //background colors set
  };

  async componentWillMount() {
    this.setState({
      backgroundColor: {
        color1: "#9e9e9e",
        color2: "#616161",
        color3: "#424242"
      },
      buttonColors: {
        color1: "#ff7043",
        color2: "#ff3d00"
      }
    });

    //check if internet available
    try {
      const connectionInfo = await NetInfo.getConnectionInfo();
      if (connectionInfo.type.toLowerCase() !== "none") {
        //if connection to internet, set game
        this.setState({ isInternetConnected: true });
        _showToast(`you are online`, 3000, "success");

        //get appTheme
        database()
          .ref("/appTheme/")
          .once("value")
          .then(colors => {
            const appTheme = colors.val();
            this.setState({
              backgroundColor: {
                color1: appTheme.backgroundColor.color1,
                color2: appTheme.backgroundColor.color2,
                color3: appTheme.backgroundColor.color3
              },
              buttonColors: {
                color1: appTheme.buttonColors.color1,
                color2: appTheme.buttonColors.color2
              }
            });
          });

        //max amount of questions
        const dataRef = database().ref("amountOfQuestions/");
        dataRef.once("value").then(data => {
          const maxNumOfQuestions = data.val();
          this.setState({
            maxNumOfQuestions: maxNumOfQuestions.amountOfQuestions
          });
        });

        //Set best overallresult
        this.state.reducers._loadBestScores("gold");
        this.state.reducers._loadBestScores("silver");
        this.state.reducers._loadBestScores("bronze");

        //Set announcement
        database()
          .ref("/announcement/")
          .once("value")
          .then(data => {
            const announcement = data.val();
            this.setState({
              announcement: {
                header: announcement.header,
                message: announcement.message,
                footer: announcement.footer
              }
            });
          });

        //Get bestScore from ss
        let bestScores = await retrieveDataFromSecureStorage(
          "WordsMeaningBest"
        );
        if (bestScores !== null) {
          bestScores = Number(JSON.parse(bestScores));
          this.setState({ bestScores });
        }

        //Get crystal from ss
        let crystal = await retrieveDataFromSecureStorage(
          "WordsMeaningCrystal"
        );
        if (crystal !== null) {
          crystal = Number(JSON.parse(crystal));
          this.setState({ crystal });
        }

        //Get life from ss
        let life = await retrieveDataFromSecureStorage("WordsMeaningLife");
        if (life !== null) {
          life = Number(JSON.parse(life));
          this.setState({ life });
        }
      } else {
        //if there is no internet connection
        this.setState({ isInternetConnected: false });
        _showToast(`offline please enable network`, 5000, "danger");
      }
      const handleConnectivityChange = connectionInfo => {
        if (connectionInfo.type.toLowerCase() !== "none") {
          //if connection to internet, set game
          this.setState({ ...this.state, isInternetConnected: true });
          _showToast(`you are online`, 3000, "success");
        } else {
          //if there is no internet connection
          this.setState({ ...this.state, isInternetConnected: false });
          _showToast(`offline please enable network`, 5000, "danger");
        }
        // NetInfo.removeEventListener(
        //   "connectionChange",
        //   handleConnectivityChange
        // );
      };
      NetInfo.addEventListener("connectionChange", handleConnectivityChange);
    } catch (error) {
      // console.log(error);
    }
  }

  render() {
    return (
      <SettingsContext.Provider value={this.state}>
        {this.props.children}
      </SettingsContext.Provider>
    );
  }
}
