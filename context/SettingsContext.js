import React from "react";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from "expo";

//Create context
export const SettingsContext = React.createContext();
export const SettingsConsumer = SettingsContext.Consumer;

//adds func here
const showAdd = async () => {
  AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test ID, Replace with your-admob-unit-id
  AdMobRewarded.setTestDeviceID("EMULATOR");
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
};

//save data to server
const saveDataToSecureStorage = async (key, item) =>
  await Expo.SecureStore.setItemAsync(key, JSON.stringify(item));

//getData from server
const retrieveDataFromSecureStorage = async key =>
  await Expo.SecureStore.getItemAsync(key);

export class SettingsProvider extends React.Component {
  state = {
    loggedIn: false,
    user: {},
    scores: 0,
    bestScores: 0,
    crystal: 0,
    life: 3,
    endGame: false,
    reducers: {
      //Loged in ?
      _logInUser: user => {
        this.setState({ loggedIn: true, user });
        console.log(this.state.loggedIn, this.state.user);
      },
      //End game
      _unlockGame: () => {
        this.setState({ endGame: false, scores: 0, life: 3 });
      },
      //Adding time
      _addTime: () => {
        this.setState({
          crystal: this.state.crystal - 15
        });
        saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
      },
      //Getting Hint
      _getHint: async () => {
        await this.setState({
          crystal: this.state.crystal - 15
        });
        saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
      },
      //Get life thru add
      _getLifeAdd: async () => {
        await this.setState({ life: this.state.life + 1 });
        saveDataToSecureStorage("WordsMeaningLife", this.state.life);

        showAdd();
      },
      //remove life
      _removeLife: async () => {
        if (this.state.life !== 0) {
          await this.setState({ life: this.state.life - 1 });
          //Set life to ss
          saveDataToSecureStorage("WordsMeaningLife", this.state.life);
        } else if (this.state.life <= 0) {
          // Display a rewarded ad
          this.setState({ endGame: true });
        }
      },
      //add life
      _addLife: async () => {
        await this.setState({
          life: this.state.life + 1,
          crystal: this.state.crystal - 35
        });
        //Set life to ss
        saveDataToSecureStorage("WordsMeaningLife", this.state.life);
        saveDataToSecureStorage("WordsMeaningCrystal", this.state.crystal);
      },
      //add score
      _addScore: async rating => {
        //Update score + crystal
        await this.setState({
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
