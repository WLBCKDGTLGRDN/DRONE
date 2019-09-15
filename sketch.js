var wave;
var playing;

var Te;
var Pr;
var Hu;
var Ro;
var Pi;
var Ya;
var MagX;
var MagY;
var MagZ;
var ho;
var mi;
var se;
let curwenfont;
let reverb;
let delay;
let env;

function preload() {
   curwenfont = loadFont('CURWENFONT.ttf');
}

function setup() {

  createCanvas(1080, 720);
  frameRate(1);

  textFont(curwenfont);

  wave = new p5.Oscillator();
  wave.setType('sine');
  wave.freq(((Pr/Te) * (Hu/Pi))/4, 0.5);
   
  fft = new p5.FFT(0.01);

  reverb = new p5.Reverb();
  reverb.amp(2);

  delay = new p5.Delay();
  delay.amp(0.8);

  env = new p5.Envelope(0.5, 1, 0.5, 1);
  env.play(delay);

  button = createButton('play');
  button.mousePressed(toggle);
}

function draw() {

  setInterval(loadJSON, 1000);
  loadJSON('http://www.welbeckdigitalgarden.co.uk:3000/JSON', drawvalues);

  ho = hour();
  mi = minute();
  se = second();

  

  if (playing) {

    background(0);
    var waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(220, 220, 220);
    strokeWeight(5);
    for (var i = 0; i< waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
    } 
    endShape();
    fill(220, 0, 220);
    textSize(45);
    
    text("frequency:", 40, 40);
    text(+((Pr/Te)*(Hu/Pi))/4, 40, 100);
    text("amplitude:", 40, 150);
    text(+(Ya/200), 40, 200);
    text("phase: ", 40, 250);
    text(+abs((((MagZ/MagY) + (Ro/100) -1)*10)), 40, 300);
    text("reverb: ", 40, 350);
    text(+(Pi/20), 40, 400);
    text("delay: ", 40, 450);
    text(+(MagZ/5), 40, 500);

    //wave.disconnect();
}
    else {
      background(0);
    }
  
  fill(200, 0, 200); 
  textSize(40);
  text("Welbeck Digital Garden", 40, 600);

  if (ho < 10) {
    text("0" + ho, 40, 660);
  }
  else {
    text(ho, 40, 660);
  }

  if (mi < 10) {
    text("0" + mi, 90, 660);
  }
  else {
    text(mi, 90, 660);
  }

  if (se < 10) {
    text("0" + se, 140, 660);
  }
  else {
    text(se, 140, 660);
  }
  print(wave.freq());
  print(wave.amp());
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawvalues(AtmosJSON) {
  Te = AtmosJSON.Temperature;
  Pr = AtmosJSON.Pressure;
  Hu = AtmosJSON.Humidity;
  Ro = AtmosJSON.Roll;
  Pi = AtmosJSON.Pitch;
  Ya = AtmosJSON.Yaw;
  MagX = AtmosJSON.MagX;
  MagY = AtmosJSON.MagY;
  MagZ = AtmosJSON.MagZ;
  wave.freq(((Pr/Te) * (Hu/Pi))/5, 0.2);
  wave.phase(abs(((MagZ/MagY) + (Ro/100) - 1)*10));
  wave.amp(Ya/200, 0.1);
  reverb.process(wave, (MagZ/2), (Pi/5));
  delay.process(wave, (MagY/5), 0.7, (Pr*2));
  env.play(wave);

}

function toggle() {
  if (!playing) {
    wave.start();
    playing = true;
  } else {
    wave.stop();
    wave.amp(0, 0.1);
    playing = false;
  }
}
