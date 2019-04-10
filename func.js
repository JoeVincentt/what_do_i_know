_alreadyLoggedCheck = async () => {
  auth().onAuthStateChanged(async user => {
    if (user != null) {
      try {
        let userData;
        database()
          .ref("/users/" + userId)
          .once("value")
          .then(userExists => {
            const existingUserData = userExists.val();

            userData = {
              id: existingUserData.id,
              email: existingUserData.email,
              username: existingUserData.username,
              avatar: existingUserData.avatar,
              life: existingUserData.life - 1,
              scores: existingUserData.scores,
              bestScores: existingUserData.bestScores,
              crystal: existingUserData.crystal
            };
            this.setState({ username: existingUserData.username });
          });
        this.context.reducers._logInUser(userData);
      } catch (error) {
        _showToast("error occurred", 3000, "warning");
        // console.log(error);
      }
    } else {
      this._facebookLogIn();
    }
  });
};
