import React from "react";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  Constants
} from "expo";
import * as firebase from "firebase";
firebase.initializeApp(Constants.manifest.extra.firebaseConfig);
require("firebase/firestore");
const db = firebase.firestore();

//Create context
export const SettingsContext = React.createContext();
export const SettingsConsumer = SettingsContext.Consumer;

// //adds func here
// const showAdd = async () => {
//   AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test ID, Replace with your-admob-unit-id
//   AdMobRewarded.setTestDeviceID("EMULATOR");
//   await AdMobRewarded.requestAdAsync();
//   await AdMobRewarded.showAdAsync();
// };

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
    loggedIn: false,
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
      _unlockGame: () => {
        if (this.state.loggedIn) {
          this.setState({
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
          this.setState({ endGame: false, scores: 0, life: 3, crystal: 0 });
          saveDataToSecureStorage("WordsMeaningLife", this.state.life);
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      //Adding time
      _addTime: () => {
        if (this.state.loggedIn) {
          this.setState({
            user: { ...this.state.user, crystal: this.state.user.crystal - 15 }
          });
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
        } else {
          this.setState({
            crystal: this.state.crystal - 15
          });
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      //Getting Hint
      _getHint: async () => {
        if (this.state.loggedIn) {
          this.setState({
            user: { ...this.state.user, crystal: this.state.user.crystal - 15 }
          });
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
        } else {
          this.setState({
            crystal: this.state.crystal - 15
          });
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      //Get life thru add
      _getLifeAdd: () => {
        if (this.state.loggedIn) {
          this.setState({
            user: { ...this.state.user, life: this.state.user.life + 1 },
            endGame: false
          });
          saveDataToDatabase(this.state.user.id, "life", this.state.user.life);
        } else {
          this.setState({ life: this.state.life + 1, endGame: false });
          saveDataToSecureStorage("WordsMeaningLife", this.state.life);
        }
        // showAdd();
      },
      //remove life
      _removeLife: () => {
        if (this.state.loggedIn) {
          if (this.state.user.life >= 1) {
            this.setState({
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
            this.setState({ life: this.state.life - 1 });
            //Set life to ss
            saveDataToSecureStorage("WordsMeaningLife", this.state.life);
          } else {
            this.setState({ endGame: true });
          }
        }
      },
      //add life
      _addLife: () => {
        if (this.state.loggedIn) {
          this.setState({
            user: {
              ...this.state.user,
              life: this.state.user.life + 1,
              crystal: this.state.user.crystal - 35
            }
          });
          saveDataToDatabase(this.state.user.id, "life", this.state.user.life);
          saveDataToDatabase(
            this.state.user.id,
            "crystal",
            this.state.user.crystal
          );
        } else {
          this.setState({
            life: this.state.life + 1,
            crystal: this.state.crystal - 35
          });
          //Set life to ss
          saveDataToSecureStorage("WordsMeaningLife", this.state.life);
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
        }
      },
      //add score and update score in DB or LocalStorage
      _addScore: rating => {
        if (this.state.loggedIn) {
          this.setState({
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
          this.setState({
            scores: this.state.scores + 1,
            crystal: this.state.crystal + rating
          });
          //Set crystals to ss
          saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);

          //Set bestScore
          if (this.state.scores > this.state.bestScores) {
            this.setState({ bestScores: this.state.scores });
            saveDataToSecureStorage("WordsMeaningBest", this.state.scores);
          }
        }
      },
      _backgroundColorChange: async (dark, light) => {
        if (dark !== null) {
          const WordsMeaningSettings = {
            backgroundColor: {
              color1: "#9e9e9e",
              color2: "#616161",
              color3: "#424242"
            },
            buttonColors: {
              color1: "#ff7043",
              color2: "#ff3d00"
            }
          };

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
          saveDataToSecureStorage("WordsMeaningSettings", WordsMeaningSettings);
        }
        if (light !== null) {
          const WordsMeaningSettings = {
            backgroundColor: {
              color1: "#ffff00",
              color2: "#ffcc00",
              color3: "#fbc02d"
            },
            buttonColors: {
              color1: "#ff9900",
              color2: "#cc6600"
            }
          };
          this.setState({
            backgroundColor: {
              color1: "#ffff00",
              color2: "#ffcc00",
              color3: "#ff9933"
            },
            buttonColors: {
              color1: "#ff9900",
              color2: "#cc6600"
            }
          });
          saveDataToSecureStorage("WordsMeaningSettings", WordsMeaningSettings);
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
    //Get Color theme from ss
    let savedStyles = await retrieveDataFromSecureStorage(
      "WordsMeaningSettings"
    );
    if (savedStyles !== null) {
      savedStyles = JSON.parse(savedStyles);
      this.setState({
        backgroundColor: {
          color1: savedStyles.backgroundColor.color1.toString(),
          color2: savedStyles.backgroundColor.color2.toString(),
          color3: savedStyles.backgroundColor.color3.toString()
        },
        buttonColors: {
          color1: savedStyles.buttonColors.color1.toString(),
          color2: savedStyles.buttonColors.color2.toString()
        }
      });
    }

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
    let bestScores = await retrieveDataFromSecureStorage("WordsMeaningBest");
    if (bestScores !== null) {
      bestScores = Number(JSON.parse(bestScores));
      this.setState({ bestScores });
    }

    //Get crystal from ss
    let crystal = await retrieveDataFromSecureStorage("WordsMeaningCrystal");
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
  }

  render() {
    return (
      <SettingsContext.Provider value={this.state}>
        {this.props.children}
      </SettingsContext.Provider>
    );
  }
}
