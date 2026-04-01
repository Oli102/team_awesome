let metrics = {
  posture: 50,
  eyeContact: 50,
  gesticulation: 0,
  presence: 50
};

function determineState(signals) {
  if (!signals) return { metrics, message: "AWAITING DATA" };

  // Update Posture
  metrics.posture = constrain(metrics.posture + (signals.postureScore * CONFIG.scoring.rate), 0, 100);
  
  // Update Eye Contact
  metrics.eyeContact = constrain(metrics.eyeContact + (signals.eyeContactScore * CONFIG.scoring.rate), 0, 100);
  
  // Update Gesticulation (Builds with movement, decays over time)
  if (signals.gesticulationScore > 0 && signals.isHandsVisible) {
    metrics.gesticulation = constrain(metrics.gesticulation + signals.gesticulationScore, 0, 100);
  } else {
    metrics.gesticulation *= CONFIG.scoring.decay;
  }
  if (!signals.isHandsVisible) metrics.gesticulation = Math.max(0, metrics.gesticulation - 2);

  // Update Presence
  metrics.presence = constrain(metrics.presence + (signals.presenceScore * CONFIG.scoring.rate), 0, 100);

  let msg = "MAINTAINING STANDARDS";
  if (metrics.eyeContact < 30) msg = "LOOK AT THE AUDIENCE";
  else if (metrics.posture < 30) msg = "FIX POSTURE: STAND TALL";
  else if (!signals.isHandsVisible) msg = "KEEP HANDS VISIBLE";

  return { metrics, message: msg };
}