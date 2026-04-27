// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#e7c6ff');

  // 確保影片已經載入且具有寬高數值，否則不進行繪製與運算
  if (video.width === 0 || video.height === 0) return;

  // 計算影像顯示的大小（全螢幕的 50%）
  let displayW = width * 0.5;
  let displayH = height * 0.5;
  // 計算置中位置
  let x = (width - displayW) / 2;
  let y = (height - displayH) / 2;

  image(video, x, y, displayW, displayH);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      // 在 ml5.js HandPose 中，屬性名稱通常是 score
      if (hand.score > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 將手部座標從原始影像尺寸映射到畫布上的顯示位置
          let px = map(keypoint.x, 0, video.width, x, x + displayW);
          let py = map(keypoint.y, 0, video.height, y, y + displayH);

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(px, py, 16);
        }
      }
    }
  }
}
