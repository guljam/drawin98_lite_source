import flash.display.*;


const penSizeOddSet:Array = [1,0,1,1,1,0,1,0,0];
const penSizeSet:Array = [1, 2, 3, 5, 7, 10, 15, 30, 100];

var drawingMode:Boolean = false;
var image:Shape = new Shape();
var currentColor:uint = 0x000000;
var clickx:uint = 0; //마우스 클릭한 좌표
var clicky:uint = 0;
var opacity = 1; //반투명
var oddSize = 1;
var penSizeIndex:uint = 0;
var eraseSizeIndex:uint = 5;
var eraseON:Boolean = false;
var spuitON:Boolean = false;
var spuitColor:uint = 0x000000;
var spuitClick:Boolean = false;

addChild(image);
image.mask = canvasMask;

function pickColor(x:int,y:int)
{
  var tempImg = new BitmapData(mcCanvas.width, mcCanvas.height);
  image.mask = null;
  tempImg.draw(image);
  image.mask = canvasMask;
  var scolor = tempImg.getPixel(x, y);
  tempImg.dispose();
  var tmpColor = new ColorTransform();
  tmpColor.color = scolor;
  spuitColor = scolor;
  currentColor = scolor;
  spuitColorBox.transform.colorTransform = tmpColor;
}

function mouseDownHandler(event:MouseEvent):void
{
  if(spuitON === true)
  {
    spuitClick = true;
    pickColor(image.mouseX, image.mouseY);
  }
  else
  {
    drawingMode = true;
    stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);

    if(oddSize === 1) image.graphics.moveTo(mouseX, mouseY);
    else image.graphics.moveTo(mouseX+0.5, mouseY+0.5);

    if(eraseON === false)
    {
      image.graphics.lineStyle(penSizeSet[penSizeIndex], currentColor, opacity);
    }
    else if(eraseON === true)
    {
      image.graphics.lineStyle(penSizeSet[eraseSizeIndex], 0xFFFFFF, 1);
    }

    clickx = mouseX;
    clicky = mouseY;
  }
}

function mouseMoveHandler(event:MouseEvent):void
{
  if(spuitON === true && spuitClick === true)
  {
    pickColor(image.mouseX, image.mouseY);
  }
  else if (drawingMode)
	{
	  if(oddSize === 1) image.graphics.lineTo(mouseX, mouseY);
	  else image.graphics.lineTo(mouseX+0.5, mouseY+0.5);
	}
}


function mouseUpHandler(event:MouseEvent):void
{
	drawingMode = false;
  spuitClick = false;
  stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);

	if(clickx === mouseX && clicky === mouseY)
	{
    if(eraseON === true)
    {
      image.graphics.beginFill(0xFFFFFF, 1);
      image.graphics.lineStyle(0,0xFFFFFF,0);
      if(penSizeOddSet[eraseSizeIndex] === 1)
      {
        image.graphics.drawCircle(mouseX, mouseY, penSizeSet[eraseSizeIndex] / 2);
      }
      else
      {
        image.graphics.drawCircle(mouseX+0.5, mouseY+0.5, penSizeSet[eraseSizeIndex] / 2);
      }
      image.graphics.endFill();
    }
    else if(eraseON === false)
    {
      image.graphics.beginFill(currentColor, 1);
      image.graphics.lineStyle(0,currentColor,0);
      if(penSizeOddSet[penSizeIndex] === 1)
      {
        image.graphics.drawCircle(mouseX, mouseY, penSizeSet[penSizeIndex] / 2);
      }
      else
      {
        image.graphics.drawCircle(mouseX+0.5, mouseY+0.5, penSizeSet[penSizeIndex] / 2);
      }
      image.graphics.endFill();
    }

	}
}

function printSize()
{
  if(eraseON === false)
  {
    txtBrushSize.text = "pen "+penSizeSet[penSizeIndex]+"px";
  }
  else if(eraseON === true)
  {
    txtBrushSize.text = "erase "+ penSizeSet[eraseSizeIndex]+"px";
  }
}
printSize();


function newImageClick(event:MouseEvent):void
{
	image.graphics.clear();
}


function changeBrushSize(incSize:int)
{
  if(eraseON === false)
  {
    penSizeIndex = Math.max(0,Math.min(penSizeSet.length-1, penSizeIndex + incSize));
    oddSize = penSizeOddSet[penSizeIndex];
    image.graphics.lineStyle(penSizeSet[penSizeIndex], currentColor, opacity);
    txtBrushSize.text = String("pen " +penSizeSet[penSizeIndex] + "px");
  }
  else if(eraseON === true)
  {
    eraseSizeIndex = Math.max(0,Math.min(penSizeSet.length-1, eraseSizeIndex + incSize));
    oddSize = penSizeOddSet[eraseSizeIndex];
    image.graphics.lineStyle(penSizeSet[eraseSizeIndex], 0xFFFFFF, 1);
    txtBrushSize.text = String("erase " + penSizeSet[eraseSizeIndex] + "px");
  }


}

function sizeUpClick(event:MouseEvent):void
{
  changeBrushSize(1);
}

function sizeDownClick(event:MouseEvent):void
{
  changeBrushSize(-1);
}

function txtOpacityValClick(event:MouseEvent):void
{
  if(opacity === 1) opacity = 0.5;
	else opacity = 1;

	txtOpacityVal.text = String(opacity);
}
function txtOpacityClick(event:MouseEvent):void
{
	if(opacity === 1) opacity = 0.5;
	else opacity = 1;

	txtOpacityVal.text = String(opacity);

}



function keyDownHandler(param1:KeyboardEvent) : void
{
  switch(param1.keyCode)
  {
    case 68://d
    if(eraseON === false)
    {
      eraseON = true;
      oddSize = penSizeOddSet[eraseSizeIndex];
      printSize();
    }
    break;

    case 69://e
      if(opacity === 1) opacity = 0.5;
      else opacity = 1;
      txtOpacityVal.text = String(opacity);
    break;

    case 67://c
    if(spuitON === false)
    {
      spuitON = true;
      txtBrushSize.text = "spuit";
    }
    break;

    case 70://f
      changeBrushSize(-1);
    break;

    case 71://g
      changeBrushSize(1);
    break;
  }
}

function keyUpHandler(param1:KeyboardEvent) : void
{
  var nowkey = param1.keyCode;

  switch(nowkey)
  {
    case 68: //d
      eraseON = false;
      oddSize = penSizeOddSet[penSizeIndex];
      printSize();
    break;

    case 67:
      spuitON = false;
      printSize();
    break;
  }
}


function color0Click(event:MouseEvent):void
{
	currentColor = 0x000000;
}

function color1Click(event:MouseEvent):void
{
	currentColor = 0x808080;
}

function color2Click(event:MouseEvent):void
{
	currentColor = 0xC0C0C0;
}

function color3Click(event:MouseEvent):void
{
	currentColor = 0xFFFFFF;
}

function color4Click(event:MouseEvent):void
{
	currentColor = 0xFF3B21;
}

function color5Click(event:MouseEvent):void
{
	currentColor = 0xFFBD16;
}

function color6Click(event:MouseEvent):void
{
	currentColor = 0xF5F30F;
}

function color7Click(event:MouseEvent):void
{
	currentColor = 0xA5E975;
}

function color8Click(event:MouseEvent):void
{
	currentColor = 0x71DBFD;
}

function color9Click(event:MouseEvent):void
{
	currentColor = 0xFA80F9;
}

function color10Click(event:MouseEvent):void
{
	currentColor = 0x8E0000;
}

function color11Click(event:MouseEvent):void
{
	currentColor = 0xFFCC99;
}

function color12Click(event:MouseEvent):void
{
	currentColor = 0x877D30;

}

function color13Click(event:MouseEvent):void
{
	currentColor = 0x008F47;
}

function color14Click(event:MouseEvent):void
{
	currentColor = 0x313BCD;
}

function color15Click(event:MouseEvent):void
{
	currentColor = 0xC02E97;
}

function color16Click(event:MouseEvent):void
{
	currentColor = 0x3F037E;
}


function spuitColorBoxClick(event:MouseEvent):void
{
	currentColor = spuitColor;
}

function testbtnClick(event:MouseEvent):void
{
  // trace("call");
	// image.scaleX = 2.0;
	// image.scaleY = 2.0;

  // image.x += 10;
  // mcCanvas.x += 10;
  // canvasMask.x += 10;
}

// function saveButtonClick(event:MouseEvent):void
// {
//   trace("save click")

//   var tempImg = new BitmapData(mcCanvas.width, mcCanvas.height);
//   image.mask = null;
//   tempImg.draw(image);
//   image.mask = canvasMask;


//   var jpgEncoder:JPGEncoder = new JPGEncoder(100.0);
//   var byteArray:ByteArray = jpgEncoder.encode(tempImg);

//   var fileReference:FileReference=new FileReference();
//     fileReference.save(byteArray, "hello.jpg");
//   tempImg.dispose();
// }



mcCanvas.addEventListener(MouseEvent.MOUSE_DOWN, mouseDownHandler);
stage.addEventListener(MouseEvent.MOUSE_UP, mouseUpHandler);
stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDownHandler);
stage.addEventListener(KeyboardEvent.KEY_UP, keyUpHandler);
btnSizeUp.addEventListener(MouseEvent.CLICK, sizeUpClick);
btnSizeDown.addEventListener(MouseEvent.CLICK, sizeDownClick);
txtOpacity.addEventListener(MouseEvent.CLICK, txtOpacityClick);
txtOpacityVal.addEventListener(MouseEvent.CLICK, txtOpacityValClick);
btnNewImage.addEventListener(MouseEvent.CLICK, newImageClick);


color0.addEventListener(MouseEvent.CLICK, color0Click);
color1.addEventListener(MouseEvent.CLICK, color1Click);
color2.addEventListener(MouseEvent.CLICK, color2Click);
color3.addEventListener(MouseEvent.CLICK, color3Click);
color4.addEventListener(MouseEvent.CLICK, color4Click);
color5.addEventListener(MouseEvent.CLICK, color5Click);
color6.addEventListener(MouseEvent.CLICK, color6Click);
color7.addEventListener(MouseEvent.CLICK, color7Click);
color8.addEventListener(MouseEvent.CLICK, color8Click);
color9.addEventListener(MouseEvent.CLICK, color9Click);
color10.addEventListener(MouseEvent.CLICK, color10Click);
color11.addEventListener(MouseEvent.CLICK, color11Click);
color12.addEventListener(MouseEvent.CLICK, color12Click);
color13.addEventListener(MouseEvent.CLICK, color13Click);
color14.addEventListener(MouseEvent.CLICK, color14Click);
color15.addEventListener(MouseEvent.CLICK, color15Click);
color16.addEventListener(MouseEvent.CLICK, color16Click);
spuitColorBox.addEventListener(MouseEvent.CLICK, spuitColorBoxClick);
testbtn.addEventListener(MouseEvent.CLICK, testbtnClick);
// saveButton.addEventListener(MouseEvent.CLICK, saveButtonClick);
