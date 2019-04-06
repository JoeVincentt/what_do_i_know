import React from "react";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  Constants
} from "expo";
import { NetInfo } from "react-native";
import { _showToast } from "../utils/ShowToast";
import { initializeApp, firestore } from "firebase";
initializeApp(Constants.manifest.extra.firebaseConfig);
require("firebase/firestore");
const db = firestore();

//Create context
export const SettingsContext = React.createContext();
export const SettingsConsumer = SettingsContext.Consumer;

//save data to server
const saveDataToDatabase = async (userId, key, value) => {
  var usersUpdate = {};
  usersUpdate[`${key}`] = value;
  const userRef = db
    .collection("users")
    .doc(userId)
    .update(usersUpdate);
};

//getData from server

//Save and retrieve data from local storage
const saveDataToSecureStorage = async (key, item) =>
  await Expo.SecureStore.setItemAsync(key, JSON.stringify(item));

const retrieveDataFromSecureStorage = async key =>
  await Expo.SecureStore.getItemAsync(key);

export class SettingsProvider extends React.Component {
  state = {
    isInternetConnected: false,
    loggedIn: false,
    maxNumOfQuestions: 12,
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
      //add score and update score in DB or LocalStorage
      _addScore: async rating => {
        if (this.state.loggedIn) {
          await this.setState({
            user: {
              ...this.state.user,
              scores: this.state.user.scores + 1,
              crystal: this.state.user.crystal + rating
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
            const resRefBronze = db.collection("bestScores").doc("bronze");
            resRefBronze
              .get()
              .then(doc => {
                if (doc.exists) {
                  if (doc.data().bestScores < this.state.user.scores) {
                    resRefBronze.update({
                      username: this.state.user.username,
                      bestScores: this.state.user.scores
                    });
                  }
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                }
              })
              .catch(function(error) {
                console.log("Error getting document:", error);
              });
          }
          if (
            this.state.user.scores >
            this.state.overallBestScores.silver.bestScores
          ) {
            const resRefSilver = db.collection("bestScores").doc("silver");
            resRefSilver
              .get()
              .then(doc => {
                if (doc.exists) {
                  if (doc.data().bestScores < this.state.user.scores) {
                    resRefSilver.update({
                      username: this.state.user.username,
                      bestScores: this.state.user.scores
                    });
                  }
                } else {
                  // doc.data() will be undefined in this case
                  // console.log("No such document!");
                }
              })
              .catch(function(error) {
                console.log("Error getting document:", error);
              });
          }
          if (
            this.state.user.scores >
            this.state.overallBestScores.gold.bestScores
          ) {
            //Set best overallresult
            const resRefGold = db.collection("bestScores").doc("gold");
            resRefGold
              .get()
              .then(doc => {
                if (doc.exists) {
                  if (doc.data().bestScores < this.state.user.scores) {
                    resRefGold.update({
                      username: this.state.user.username,
                      bestScores: this.state.user.scores
                    });
                  }
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                }
              })
              .catch(function(error) {
                console.log("Error getting document:", error);
              });
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
        const resRefColors = db.collection("appTheme").doc("appTheme");
        resRefColors
          .get()
          .then(doc => {
            if (doc.exists) {
              const appTheme = doc.data();
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
              // console.log("Document data:", doc.data());
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });

        //Set best overallresult
        const resRefQuestions = db
          .collection("amountOfQuestions")
          .doc("amountOfQuestions");
        resRefQuestions
          .get()
          .then(doc => {
            if (doc.exists) {
              this.setState({
                maxNumOfQuestions: doc.data().amountOfQuestions
              });
              // console.log("Document data:", doc.data());
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });

        //Set best overallresult
        const resRefGold = db.collection("bestScores").doc("gold");
        resRefGold
          .get()
          .then(doc => {
            if (doc.exists) {
              this.setState({
                overallBestScores: {
                  ...this.state.overallBestScores,
                  gold: {
                    bestScores: doc.data().bestScores,
                    username: doc.data().username
                  }
                }
              });
              // console.log("Document data:", doc.data());
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });

        const resRefBronze = db.collection("bestScores").doc("bronze");
        resRefBronze
          .get()
          .then(doc => {
            if (doc.exists) {
              this.setState({
                overallBestScores: {
                  ...this.state.overallBestScores,
                  bronze: {
                    bestScores: doc.data().bestScores,
                    username: doc.data().username
                  }
                }
              });
              // console.log("Document data:", doc.data());
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });

        const resRefSilver = db.collection("bestScores").doc("silver");
        resRefSilver
          .get()
          .then(doc => {
            if (doc.exists) {
              this.setState({
                overallBestScores: {
                  ...this.state.overallBestScores,
                  silver: {
                    bestScores: doc.data().bestScores,
                    username: doc.data().username
                  }
                }
              });
              // console.log("Document data:", doc.data());
            } else {
              // doc.data() will be undefined in this case
              return;
              // console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
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
        _showToast(`offline please enable network`, 3000, "danger");
      }
      const handleConnectivityChange = connectionInfo => {
        if (connectionInfo.type.toLowerCase() !== "none") {
          //if connection to internet, set game
          this.setState({ ...this.state, isInternetConnected: true });
          _showToast(`you are online`, 3000, "success");
        } else {
          //if there is no internet connection
          this.setState({ ...this.state, isInternetConnected: false });
          _showToast(`offline please enable network`, 3000, "danger");
        }
        // NetInfo.removeEventListener(
        //   "connectionChange",
        //   handleFirstConnectivityChange
        // );
      };
      NetInfo.addEventListener("connectionChange", handleConnectivityChange);
    } catch (error) {
      console.log(error);
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
