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

/* 獲取畫布和畫框元素 */

var currentFrame = null;

/* 畫布功能 */
function showCanvas(frame) {
    currentFrame = frame;
    var cc = document.getElementById("canvasContainer");
    var or = document.getElementById("overlay");
    var width = frame.getAttribute("data-width");
    var height = frame.getAttribute("data-height");
    var canvas = document.getElementById("canvas");
    var clean =document.getElementById("cleanButton");
    var ctx = canvas.getContext("2d");

    // 畫布繪製邏輯
    function setCanvasSize() {
        var containerWidth = document.documentElement.clientWidth;
        var containerHeight = document.documentElement.clientHeight;

        // 根據畫框的比例計算畫布的寬度和高度
        var canvasWidth = (parseFloat(width) / 100) *2*containerWidth;
        var canvasHeight = (parseFloat(height) / 100) *2* containerHeight;

        // 設置畫布大小
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // 確保畫布容器居中顯示
        // cc.style.top = (containerHeight - canvasHeight) / 2 + "px";
        // cc.style.left = (containerWidth - canvasWidth) / 2 + "px";
    }

    // 初始設置畫布大小
    setCanvasSize();

        // 如果 frame 有背景圖片，載入到畫布上
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

    // 重新啟動動畫
    setTimeout(function() {
        // 這裡重新設置 CSS 動畫來觸發縮放
        cc.style.transform = "translate(-50%, -50%) scale(0)"; // 重置到縮小狀態
        canvas.style.transform = "scale(0)"; // 重置畫布為縮小狀態

        // 使用 setTimeout 延遲觸發動畫，確保動畫能夠重新開始
        setTimeout(function() {
            cc.style.transform = "translate(-50%, -50%) scale(1)"; // 動畫放大
            canvas.style.transform = "scale(1)"; // 動畫放大
        }, 50); // 延遲一點時間，確保動畫可以重新觸發
    }, 10); // 延遲觸發動畫

    // 畫筆設置
    var ctx = canvas.getContext("2d");
    var painting = false;

    // 設置畫筆顏色和粗細
    ctx.strokeStyle = "black"; // 畫筆顏色
    ctx.lineWidth = 5; // 畫筆粗細
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

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // 事件監聽器
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);

    // 點擊遮罩層時隱藏畫布容器和遮罩層
    or.addEventListener("click", function() {
        cc.style.display = "none";
        or.style.display = "none";
    });

    clean.addEventListener("click", function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    window.addEventListener("resize", function() {
        cc.style.display = "none";
        or.style.display = "none";
    });
}

/*上傳畫布!!!!!!*/
function uploadCanvas(){
    var canvas = document.getElementById("canvas");
    var frame= document.querySelector(".frame[data-width='17.5%']");
    var ctx = canvas.getContext("2d");

    //畫布 TO 圖片
    var imgData=canvas.toDataURL("image/png");

    //LocalStroage 上傳資料
    localStorage.setItem("canvasImage",imgData);

    //將圖片顯示到對應的frame上
    if (currentFrame) {
        currentFrame.style.backgroundImage = "url('" + imgData + "')";
        currentFrame.style.backgroundSize = "100% 100%";
    }
    document.getElementById("canvasContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

//全部清空
function clearall()
{
    var blast=document.getElementById("blast");
    blast.src = ""; // 清空 src，觸發重新載入
    setTimeout(() => {
        blast.src = "../image/blast.gif"; // 設定新的 GIF 路徑
    }, 10); // 短暫延遲，確保重新載入生效
    blast.style.display="block";
    setTimeout(function () {
        blast.style.display = "none";
    }, 4500)
}
