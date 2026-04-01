let prevWrists = { left: null, right: null };

function wristMotion(currentWrist, previousWrist) {
  if (!currentWrist || currentWrist.confidence < 0.3 || !previousWrist) return null;
  return dist(currentWrist.x, currentWrist.y, previousWrist.x, previousWrist.y);
}

function extractSignals(pose) {
  if (!pose || !pose.keypoints) return null;

  let nose = pose.keypoints.find(k => k.name === "nose");
  let lEar = pose.keypoints.find(k => k.name === "left_ear");
  let rEar = pose.keypoints.find(k => k.name === "right_ear");
  let lShoulder = pose.keypoints.find(k => k.name === "left_shoulder");
  let rShoulder = pose.keypoints.find(k => k.name === "right_shoulder");
  let lWrist = pose.keypoints.find(k => k.name === "left_wrist");
  let rWrist = pose.keypoints.find(k => k.name === "right_wrist");

  if (!lShoulder || !rShoulder) return null;

  let signals = {
    postureScore: 0,
    eyeContactScore: 0,
    gesticulationScore: 0,
    presenceScore: 0,
    isHandsVisible: true
  };

  // 1. Posture Calculation
  let shoulderMidY = (lShoulder.y + rShoulder.y) / 2;
  let postDist = shoulderMidY - nose.y;
  signals.postureScore = postDist > CONFIG.thresholds.slouchDistance ? 1 : -1;

  // 2. Eye Contact (Looking at camera = Good, Looking away = Bad)
  if (!nose || nose.confidence < 0.2) {
    signals.eyeContactScore = -2; // Back turned
  } else if (lEar && rEar && lEar.confidence > 0.2 && rEar.confidence > 0.2) {
    let dLeft = dist(nose.x, nose.y, lEar.x, lEar.y);
    let dRight = dist(nose.x, nose.y, rEar.x, rEar.y);
    let ratio = Math.max(dLeft, dRight) / (Math.min(dLeft, dRight) + 1);
    signals.eyeContactScore = ratio > CONFIG.thresholds.headTurnRatio ? -1 : 1;
  }

  // 3. Hands/Gesticulation
  let pocketZoneY = shoulderMidY + CONFIG.thresholds.pocketDropLimit;
  let handsHidden = (!lWrist || lWrist.confidence < 0.2 || lWrist.y > pocketZoneY) && 
                    (!rWrist || rWrist.confidence < 0.2 || rWrist.y > pocketZoneY);
  signals.isHandsVisible = !handsHidden;

  let leftMotion = wristMotion(lWrist, prevWrists.left);
  let rightMotion = wristMotion(rWrist, prevWrists.right);
  let trackedMotions = [leftMotion, rightMotion].filter(v => v !== null);

  if (trackedMotions.length > 0 && signals.isHandsVisible) {
    let avgMotion = trackedMotions.reduce((sum, value) => sum + value, 0) / trackedMotions.length;
    if (avgMotion > CONFIG.thresholds.gesticulationHighSpeed) {
      signals.gesticulationScore = 3;
    } else if (avgMotion > CONFIG.thresholds.gesticulationSpeed) {
      signals.gesticulationScore = 2;
    } else if (avgMotion > CONFIG.thresholds.gesticulationMinSpeed) {
      signals.gesticulationScore = 1;
    }
  }

  if (lWrist && lWrist.confidence > 0.3) {
    prevWrists.left = { x: lWrist.x, y: lWrist.y };
  } else {
    prevWrists.left = null;
  }

  if (rWrist && rWrist.confidence > 0.3) {
    prevWrists.right = { x: rWrist.x, y: rWrist.y };
  } else {
    prevWrists.right = null;
  }

  // 4. Presence (Centered)
  let drift = Math.abs(nose.x - 400);
  signals.presenceScore = drift < 100 ? 1 : -1;

  return signals;
}