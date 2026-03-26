# team_awesome

## Team

| Name | GitHub Username | Role |
|------|---|---|
| John | @john | Detection Lead |
| AJ | @aj | State Engine Lead |
| Grant | @grant | Response Lead |
| Oliver | @oli102 | Integration Lead |

### Role Descriptions

**Detection Lead** — owns detection.js. Responsible for landmark math, distance calculations, and raw signal extraction. This person translates FaceMesh data into the numbers your state engine needs.

**State Engine Lead** — owns stateEngine.js and config.js. Responsible for mapping raw signals to named states using thresholds, timing, and hysteresis. This person is the bridge between sensing and meaning.

**Response Lead** — owns response.js and style.css. Responsible for the visual, sonic, or behavioral output when states change. This person makes the system's interpretation visible to the viewer.

**Integration Lead** — owns sketch.js, index.html, and the README. Responsible for the p5.js draw loop, camera initialization, ml5 setup, and ensuring all layers connect. Also maintains documentation and the calibration log.

## Calibration Log

### Detection Setup (John)
- FaceMesh landmark extraction ready
- Raw signal pipeline prepared
