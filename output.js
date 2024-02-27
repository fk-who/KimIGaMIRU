window.addEventListener("DOMContentLoaded", ()=>{
    window.opener.postMessage("DOMContentLoaded", "http://127.0.0.1:5500")
    let output = document.getElementById("output");
    let scale = 1;
    function resize(){
        scale = Math.min(window.innerWidth / output.width, window.innerHeight / output.height);
        output.style.transform = `scale(${scale}, ${scale})`;
    }
    window.addEventListener("resize", resize, false);
    resize();
})