let video;
let bodyPose;
let poses = [];

function preload() {
  bodyPose = ml5.bodyPose("BlazePose", { flipped: false }); 
}

function setup() {
  let canvas = createCanvas(CONFIG.video.width, CONFIG.video.height);
  canvas.parent("canvas-container");
  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide(); 
  bodyPose.detectStart(video, (results) => { poses = results; });
}

function draw() {
  background(5); 
  if (poses && poses.length > 0) {
    let signals = extractSignals(poses[0]);
    let stateObj = determineState(signals); 
    renderResponse(stateObj, poses[0]);
  } else {
    renderResponse({ metrics: {posture:0, eyeContact:0, gesticulation:0, presence:0}, message: "NO SIGNAL" }, null);
  }
}