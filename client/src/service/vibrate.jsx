export const vibratePhone = (duration) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  } else {
    console.log("Vibration API not supported");
  }
};
