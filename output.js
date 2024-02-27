window.addEventListener("DOMContentLoaded", ()=>{
    // DOMContentLoaded を親ウィンドウに知らせる
    window.opener.postMessage("DOMContentLoaded", "http://127.0.0.1:5500")
    
    // ウィンドウリサイズ時の処理
    let output = document.getElementById("output");
    let scale = 1;
    function resize(){
        scale = Math.min(window.innerWidth / output.width, window.innerHeight / output.height);
        output.style.transform = `scale(${scale}, ${scale})`;
    }
    window.addEventListener("resize", resize, false);
    resize();

    // フルスクリーン表示
    const overlay = document.getElementById("overlay");
    overlay.addEventListener("click", ()=>{
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }   
    });
    document.addEventListener("fullscreenchange",()=>{overlay.classList.add("nodisplay")})
})