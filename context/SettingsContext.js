import React from "react";
//
// Initial State
//

//
// Context...
//

export const SettingsContext = React.createContext();
export const SettingsConsumer = SettingsContext.Consumer;

export class SettingsProvider extends React.Component {
  state = {
    scores: 0,
    _addScore: async () => {
      this.setState({ scores: this.state.scores + 1 });
    },
    backgroundColor: {
      color1: "#ffff00",
      color2: "#ffcc00",
      color3: "#ff9933"
    },
    buttonColors: {
      color1: "#ff9900",
      color2: "#cc6600"
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
            color3: "#ff9933"
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
  }

  render() {
    return (
      <SettingsContext.Provider value={this.state}>
        {this.props.children}
      </SettingsContext.Provider>
    );
  }
}
