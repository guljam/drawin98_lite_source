//getElement
const frame = window.requestAnimationFrame;
const doc = document;
const isIE = false || !!doc.documentMode;
const isEdge = !isIE && !!window.StyleMedia;
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
const isFirefox = typeof InstallTrigger !== 'undefined';
const god = doc.getElementById("god");
const toolBar = doc.getElementById("toolBar");
const toolBox = doc.getElementById("toolBox");
const penTypeButtonBox = doc.getElementById("penTypeButtonBox");
const toolMoveBox = doc.getElementById("toolMoveBox");
const toolMoveBoxV = doc.getElementById("toolMoveBoxV");
const colorModeButton = doc.getElementById("colorModeButton");
const mirrorButton = doc.getElementById("mirrorButton");
const penSizeBox = doc.getElementById("penSizeBox");
const timerText = doc.getElementById("timerText");
const titleFileName = doc.getElementById("titleFileName");
const titleFileNameClone = doc.getElementById("titleFileNameClone");
const canvasPanel = doc.getElementById("canvasPanel");
const canvasPanel2 = doc.getElementById("canvasPanel2");
const canvas1 = doc.getElementById("canvas1");
const canvas2 = doc.getElementById("canvas2");
const canvas4 = doc.getElementById("canvas4");
const space0 = doc.getElementById("space0");
const space1 = doc.getElementById("space1");
const space2 = doc.getElementById("space2");
const space3 = doc.getElementById("space3");
const spaceArray = [space0, space1, space2, space3];
const penTypeRoundBox = doc.getElementById("penTypeRoundBox");
const penTypeSquareBox = doc.getElementById("penTypeSquareBox");
const colorModeBG = doc.getElementById("colorModeBG");
const hintText = doc.getElementById("hintText");
const loadButtonInput = doc.getElementById("loadButtonInput");
const screenShooter = doc.getElementById("screenShooter");
const tempimg = doc.getElementById("tempimg");
const tempimg3 = doc.getElementById("tempimg3");
const colorBar = doc.getElementById("colorBar");
const helpPanel = doc.getElementById("helpPanel");
const selectModeBox = doc.getElementById("selectModeBox");
const selectModeBoxChild = doc.getElementById("selectModeBoxChild");

const saveButtonBox = doc.getElementById("saveButtonBox");
const tiny = doc.getElementById("tiny");
const normalColorBox = doc.getElementById("colorBox");
const customColorBox = doc.getElementById("customColorBox");
const startupSound = doc.getElementById("startupSound");
const recordingPrograss = doc.getElementById("recordingPrograss");
const zoominBox = doc.getElementById("zoominBox");
const penSizeBoxArray = doc.getElementsByClassName("penSizeBox");
const penSizeShapeArray = doc.getElementsByClassName("penSizeShape");
const tool2Array = doc.getElementsByClassName("tool2Button");
const penSize1gaeArray = doc.getElementsByClassName("penSizeBox");
const gkey = { //단축키 keycode 리스트
  q: 81,
  w: 87,
  e: 69,
  y: 89,
  u: 85,
  i: 73,
  a: 65,
  s: 83,
  d: 68,
  f: 70,
  g: 71,
  h: 72,
  j: 74,
  k: 75,
  z: 90,
  x: 88,
  c: 67,
  v: 86,
  b: 66,
  n: 78,
  m: 77,
  r: 82,
  t: 84,
  comma: 188,
  esc: 27,
  n1: 49,
  n2: 50,
  ctrl: 17,
  lalt1: 18,
  lalt: 21, //한글모드에서 오른쪽 일본어 모드에서는 그냥 18이 공통인데 alt는 전부묶어서 가자
  shift: 16,
  space: 32
};
//vars
const c1 = canvas1.getContext("2d"); //캔버스 2d context
const c2 = canvas2.getContext("2d");
const c4 = canvas4.getContext("2d");

const desktopColorset = [
  "#96555C","#C57559","#CE945A","#E8BE67","#D6CC7E","#A2B564","#81A254","#5C7F56",
  "#85628E","#6E6F9E","#52608E","#4B779E","#558A9A","#017F7E","#4D8673","#59866C",
  "#9D769E","#AD82A1","#AB99A8","#C7B6BF", "#D2CEC9","#C1C0BD","#90908F","#6F6F6F",
  "#4A4A4A","#2C2C2C","#1B1B1B",
];
const toolNumberArr = [ //툴버튼 누름 효과 줄때 인덱스로 찾게 array로 만들어줌
  0,
  0,
  "lineButton2",
  "penButton3",
  "eraseButton4",
  "spuitButton5",
  "handButton6",
  "moveButton7",
  "zoomoutButton8",
  "zoominButton9"
];
const penSizeOddFlag = [1, 0, 1, 1, 1, 0, 1, 0, 0];//홀수 사이즈 플래그
const penSizeSet = [1, 2, 3, 5, 7, 10, 15, 30, 100];//실제 펜 사이즈
const penSizePreviewRound = [2, 3, 5, 7, 11, 15, 19, 23, 25];//사이즈 메뉴에서는 사이즈를
const penSizePreviewSquare = [1, 2, 3, 5, 7, 10, 15, 19, 25];//좀 조절해서 보여줌
const canvasMinHeight = 150;//캔버스 최대 최소 크기
const canvasMaxHeight = 800;
const rDataLimit = 20000000;//20mb까지 제한 1024byte계산인데 여유로 그냥 1000byte로계산
const rImageSaveItv = 100; //스크로크 할때 이 숫자마다 썸네일 이미지 저장해줌, 메모리 희생 대신 시간탐색 빨라짐
let mainTool = 3;//메인툴 번호 3번은 펜
let canvasClicked = false; //그냥 단순하게 캔버스 클릭했는지 주는 변수
let hasCanvasClicked = false; //이건 replay 데이터 추가 할때 캔버스를 한번이라도 클릭했으면 데이터를 넣어줌
let penSizeIndex = 2; //html 요소 쓰여진 순서로얻어오기 때문에 html수정할때 주의 요함 id번호까지 순서대로 해야됨
let penSize = penSizeSet[penSizeIndex];
let penCapType = "round";
let penJoinType = "round";
let eraseCapType = "round";
let penColor = "rgb(0,0,0)"; //pencolor 꼭 rgb형식으로 rgb에서 색깔 분할하는 함수도 있어서
let colorModeON = false; //펜 반투명 on off변수
let eraseSizeIndex = 5;
let eraseSize = penSizeSet[eraseSizeIndex];
let lineStartPos = null; //직선툴 시작과 끝 위치값 {x: y:}로 전송함

let canvasWidth = canvas1.clientWidth;//현재 캔버스 값
let canvasHeight = canvas1.clientHeight;
let mouseMoveUsed = false; //mousemove안쓰고 바로 떼줄수도 있으니 그거 구분하기 위해서 변수 넣어줌
let afterPenReturnON = false; //단축키 누르고 마우스 썼는데 단축키 먼저 땠을때, 그 다음 마우스를 떼면 펜툴로 돌려줌
let helpON = false; //지금은 shortcut으로 버튼 이름이 바꼈는데 그거임
let mirrorON = false;
let aboutON = false;
let aboutWaitTimer = 0;
let changeCanvasSizeON = false;
let topmenuON = false;

let spuit1x1Size = 6; //스포이드 중앙점 알려주는 빨간 박스
let spuitZoomedSize = 60; //스포이드 크게 나오는 원 크기
let spuitSlowMoveDist = 15;
let spuitLastX = 0; //스포이드 돋보기 이동한 자리 마지막위치 저장
let spuitLastY = 0;
let spuitSlowMoveX = 0; //마우스 큰 움직임따라1px씩 움직이는 위치
let spuitSlowMoveY = 0;

let penSmoothingTimer = 0;//펜보정 타이머
let penSmoothX = null;//펜 떨림 보정 pointerdown 시작 좌표
let penSmoothY = null;
let handMoveX = 0; //손 툴, 캔버스 스크롤 얼마나 됐는지 저장하는 변수
let handMoveY = 0;
let handMoveClickX = 0;
let handMoveClickY = 0;
let imageMoveX = 0;//movetool 이동 값 합산해주는 변수
let imageMoveY = 0;       //movetool해서 클릭하고 움직이지 않고 그냥 떼주는경우가 있음
let imageMoveON = false; //movetool켜지고 pointermove이벤트가 발생했을때 올려주는 플래그
let imageMoveClicked = false;//canvasClicked랑 따로 만들어 주는 이유는  클릭하고 움직이지 않았을때가 있어서 그럼

//movetool켜지고 pointerdown 이벤트가 발생했을때 올려주는 플래그

let timeCount = 0; //타이머 관련
let timerON = false;//타이머를 키면 올려주는 플래그
let timerStartON = false; //타이머가 시작되면 올려주는 플래그
let timerNextTimer = null;//다음 1초 세주는 타이머 여기다 저장, 타이머 끄거나할때 이 변수로함
let timerLastTime = 0;

let undoImageList = []; //undo 관련
let undoMirrorList = []; //addundo할때 mirror플래그를 같이 저장해줌
let undoLimit = 20; //undo 한도
let undoIndex = null; //현재 undo가 어느부분이 되고 있는지 나타내는 커서? 같은거
let undoDelFlag = false;
let undoStrResetTimer = null;//hint에서 undo했을때 일정시간 지나면 tool234로 표시해주는 타이머

let zoomed = 1; //현재 줌된값
let mainKey = null; //단축키 관련
let subKey = null; //지우개눌렀을때 크기 조절하는 키는 여기다가 넣어줌
let loadFileFlag = 0; //이미지인가 리플레이 파일인가 골라주는 플래그

let toolBarFloatON = false; //toolPanelMoveON되서 tool1판넬이 떠있을때 올려주는 플래그
let colorBarFloatON = false; //toolPanelMoveON되서 tool1판넬이 떠있을때 올려주는 플래그
let tool1CheckDelayTimer = null; //wheel돌렸을때 바로 체크해주면 체크가 안되서 약간 텀을줌
let moveEventTime = 0; //파이어폭스에서는 이벤트가 중복되서 호출되서 선이 이상하게 그어져서 시간 텀두는 변수
let tinyFlag = false; //작은 커서 플래그
let activeFileMenuEnt = null; //활성화된 서브메뉴 ent 저장해줌

//툴바 이동 관련 변수들
let colorBarX = 0; //colorbar움직일때 클릭위치 저장
let colorBarY = 0;
let toolBarX = 0; //툴바 위치 XY
let toolBarY = 0;
let colorBarSpace = 1; //툴바 컬러바 스페이스위치 번호 12시부터 시계방향으로  1 3 0 2 순서임
let toolBarSpace = 3;
let sideSpaceMinHeightTool = 420; //양옆 space2 3 최소 높이
let sideSpaceMinHeightColor = 340; //양옆 space2 3 최소 높이
let spacePreviewList = [0, 0, 0, 0]; //preview눌렀을때 뭐가 나왔는지 저장, mousemove에서 ready체크함
let spacePreviewOFFColor = "#EBA6A6";
let spacePreviewONColor = "#A7D8B1";
let spaceReadyX = 0;//preivew가 녹색이 되었을때 그 좌표값저장
let spaceReadyY = 0;
let spaceReadyIndex = null; //ready가 켜진번호를 저장함 mouseup 에서 최종적으로 선택하게끔함

//전체 윈도우창 관련 변수
let godX = 0; //god윈도우 이동한 위치값
let godY = 0;
let lastInnerWidth = 0; //window resize시 가로크기만 정해서 god 정가운데로 해줌
let zoominBoxX = 0; //줌박스 이동한 위치값
let zoominBoxY = 0;
let customColorAddTimer = null; //직접 만든 컬러 길게 클릭하면 추가시키는 타이머 변수 취소할때도 필요함
let customColorInfo = null; //이벤트를 넘나들어야 하기 때문에 정보 저장하는 중간 매개자 변수
let lastZoomBoxX = 0; //줌인 박스 위치 저장
let lastZoomBoxY = 0;
let rStartPosX = null; //리플레이 데이터 시작 지점 저장해줌
let rStartPosY = null; //점을 찍을 것인지 아닌지 판단해줘야함
let fileNameON = false; //파일 저장 이름 관련 변수
let themeON = false; //테마 설정 ON

//1:god 클릭
//2:리플레이 속도 조절 클릭
//3:리플레이 시간 탐색 클릭
//4:툴바 움직임 클릭
//5:컬러바 움직임 클릭
//6:캔버스 크기조절 클릭
let pointerDownFlag = 0;

//function

//원점 penSmoothX oy로부터 hx hy쪽으로 dist 떨어진 거리 점을 리턴함
// function movePointAngleDist(penSmoothX,penSmoothY,hx,hy,dist)
// {
//     let rad = Math.atan2(hx-penSmoothX,hy-penSmoothY);

//     return {x:penSmoothX + dist * Math.sin(rad),
//             y:penSmoothY + dist * Math.cos(rad)};
// }
// function getDist (a,b)
// {
//     let subx = b.x-a.x;
//     let suby = b.y-a.y;

//     return Math.sqrt(subx*subx + suby*suby);
// }

//엣지 chrome beta에서 translate가 작동안해서 style로 일단 변경
function setGodPosition()
{
  god.style.left = Math.floor(godX)+"px";
  god.style.top = Math.floor(godY)+"px";
}

//pointermove 이벤트가 토글로 바뀌면서 줌박스 이벤트 따로 추가해줌
function zoomBoxMoveFunc(e)
{
  if(mainTool !== 9)
  {
    doc.removeEventListener("pointermove",zoomBoxMoveFunc);
  }
  const pos = getCanvasCursorPos(e);
  lastZoomBoxX = pos.x; //줌박스 커서 마지막 위치 저장해줌
  lastZoomBoxY = pos.y;
  zoomBoxMove();
}

function pointerMoveFunc(e)
{
  // if (aboutON === true) return;

  //일정시간 이상일때만 firefox edge에서 이벤트가 중복되거나 너무 빨라서 선이 이상함
  const nowTime = e.timeStamp;
  const subTime = nowTime - moveEventTime;
  //1픽셀씩 움직일때만 시간 제한을 조금 크게 해주고 나머지는 3으로해줌
  //왜냐하면 firefox에서 subtime이 3보다 작으면 선이 이상하게 나옴 타블렛 썼을시
  // const subTimeLimit = (Math.abs(e.movementX) < 2 || Math.abs(e.movementY) < 2) ? 6.5 : 3
  if (subTime < 3) {
    return;
  }

  switch (pointerDownFlag) {
    case 1: {
      godX += e.movementX;
      godY += e.movementY;

      setGodPosition();
      // transform = "translate(" + (godX >> 0) + "px," + (godY >> 0) + "px)";
      // god.style.transform = "translate(" + (godX >> 0) + "px," + (godY >> 0) + "px)";
      return;
    }
    case 2: {
      moveSpeedCursor(e.pageX);
      return;
    }
    case 3: {
      moveTimeCursor(e.pageX, Math.abs(e.movementX));
      return;
    }
    case 4: {
      const toolsp = window["space" + toolBarSpace];
      if (toolBarSpace >= 2) {
        const ylim = toolsp.clientHeight - toolBar.clientHeight;
        toolBarY += e.movementY;

        if (toolBarY <= 0) toolBarY = 0;
        else if (toolBarY >= ylim) toolBarY = ylim;

        toolBar.style.top = toolBarY + "px";
      } else {
        const xlim = toolsp.clientWidth - toolBar.clientWidth;
        toolBarX += e.movementX;

        if (toolBarX <= 0) toolBarX = 0;
        else if (toolBarX >= xlim) toolBarX = xlim;
        toolBar.style.left = toolBarX + "px";
      }
      checkSpaceReady(e.x, e.y);
      return;
    }
    case 5: {
      const colorsp = window["space" + colorBarSpace];
      if (colorBarSpace >= 2) {
        //color bar transfrom에서 90도로만 변환해서 새로길이가 가로길이임
        const ylim = colorsp.clientHeight - colorBar.clientWidth;
        colorBarY += e.movementY;

        if (colorBarY < 0) colorBarY = 0;

        else if (colorBarY > ylim) colorBarY = ylim;

        colorBar.style.top = colorBarY + "px";
      } else {
        const xlim = colorsp.clientWidth - colorBar.clientWidth;
        colorBarX += e.movementX;

        if (colorBarX < 0) colorBarX = 0;
        else if (colorBarX > xlim) colorBarX = xlim;

        colorBar.style.left = colorBarX + "px";
      }
      checkSpaceReady(e.x, e.y);
      return;
    }
    case 6: {
      canvasHeight += e.movementY;
      if (canvasHeight > canvasMaxHeight) {
        canvasHeight = canvasMaxHeight;
      } else if (canvasHeight < canvasMinHeight) {
        canvasHeight = canvasMinHeight;
      }

      if (e.movementY) chCanvasPreview(canvasHeight);

      return;
    }
  }

  if (mainTool === 7 && imageMoveClicked === true) {
    //7m
    imageMoveX += e.movementX / zoomed;
    imageMoveY += e.movementY / zoomed;

    c1.save();
    c1.globalAlpha = 1;
    c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
    c1.translate(imageMoveX, imageMoveY);
    c1.drawImage(canvas2, 0, 0);
    c1.restore();
    return;
  }

  if (canvasClicked === false) return;

  moveEventTime = nowTime;
  mouseMoveUsed = true;

  const getpos = getCanvasCursorPos(e);
  const x = getpos.x;
  const y = getpos.y;

  switch (mainTool) //move1
  {
    case 2: {
      const odd = penSizeOddFlag[penSizeIndex];
      const xx = odd === 1 ? x : x + 0.5;
      const yy = odd === 1 ? y : y + 0.5;
      c1.beginPath();
      c1.moveTo(lineStartPos.x, lineStartPos.y);
      c1.lineTo(xx, yy);
      c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
      c1.stroke();
      break;
    }
    case 3: {
      penSmoothing(x,y);
      break;
    }
    case 4: {
      const odd = penSizeOddFlag[eraseSizeIndex];
      const xx = odd === 1 ? x : x + 0.5;
      const yy = odd === 1 ? y : y + 0.5;

      c1.lineTo(xx, yy)
      c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
      c1.stroke();
      break;
    }
    case 5: {
      const abs = Math.abs;
      const sign = Math.sign;
      const subX = x - spuitLastX;
      const subY = y - spuitLastY;
      const signX = sign(subX);
      const signY = sign(subY);
      const moveStartDist = Math.ceil(spuitSlowMoveDist / zoomed * 2);

      if (abs(subX) > moveStartDist) {
        if (signX < 0) spuitSlowMoveX -= 1;
        else if (signX > 0) spuitSlowMoveX += 1;

        spuitZoom(spuitSlowMoveX, spuitSlowMoveY);
        spuitLastX = x;
        spuitLastY = y;
      }
      else if (abs(subY) > moveStartDist) {
        if (signY < 0) spuitSlowMoveY -= 1;
        else if (signY > 0) spuitSlowMoveY += 1;

        spuitZoom(spuitSlowMoveX, spuitSlowMoveY);
        spuitLastX = x;
        spuitLastY = y;
      }
      break;
    }
    case 6: {
      handMoveX += e.pageX - handMoveClickX;//e.movementX//*zoomed;
      handMoveY += e.pageY - handMoveClickY;//e.movementY//*zoomed;

      handMoveClickX = e.pageX;
      handMoveClickY = e.pageY;

      if (canvasPanel2.offsetLeft !== handMoveX || canvasPanel2.offsetTop !== handMoveY) {
        canvasPanel2.style.left = handMoveX + "px";
        canvasPanel2.style.top = handMoveY + "px";
      }
      break;
    }
  }
}

function penSmoothing(x,y)
{
  if(penSmoothX === null) return;
  clearTimeout(penSmoothingTimer);

  const odd = penSizeOddFlag[penSizeIndex];
  const xx = odd === 1 ? x : x + 0.5;
  const yy = odd === 1 ? y : y + 0.5;
  let f = 0.85;
  const abs = Math.abs;

  let ox = penSmoothX;
  let oy = penSmoothY;
  if (ox > xx) ox -= (ox - xx) * f;
  else if (ox < xx) ox += (xx - ox) * f;

  if (oy > yy) oy -= (oy - yy) * f;
  else if (oy < yy) oy += (yy - oy) * f;

  c1.lineTo(ox, oy);
  c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
  c1.stroke();

  if ((penSmoothX != ox || penSmoothY != oy)
  && (abs(penSmoothX-ox) >= 0.1 || abs(penSmoothY-oy) >= 0.1))
  {
    penSmoothingTimer = setTimeout(function()
    {
      penSmoothing(x,y);
    },20)
  }
  penSmoothX = ox;
  penSmoothY = oy;
}

// function hasSameSign(a, b) {
//   return (a ^ b) >= 0;
// }
//두점 거리 구하기
// function getDist(a, b) {
//   let subx = b.x - a.x;
//   let suby = b.y - a.y;

//   return Math.sqrt(subx * subx + suby * suby);
// }

//뭔가 colorbox scale해줄때 pencolor가 custom에 뭍혀서 강제로 zindex내려주는 함수
function removeCustomColorZIndex()
{
  customColorBox.style.zIndex = "";
  normalColorBox.addEventListener("pointerover",addCustomColorZIndex);
  normalColorBox.removeEventListener("pointerleave",removeCustomColorZIndex);
}

function addCustomColorZIndex()
{
  customColorBox.style.zIndex = -1;
  normalColorBox.addEventListener("pointerleave",removeCustomColorZIndex);
  normalColorBox.removeEventListener("pointerover",addCustomColorZIndex);
}

function setDesktopColor(color) {
  if (!color) return;
  const arr = rgbStringToRGBArr(color);
  const r = arr[0], g = arr[1], b = arr[2];
  const fontcolor = (r <= 190 && g <= 190 && b <= 190) ? "rgb(255,255,255)" : "rgb(0,0,0)"
  document.documentElement.style.setProperty("--desktopColor", color);
  document.documentElement.style.setProperty("--desktopFontColor", fontcolor);

  if (isChrome || isFirefox) {
    localStorage.setItem("desktopColor", color);
  }
}

//타이머 관련 함수
function timerStartFunc(e) {
  const targetID = e.target.id;
  if (targetID === "canvas1" || targetID === "canvasPanel") {
    timerStartON = true;
    timerLastTime = Date.now();
    timerNextTimer = setTimeout(timerGO, 1000);
    doc.removeEventListener("pointerdown", timerStartFunc);
  }
}

function checkTitleFocus(e) {
  if (e.target.id !== "titleFileName") {
    fileNameON = false;
    //전체선택된 채로 blur해주면 다음번에는 전체 선택이 안되서
    //선택을 리셋해주고 blur해줌
    titleFileName.setSelectionRange(0, 0);
    titleFileName.blur();
    doc.removeEventListener("pointerdown", checkTitleFocus);
  }
}

//이미지나 리플레이 파일 로드했을때 실행해주는 함수
function drawDot(c, x, y, shape, size, color) {
  let lower = shape.toLowerCase();
  let halfsize = size / 2;

  if (lower === "round") {
    c.beginPath();
    c.save();
    c.fillStyle = color;
    c.arc(x, y, halfsize, 0, 6.48);
    c.fill();
    c.restore();
  }
  else if (lower === "square" || size < 2) {//size 1일때는 펜 모양이 butt기본값이라서 따로 넣어줌
    c.beginPath();
    c.save();
    c.fillStyle = color;
    c.rect(x - halfsize, y - halfsize, size, size);
    c.fill();
    c.restore();
  }
}

function fileLoad(e) {
  //clear all data랑 약간 달라서 수동으로 해줌
  undoImageList = [];
  undoMirrorList = [];
  undoIndex = null;
  tempimg.removeAttribute("src");
  tempimg.src = "";

  const loadedfile = loadButtonInput.files[0];
  const nameArr = loadedfile.name.split(".");
  let title = "";
  let titlewidth = 0;
  for (let i = 0, len = nameArr.length - 1; i < len; ++i) {
    title += nameArr[i];
  }
  titleFileNameClone.textContent = title;
  titlewidth = titleFileNameClone.offsetWidth;

  if (titlewidth < 10) titlewidth = 10;
  else if (titlewidth > 300) titlewidth = 300;
  titleFileName.value = title;
  titleFileName.style.width = titlewidth + "px";

  c1.globalAlpha = 1;
  c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
  c2.globalAlpha = 1;
  c2.clearRect(0, 0, canvasWidth, canvasMaxHeight);
  c4.globalAlpha = 1;
  c4.clearRect(0, 0, canvasWidth, canvasMaxHeight);

    //imgload
  tempimg.onload = function () {
    //로드한 이미지에 맞추어서 캔버스 크기 조절
    tempimg.style.display = "block";
    let height = Math.min(Math.max(150, tempimg.offsetHeight), 800);
    tempimg.style.display = "none";
    chCanvas(height);
    checkToolPosition();
    c2.drawImage(tempimg, 0, 0);
    addUndo();
  };

  checkCanvasSize();
  tempimg.src = e.target.result.indexOf("data:") !== -1 ? e.target.result : "";

  loadButtonInput.value = "";
}

function zoomOut() {
  const zoomsave = zoomed;
  const cx = canvasWidth / 2 - canvasPanel2.offsetLeft;
  const cy = canvasHeight / 2 - canvasPanel2.offsetTop;

  zoomed--;
  if (zoomed < 1) zoomed = 1;
  zoomCanvas(zoomed);

  if (zoomsave <= 2) return;

  const f = zoomed / zoomsave;
  const xx = canvasPanel2.offsetLeft - (cx * f - cx) >> 0;
  const yy = canvasPanel2.offsetTop - (cy * f - cy) >> 0;

  canvasPanel2.style.left = xx + "px";
  canvasPanel2.style.top = yy + "px";

  if (mainTool === 9) {
    zoominBox.style.display = "block";
  }
}

function zoomIn() {
  //줌되기 이전의 위치 값을 구함
  const zoomsave = zoomed;
  const cx = zoominBoxX * zoomsave; //pos에서는 캔버스 크기에 상관없이 1배 값을 리턴해줘서
  const cy = zoominBoxY * zoomsave; //zoomed를 곱해서 늘어난 캔버스의 절대 위치를 구해줌

  ++zoomed;
  if (zoomed > 4) zoomed = 4;
  zoomCanvas(zoomed);

  if (zoomsave >= 4) return;

  const f = zoomed / zoomsave;
  const xx = -((cx * f) >> 0); //줌박스와 화면을 싱크해줌
  const yy = -((cy * f) >> 0);
  canvasPanel2.style.left = xx + "px";
  canvasPanel2.style.top = yy + "px";
  zoomBoxMove();
}

function zoomBoxMove() {
  if (zoomed >= 4) {
    zoominBox.style.display = "none";
    return;
  }

  const nextZ = zoomed + 1 > 4 ? 4 : zoomed + 1;
  const nextZoomf = nextZ / zoomed;
  zoominBox.style.width = ((canvasWidth / zoomed / nextZoomf) >> 0) + "px";
  zoominBox.style.height = ((canvasHeight / zoomed / nextZoomf) >> 0) + "px";

  //줌 박스 크기가 설정된 뒤에 해줘야함
  const x = (lastZoomBoxX - zoominBox.offsetWidth / 2) >> 0;
  const y = (lastZoomBoxY - zoominBox.offsetHeight / 2) >> 0;

  zoominBoxX = x;
  zoominBoxY = y;
  zoominBox.style.transform = "translate(" + x + "px," + y + "px)";
}
function zoominBoxSwitch(flag) {
  if (flag === false) {
    zoominBox.style.display = "none";
    zoominBox.classList.remove("zoominCursorON");
  } else if (flag === true) {
    zoominBox.style.display = "block";
    printHint("Select zoom position. (Key : W or U)");
    zoominBox.classList.add("zoominCursorON");

    zoomBoxMove();
  }
}

function checkGodPosition() {
  const godrect = god.getBoundingClientRect();
  const offsetw = -godrect.width * 0.8;
  const ih = window.innerHeight;

  if (godrect.top <= 0) {
    //맨 위에 바는 항상 보여야 함
    godY = 0;
  } else if (godrect.top > ih * 0.8) { // && ih > god.offsetHeight
    godY -= godrect.top - ih * 0.8;
  }

  if (godrect.left < offsetw) {
    godX = offsetw;
  } else if (godrect.right > window.innerWidth - offsetw) {
    godX -= godrect.right - (window.innerWidth - offsetw);
  }

  setGodPosition();
  // god.style.transform =
  //   "translate(" + (godX >> 0) + "px," + (godY >> 0) + "px)";
}

function aboutOFF() {
  aboutON = false;
  const aboutPanel = doc.getElementById("aboutPanel");
  const aboutImg = doc.getElementById("aboutImg");
  const titleBar = doc.getElementById("titleText");
  clearInterval(aboutWaitTimer);
  startupSound.pause();
  startupSound.currentTime = 0;
  aboutPanel.style.display = "none";
  aboutImg.style.transform = "";
  titleBar.classList.remove("aboutLoading");
  chCanvasPreview(canvasHeight);
  canvasPanel.style.transition = "";
  aboutImg.style.transform = "scale(1)";
  checkToolPosition();
}

//배경이 투명색이라서 기본 데이터가 0,0,0,0이라서 흰색을
//배경으로하는 컬러가 픽이 안됨
//그래서 임시로 캔버스4번을 흰색으로 칠하고 거기다가 2번을 그려서
//색 고르기 되게 한거임
function spuitToolReady() {
  c4.save();
  c4.globalAlpha = 1;
  c4.fillStyle = "#FFFFFF";
  c4.fillRect(0, 0, canvasWidth, canvasMaxHeight);
  c4.fill();
  c4.drawImage(canvas2, 0, 0);
  c4.restore();
}

function checkSpaceSize() {
  const spaceSet = spaceArray;
  const len = spaceSet.length;

  spaceSet[toolBarSpace].style.width = toolBar.offsetWidth + 8 + "px";
  spaceSet[colorBarSpace].style.width = "50px";

  for (let i = 0; i < len; ++i) {
    spaceSet[i].style.display = "block";
    spaceSet[i].style.opacity = "1";
    spaceSet[i].style.backgroundColor = "";
    spaceSet[i].style.border = "";
    //높이 주는건 display가 보여지고 나서 해야함 안하면 0으로 나옴
    if (i >= 2) {
      //+10은 캔버스 조절바
      const normal = canvasPanel.offsetHeight + space0.offsetHeight + space1.offsetHeight + 10;
      let height = normal;

      if (toolBarSpace >= 2 && normal < sideSpaceMinHeightTool) {
        height = sideSpaceMinHeightTool;
      }
      else if (colorBarSpace >= 2 && normal < sideSpaceMinHeightColor) {
        height = sideSpaceMinHeightColor;
      }

      //비어있는 거는 0px로 해줌
      if (spaceSet[i].childElementCount === 0) spaceSet[i].style.width = "0px";

      spaceSet[i].style.height = (height >> 0) + "px";
      spaceSet[i].style.top = "0px"; //프리뷰에서 top을 조절하기 때문에 0px로 다시 리셋
    } else {
      spaceSet[i].style.width = "100%";
      spaceSet[i].style.height = "";
      spaceSet[i].style.top = "0px"; //프리뷰에서 top을 조절하기 때문에 0px로 다시 리셋
    }
  }

  checkGodWidth();
}

function spaceReadyCancel() {
  canvasPanel.style.borderColor = "";
}

function checkSpaceReady(x, y) {
  const rect = canvasPanel.getBoundingClientRect();
  const left = rect.left;
  const right = rect.right;
  const top = rect.top;
  const bottom = rect.bottom;
  const offset = 10;
  const borderColor = [0, 0, 0, 0];
  let activeSpace = null;

  for (let i = spacePreviewList.length - 1; i >= 0; --i) {
    if (spacePreviewList[i] === 1) {
      borderColor[i] = spacePreviewOFFColor;
    }
    else {
      borderColor[i] = "transparent";
    }

    if (spacePreviewList[i] === 0) continue;

    if (i === 0
      && x >= left && x <= right && y >= bottom - 20 - offset && y <= bottom + offset) {
      activeSpace = i;
      borderColor[i] = spacePreviewONColor;
      spaceReadyX = x - left;
      spaceReadyY = 0;
    }
    else if (i === 1
      && x >= left && x <= right && y >= top - offset && y <= top + 20 + offset) {
      activeSpace = i;
      borderColor[i] = spacePreviewONColor;
      spaceReadyX = x - left;
      spaceReadyY = 0;
    }
    else if (i === 2
      && x >= right - 20 - offset && x <= right + offset && y >= top && y <= bottom) {
      activeSpace = i;
      borderColor[i] = spacePreviewONColor;
      spaceReadyX = 0;
      spaceReadyY = y - top;
    }
    else if (i === 3
      && x >= left - offset && x <= left + 20 + offset && y >= top && y <= bottom) {
      activeSpace = i;
      borderColor[i] = spacePreviewONColor;
      spaceReadyX = 0;
      spaceReadyY = y - top;
    }
  }

  spaceReadyIndex = activeSpace;

  canvasPanel.style.borderColor = borderColor[1] + " "
    + borderColor[2] + " "
    + borderColor[0] + " "
    + borderColor[3];
}

function spacePreview() {
  const spaceSet = spaceArray;
  const len = spaceSet.length;
  let borderColor = [0, 0, 0, 0];
  spaceReadyIndex = null; //프리뷰 시작할때 초기값시켜줌
  spacePreviewList = [0, 0, 0, 0];

  for (let i = 0; i < len; ++i) {
    if (i === colorBarSpace || i === toolBarSpace) {
      spacePreviewList[i] = 0;
      borderColor[i] = "transparent";
    }
    else {
      spacePreviewList[i] = 1;
      borderColor[i] = spacePreviewOFFColor;
    }
  }

  canvasPanel.style.borderColor = borderColor[1] + " "
    + borderColor[2] + " "
    + borderColor[0] + " "
    + borderColor[3];
}

function setToolSpace(spaceIndex) {
  toolBarSpace = spaceIndex;
  toolBar.style.left = "0px";
  toolBar.style.top = "0px";
  toolBarX = spaceReadyX;
  toolBarY = spaceReadyY;
  god.style.width = god.offsetWidth + 50 + "px";

  toolBar.style.left = toolBarX + "px";
  toolBar.style.top = toolBarY + "px";

  //수동으로 다해줌
  if (spaceIndex >= 2) {
    toolMoveBoxV.style.display = "none";
    toolMoveBox.style.display = "block";
    toolBar.style.margin = "0px 5px";
    toolBar.style.flexDirection = "";
    toolBar.style.justifyContent = "";
    toolBar.style.width = "";
    toolBar.style.marginBottom = "";
    toolBox.style.width = "";
    toolBox.style.height = "";
    toolBox.style.marginLeft = "0px";
    toolMoveBox.style.transform = "";
    toolMoveBox.style.width = "";
    penTypeButtonBox.style.marginTop = "";
    penTypeButtonBox.style.height = "";
    penTypeButtonBox.style.width = "";
    penTypeButtonBox.style.flexWrap = "";
    penTypeButtonBox.style.padding = "";
    penTypeButtonBox.style.marginRight = "";
    penSizeBox.style.width = "";
    penSizeBox.style.padding = "";

    const len = penSize1gaeArray.length;
    for (let i = 0; i < len; ++i) {
      penSize1gaeArray[i].style.padding = "";
      penSize1gaeArray[i].style.minWidth = "";
      penSize1gaeArray[i].style.minHeight = "";
      penSize1gaeArray[i].style.height = "";
      penSize1gaeArray[i].style.width = "100%";
    }
    penSizeCursorSelect(penSizeIndex);
  } else {
    toolMoveBoxV.style.display = "block";
    toolMoveBox.style.display = "none";
    toolBar.style.margin = "0px";
    toolBar.style.flexDirection = "row";
    toolBar.style.justifyContent = "flex-start";
    toolBar.style.width = "570px";
    toolBar.style.margin = "0px 0px 3px 0px";
    toolBox.style.height = "27px";
    toolBox.style.marginLeft = "0px";
    toolMoveBox.style.transform = "rotate(90deg)";
    toolMoveBox.style.width = "25px";
    penTypeButtonBox.style.marginTop = "0px";
    penTypeButtonBox.style.height = "28px";
    penTypeButtonBox.style.width = "85px";
    penTypeButtonBox.style.flexWrap = "wrap";
    penTypeButtonBox.style.padding = "0px";
    penTypeButtonBox.style.marginRight = "5px";
    penSizeBox.style.width = "205px";
    penSizeBox.style.padding = "0px";

    const len = penSize1gaeArray.length;
    for (let i = 0; i < len; ++i) {
      penSize1gaeArray[i].style.padding = "0px 3px"
      penSize1gaeArray[i].style.minWidth = "10px";
      penSize1gaeArray[i].style.minHeight = "25px";
      penSize1gaeArray[i].style.height = "100%";
      penSize1gaeArray[i].style.width = "initial";
      penSize1gaeArray[i].firstChild.offsetHeight + "px";
    }
    penSizeCursorSelect(penSizeIndex);
  }

  const nowspace = window["space" + spaceIndex];
  const fr = doc.createDocumentFragment();

  if (spaceIndex === 0 || spaceIndex === 1) nowspace.style.top = "";

  fr.appendChild(toolBar);
  nowspace.appendChild(fr);
  changePenType((mainTool === 4) ? eraseCapType : penCapType);
  checkSpaceSize();
}

function setColorBarSpace(spaceIndex) {
  colorBarSpace = spaceIndex;
  colorBar.style.top = "0px";
  colorBar.style.left = "0px";
  colorBarX = spaceReadyX;
  colorBarY = spaceReadyY;

  colorBar.style.left = colorBarX + "px";
  colorBar.style.top = colorBarY + "px";

  if (spaceIndex >= 2) {
    colorBar.style.transform = "rotate(90deg) scaleY(-1)";
    colorBar.style.marginLeft = "4px";
    colorBar.style.marginBottom = "";
    colorModeBG.style.transform = "rotate(-90deg) scaleX(-1)"; //이것만 정상으로 돌려줌 해줌

  } else {
    colorBar.style.transform = "";
    colorBar.style.marginLeft = "";
    colorBar.style.marginBottom = "";
    colorModeBG.style.transform = "";
  }

  const nowSpace = window["space" + spaceIndex];
  const fr = doc.createDocumentFragment();
  fr.appendChild(colorBar);
  nowSpace.appendChild(fr);

  if (spaceIndex === 0 || spaceIndex === 1) {
    nowSpace.style.top = "";
  } else if (spaceIndex === 2 || spaceIndex === 3) {
    //붙여놓고 나서 조절해줌
    const realWidth =
      colorBar.clientHeight +
      colorBar.clientLeft +
      parseInt(colorBar.style.marginLeft) +
      2;
    nowSpace.style.width = realWidth + "px";
  }

  checkSpaceSize();
}

function rgbStringToRGBArr(colorStr) {
  if (colorStr === "" || colorStr.indexOf("rgb") < 0) return 0;

  const filter = /[^0-9]/g;
  const cArr = colorStr.split(",");
  const color = [
    Number(cArr[0].replace(filter, "")),
    Number(cArr[1].replace(filter, "")),
    Number(cArr[2].replace(filter, ""))
  ];
  return color;
}

function Tool234Hint() {
  const n = mainTool;
  let type = n === 3 ? "Pen " : n === 4 ? "Erase " : n === 2 ? "Straight line " : 0;
  // let capType = (mainTool === 4) ? eraseCapType : penCapType;

  if (type === 0) {
    printHint("");
    return;
  }

  printHint(type);
}

function changeColorBGButton(color) {
  //pencolor에 의존하므로 pencolor가 바뀐뒤에 가야함
  if (colorModeON === true) {
    const c = rgbStringToRGBArr(color);
    const r = (255 + c[0]) / 2; //rgb컬러를 기존보다 0.5배투명한데 알파값이 1인 rgb컬러로 바꿔줌
    const g = (255 + c[1]) / 2; //물론 배경색은 흰색기준
    const b = (255 + c[2]) / 2;

    if (r <= 190 && g <= 190 && b <= 190)
      colorModeBG.style.color = "rgb(255,255,255)";
    else colorModeBG.style.color = "rgb(0,0,0)";

    colorModeBG.textContent = "50%";
    colorModeBG.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
  } else {
    colorModeBG.style.backgroundColor = color;
    colorModeBG.textContent = "";
  }
}

function changeColorMode() {
  colorModeON = !colorModeON;

  if (colorModeON === true) {
    colorModeButton.style.borderColor = "#A0A0A0 white white #A0A0A0";
    changeColorBGButton(penColor);
  } else if (colorModeON === false) {
    colorModeButton.style.borderColor = "white #A0A0A0 #A0A0A0 white";
    changeColorBGButton(penColor);
  }
}

function saveData(replayFlag) {
  if (replayFlag === false) {
    c1.save();
    c1.globalAlpha = 1.0;
    c1.fillStyle = "white";
    c1.fillRect(0, 0, canvasWidth, canvasMaxHeight);
    c1.fill();
    c1.drawImage(canvas2, 0, 0);
    c1.restore();

    // const nowTime = new Date();
    const fileName = titleFileName.value + ".png";

    if (isEdge) {
      const blob = canvas1.msToBlob();
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      screenShooter.href = canvas1
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      screenShooter.setAttribute("download", fileName);
      screenShooter.click();
    }

    c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
  } else if (replayFlag === true) {
    saveReplay();
  }
}

function clearAll() {
  if (confirm("Clear canvas?")) {
    tempimg.removeAttribute("src");
    undoImageList = []; //undo데이터 완전히 다제거
    undoMirrorList = [];
    undoIndex = null;
    mirrorON = false;
    mirrorButton.classList.remove("tool2ButtonON");
    titleFileName.value = "Untitled";
    titleFileNameClone.textContent = "Untitled";
    titleFileName.style.width = titleFileNameClone.offsetWidth + "px";
    c1.globalAlpha = 1;
    c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
    c2.globalAlpha = 1;
    c2.clearRect(0, 0, canvasWidth, canvasMaxHeight);
    c4.globalAlpha = 1;
    c4.clearRect(0, 0, canvasWidth, canvasMaxHeight);
    checkCanvasSize();
    addUndo(); //캔버스 다지웠을때 초기 빈 캔버스 하나 로드해줘야함.
  }
}

function printHint(str) {
  hintText.textContent = str;
}

function checkToolPosition() {
  if (helpON === true ||aboutON === true) return; //리플레이 모드에서는 하지 않음
  const toolsp = toolBarSpace;
  const colorsp = colorBarSpace;//컬러바
  const ih = window.innerHeight;
  const scY = window.scrollY;

  //툴바 컬러바 최대 x y 다시 체크
  const tsp = window["space" + toolsp];
  const csp = window["space" + colorsp];
  const xlim1 = tsp.clientWidth - toolBar.clientWidth;
  const ylim1 = tsp.clientHeight - toolBar.clientHeight;
  const xlim2 = csp.clientWidth - colorBar.clientWidth;
  //colorbar는 transform으로 90도로만 width가 가로새로 크기 다됨
  const ylim2 = csp.clientHeight - colorBar.clientWidth;

  if (toolBarY <= 0) toolBarY = 0;
  else if (toolBarY >= ylim1) toolBarY = ylim1;
  if (toolBarX <= 0) toolBarX = 0;
  else if (toolBarX >= xlim1) toolBarX = xlim1;

  if (colorBarY <= 0) colorBarY = 0;
  else if (colorBarY >= ylim2) colorBarY = ylim2;
  if (colorBarX <= 0) colorBarX = 0;
  else if (colorBarX >= xlim2) colorBarX = xlim2;

  toolBar.style.left = toolBarX + "px";
  toolBar.style.top = toolBarY + "px";
  colorBar.style.left = colorBarX + "px";
  colorBar.style.top = colorBarY + "px";

  if (toolsp >= 1) {
    const sp = toolsp === 1 ? space1 : toolsp === 2 ? space2 : space3;
    const y = toolBarY;
    const top = sp.offsetTop + y;
    const btm = top + toolBar.clientHeight + godY;

    if (top < scY) {
      //윗쪽이 안보일때
      let yy = y + (scY - top - 1);
      toolBarFloatON = true;
      toolBar.style.top = yy + "px";
    } else if (btm > ih + scY) {
      //아랫쪽이 안보일때
      let yy = y - (btm - (ih + scY));
      if (yy < 0) yy = 0;
      toolBarFloatON = true;
      toolBar.style.top = yy + "px";
    } //중간에 있을때 제자리 찾아줌
    else {
      toolBarFloatON = false;
      toolBar.style.top = toolBarY + "px";
    }
  } else {
    const btm = space0.offsetTop + toolBar.clientHeight + godY;

    if (btm > ih + scY) {
      let yy = -(btm - (ih + scY));
      toolBarFloatON = true;
      toolBar.style.top = yy + "px";
    } else {
      toolBarFloatON = false;
      toolBar.style.top = "0px";
    }
  }

  if (colorsp >= 1) {
    const sp = colorsp === 1 ? space1 : colorsp === 2 ? space2 : space3;
    const y = colorBarY;
    const top = sp.offsetTop + y + 1;
    //90도 transform을 해서 가로 길이가 세로 길이가 될때가 있어서 조건붙여줌
    const h = colorsp >= 2 ? colorBar.clientWidth : colorBar.clientHeight;
    const btm = top + h + godY; //

    if (top < scY) {
      let yy = y + (scY - top);
      colorBarFloatON = true;
      colorBar.style.top = yy + "px";
    } else if (btm > ih + scY) {
      let yy = y - (btm - (ih + scY));
      if (yy < 0) yy = 0;
      colorBarFloatON = true;
      colorBar.style.top = yy + "px";
    } else {
      colorBarFloatON = false;
      colorBar.style.top = colorBarY + "px";
    }
  } else {
    const btm = space0.offsetTop + colorBar.clientHeight + godY;
    if (btm > ih + scY) {
      let yy = -(btm - (ih + scY));
      colorBarFloatON = true;
      colorBar.style.top = yy + "px";
    } else {
      colorBarFloatON = false;
      colorBar.style.top = "0px";
    }
  }
}

function checkGodWidth() {
  //뭔지 모르겠는데 여튼 뒤에 5정도 붙여줘야 예쁘게됨
  const godWidth = (space2.offsetWidth + space3.offsetWidth + canvasPanel.offsetWidth + 5) >> 0;
  god.style.width = godWidth + "px";
}

function checkCanvasSize() {
  canvasPanel.style.width = "600px";
  canvasPanel.style.borderColor = "";
  canvas1.style.display = "";
  canvas2.style.display = "";
  canvas4.style.display = "none";
  // replayStrokeCursor.style.display = "none";
  saveButtonBox.style.display = "block";
  canvas1.height = canvasHeight;
  canvasPanel.style.height = canvasHeight + "px";
  canvasPanel2.style.height = canvasHeight + "px";
  checkSpaceSize();
  checkToolPosition();
}


function canvasPanelMoveLimit() {
  const rat = 0.8; //캔버스 20%까지 보여줌
  const cp1 = canvasPanel.getBoundingClientRect(); //캔버스 부모판넬
  const cp2 = canvasPanel2.getBoundingClientRect(); //움직이는 캔버스

  if (cp2.right < cp1.left) canvasPanel2.style.left = -(cp2.width * rat) + "px";
  else if (cp2.left > cp1.right) canvasPanel2.style.left = cp1.width * rat + "px";

  if (cp2.bottom < cp1.top) canvasPanel2.style.top = -(cp2.height * rat) + "px";
  else if (cp2.top > cp1.bottom) canvasPanel2.style.top = cp1.height * rat + "px";

  handMoveX = canvasPanel2.offsetLeft;
  handMoveY = canvasPanel2.offsetTop;
}

function zoomCanvas(how) {
  canvasPanel2.style.transform = "scale(" + how + ")";

  if (how == 1) {
    canvasPanel2.style.left = "0px";
    canvasPanel2.style.top = "0px";
    handMoveX = 0;
    handMoveY = 0;
  } else {
    canvasPanelMoveLimit();
  }
  if (how > 1) printHint("Zoom x" + how);
}

function penSizeCursorSelect(index) {
  const len = penSizeBoxArray.length;

  for (let i = 0; i < len; ++i) {
    const ele = penSizeBoxArray[i];
    if (index === i) {
      ele.classList.add("penSizeBoxSelected");
      ele.firstElementChild.classList.add("penSizeSelected");
      if (i === 8) doc.getElementById("penSizeText8").style.color = "black";
    } else {
      ele.classList.remove("penSizeBoxSelected");
      ele.firstElementChild.classList.remove("penSizeSelected");
      if (i === 8) doc.getElementById("penSizeText8").style.color = "white";
    }
  }
}

function tool2CursorSelect(id) {
  const len = tool2Array.length;

  for (let i = 0; i < len; ++i) {
    const ele = tool2Array[i];
    if (ele.id === id) ele.classList.add("tool2ButtonON");
    else ele.classList.remove("tool2ButtonON");
  }

  if (mainTool === 3 || mainTool === 4 || mainTool === 2) {
    penSizeBox.style.opacity = "";
    penSizeBox.classList.remove("noHover");
    penTypeButtonBox.style.opacity = "";
    penTypeButtonBox.classList.remove("noHover");

  } else {
    penSizeBox.style.opacity = "0.3";
    penSizeBox.classList.add("noHover");
    penTypeButtonBox.style.opacity = "0.3";
    penTypeButtonBox.classList.add("noHover");
  }
}

function getCanvasCursorPos(e) {
  if (e.target.id === "canvas1") {
    const x = e.offsetX;
    const y = e.offsetY;
    return { x: x, y: y };
  }
  else if (e.target.id === "canvasPanel1") {
    const x = e.offsetX - 20;
    const y = e.offsetY - 20;
    return { x: x, y: y };
  }
  else {
    const cp2 = canvasPanel2.getBoundingClientRect();
    const x = (e.pageX - cp2.left - window.scrollX) / zoomed;
    const y = (e.pageY - cp2.top - window.scrollY) / zoomed;
    return { x: x, y: y };
  }
}

//undo redo가 공통적으로 실행하는 함수
function afterUndo(index) {

  // mirrorON = undoMirrorList[index];
  //미러 플래그가 다르면 다시 미러 해줌
  if (mirrorON !== undoMirrorList[index]) {
    c2.save();
    c2.globalAlpha = 1.0;
    c2.globalCompositeOperation = "copy";
    c2.scale(-1, 1);
    c2.drawImage(canvas2, 0, 0, -canvasWidth, canvasMaxHeight);
    c2.restore();
  }

  imageMoveON = false;//undo하면 기존 데이터로 바뀌기 때문에 move데이터를 리셋해줌
  imageMoveX = 0;
  imageMoveY = 0;

  const len = undoLimit;//undoImageList.length;
  let str = " ";
  for (let i = 0; i < len; ++i) {
    if (i < undoIndex) str += "▮";
    else str += "▯";
  }

  clearTimeout(undoStrResetTimer);
  undoStrResetTimer = setTimeout(function () {
    Tool234Hint();
  }, 2000)
  return str;
}
function redo() {
  const maxIndex = undoImageList.length - 1;
  if (undoIndex === null) return;
  if (undoIndex === maxIndex) {
    undoDelFlag = false;
    return;
  }

  undoIndex = undoIndex + 1;
  c2.putImageData(undoImageList[undoIndex], 0, 0);
  const str = afterUndo(undoIndex);

  printHint(str + " Redo (Key : X or M)");

}
function undo() {
  if (undoIndex === null) undoIndex = undoImageList.length - 1;

  undoIndex = undoIndex - 1;
  undoDelFlag = true;

  if (undoIndex < 0) {
    undoIndex = 0;
    return;
  }

  c2.putImageData(undoImageList[undoIndex], 0, 0);
  const str = afterUndo(undoIndex);

  printHint(str + " Undo (Key : Z or ,)");

  // printHint("Undo " + undoIndex + "/" + undoImageList.length + " (Key : Z or ,)");
}

function addUndo() {
  if (undoDelFlag === true) {
    undoDelFlag = false;
    undoImageList.splice(undoIndex + 1);
    undoMirrorList.splice(undoIndex + 1);
  }

  undoImageList.push(c2.getImageData(0, 0, canvasWidth, canvasMaxHeight));
  undoMirrorList.push(mirrorON);

  if (undoImageList.length > undoLimit + 1) {
    undoImageList.splice(0, 1); //0번인덱스를 지워줌
    undoMirrorList.splice(0, 1); //미러 플래그도 같이 따라가줌
  }
  undoIndex = undoImageList.length - 1;
}

function timerGO() {
  const nowTime = Date.now();
  const subTime = (nowTime - timerLastTime) * 0.001;

  timeCount += subTime;
  timerLastTime = nowTime;
  const floor = Math.floor; //>> bitwise는 32비트 int까지라서 floor그냥 써줌
  const hh = floor(timeCount / 3600);
  const mm = floor((timeCount - hh * 3600) / 60);
  const ss = floor(timeCount % 60);
  const h = hh < 10 ? "0" + hh : hh;
  const m = mm < 10 ? "0" + mm : mm;
  const s = ss < 10 ? "0" + ss : ss;
  const time = h + ":" + m + ":" + s;
  const floorTime = floor(timeCount);

  timerNextTimer = setTimeout(timerGO, 1000);

  timerText.textContent = time;

  if (floorTime > 0 && floorTime % 3600 === 0) {
    timerText.classList.add("buttonShake");

    setTimeout(function () {
      timerText.classList.remove("buttonShake");
    }, 3000);
  }
}

function mirrorCanvas() {
  mirrorON = !mirrorON;
  if (mirrorON === true) {
    mirrorButton.classList.add("tool2ButtonON");
  } else if (mirrorON === false) {
    mirrorButton.classList.remove("tool2ButtonON");
  }

  c2.save();
  c2.globalAlpha = 1.0;
  c2.globalCompositeOperation = "copy";
  c2.scale(-1, 1);
  c2.drawImage(canvas2, 0, 0, -canvasWidth, canvasMaxHeight);
  c2.restore();

  const centerX = canvasWidth / 2;
  const centerX2 = canvasPanel2.offsetLeft + (canvasPanel2.offsetWidth * zoomed) / 2;
  const fixX = canvasPanel2.offsetLeft + (centerX - centerX2) * 2;

  canvasPanel2.style.left = fixX + "px";
  
  if (mainTool === 7) {
    imageMoveON = false;
    imageMoveX = 0;
    imageMoveY = 0;
  }
  printHint("Flip-canvas Horizontal (Key : A or K)");
}

function changePenSize(incFlag) {
  if (incFlag === true) {
    const indexLimit = penSizeSet.length - 1;

    if (mainTool === 3 || mainTool === 2) {
      ++penSizeIndex;
      if (penSizeIndex > indexLimit) penSizeIndex = indexLimit;
      penSize = penSizeSet[penSizeIndex];
      penSizeCursorSelect(penSizeIndex);
    } else if (mainTool === 4) {
      ++eraseSizeIndex;
      if (eraseSizeIndex > indexLimit) eraseSizeIndex = indexLimit;
      eraseSize = penSizeSet[eraseSizeIndex];
      penSizeCursorSelect(eraseSizeIndex);
    }
  } else {
    if (mainTool === 3 || mainTool === 2) {
      penSizeIndex--;
      if (penSizeIndex < 0) penSizeIndex = 0;
      penSize = penSizeSet[penSizeIndex];
      penSizeCursorSelect(penSizeIndex);
    } else if (mainTool === 4) {
      eraseSizeIndex--;
      if (eraseSizeIndex < 0) eraseSizeIndex = 0;
      eraseSize = penSizeSet[eraseSizeIndex];
      penSizeCursorSelect(eraseSizeIndex);
    }
  }
}

function changePenType(capType) {
  if (mainTool > 4) return;
  //모양이 같을때 리턴
  if (capType === "square") {
    penTypeSquareBox.style.border = "1px solid #0A246A";
    penTypeRoundBox.style.border = "1px solid transparent";
    for (let i = 0, len = penSizeShapeArray.length; i < len; ++i) {
      if (toolBarSpace >= 2) {
        penSizeShapeArray[i].style.width = "25px";
        penSizeShapeArray[i].style.height = penSizePreviewSquare[i] + "px";
        penSizeShapeArray[i].style.borderRadius = "0%";
      } else {
        penSizeShapeArray[i].style.width = penSizePreviewSquare[i] + "px";
        penSizeShapeArray[i].style.height = "25px";
        penSizeShapeArray[i].style.borderRadius = "0%";
      }
    }
  } else if (capType === "round") {
    penTypeRoundBox.style.border = "1px solid #0A246A";
    penTypeSquareBox.style.border = "1px solid transparent";
    for (let i = 0, len = penSizeShapeArray.length; i < len; ++i) {
      let size = penSizePreviewRound[i];
      penSizeShapeArray[i].style.width = size + "px";
      penSizeShapeArray[i].style.height = size + "px";
      penSizeShapeArray[i].style.borderRadius = "50%";
    }
  }
}

function NumberFromString(string) {
  if (!string || typeof string === "object") return "";
  if (typeof string === "number") return string;

  return Number(string.replace(/\D/g, ""));
}

function spuitZoom(x, y) {
  const pc = c4.getImageData(x, y, 1, 1).data;
  const asize = spuit1x1Size;
  const zsize = spuitZoomedSize;
  const pickRectSize = zsize / asize;
  const offset = (asize / 2) + 1;
  let pointerColor = "red";
  const cropCircleSize = (zoomed > 1) ? zsize / zoomed * 2 : zsize / zoomed;

  if (pc[0] > 150 && pc[1] < pc[0] && pc[2] < pc[0]) {
    pointerColor = "#00FFFF";
  }

  c1.save();
  c1.globalAlpha = 1.0;
  c1.imageSmoothingEnabled = false;
  // c1.mozImageSmoothingEnabled = false;
  c1.webkitImageSmoothingEnabled = false;
  c1.msImageSmoothingEnabled = false;
  c1.fillStyle = "white";
  c1.fillRect(0, 0, canvasWidth, canvasMaxHeight);
  c1.fill();

  c1.drawImage(
    canvas2,
    x - asize,
    y - asize, //시작지점 x y에서
    asize * 3,
    asize * 3, //가로 w세로 h인 영역을 잘라내서
    x - zsize - offset,
    y - zsize - offset, //원하는 좌표 에다가
    zsize * 3,
    zsize * 3 //어떤 사이즈로 그릴건지?
  );

  //crop lans
  c1.beginPath();
  c1.lineWidth = 1;
  c1.strokeStyle = "red";
  c1.globalCompositeOperation = "destination-in";
  c1.arc(x, y, cropCircleSize, 0, 6.48);
  c1.fill();

  // rect cursor
  c1.globalCompositeOperation = "source-over";
  c1.beginPath();
  c1.lineWidth = zoomed === 1 ? 2 : 1;
  c1.strokeStyle = pointerColor;
  c1.rect(x - offset, y - offset, pickRectSize, pickRectSize);
  c1.stroke(); 6
  c1.restore();

  const alpha = pc[3] / 255;
  const round = Math.round;
  const r = round((1 - alpha) * pc[0] + alpha * pc[0]);
  const g = round((1 - alpha) * pc[1] + alpha * pc[1]);
  const b = round((1 - alpha) * pc[2] + alpha * pc[2]);
  const rgb = "rgb(" + r + "," + g + "," + b + ")";

  if (r === 0 && g === 0 && b === 0 && alpha === 0) {
    //투명한 검정색이면 불투명한 검정색으로
    penColor = "rgb(255,255,255,1)";
    changeColorBGButton("rgb(255,255,255,1)");
  } else {
    penColor = rgb;
    changeColorBGButton(rgb);
  }
}

function chCanvasPreview(height) {
  canvasPanel.style.height = height + "px";
  printHint("Canvas size " + canvasWidth + " x " + height);
}
function chCanvas(height) {
  canvas1.height = height;
  canvasPanel.style.height = height + "px";
  canvasPanel.style.borderColor = "";
  canvasPanel2.style.height = height + "px";
  canvasHeight = height;

  //+10은 캔버스 조절바 높이
  const normal = canvasPanel.offsetHeight + space0.offsetHeight + space1.offsetHeight + 10;
  let spaceHeight = normal;

  if (toolBarSpace >= 2 && normal < sideSpaceMinHeightTool) {
    spaceHeight = sideSpaceMinHeightTool;
  }
  else if (colorBarSpace >= 2 && normal < sideSpaceMinHeightColor) {
    spaceHeight = sideSpaceMinHeightColor;
  }

  space2.style.height = spaceHeight + "px";
  space3.style.height = spaceHeight + "px";

  const colorBarTotalH = colorBarY + colorBar.clientWidth; //transform 90도로 되어있어서 width가 맞음
  const toolBarTotalH = toolBarY + toolBar.clientHeight;

  if (colorBarSpace >= 2 && colorBarTotalH > spaceHeight) {
    const sub = colorBarTotalH - spaceHeight;

    colorBarY -= sub;
    colorBar.style.top = colorBarY + "px";
  }
  if (toolBarSpace >= 2 && toolBarTotalH > spaceHeight) {
    const sub = toolBarTotalH - spaceHeight;

    toolBarY -= sub;
    toolBar.style.top = toolBarY + "px";
  }

  canvasPanelMoveLimit();
}

//pixel perfect
// if (len > 2 && i > 0 && i+1 < len
// && (pp[i-1].x == px || pp[i-1].y == py)
// && (pp[i+1].x == px || pp[i+1].y == py)
// && pp[i-1].x != pp[i+1].x
// && pp[i-1].y != pp[i+1].y)
// {
//   continue;
// }

//init set

doc.getElementById("body").onload = function () {
  canvasPanel2.style.width = canvasWidth + "px";
  canvasPanel2.style.height = canvasHeight + "px";
  canvas1.height = canvasHeight; //그려주는 캔버스
  canvas2.height = canvasMaxHeight; //최종 뿌려주는 캔버스
  canvas4.height = canvasMaxHeight;

  //컬러모드 버튼 색깔 초기값
  changeColorBGButton(penColor);
  //펜타입 초기화
  penTypeRoundBox.style.border = "1px solid #0A246A";
  penTypeSquareBox.style.border = "1px solid transparent";
  // //양옆사이즈는 가변이라서 처음에 수동으로 먼저 정해줌
  space2.style.height = canvasHeight + "px";
  space3.style.height = canvasHeight + "px";

  //god윈도우 초기 위치
  godX = window.innerWidth / 2 - god.offsetWidth / 2;
  godY = 50;
  // god.style.transform =
  //   "translate(" + (godX >> 0) + "px," + (godY >> 0) + "px)";
    setGodPosition();
  lastInnerWidth = window.innerWidth;

  //펜사이즈 보여지는거 설정
  for (let i = 0, len = penSizeShapeArray.length; i < len; ++i) {
    const ele1 = penSizeShapeArray[i];
    let viewsize = penSizePreviewRound[i];

    ele1.style.width = viewsize + "px";
    ele1.style.height = viewsize + "px";
  }

  const tempbox = doc.createDocumentFragment();

  for (let i = 0, len = desktopColorset.length; i < len; ++i) {
    let newColor = doc.createElement("div");

    newColor.classList.add("desktopColorBox");
    newColor.style.backgroundColor = desktopColorset[i];

    tempbox.appendChild(newColor);
  }

  doc.getElementById("desktopColorPicker").appendChild(tempbox);
  if (isChrome || isFirefox) {
    const savedDeskTopColor = localStorage.getItem("desktopColor");
    if (savedDeskTopColor) setDesktopColor(savedDeskTopColor);
  }

  addCustomColorZIndex();
  zoomCanvas(zoomed);
  addUndo(); //빈 캔버스 하나 등록해줌
  checkCanvasSize();
  checkToolPosition(); //처음에 툴 위치 체크해줌
  penSizeCursorSelect(penSizeIndex); //처음에 펜
  tool2CursorSelect("penButton3");
  checkGodPosition();
  checkGodWidth();

  //파일 이름 길이 설정 clone을 거쳐서 width를 구하는 방식임
  titleFileNameClone.textContent = titleFileName.value;
  titleFileName.style.width = (titleFileNameClone.offsetWidth) + "px";
}

//event 시작
doc.addEventListener("pointerdown", function (e) {

  if (e.button !== 0) return false;  //좌클릭으로 시작하지 않으면 무시
  else if (aboutON === true) {
    //소리 재생 안끝나거나, 링크 클릭하면 off하지 않음
    if (e.target.id === "c301") return;
    aboutOFF();
    return;
  }

  const target = e.target || e.srcElement;
  const targetID = target.id;
  const className = target.classList;

  doc.addEventListener("pointermove", pointerMoveFunc);

  if (className.contains("titleClick") && fileNameON === false) {
    pointerDownFlag = 1;
  }
  else if (activeFileMenuEnt !== null) {
    //submenu
    if (className.contains("saveButton")) {
      saveData(false);
    } else if (className.contains("saveReplayImageButton")) {
      //리플레이 모드에서 현재 프레임 이미지를 저장함
      saveReplayCurrentImage();
    }

    else if (className.contains("loadButton")) {
      loadFileFlag = 0;
      // loadButtonInput.setAttribute("accept", ".jpeg,.jpg,.png,.bmp,.gif");
      loadButtonInput.click();
      return;
    } 
    else if (targetID === "loadButtonInput") {
      loadFileFlag = 0;
      return;
    }
    
    else if (className.contains("resetButton")) {
      clearAll();
    }

    topmenuON = false;
    activeFileMenuEnt.style.display = "none";
    activeFileMenuEnt = null;

    return;
  }
  else if (targetID === "menuFile" && topmenuON == false) {
    topmenuON = true;

    if (activeFileMenuEnt === null) {
      const child = target.firstElementChild;

      activeFileMenuEnt = child;
      child.style.display = "block";
    }

    return;

  } else if (targetID === "menuTimer") {

    if (timerON === false) {
      timerON = true;
      timerText.style.display = "block";
      timerText.textContent = "00:00:00";
      doc.addEventListener("pointerdown", timerStartFunc);

    } else if (timerON === true) {
      timerON = false;
      timerStartON = false;
      timeCount = 0;
      timerText.style.display = "none";
      doc.removeEventListener("pointerdown", timerStartFunc);
      clearTimeout(timerNextTimer);
    }
    return;
  } else if (targetID === "menuAbout") {
    const aboutPanel = doc.getElementById("aboutPanel");
    const aboutImg = doc.getElementById("aboutImg");
    const titleBar = doc.getElementById("titleText");
    startupSound.play();
    aboutON = true;
    helpON = false;
    helpPanel.style.display = "none";
    //helppanel꺼주고 위치 구해야함
    aboutPanel.style.display = "block";
    titleBar.classList.add("aboutLoading");
    chCanvasPreview(390); //about이미지랑 높이 같게함
    toolBar.style.top = "0px";
    colorBar.style.top = "0px";

    aboutWaitTimer = setInterval(function () {
      if (startupSound.currentTime > 1.2) {
        clearInterval(aboutWaitTimer);
        aboutImg.style.transform = "scale(3)";
        canvasPanel.style.transition = "1.85s"
        chCanvasPreview(canvasMaxHeight);
      }
    }, 100);

    return;
  } else if (targetID === "menuHelp" || targetID === "iconSomething") {
    helpON = !helpON;

    if (helpON === true) {
      helpPanel.style.display = "block";
    } else if (helpON === false) {
      helpPanel.style.display = "none";
    }
    return;
  } else if (className.contains("drawin98Click")) {
    if (god.style.display === "none") {
      god.style.display = "block";
      checkGodPosition();
    }
    else {
      themeON = false;
      doc.getElementById("desktopColorPanel").style.display = "none";
      god.style.display = "none";
      rePlayPause();
    }
  } else if (className.contains("themeClick")) {
    themeON = true;
    const panel = doc.getElementById("desktopColorPanel");

    panel.style.display = "block";
    panel.style.left = (window.innerWidth / 2 - panel.offsetWidth / 2) + "px";
    panel.style.top = (window.innerHeight / 2 - panel.offsetHeight / 2) + "px";
    return;
  } else if (className.contains("desktopColorBox")) {
    setDesktopColor(target.style.backgroundColor);
    return;
  } else if (themeON === true && !(targetID === "desktopColorPicker" || targetID === "desktopColorPanel" || className.contains("desktopColorBox"))) {
    themeON = false;
    doc.getElementById("desktopColorPanel").style.display = "none";
    return;
  }

  if (mainTool === 9 && targetID === "zoominBox") {
    zoomIn();
  }
  else if (targetID === "canvas1" || targetID === "canvasPanel") {

    if (mainTool === 5) {
      //스포이드
      const getpos = getCanvasCursorPos(e);
      const x = getpos.x;
      const y = getpos.y;
      const fx = x >> 0;
      const fy = y >> 0;
      canvasClicked = true;
      spuitLastX = fx;
      spuitLastY = fy;
      spuitSlowMoveX = fx;
      spuitSlowMoveY = fy;
      spuitZoom(fx, fy);
    } else if (mainTool === 6) {
      canvasClicked = true;
      handMoveClickX = e.pageX;
      handMoveClickY = e.pageY;
      // handMoveX = canvasPanel2.offsetLeft;
      // handMoveY = canvasPanel2.offsetTop;
    } else if (mainTool === 7) {
      canvasClicked = true;
      if (imageMoveON === false) imageMoveON = true;
      imageMoveClicked = true;
      imageMoveX = 0;
      imageMoveY = 0;
      c1.save();
      c1.globalAlpha = 1;
      c1.globalCompositeOperation = "copy";
      c1.translate(imageMoveX, imageMoveY);
      c1.drawImage(canvas2, 0, 0);
      c1.restore();
      canvas2.style.opacity = "0";
    }
    else {
      const getpos = getCanvasCursorPos(e);
      const x = getpos.x;
      const y = getpos.y;

      mouseMoveUsed = false;
      canvasClicked = true;
      hasCanvasClicked = true;
      c1.beginPath();
      c1.lineWidth = (mainTool === 4) ?
        (eraseSizeIndex === 0) ? 1.01 : eraseSize
        : (penSizeIndex === 0) ? 1.01 : penSize;
      c1.lineCap = (mainTool === 4) ? eraseCapType : penCapType;
      c1.lineJoin = penJoinType;
      c1.strokeStyle = (mainTool === 4) ? "#FFFFFF" : penColor;

      if (colorModeON === true && mainTool !== 4) c1.globalAlpha = 0.5;
      else c1.globalAlpha = 1.0;

      if (mainTool === 3 || mainTool === 4) { //down1
        // pen erase tool
        const index = (mainTool === 3) ? penSizeIndex : eraseSizeIndex;
        const odd = penSizeOddFlag[index];
        const xx = odd === 1 ? x : x + 0.5;
        const yy = odd === 1 ? y : y + 0.5;
        penSmoothX = xx;
        penSmoothY = yy;
        c1.moveTo(xx, yy);
      } else if (mainTool === 2) {
        //line tool
        const odd = penSizeOddFlag[penSizeIndex];
        const xx = odd === 1 ? x : x + 0.5;
        const yy = odd === 1 ? y : y + 0.5;

        lineStartPos = { x: xx, y: yy };
      }
    }
  } else if (className.contains("mirrorClick")) {
    mirrorCanvas();
  }
  //왼쪽 툴 선택
  else if (mainKey === null && className.contains("tool2Click")) {
    // className.contains("icon2") || className.contains("tool2Button"))

    let toolNumber = NumberFromString(targetID);

    if (toolNumber > 1 && toolNumber !== 8) { //버튼 누르는것만 표시해주는 거
      //zoomout은 해주지 않음
      mainTool = toolNumber;

      if (toolNumber !== 9) zoominBoxSwitch(false);

      if (className.contains("icon2")) {
        tool2CursorSelect(target.parentElement.id);
      } else {
        tool2CursorSelect(target.id);
      }
    }

    switch (toolNumber) {
      case 0:
        undo();
        break;
      case 1:
        redo();
        break;
      case 2:
        penSize = penSizeSet[penSizeIndex];
        penSizeCursorSelect(penSizeIndex);
        changePenType(penCapType);
        printHint("Straight line. (Key : SHIFT)");
        break;
      case 3:
        penSize = penSizeSet[penSizeIndex];
        penSizeCursorSelect(penSizeIndex);
        changePenType(penCapType);
        Tool234Hint();
        break;
      case 4:
        eraseSize = penSizeSet[eraseSizeIndex];
        penSizeCursorSelect(eraseSizeIndex);
        changePenType(eraseCapType);
        printHint("Erase. (Key : D or H)");
        break;
      case 5:
        spuitToolReady();
        printHint("Select color. Drag to move by 1 pixel. (Key : C or N)");
        break;
      case 6:
        printHint("Move canvas. Press zoom-out button to reset canvas position. (Key : SPACEBAR)");
        break;
      case 7:
        canvas1.style.opacity = "1";
        printHint("Move canvas image. If image is outside the canvas, it will be erased. (Key : V or B)");
        break;
      case 9:
        zoominBoxSwitch(true);
        doc.addEventListener("pointermove",zoomBoxMoveFunc);
        break;
      case 8:
        zoomOut();
        printHint("Zoom x" + zoomed + " (Key : S or J)");
        break;
    }

  } //사이즈 선택
  else if (className.contains("penSizeClick")) {
    const index = NumberFromString(targetID);

    //pen,line
    if (mainTool === 3 || mainTool === 2) {
      penSize = penSizeSet[index];
      penSizeIndex = index;
      penSizeCursorSelect(index);
    } //erase
    else if (mainTool === 4) {
      eraseSize = penSizeSet[index];
      eraseSizeIndex = index;
      penSizeCursorSelect(index);
    }
  } //윗쪽 캔버스 조작메뉴 선택
  else if (className.contains("customColor") && customColorAddTimer === null) {
    const cssinfo = getComputedStyle(target);
    const clickColor = cssinfo.getPropertyValue("background-color"); //커스텀이 가지고있는 배경색
    customColorInfo = [target, clickColor];

    //customColor의 부모의 부모가 전체 array임
    customColorAddTimer = setTimeout(function () {
      target.style.backgroundColor = penColor; //오래 누르고 있으면 펜 컬러로 변경
      customColorAddTimer = null;
    }, 500);
  } else if (className.contains("penColorBox")) {
    const bgcolor = target.style.backgroundColor;

    if (penColor === bgcolor) return;
    penColor = bgcolor;
    changeColorBGButton(bgcolor);
  } else if (className.contains("colorModeClick")) {
    changeColorMode();
  } else if (className.contains("penTypeRound")) {
    if (mainTool === 4) eraseCapType = "round";
    else penCapType = "round";
    changePenType("round");
  } else if (className.contains("penTypeSquare")) {
    if (mainTool === 4) eraseCapType = "square";
    else penCapType = "square";
    changePenType("square");
  } else if (className.contains("canvasSize")) {
    canvasPanel.style.borderColor = "#B2B2B2";
    pointerDownFlag = 6;
    changeCanvasSizeON = true;
  } else if (className.contains("colorMoveClick")) {
    pointerDownFlag = 5;
    //양측에 있을때만 Y값 계산함 위아래는 가로만 움직이기 때문에 안해줌
    if (colorBarSpace >= 2 && colorBarFloatON === true) {
      colorBarY = colorBar.offsetTop;
      colorBar.style.top = colorBarY + "px";
    }
    spacePreview();
  } else if (className.contains("toolMoveClick")) {
    pointerDownFlag = 4;
    if (toolBarSpace >= 2 && toolBarFloatON === true) {
      toolBarY = toolBar.offsetTop; //offsetTop이 부모로부터 떨어진거기 때문에 그냥 해줌
      toolBar.style.top = toolBarY + "px";
    }
    spacePreview();
  }

}); //downend

doc.addEventListener("pointerup", function (e) {
  if (aboutON === true) return;
  doc.removeEventListener("pointermove", pointerMoveFunc);
  canvasClicked = false;
  // imageMoveClicked = false;

  switch (pointerDownFlag) {
    case 1: {
      checkGodPosition();
      checkToolPosition();
      break;
    }
    case 4:
    case 5: {
      if (spaceReadyIndex !== null) {
        if (pointerDownFlag === 5) {
          setColorBarSpace(spaceReadyIndex);
        } else {
          setToolSpace(spaceReadyIndex);
        }

        spaceReadyIndex = null;
      }

      spaceReadyCancel();
      checkToolPosition();
      break;
    }
    case 6: {
      chCanvas(canvasPanel.clientHeight);
      changeCanvasSizeON = false;
      checkToolPosition();
      break;
    }
  }
  if (pointerDownFlag !== 0) pointerDownFlag = 0;

  if (customColorAddTimer !== null) {
    const target = e.target || e.srcElement;

    clearTimeout(customColorAddTimer);
    customColorAddTimer = null;

    if (target.classList.contains("customColor")) {
      const color = customColorInfo[1];
      penColor = color;
      changeColorBGButton(color);
    }
  }

  if (mainTool === 7) {
    //7up
    if (imageMoveX !== 0 || imageMoveY !== 0) {
      imageMoveClicked = false;
      canvas1.style.opacity = "1";
      c2.save();
      c2.globalCompositeOperation = "copy";
      c2.drawImage(canvas1, 0, 0);
      c2.restore();
      c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
      addUndo();
      // replayAddMoveData(imageMoveX, imageMoveY, mirrorON, canvasHeight);
      imageMoveX = 0;
      imageMoveY = 0;
    }
    else {
      c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
    }
    canvas2.style.opacity = "";

  } else if (mainTool === 5) {  //스포이드

    const targetID = e.target.id;
    c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
    c1.beginPath();

    //클릭 떼고나면 펜툴로 돌려줌 단축키는 제외
    if(!(targetID === "iconSpuit5" || targetID === "spuitButton5") && !(mainKey === gkey.c || mainKey === gkey.n))
    {
      mainTool = 3;
      penSize = penSizeSet[penSizeIndex];
      penSizeCursorSelect(penSizeIndex);
      tool2CursorSelect(toolNumberArr[3]);
      changePenType(penCapType);
    }
  } else if (mainTool === 6) {
    handMoveX = canvasPanel2.offsetLeft;
    handMoveY = canvasPanel2.offsetTop;
    canvasPanelMoveLimit();
  }
  else if (hasCanvasClicked === true && mainTool <= 4) {
    //up1
    hasCanvasClicked = false;
    const getpos = getCanvasCursorPos(e);
    const index = (mainTool === 4) ? eraseSizeIndex : penSizeIndex;
    const odd = penSizeOddFlag[index];
    const xx = odd === 1 ? getpos.x : getpos.x + 0.5;
    const yy = odd === 1 ? getpos.y : getpos.y + 0.5;

    if (mouseMoveUsed === false) {
      c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
      drawDot(c1, xx, yy, c1.lineCap, c1.lineWidth, c1.strokeStyle);
      if (mainTool === 4) {
        c2.save();
        c2.globalCompositeOperation = "destination-out";
        c2.drawImage(canvas1, 0, 0);
        c2.restore();
      }
      else {
        c2.drawImage(canvas1, 0, 0);
      }

      c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
      c1.beginPath();
      addUndo();
    }
    else {
      switch (mainTool) {
        case 2: {
          //직선긋기
          c1.beginPath();
          c1.moveTo(lineStartPos.x, lineStartPos.y);
          c1.lineTo(xx, yy);
          c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
          c1.stroke();
          c2.drawImage(canvas1, 0, 0);
          c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
          addUndo();
          lineStartPos = null;
          break;
        }

        case 3: {
          clearInterval(penSmoothingTimer);
          c1.lineTo(xx, yy);
          c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
          c1.stroke();
          c2.drawImage(canvas1, 0, 0);
          c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
          addUndo();
          break;
        }

        case 4: {
          c1.lineTo(xx, yy);
          c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
          c1.stroke();
          c2.save();
          c2.globalCompositeOperation = "destination-out";
          c2.drawImage(canvas1, 0, 0);
          c2.restore();
          c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
          addUndo();
          break;
        }
      }
    }

  }
  //단축키를 먼저 떼고 마우스를 올렸을때
  if (afterPenReturnON === true) {
    afterPenReturnON = false;
    if (mainTool === 5) c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
    mainTool = 3;
    penSize = penSizeSet[penSizeIndex];
    penSizeCursorSelect(penSizeIndex);
    tool2CursorSelect(toolNumberArr[3]);
    changePenType(penCapType)
    mainKey = null;
    subKey = null;
  }
  hasCanvasClicked = false;
  mouseMoveUsed = false;
});

doc.addEventListener("pointerover", function (e) {
  if (pointerDownFlag === 5 || aboutON === true || mainKey !== null) return;

  const target = e.target || e.srcElement;
  const className = target.classList;
  const targetID = target.id;

  if (topmenuON === true) {
    if (className.contains("saveButton")) {
      printHint("Save image as *.png file. (Key : CTRL+S)");
    }
    else if (className.contains("loadButton")) {
      printHint("load image.");
    } else if (className.contains("resetButton")) {
      printHint("Click to clear canvas (Key : ESC)");
    }

    return;
  }

  if (targetID === "canvas1" && mainTool <= 4) {
    // printHint("");
    Tool234Hint(false);
  }

  if (targetID === "tiny") {
    printHint("Click to use tiny cursor in canvas.");
  } else if (targetID === "recordinglimitBar") {
    const rate = ((rDataCounter / rDataLimit) * 100).toFixed(1);
    printHint(
      "Current recording progress " +
      rate +
      "%. If it is 100%, will save and re-recording"
    );
  } else if (className.contains("canvasSize") && changeCanvasSizeON === false) {
    printHint("Drag to change canvas size.");
  } else if (className.contains("colorModeClick")) {
    printHint("Click to toggle between 50% - 100% opacity (Key : E or Y)");
  } else if (className.contains("penSizeBox")) {
    const size = penSizeSet[NumberFromString(targetID)];
    const type = (mainTool === 3) ? "Pen" :
      (mainTool === 4) ? "Erase" : "Line";
    printHint(type + " size : " + size + "px (Key : F or G)");
  } else if (className.contains("penTypeClick")) {
    printHint("Line shape. (Key : Q or I)");
  } else if (className.contains("grabBox")) {
    printHint("Click to move.");
  }
  else if (className.contains("penColorBox")) {
    printHint("Click to select color.");
  }
  else if (className.contains("customColor")) {
    printHint("Click to select color. Long-click to add current color.");
  }
});

doc.onkeypress = function (e) {
  if (fileNameON === true) return;
  let charCode = e.keyCode || e.which;
  //1 6키
  if (canvasClicked === false) {
    if (charCode === 32) {
      e.preventDefault();
      return false;
    } else if (charCode === 116) {
      e.preventDefault();
      return false;
    }
    if (charCode === 9 || charCode === 32 || charCode === 112) {
      //tab
      e.preventDefault();
      return false;
    }
  }
};

doc.addEventListener("keydown", function (e) {
  let nowkey = e.keyCode || e.which;
  // console.log("fileNameON",fileNameON);
  if (fileNameON === true) return;
  if (e.ctrlKey) {
    //컨트롤 S단축키 우선
    switch (nowkey) {
      case gkey.s:
        saveData(false);
        e.preventDefault();
        return false;
    }
    e.preventDefault();
    return false;
  } else if (e.shiftKey) {
    //shift키가 직선 긋기도 있어서 return해주면 안됨
    switch (nowkey) {
      case gkey.s:
        saveData(true);
        e.preventDefault();
    }
    e.preventDefault();
  } else if (nowkey === gkey.esc) {
    //리셋
    clearAll();
  }

  if (pointerDownFlag === 4 || pointerDownFlag === 5) return;

  let eraseSubKeyFlag = false; //아랫쪽에도 q가 눌리기 때문에 플래그 줘서 한번만 하게함
  if (mainTool === 4 && subKey === null) {
    if (nowkey === gkey.f) {
      changePenSize(false); //지우개랑 편 변경 키랑 같이 눌렀을때
      subKey = nowkey;
    } else if (nowkey === gkey.g) {
      changePenSize(true);
      subKey = nowkey;
    }
    else if (nowkey === gkey.q) {
      eraseSubKeyFlag = true;
      if (eraseCapType === "round") eraseCapType = "square";
      else if (eraseCapType === "square") eraseCapType = "round";
      changePenType(eraseCapType);
      subKey = nowkey;
    }
  }

  //캔버스가 클릭되어있는 동안 또는 같은키가 눌리고 있을때 //alt는 원인불명으로 왜눌리는지 모르겠음
  if (canvasClicked === true || mainKey !== null) {
    return;
  }
  if (nowkey !== gkey.w || nowkey !== gkey.u) zoominBoxSwitch(false);

  switch (nowkey) {
    case gkey.f:
      mainKey = nowkey;
      changePenSize(false);
      break;
    case gkey.g:
      mainKey = nowkey;
      changePenSize(true);
      break;

    case gkey.q:
    case gkey.i:
      {
        if (eraseSubKeyFlag === false) {
          mainKey = nowkey;

          if (mainTool === 4) {
            if (eraseCapType === "square") eraseCapType = "round";
            else if (eraseCapType === "round") eraseCapType = "square";
            changePenType(eraseCapType);
          }
          else {
            if (penCapType === "square") penCapType = "round";
            else if (penCapType === "round") penCapType = "square";
            changePenType(penCapType);
          }
        }

        break;
      }
    case gkey.e:
    case gkey.y:
      mainKey = nowkey;
      changeColorMode();
      break;

    case gkey.a:
    case gkey.k:
      mainKey = nowkey;
      mirrorCanvas();
      break;

    case gkey.z:
    case gkey.comma:
      mainKey = nowkey;
      undo();
      tool2Array.undoButton0.classList.add("tool2ButtonON");
      break;

    case gkey.x:
    case gkey.m:
      mainKey = nowkey;
      redo();
      tool2Array.redoButton1.classList.add("tool2ButtonON");
      break;

    case gkey.shift:
      mainKey = nowkey;
      mainTool = 2; //linetool
      penSize = penSizeSet[penSizeIndex];
      Tool234Hint(false);
      penSizeCursorSelect(penSizeIndex);
      tool2CursorSelect(toolNumberArr[2]);
      changePenType(penCapType)
      break;

    case gkey.d:
    case gkey.h:
      mainKey = nowkey;
      mainTool = 4;
      penSize = penSizeSet[eraseSizeIndex];
      Tool234Hint(false);
      penSizeCursorSelect(eraseSizeIndex);
      tool2CursorSelect(toolNumberArr[4]);
      changePenType(eraseCapType)
      break;

    case gkey.v: //move tool
    case gkey.b:
      mainKey = nowkey;
      mainTool = 7;
      tool2CursorSelect(toolNumberArr[7]);
      printHint(
        "Move canvas image. If image is outside the canvas, it will be erased."
      );
      break;

    case gkey.c:
    case gkey.n:
      mainKey = nowkey;
      spuitToolReady();
      mainTool = 5;
      tool2CursorSelect(toolNumberArr[5]);
      printHint("Select color. Click+Drag to moving by 1 pixel.");
      break;
    case gkey.space:
      mainKey = nowkey;
      mainTool = 6;
      handMoveX = canvasPanel2.offsetLeft;
      handMoveY = canvasPanel2.offsetTop;
      tool2CursorSelect(toolNumberArr[6]);
      printHint("Move canvas. Press zoom-out button to reset canvas position.");
      break;
    case gkey.w:
    case gkey.u:
      mainKey = nowkey;
      mainTool = 9;
      tool2CursorSelect(toolNumberArr[9]);
      zoominBoxSwitch(true);
      doc.addEventListener("pointermove",zoomBoxMoveFunc);
      break;
    case gkey.s:
    case gkey.j:
      mainKey = nowkey;
      tool2CursorSelect(toolNumberArr[8]);
      zoomOut();
      break;
  }
});

doc.addEventListener("keyup", function (e) {
  if (pointerDownFlag === 5) {
    return;
  }

  const nowkey = e.keyCode || e.which;

  //지우개 크기키부터 체크해줌
  if (subKey !== null && (nowkey === gkey.f || nowkey === gkey.g || nowkey === gkey.q)) {
    subKey = null;
    // return; //지우개+크기조절키는 제외
  }

  if (canvasClicked === true && mainTool !== 3 && nowkey === mainKey) {
    if (afterPenReturnON === false) {
      afterPenReturnON = true;
    }
    return;
  }

  if (nowkey !== mainKey) {
    //메인키가 이미 눌려있는데 다른키가 눌렀다 떨어지면 그냥 리턴
    return;
  } else if (nowkey === mainKey) {
    mainKey = null;
  }
  if (nowkey === gkey.w || nowkey === gkey.u) {
    zoominBoxSwitch(false);
  }

  if (
    nowkey === gkey.z || //언두 리두키는 그냥 껍데기만 껐다 켰다 해줌
    nowkey === gkey.comma
  ) {
    tool2Array.undoButton0.classList.remove("tool2ButtonON");
  } else if (nowkey === gkey.x || nowkey === gkey.m) {
    tool2Array.redoButton1.classList.remove("tool2ButtonON");
  }

  switch (nowkey) //이거 뭔가 비효율적아님?
  {
    case gkey.s:
    case gkey.j:
    case gkey.w:
    case gkey.u:
    case gkey.d:
    case gkey.h:
    case gkey.n:
    case gkey.c:
    case gkey.v:
    case gkey.b:
    case gkey.space:
    case gkey.shift:
      if (mainTool === 5) c1.clearRect(0, 0, canvasWidth, canvasMaxHeight);
      mainTool = 3;
      penSize = penSizeSet[penSizeIndex];
      penSizeCursorSelect(penSizeIndex);
      tool2CursorSelect(toolNumberArr[3]);
      changePenType(penCapType);

      break;
  }
});

loadButtonInput.onchange = function () {
  const file = loadButtonInput.files[0];
  const fr = new FileReader();

  topmenuON = false;
  activeFileMenuEnt.style.display = "none";
  activeFileMenuEnt = null;

  console.log("")
  fr.onload = fileLoad;
  fr.readAsDataURL(file);
};

//scroll이벤트가 많기 때문에 타이머 걸어서 0.1초 단위로 업뎃해줌
doc.addEventListener("wheel", function () {
  clearTimeout(tool1CheckDelayTimer);
  tool1CheckDelayTimer = setTimeout(function () {
    checkGodPosition();
    checkToolPosition();
  }, 150);
});
window.addEventListener("scroll", function () {
  clearTimeout(tool1CheckDelayTimer);
  tool1CheckDelayTimer = setTimeout(function () {
    checkGodPosition();
    checkToolPosition();
  }, 150);
});

window.addEventListener("resize", function () {
  clearTimeout(tool1CheckDelayTimer);
  tool1CheckDelayTimer = setTimeout(function () {
    checkToolPosition();
    checkGodPosition();
    //가로크기만 변경됐을때
    if (window.innerWidth !== lastInnerWidth) {
      lastInnerWidth = window.innerWidth;
      godX = window.innerWidth / 2 - god.offsetWidth / 2;
      setGodPosition();
      // god.style.transform =
      //   "translate(" + (godX >> 0) + "px," + (godY >> 0) + "px)";
    }

  }, 150);
});

//파폭등에서 드래그 되는거 막음
window.ondragstart = function () {
  if (fileNameON === false)
    return false;
};

tiny.onclick = function () {
  tinyFlag = !tinyFlag;

  if (tinyFlag === true) {
    canvas1.classList.add("tinyCursorON");
    canvasPanel.classList.add("tinyCursorON");
    tiny.style.opacity = "1";
  } else if (tinyFlag === false) {
    canvas1.classList.remove("tinyCursorON");
    canvasPanel.classList.remove("tinyCursorON");

    tiny.style.opacity = "0.45";
  }
};

//파일 이름 변경관련 이벤트들
titleFileName.addEventListener("click", function (e) {
  if (fileNameON === false) {
    fileNameON = true;
    e.target.setSelectionRange(0, e.target.value.length);
    doc.addEventListener("pointerdown", checkTitleFocus);
  }
})

titleFileName.addEventListener("change", function (e) {
  if (titleFileName.offsetWidth < 20) titleFileName.style.width = "10px";
  if (!e.target.value || e.target.value === "") titleFileName.value = "Untitled";
  titleFileNameClone.textContent = titleFileName.value;

  let width = titleFileNameClone.offsetWidth;
  if (width < 10) width = 10;
  else if (width > 300) width = 300;

  titleFileName.style.width = width + "px";
  e.target.blur();
  fileNameON = false;
})
titleFileName.addEventListener("input", function () {
  titleFileNameClone.selectionStart = titleFileName.value.length;
  titleFileNameClone.textContent = titleFileName.value;
  let width = titleFileNameClone.offsetWidth;
  if (width < 20) width = 20;
  else if (width > 300) width = 300;

  titleFileName.style.width = width + "px";
})

startupSound.onended = function ()//about 사운드 끝나면 다시 원복해줌
{
  doc.getElementById("aboutImg").style.transform = "";
  chCanvasPreview(390);
}

window.onbeforeunload = function () {
  return "quit?";
};