const PRIMARY_COLOR = "#e53935",
  SHADOW_COLOR = "#0e0e0e",
  CLOCK_COLOR = "#212121";

let canvas, ctx;

let w, h, vMin;

let globalTime;

let clock;

function Setup() {
  canvas = document.querySelector("#scene");
  ctx = canvas.getContext("2d");

  Reset();
  window.onresize = Reset;

  let now = new Date();
  clock = new Clock(
    (now.getHours() % 12) * 1000 * 60 * 60 * -1 +
      now.getMinutes() * 1000 * 60 * -1 +
      now.getSeconds() * 1000 * -1,
    now.getMinutes() * 1000 * 60 * -1 + now.getSeconds() * 1000 * -1,
    now.getSeconds() * 1000 * -1,
    PRIMARY_COLOR,
    SHADOW_COLOR,
    CLOCK_COLOR
  );

  Loop();
}

function Reset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  vMin = Math.min(w, h);
}

function Loop(time) {
  globalTime = time;

  ctx.clearRect(0, 0, w, h);

  //Background
  ctx.beginPath();
  ctx.fillStyle = CLOCK_COLOR;
  ctx.fillRect(0, 0, w, h);
  ctx.closePath();

  clock.update();
  clock.draw(ctx);

  window.requestAnimationFrame(Loop);
}

window.onload = Setup;

function Clock(hStart, mStart, sStart, primaryColor, shadowColor, clockColor) {
  this.hoursStart = hStart;
  this.minutesStart = mStart;
  this.secondsStart = sStart;

  this.primaryColor = primaryColor;
  this.shadowColor = shadowColor;
  this.clockColor = clockColor;

  this.hoursAngle = 0;
  this.minutesAngle = 0;
  this.secondsAngle = 0;

  this.hoursDuration = 1000 * 60 * 60 * 12;
  this.minutesDuration = 1000 * 60 * 60;
  this.secondsDuration = 1000 * 60;

  this.getUnitTime = function () {
    let unitTime = {
      hours: (globalTime - this.hoursStart) / this.hoursDuration,
      minutes: (globalTime - this.minutesStart) / this.minutesDuration,
      seconds: (globalTime - this.secondsStart) / this.secondsDuration
    };
    if (unitTime.hours >= 1) {
      unitTime.hours = 1;
      this.hoursStart += this.hoursDuration;
    }
    if (unitTime.minutes >= 1) {
      unitTime.minutes = 1;
      this.minutesStart += this.minutesDuration;
    }
    if (unitTime.seconds >= 1) {
      unitTime.seconds = 1;
      this.secondsStart += this.secondsDuration;
    }
    return unitTime;
  };

  this.update = function () {
    this.hoursAngle = this.getUnitTime().hours * Math.PI * 2;
    this.minutesAngle = this.getUnitTime().minutes * Math.PI * 2;
    this.secondsAngle = this.getUnitTime().seconds * Math.PI * 2;
  };

  this.draw = function (ctx) {
    //Main circle
    ctx.save();
    ctx.beginPath();
    ctx.translate(w / 2, h / 2);
    ctx.arc(0, 0, vMin * 0.45, 0, Math.PI * 2);
    ctx.shadowColor = this.shadowColor;
    ctx.shadowOffsetX = vMin * 0.01;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = vMin * 0.02;
    ctx.fillStyle = this.clockColor;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    //Sub main circle
    ctx.save();
    ctx.beginPath();
    ctx.translate(w / 2, h / 2);
    ctx.arc(0, 0, vMin * 0.41, 0, Math.PI * 2);
    ctx.shadowColor = this.shadowColor;
    ctx.shadowOffsetX = vMin * 0.02;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = vMin * 0.04;
    ctx.fillStyle = this.primaryColor;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    //Clock numbers
    for (let i = 0; i < 12; i++) {
      let angle = 30 * (i + 1) * (Math.PI / 180) - 90 * (Math.PI / 180);
      ctx.save();
      ctx.beginPath();
      ctx.translate(w / 2, h / 2);
      ctx.font = "700 " + vMin * 0.07 + "px Saira Extra Condensed";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = this.clockColor;
      ctx.fillText(
        i + 1,
        vMin * 0.3 * Math.cos(angle),
        vMin * 0.3 * Math.sin(angle)
      );
      ctx.closePath();
      ctx.restore();
    }

    //Hours pointer
    ctx.save();
    ctx.beginPath();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(DegToRad(-90) + this.hoursAngle);
    ctx.moveTo(0, 0);
    ctx.lineTo(
      vMin * 0.45 * Math.cos(DegToRad(33.4) / 2),
      vMin * 0.45 * Math.sin(DegToRad(33.4) / 2)
    );
    ctx.arc(
      0,
      0,
      vMin * 0.45,
      DegToRad(33.4) / 2,
      Math.PI * 2 - DegToRad(33.4) / 2
    );
    ctx.lineTo(0, 0);
    ctx.shadowColor = this.shadowColor;
    ctx.shadowOffsetX = vMin * 0.005;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = vMin * 0.03;
    ctx.fillStyle = this.clockColor;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    //Small circle
    ctx.save();
    ctx.beginPath();
    ctx.translate(w / 2, h / 2);
    ctx.arc(0, 0, vMin * 0.03, 0, Math.PI * 2);
    ctx.shadowColor = this.shadowColor;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0.001;
    ctx.shadowBlur = vMin * 0.03;
    ctx.fillStyle = this.clockColor;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    //Minutes pointer
    ctx.save();
    ctx.beginPath();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(DegToRad(-90) + this.minutesAngle);
    ctx.moveTo(vMin * -0.05, 0);
    ctx.lineTo(vMin * 0.22, 0);
    ctx.lineWidth = vMin * 0.005;
    ctx.lineCap = "round";
    ctx.shadowColor = this.shadowColor;
    ctx.shadowOffsetX = vMin * 0.004;
    ctx.shadowOffsetY = vMin * 0.001;
    ctx.shadowBlur = vMin * 0.008;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    //Seconds pointer
    ctx.save();
    ctx.beginPath();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(DegToRad(-90) + this.secondsAngle);
    ctx.moveTo(vMin * -0.1, 0);
    ctx.lineTo(vMin * 0.3, 0);
    ctx.lineWidth = vMin * 0.005;
    ctx.lineCap = "round";
    ctx.shadowColor = this.shadowColor;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = vMin * 0.001;
    ctx.shadowBlur = vMin * 0.01;
    ctx.strokeStyle = this.primaryColor;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    //Small circle 2
    ctx.save();
    ctx.beginPath();
    ctx.translate(w / 2, h / 2);
    ctx.arc(0, 0, vMin * 0.012, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = vMin * 0.002;
    ctx.strokeStyle = this.primaryColor;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    //Small circle 3
    ctx.save();
    ctx.beginPath();
    ctx.translate(w / 2, h / 2);
    ctx.arc(0, 0, vMin * 0.004, 0, Math.PI * 2);
    ctx.fillStyle = this.clockColor;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };
}

function DegToRad(deg) {
  return deg * (Math.PI / 180);
}
