import React from "react";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from "expo";

//
// Initial State
//

//
// Context...
//

export const SettingsContext = React.createContext();
export const SettingsConsumer = SettingsContext.Consumer;

const showAdd = async () => {
  AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test ID, Replace with your-admob-unit-id
  AdMobRewarded.setTestDeviceID("EMULATOR");
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
};

export class SettingsProvider extends React.Component {
  state = {
    scores: 0,
    bestScores: 0,
    crystal: 0,
    life: 3,
    endGame: false,
    //End game
    _unlockGame: async () => {
      this.setState({ endGame: false });
    },
    //Adding time
    _addTime: async () => {
      await this.setState({
        crystal: this.state.crystal - 15
      });
      await Expo.SecureStore.setItemAsync(
        "WordsMeaningCrystal",
        JSON.stringify(this.state.crystal)
      );
    },
    //Getting Hint
    _getHint: async () => {
      await this.setState({
        crystal: this.state.crystal - 15
      });
      await Expo.SecureStore.setItemAsync(
        "WordsMeaningCrystal",
        JSON.stringify(this.state.crystal)
      );
    },
    //Get life thru add
    _getLifeAdd: async () => {
      await this.setState({ life: this.state.life + 1 });
      await Expo.SecureStore.setItemAsync(
        "WordsMeaningLife",
        JSON.stringify(this.state.life)
      );
      showAdd();
    },
    //remove life
    _removeLife: async () => {
      if (this.state.life !== 0) {
        await this.setState({ life: this.state.life - 1 });
        //Set life to ss
        await Expo.SecureStore.setItemAsync(
          "WordsMeaningLife",
          JSON.stringify(this.state.life)
        );
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
      await Expo.SecureStore.setItemAsync(
        "WordsMeaningLife",
        JSON.stringify(this.state.life)
      );
      await Expo.SecureStore.setItemAsync(
        "WordsMeaningCrystal",
        JSON.stringify(this.state.crystal)
      );
    },
    //add score
    _addScore: async rating => {
      //Update score + crystal
      await this.setState({
        scores: this.state.scores + 1,
        crystal: this.state.crystal + rating
      });
      //Set crystals to ss
      await Expo.SecureStore.setItemAsync(
        "WordsMeaningCrystal",
        JSON.stringify(this.state.crystal)
      );
      //Set bestScore
      if (this.state.scores > this.state.bestScores) {
        this.setState({ bestScores: this.state.scores });
        await Expo.SecureStore.setItemAsync(
          "WordsMeaningBest",
          JSON.stringify(this.state.scores)
        );
      }
    },

    //background colors set
    backgroundColor: {
      color1: "#9e9e9e",
      color2: "#616161",
      color3: "#424242"
    },
    buttonColors: {
      color1: "#ff7043",
      color2: "#ff3d00"
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
        await Expo.SecureStore.setItemAsync(
          "WordsMeaningSettings",
          JSON.stringify(WordsMeaningSettings)
        );
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
        await Expo.SecureStore.setItemAsync(
          "WordsMeaningSettings",
          JSON.stringify(WordsMeaningSettings)
        );
      }
    }
  };

  async componentWillMount() {
    //Get Color theme from ss
    let savedStyles = await Expo.SecureStore.getItemAsync(
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
    let bestScores = await Expo.SecureStore.getItemAsync("WordsMeaningBest");
    if (bestScores !== null) {
      bestScores = Number(JSON.parse(bestScores));
      this.setState({ bestScores });
    }

    //Get crystal from ss
    let crystal = await Expo.SecureStore.getItemAsync("WordsMeaningCrystal");
    if (crystal !== null) {
      crystal = Number(JSON.parse(crystal));
      this.setState({ crystal });
    }

    //Get life from ss
    let life = await Expo.SecureStore.getItemAsync("WordsMeaningLife");
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
