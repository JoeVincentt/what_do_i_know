import { Audio } from "expo";

export const soundPlay = async path => {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(path);
    await soundObject.playAsync();
    // Your sound is playing!
  } catch (error) {
    // An error occurred!
  }
};
