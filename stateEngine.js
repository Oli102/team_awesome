let presenterScore = 0;
let currentState = null;
let stateFrameCount = 0;

function updateState(signals) {
  let newState = detectState(signals);
  if (newState === currentState) {
    stateFrameCount++;
  } else {
    stateFrameCount = 0;
    currentState = newState;
  }
  if (stateFrameCount === CONFIG.STATE_HOLD_FRAMES) {
    applyStateEffect(currentState);
  }
  return currentState;
}

function detectState(signals) {
  if (signals.postureScore >= CONFIG.POSTURE_GOOD_THRESHOLD) return "goodPosture";
  if (signals.postureScore < CONFIG.POSTURE_POOR_THRESHOLD) return "poorPosture";
  if (signals.headTurnedAway) return "screenGlance";
  if (signals.handsInPockets) return "pocketHands";
  if (signals.isGesticulating) return "gesticulation";
  if (signals.eyeContactGood) return "eyeContact";
  return null;
}

function applyStateEffect(state) {
  if (!state) return;
  presenterScore += CONFIG.POINTS[state] || 0;
  console.log(`State: ${state} | Score: ${presenterScore}`);
}

function getScore() {
  return presenterScore;
}
