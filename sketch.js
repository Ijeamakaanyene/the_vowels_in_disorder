// Messy Vowels
// Code by Ijeamaka
// Copyright (©) 2023 Ijeamaka :)
// April 2023
// Twitter: @ijeamaka_a


let cHeight = [];
let cWidth = [];
let outerMargin = [];
let seed = [];
let gap = [];

let blackColor = [
  "#333333",
];

let coreColors = [
  "#333333",
  "#afa69e",
  "#32363f",
  "#2e3853"
];

let popColors = [
  "#bb3939", 
  "#afa69e", 
  "#a3b18a"
];

features = { }

function makeFeatures() {
  // exposed features
  vowelOpts = ["A", "E", "I", "O", "U"];
  features.vowelSel = Math.floor(fxrand() * vowelOpts.length);
  features.vowel = vowelOpts[features.vowelSel];
  
  disorderOpts = ["color", "size", "splits", "shrink", "cleave"];
  features.disorderType = disorderOpts[Math.floor(fxrand() * disorderOpts.length)];

  disorderLevel = ["minimal", "chaos"];
  features.disorderLevelType = disorderLevel[Math.floor(fxrand() * disorderLevel.length)];

  // internal features
  rowOpts = [4, 6];
  colOptsIncr = [1, 2, 3];
  features.nRow = rowOpts[Math.floor(fxrand()*rowOpts.length)];
  features.nCol = features.nRow + colOptsIncr[Math.floor(fxrand()*colOptsIncr.length)];

  printColor = blackColor;
  features.selectedColor = coreColors[Math.floor(fxrand()*coreColors.length)];
  features.contrastColor = popColors[Math.floor(fxrand()*popColors.length)];
  
}


function gridSetUp(width, height) {
  cHeight = Math.floor(min(width, height));
  cWidth = cHeight;
  outerMargin = Math.floor(cHeight * 0.05);
  gap = floor(cHeight * 0.015);
}

makeFeatures();

$fx.features({
  "Vowel": features.vowel,
  "Disorder Type": features.disorderType,
  "Disorder Level": features.disorderLevelType
});

// console.log($fx.getFeatures());


function setup() {
  gridSetUp(windowWidth, windowHeight);
  seed = fxrand() * 999999;
  createCanvas(cWidth, cHeight);
  noLoop();
}

function draw() {
  background('#fbf9f4');

  randomSeed(seed);
  noiseSeed(seed);
  
  // features
  vowelSel = features.vowelSel;
  disorderType = features.disorderType;
  disorderLevelType = features.disorderLevelType;
  
  rectFracMinimal = [{frac: [7/5, 3/5]},
                     {frac: [6/5, 4/5]}];
  
  rectFracChaos = [{frac: [8/5, 2/5, 2/5, 8/5]},
                   {frac: [11/5, 5/5, 3/5, 1/5]}, 
                   {frac: [10/5, 8/5, 6/5, 3/5, 2/5, 1/5]}, 
                   {frac: [10/5, 4/5, 1/5, 1/5, 4/5, 10/5]}];
  
  nRow = features.nRow;
  nCol = features.nCol;
  
  rectFrac = [];
  
  if(disorderLevelType == "minimal") {
    rectNoise = 0.3;
    whichFrac = Math.floor(fxrand()*rectFracMinimal.length);
    
    for(let i = 0; i < nRow; i++) {
      if(i % 2 == 0) {
        rectFrac.push(rectFracMinimal[whichFrac].frac[0]);
      } else {
        rectFrac.push(rectFracMinimal[whichFrac].frac[1]);
      }
    }
  } else if(disorderLevelType == "chaos") {
    rectNoise = 0.5;

    if(nRow == 4) {
      rowOpts = [0, 1];
      whichFrac = rowOpts[Math.floor(fxrand()*rowOpts.length)];
    } else if(nRow == 6) {
      rowOpts = [2, 3];
      whichFrac = rowOpts[Math.floor(fxrand()*rowOpts.length)];
    }
    
    for(let i = 0; i < nRow; i++) {
      rectFrac.push(rectFracChaos[whichFrac].frac[i]);
    }
  }

  rectWidth = ((cWidth - (outerMargin*2))/nCol) - gap;
  rectHeight = ((cHeight - (outerMargin*2))/nRow) - gap;
  
  outerMarginX = (cWidth - (rectWidth*nCol))/2;
  outerMarginY = (cHeight - ((rectHeight+gap)*nRow))/2;
  
  // finding where row starts and rect height for next steps
  rowStarts = [];
  rectHeight0 = [];
      
  for(let l = 0; l < nRow; l++) {
  
    if(disorderType == "size") {
       if(l == 0) {
         rowStarts.push(0);
         rectHeight0.push(rectHeight*rectFrac[l]);
       } else {
         curStart = rowStarts[l - 1] + rectHeight0[l - 1] + gap;
         rowStarts.push(curStart);
         rectHeight0.push(rectHeight*rectFrac[l]);
       }
    } else {
      if(l == 0) {
        rowStarts.push(0);
        rectHeight0.push(rectHeight);
      } else {
        curStart = rowStarts[l - 1] + rectHeight + gap;
        rowStarts.push(curStart);
        rectHeight0.push(rectHeight);
      }
    }
  }
    
  
  initXCoords = [];
  initYCoords = [];
  initColors = [];
  initRectHeight = [];
  
  printColor = blackColor;
  selectedColor = features.selectedColor;
  contrastColor = features.contrastColor;
  colorMode(HSB);
  
  // creating x, y coords for larger squares 
  for(let l = 0; l < nRow; l++) {
    y = outerMarginY + rowStarts[l];
    
    for(let k = 0; k < nCol; k++) {
      x = outerMarginX + k*(rectWidth);
      noiseVal = noise(k, l);
      
      if(disorderType == "splits") {
        if(noiseVal <= rectNoise) {
          totalRectHeight = rectHeight0[l] - gap;
          newRectHeight = totalRectHeight/2;
          
          initYCoords.push(y);
          initYCoords.push(y + gap + newRectHeight);
          initXCoords.push(x);
          initXCoords.push(x);
          initRectHeight.push(newRectHeight);
          initRectHeight.push(newRectHeight);
          
          initColors.push(selectedColor);
          initColors.push(selectedColor);
          
        } else {
          initXCoords.push(x);
          initYCoords.push(y);
          initRectHeight.push(rectHeight0[l]);
          initColors.push(selectedColor);
        }
      } else if(disorderType == "cleave") { 
        if(noiseVal <= rectNoise) {
          cleaveVal = map(noiseVal, 0, rectNoise, 0.1, 0.9);
          totalRectHeight = rectHeight0[l] - gap;
          newRectHeight1 = totalRectHeight * cleaveVal;
          newRectHeight2 = totalRectHeight * (1-cleaveVal);

          initYCoords.push(y);
          initYCoords.push(y + gap + newRectHeight1);
          initXCoords.push(x);
          initXCoords.push(x);
          initRectHeight.push(newRectHeight1);
          initRectHeight.push(newRectHeight2);
          
          initColors.push(selectedColor);
          initColors.push(selectedColor);


        } else {
          initXCoords.push(x);
          initYCoords.push(y);
          initRectHeight.push(rectHeight0[l]);
          initColors.push(selectedColor);
        }

      } else if(disorderType == "shrink") { 
        
        if(noiseVal <= rectNoise) {
          shrinkVal = map(noiseVal, 0, rectNoise, 0.25, 0.75);
          newRectHeight = (rectHeight0[l] - gap)*shrinkVal;
          topOrBottom = fxrand();
          
          if(topOrBottom < .5) {
            initXCoords.push(x);
            initYCoords.push(y + rectHeight0[l] - newRectHeight);
          } else {
            initXCoords.push(x);
            initYCoords.push(y);
          }
          
          initRectHeight.push(newRectHeight);
          initColors.push(selectedColor);
          
        } else {
          initXCoords.push(x);
          initYCoords.push(y);
          initRectHeight.push(rectHeight0[l]);
          initColors.push(selectedColor);
        }
        
      } else {
        initXCoords.push(x);
        initYCoords.push(y);
        initRectHeight.push(rectHeight0[l]);
        
        if(disorderType == "color") {
          if(noiseVal <= rectNoise) {
            initColors.push(contrastColor);
          } else {
            initColors.push(printColor);
          }
        } else {
          initColors.push(selectedColor);
        }
      } 
    }
  }
  
  
  for(let i = 0; i < initXCoords.length; i++) {
    // iterating through the larger squares 
    
    for(let j = 0; j < vowels[vowelSel].x.length; j++) {
      // creating squares for letter 
      
      xLetter = initXCoords[i] + ((rectWidth - gap)*vowels[vowelSel].x[j]);
      yLetter = initYCoords[i] + (initRectHeight[i]*vowels[vowelSel].y[j]);

      letterSqWidth = rectWidth/5;
      letterSqHeight = initRectHeight[i]/5;
      
      sqWidth = 0.75;
      sqHeight = 0.75;
      sqNumColX = letterSqWidth/sqWidth;
      sqNumColY = letterSqHeight/sqHeight;
      
      for(let l = 0; l < sqNumColY; l++) {
        y = yLetter + l*(sqHeight);
    
        for(let k = 0; k < sqNumColX; k++) {
          x = xLetter + k*(sqWidth);

          newColor = discolorSquare(initColors[i]);
          strokeWeight(1);
          stroke(newColor);
          fill(newColor);
          rect(x,y, sqWidth, sqHeight);
        }
      }
    }
  }

   i = 0;
   while (i != 1) {
    if (($fx.isPreview = true)) {$fx.preview(); i = 1;}
  }

}


function keyPressed() {
  if(key == "s") {
    saveCanvas("the_vowels_in_disorder_" + $fx.hash, "png");
  }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
  ] : null;
}


// source https://www.30secondsofcode.org/js/s/rgb-to-hsb/

const RGBToHSB = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
}


function discolorSquare(hex) {
  colorRGB = hexToRgb(hex);
  colorHSB = RGBToHSB(colorRGB[0], 
                      colorRGB[1], 
                      colorRGB[2]);
  ranBr = random(colorHSB[2] - 15, colorHSB[2]);
  ranBr = max(ranBr, 0);
  newColor = [colorHSB[0], 
              colorHSB[1],
              ranBr];
  
  return newColor;
  }




