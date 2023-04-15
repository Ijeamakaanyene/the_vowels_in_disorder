// The Vowels in Disorder
// Code by Ijeamaka and copyright Ijeamaka :)
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
  "#ddcbbf",
  "#3a4664"
];

let popColors = [
  "#bb3939",
  "#ddcbbf",
  "#a3b18a", 
  "#e76f51",
  "#777696"
]

window.$fxhashFeatures = {};
features = { };

function makeFeatures() {
  vowelOpts = ["A", "E", "I", "O", "U"];
  features.vowelSel = Math.floor(fxrand() * vowelOpts.length);
  
  disorderOpts = ["color", "size", "splits", "shrink"];
  features.disorderType = disorderOpts[Math.floor(fxrand() * disorderOpts.length)];
  
  disorderLevel = ["minimal", "chaos"];
  features.disorderLevelType = disorderLevel[Math.floor(fxrand() * disorderLevel.length)];
  
  window.$fxhashFeatures["Vowel"] = vowelOpts[features.vowelSel];
  window.$fxhashFeatures["Disorder Type"] = features.disorderType;
  window.$fxhashFeatures["Disorder Level"] = features.disorderLevelType;
  
}


function gridSetUp(width, height) {
  cHeight = Math.floor(min(width, height));
  cWidth = cHeight;
  outerMargin = Math.floor(cHeight * 0.05);
  gap = floor(cHeight * 0.015);
}

makeFeatures();
console.log(window.$fxhashFeatures);

function setup() {
  gridSetUp(windowWidth, windowHeight);
  seed = int(fxrand() * 100000);
  randomSeed(seed);
  noiseSeed(seed);
  createCanvas(cWidth, cHeight);
  noLoop();
}

function draw() {
  background('#fbf9f4');
  
  // features
  vowelSel = features.vowelSel;
  disorderType = features.disorderType;
  disorderLevelType = features.disorderLevelType;
  
  rectFracMinimal = [{frac: [7/5, 3/5]},
                     {frac: [6/5, 4/5]}];
  
  rectFracChaos = [{frac: [8/5, 2/5, 2/5, 8/5]},
                   {frac: [11/5, 5/5, 3/5, 1/5]}, 
                   {frac: [10/5, 8/5, 6/5, 3/5, 2/5, 1/5]}, 
                   {frac: [10/5, 4/5, 1/5, 1/5, 4/5, 10/5]},
                   {frac: [11/5, 8/5, 6/5, 5/5, 4/5, 3/5, 2/5, 1/5]},
                  {frac: [8/5, 6/5, 4/5, 2/5, 2/5, 4/5, 6/5, 8/5]}];
  
  nRow = random([4, 6, 8]);
  nCol = nRow + Math.floor(random(1, 3));
  
  rectFrac = [];
  
  if(disorderLevelType == "minimal") {
    rectNoise = 0.3;
    whichFrac = Math.floor(random(rectFracMinimal.length));
    
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
      whichFrac = random([0,1]);
    } else if(nRow == 6) {
      whichFrac = random([2,3]);
    } else if(nRow == 8) {
      whichFrac = random([4,5]);
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
         rectHeight0.push(rectHeight*rectFrac[0]);
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
  selectedColor = random(coreColors);
  contrastColor = random(popColors);
  colorMode(HSB);
  
  // creating x, y coords for larger squares 
  for(let l = 0; l < nRow; l++) {
    y = outerMarginY + rowStarts[l];
    
    for(let k = 0; k < nCol; k++) {
      x = outerMarginX + k*(rectWidth);
      noiseVal = noise(x, y);
      
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
      } else if(disorderType == "shrink") { 
        
        if(noiseVal <= rectNoise) {
          shrinkVal = map(noiseVal, 0, 1, 0.25, 1);
          newRectHeight = (rectHeight0[l] - gap)*shrinkVal;
          topOrBottom = random(1);
          
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
    if ((isFxpreview = true)) {fxpreview(); i = 1;}
  }

}


function keyPressed() {
  if(key == "s") {
    saveCanvas("the_vowels_in_disorder_" + fxhash, "png");
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
};


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




