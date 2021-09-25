var markers=[]
var selected=null
var lastColor
const scaleMarge=45
const marge=45
const cursorSize=40

function setup() {
  createCanvas(windowWidth, windowHeight-marge);
  markers.push(new Marker(0,color(255)))
  markers.push(new Marker(1,color(0)))
  lastColor=color(255,0,0)
  randomize=createButton('Generate Random Gradient')
  
  randomize.position(0,height+marge-25)
  randomize.mousePressed(generateRandomGradient)
}
function generateRandomGradient(){
  for (let m of markers){
    m.del=true
  }
  markers.push(new Marker(0,color(random(255),random(255),random(255))))
  markers.push(new Marker(1,color(random(255),random(255),random(255))))
  
  for (let i=0;i<random(10);i++){
    markers.push(new Marker(random(1),color(random(255),random(255),random(255))))
  }
}

function draw() {
  clear()
  drawScale(0.1)
  noStroke()
  rectMode(CORNER)
  let colors=[]
  let weights=[]
  for (let m of markers){
    colors.push(color(red(m.col),green(m.col),blue(m.col)))
    weights.push(m.x)
  }
  //bubble sorting markers for the multilerp function to handle
  for (let i=0;i<weights.length;i++){
    for (let j=0;j<weights.length;j++){
      if (weights[j]>weights[j+1]){
        let temp=weights[j]
        weights[j]=weights[j+1]
        weights[j+1]=temp
        temp=colors[j]
        colors[j]=colors[j+1]
        colors[j+1]=temp
        
      }
    }
  }
  
  if (keyIsDown(32)){
      
    let txt='['
    for (let c=0;c<colors.length;c++){
      txt+='color('+red(colors[c])+','+green(colors[c])+','+blue(colors[c])+')'
      if (c!==colors.length-1){
        txt+=','
      }
    }
    txt+=']'
    print(txt)
    print(weights)
  }
  
  
  for (let i=0;i<width;i++){
    fill(multiLerp(colors,weights,map(i,0,width,0,1)))
    rect(i*1,scaleMarge,1,height-scaleMarge-marge)
  }
  for (let m=markers.length-1;m>=0;m--){
    markers[m].render()
    if (markers[m].del){
      markers[m].colorPicker.remove()
      markers[m].delButton.remove()
      markers.splice(m,1)
    }
  }
}

function drawScale(unit){
  for (let x=0;x<1;x+=unit){
    fill(255)
    stroke(0)
    strokeWeight(1)
    rectMode(CORNER)
    rect(x*width-3/2,scaleMarge,3,-scaleMarge/2)
    strokeWeight(2)
    textSize(scaleMarge/2)
    textAlign(CENTER,BOTTOM)
    text(x.toFixed(2),x*width,scaleMarge/2)
  }
  if (selected){
    fill(selected.col)
    stroke(0)
    strokeWeight(1)
    rectMode(CORNER)
    rect(selected.x*width-3/2,scaleMarge,3,-scaleMarge/2)
    strokeWeight(2)
    textSize(scaleMarge/2)
    textAlign(CENTER,BOTTOM)
    text(selected.x.toFixed(3),selected.x*width,scaleMarge/2)
  }
}


function updateColor(){
  for (let m of markers){
    m.updateColor()
  }
}

function deleteButton(){
  if (selected.x!=0 && selected.x!=1){
    selected.del=true
  }
}

function multiLerp(colors,weights,value){
  for (let i=0;i<colors.length;i++){
    if (value>=weights[i] && value<weights[i+1]){
      return lerpColor(colors[i],colors[i+1],map(value,weights[i],weights[i+1],0,1))
    }
  }
}

function mousePressed(){
  for (let m of markers){
    if (!m.del && abs(m.x-mouseX/width)<cursorSize/2/width && mouseY>height-marge && (selected || mouseY<height-marge+cursorSize)){
      selected=m
      lastColor=m.col
      return
    }
  }
  selected=null
}

function doubleClicked(){
  markers.push(new Marker(constrain(mouseX,0,width)/width,lastColor))
  selected=markers[markers.length-1]
}