function renderResponse(stateObj, pose) {
  push();
  translate(width, 0);
  scale(-1, 1);

  // Muted background
  tint(50);
  image(video, 0, 0, width, height);
  noTint();

  drawTargetSkeleton();

  if (pose) {
    drawUserTracking(pose, color(0, 212, 255, 150));
  }
  pop(); 

  drawDashboard(stateObj);
}

function drawTargetSkeleton() {
  let opt = CONFIG.thresholds.optimal;
  stroke(255, 30);
  noFill();
  ellipse(opt.noseX, opt.noseY, 50, 70);
  line(opt.noseX - 100, opt.shoulderY, opt.noseX + 100, opt.shoulderY);
}

function drawUserTracking(pose, col) {
  stroke(col);
  strokeWeight(2);
  const connections = [
    ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_elbow'],
    ['left_elbow', 'left_wrist'], ['right_shoulder', 'right_elbow'],
    ['right_elbow', 'right_wrist']
  ];
  connections.forEach(pair => {
    let a = pose.keypoints.find(k => k.name === pair[0]);
    let b = pose.keypoints.find(k => k.name === pair[1]);
    if (a && b && a.confidence > 0.2 && b.confidence > 0.2) line(a.x, a.y, b.x, b.y);
  });
  
  for (let kp of pose.keypoints) {
    if (kp.confidence > 0.2 && (kp.name.includes('shoulder') || kp.name.includes('wrist'))) {
      fill(col);
      noStroke();
      circle(kp.x, kp.y, 6);
    }
  }
}

function drawDashboard(stateObj) {
  let { metrics, message } = stateObj;
  let labels = ["POSTURE", "EYE CONTACT", "GESTICULATION", "PRESENCE"];
  let vals = [metrics.posture, metrics.eyeContact, metrics.gesticulation, metrics.presence];
  
  // Status Bar (Centered, non-flashing)
  fill(20, 20, 20, 180);
  noStroke();
  rect(width / 2 - 150, 20, 300, 40, 5);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(message.toUpperCase(), width / 2, 40);

  // Draw 4 Gauges
  let startX = 80;
  for (let i = 0; i < 4; i++) {
    let x = startX + (i * 180);
    let y = height - 70;

    // Clear gauge title so each meter is easy to identify.
    noStroke();
    fill(10, 10, 10, 210);
    rectMode(CENTER);
    rect(x, y - 78, 126, 22, 4);
    fill(230);
    textSize(10);
    text(labels[i], x, y - 78);
    
    // Background Circle
    noFill();
    stroke(40);
    strokeWeight(8);
    ellipse(x, y, 100, 100);
    
    // Progress Arc
    let col = vals[i] > 40 ? color(0, 212, 255) : color(255, 80, 80);
    stroke(col);
    arc(x, y, 100, 100, -HALF_PI, -HALF_PI + (vals[i] / 100 * TWO_PI));
    
    // Value text
    noStroke();
    fill(255);
    textSize(18);
    text(Math.floor(vals[i]) + "%", x, y);
  }

  rectMode(CORNER);
}