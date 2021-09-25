class Marker{
  constructor(x,col){
    this.x=x
    this.col=col
    this.colorPicker=createColorPicker(this.col)
    this.colorPicker.class('colorPicker')
    this.colorPicker.input(updateColor)
    this.colorPicker.style('width',cursorSize+'px')
    this.delButton=createButton('X')
    this.delButton.style('width',cursorSize+'px')
    this.delButton.mousePressed(deleteButton)
    this.del=false
  }
  
  render(){
    fill(this.col)
    if (selected==this){
      stroke(255)
      this.colorPicker.show()
      if (this.x!=0 && this.x!=1){
        this.delButton.show()
      }
    }else{
      stroke(0)
      this.colorPicker.hide()
      this.delButton.hide()
    }
    push()
    translate(this.x*width,height-marge)
    triangle(-cursorSize/2,cursorSize,cursorSize/2,cursorSize,0,0)
    pop()
    this.colorPicker.position(this.x*width-(cursorSize+4)/2,height-marge+cursorSize)
    this.delButton.position(this.x*width-cursorSize/2,height-marge+cursorSize+26)
    
    if (selected==this && this.x!=0 && this.x!=1 && mouseIsPressed && mouseY<height-marge+cursorSize){
      this.x=mouseX/width
      this.x=constrain(this.x,0.001,0.999)
    }
  }
  updateColor(){
    this.col=this.colorPicker.color()
    lastColor=this.col
  }
}