//fadeout
function fadeout(objid) {
    const obj = document.getElementById(objid);
    obj.classList.add("fadeout");
}
function jump(event,url,time) {
    event.preventDefault();
    document.body.classList.add('fadeout')
    setTimeout(() => {
        window.location.href = url
    }, time);
}

//bg blur
function bgblur(bgid) {
    const bg = document.getElementById(bgid);
    bg.classList.add("blur")
}

function unblur(bgid) {
    const bg = document.getElementById(bgid);
    bg.classList.remove("blur");
    bg.classList.add("noblur");
}

// 獲取畫布和畫框元素
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearButton");
const uploadButton = document.getElementById("uploadButton");

// 設置畫布大小
canvas.width = document.getElementById("frame").offsetWidth;
canvas.height = document.getElementById("frame").offsetHeight;

// 畫筆設置
let painting = false;
let lastX = 0;
let lastY = 0;
let brushSize = 5;
let brushColor = "black";

// 開始繪畫
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopPainting);
canvas.addEventListener("mouseout", stopPainting);

// 開始繪畫
function startPainting(e) {
    painting = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// 停止繪畫
function stopPainting() {
    painting = false;
}

// 繪畫
function draw(e) {
    if (!painting) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.lineCap = "round";
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// 清空畫布
clearButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 上傳畫布
uploadButton.addEventListener("click", function () {
    const image = canvas.toDataURL(); // 將畫布轉換為圖片格式
    const imgElement = document.createElement("img");
    imgElement.src = image;
    document.body.appendChild(imgElement); // 把上傳的圖片顯示到頁面上
});