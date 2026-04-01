const CONFIG = {
  video: {
    width: 800,
    height: 600
  },
  thresholds: {
    slouchDistance: 130,
    headTurnRatio: 2.2,     // How far head turns before "Eye Contact" drops
    pocketDropLimit: 220,
    gesticulationMinSpeed: 6,
    gesticulationSpeed: 12,
    gesticulationHighSpeed: 20,
    optimal: {
      noseX: 400,
      noseY: 200,
      shoulderY: 350,
      shoulderWidth: 220 
    }
  },
  scoring: {
    decay: 0.98, // Natural decay for gesticulation when hands stop moving
    rate: 2      // How fast gauges fill/empty
  }
};