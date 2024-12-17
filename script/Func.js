/*fadeout*/
function fadeout(objid) {
    const obj = document.getElementById(objid);
    obj.classList.add("fadeout");
}
function jump(event,url,time) {
    event.preventDefault();
    document.body.classList.add("fadeout")
    setTimeout(() => {
        window.location.href = url
    }, time);
}

/*bg blur*/
function bgblur(bgid) {
    const bg = document.getElementById(bgid);
    bg.classList.add("blur")
}

function unblur(bgid) {
    const bg = document.getElementById(bgid);
    bg.classList.remove("blur");
    bg.classList.add("noblur");
}
//更改滑鼠指標
function Cursor(type) {
    const cursorStyles = {
        default: "auto",
        marker: "url('image/marker-icon.png') 16 16, auto",
        eraser: "url('image/eraser-icon.png') 16 16, auto",
        brush: "url('image/brush-icon.png') 16 16, auto"
    };

    document.body.style.cursor = cursorStyles[type] || cursorStyles.default;
}

//自動獲取frame元素
window.onload = function () {
    var frames = document.querySelectorAll('.frame');
    frames.forEach(function (frame) {
        var index = frame.dataset.index;  // 獲取每個 frame 的唯一標識符
        var savedImage = localStorage.getItem("canvasImage_" + index);  // 從 localStorage 讀取圖片

        if (savedImage) {
            frame.style.backgroundImage = "url('" + savedImage + "')";
            frame.style.backgroundSize = "100% 100%";
        }
    });
};

/* 獲取畫布和畫框元素 */
//給定每個畫框一個變數
var currentFrame = null;

/* 畫布功能 */
// 畫布功能
var currentTool = "pencil";  // 預設工具為鉛筆
var currentColor = "#000000";  // 預設顏色為黑色
var currentLineWidth = 5;  // 預設粗細為5

// 更新鉛筆顏色和粗細
function updatePencilSettings() {
    currentColor = document.getElementById("colorPicker").value;  
    currentLineWidth = document.getElementById("lineWidth").value;  
    selectTool(currentTool);
}

// 選擇工具時更新畫筆設置
function selectTool(tool) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    currentTool = tool;

    if (tool === "pencil") {
        // 設定鉛筆工具的顏色和粗細
        ctx.strokeStyle = currentColor;  // 設定鉛筆顏色
        ctx.lineWidth = currentLineWidth;  // 設定鉛筆粗細
        Cursor("marker");

        // 停止刷子工具的點擊事件
        canvas.removeEventListener("click", fillCanvas);

    } else if (tool === "eraser") {
        // 設定橡皮擦工具的顏色和粗細
        ctx.strokeStyle = "white";  // 橡皮擦的顏色設為白色
        ctx.lineWidth = 20;  // 橡皮擦較大
        Cursor("eraser");

        // 停止刷子工具的點擊事件
        canvas.removeEventListener("click", fillCanvas);

    } else if (tool === "brush") {
        // 設定刷子工具的顏色
        ctx.fillStyle = currentColor;  // 設定刷子顏色
        Cursor("brush");

        // 當選擇刷子工具時，監聽點擊事件
        canvas.addEventListener("click", fillCanvas);
    }
}

// 點擊畫布後填充背景
function fillCanvas(event) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // 填充整個畫布
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 點擊後只填充一次，移除點擊事件
    canvas.removeEventListener("click", fillCanvas);
}

// 顯示畫布並設定大小
function showCanvas(frame) {
    var cc = document.getElementById("canvasContainer");
    var or = document.getElementById("overlay");
    var tb = document.getElementById("toolbox");
    var width = frame.getAttribute("data-width");
    var height = frame.getAttribute("data-height");
    var canvas = document.getElementById("canvas");
    var clean = document.getElementById("cleanButton");
    var ctx = canvas.getContext("2d");

    currentFrame = frame;

    // 設定畫布大小
    function setCanvasSize() {
        Cursor("marker");
        var containerWidth = document.documentElement.clientWidth;
        var containerHeight = document.documentElement.clientHeight;

        // 根據畫框的比例計算畫布的寬度和高度
        var canvasWidth = (parseFloat(width) / 100) * 1.5 * containerWidth;
        var canvasHeight = (parseFloat(height) / 100) * 1.5 * containerHeight;

        // 設置畫布大小
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    setCanvasSize();

    // 顯示背景圖像
    var backgroundImage = frame.style.backgroundImage;
    if (backgroundImage && backgroundImage.startsWith("url")) {
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = backgroundImage.slice(5, -2); // 移除 `url("")` 的包裹部分
    }

    // 顯示畫布容器和遮罩層
    cc.style.display = "block";
    or.style.display = "block";
    tb.classList.add("show");

    // 畫筆設置
    var ctx = canvas.getContext("2d");
    var painting = false;

    // 設置畫筆顏色和粗細
    ctx.strokeStyle = currentColor; // 使用當前顏色
    ctx.lineWidth = currentLineWidth; // 使用當前粗細
    ctx.lineCap = "round"; // 圓角筆觸

    // 開始繪畫
    function startPosition(e) {
        painting = true;
        draw(e);
    }

    // 停止繪畫
    function endPosition() {
        painting = false;
        ctx.beginPath(); // 結束當前路徑
    }

    // 畫線
    function draw(e) {
        if (!painting) return;

        // 取得畫布的相對坐標
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        if (currentTool === "eraser") {
            // 橡皮擦功能：清除畫布上的區域
            ctx.clearRect(x - ctx.lineWidth / 2, y - ctx.lineWidth / 2, ctx.lineWidth, ctx.lineWidth);
        } else {
            // 繪製線條
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    }

    // 事件監聽器
    canvas.addEventListener("mousedown", function (e) {
        if (currentTool === 'pencil' || currentTool === 'eraser') {
            startPosition(e);
        }
    });

    canvas.addEventListener("mousemove", function (e) {
        if (currentTool === 'pencil' || currentTool === 'eraser') {
            draw(e);
        }
    });

    canvas.addEventListener("mouseup", function (e) {
        if (currentTool === 'pencil' || currentTool === 'eraser') {
            endPosition(e);
        }
    });

    canvas.addEventListener("click", function (e) {
        if (currentTool === 'brush') {
            fillCanvas(e);
        }
    });

    // 當選擇工具時，更新 currentTool
    document.getElementById("pencilTool").addEventListener("click", function () {
        currentTool = 'pencil'; // 設置為鉛筆工具
    });

    document.getElementById("eraserTool").addEventListener("click", function () {
        currentTool = 'eraser'; // 設置為橡皮擦工具
    });

    document.getElementById("brushTool").addEventListener("click", function () {
        currentTool = 'brush'; // 設置為刷子工具
    });

    // 點擊遮罩層時隱藏畫布容器和遮罩層
    or.addEventListener("click", function () {
        cc.style.display = "none";
        or.style.display = "none";
        Cursor("auto");
        tb.classList.remove("show");
    });

    clean.addEventListener("click", function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    window.addEventListener("resize", function () {
        cc.style.display = "none";
        or.style.display = "none";
        Cursor("auto");
        tb.classList.remove("show");
    });

    selectTool("pencil");
}
/*上傳畫布!!!!!!*/
function uploadCanvas(){
    var canvas = document.getElementById("canvas");
    var frame= document.querySelector(".frame[data-width='17.5%']");
    var ctx = canvas.getContext("2d");

    //畫布 TO 圖片
    var imgData=canvas.toDataURL("image/png");

    //LocalStroage 上傳資料
    localStorage.setItem("canvasImage_" + currentFrame.dataset.index, imgData);

    //將圖片顯示到對應的frame上
    if (currentFrame) {
        currentFrame.style.backgroundImage = "url('" + imgData + "')";
        currentFrame.style.backgroundSize = "100% 100%";
    }
    document.getElementById("canvasContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    Cursor("auto");
    document.getElementById("toolbox").classList.remove("show");

}


//確定要開炸嗎??
function confirmClear() {

    var isConfirmed = window.confirm("你確定要刪除所有畫布?");

    // 確定>>>>執行 clearall() 函數
    if (isConfirmed) {
        clearall();
    }
}

//藝術就是爆炸!!!!!!!!!!!
function clearall()
{
    // 清空 src，讓gif重新生成
    var blast = document.getElementById("blast");
    blast.src = ""; 
    setTimeout(() => {
        blast.src = "image/blast.gif";
    }, 10);
    blast.style.display = "block";

    setTimeout(function () {
        var frames = document.querySelectorAll('.frame');
        frames.forEach(function (frame) {
            frame.style.backgroundImage = '';
            localStorage.removeItem("canvasImage_" + frame.dataset.index);
        });
    }, 3500); 
    setTimeout(function () {
        blast.style.display = "none";
    }, 4500)
}

function exportCanvas() {
    const canvas = document.getElementById("canvas"); 
    const dataURL = canvas.toDataURL("image/PNG"); 
    const ctx = canvas.getContext("2d");

    const now = new Date();
    const timestamp = now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0') +
        now.getMilliseconds().toString().padStart(3, '0');


    // 創建一個下載鏈接
    const link = document.createElement("a");
    link.href = dataURL;  // 設置下載鏈接的 href 為畫布的 PNG 數據 URL
    link.download = "canva"+timestamp+".PNG"// 設定下載的文件名
    link.click();  // 觸發點擊事件，開始下載
}
//下載畫布資料
function cap() {
    html2canvas(document.querySelector("#capture"), {
        allowTaint: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: window.innerWidth,
        height: window.innerHeight,
    }).then(canvas => {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "test.png";
        link.click();
    });
}





