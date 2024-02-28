window.addEventListener("DOMContentLoaded", ()=>{
    const canvas = document.getElementById("output");
    const ctx = canvas.getContext("2d");
    function draw(image){
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(()=>{draw(image)});
    }
    
    window.addEventListener("message", (event)=>{
        if (event.origin !== "https://develop.kimigamiru.pages.dev") return;
        if (event.data.action == "draw"){
            console.log("message", event.data);
            let image = window.opener.document.getElementById(event.data.imageId);
            draw(image);
        }
    })
    
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

    // DOMContentLoaded を親ウィンドウに知らせる
    window.opener.postMessage({action: "DOMContentLoaded"} , "https://develop.kimigamiru.pages.dev");
})