import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon, Constants } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import { SettingsProvider } from "./context/SettingsContext";
import { Root } from "native-base";

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <SettingsProvider>
          <View style={styles.container}>
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <Root>
              <AppNavigator />
            </Root>
          </View>
        </SettingsProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/sounds/click.wav"),
        require("./assets/sounds/ticking.wav"),
        require("./assets/sounds/hint.wav"),
        require("./assets/sounds/success.wav"),
        require("./assets/sounds/wrong.wav"),
        require("./assets/images/goldmedal.png"),
        require("./assets/images/silvermedal.png"),
        require("./assets/images/bronzemedal.png"),
        require("./assets/images/life.png"),
        require("./assets/images/info.png"),
        require("./assets/images/newgame.png"),
        require("./assets/images/pickaxe.png"),

        require("./assets/images/skip.png"),
        require("./assets/images/target.png"),
        require("./assets/images/timer.png"),
        require("./assets/images/star.png"),
        require("./assets/images/crystal.png"),
        require("./assets/images/cross.png"),
        require("./assets/images/question.png"),
        require("./assets/images/announcement.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        bangers: require("./assets/fonts/Bangers-Regular.ttf"),
        Roboto_medium: require("./assets/fonts/Roboto_medium.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
