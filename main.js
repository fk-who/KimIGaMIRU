console.log("main.js v0.07");

let FILES = 0;
let CNT = [0, 0]; // 連打要素の連打数カウント用

const FORMATS = {
    default: "kimitomiku2023",
    list: {
        kimitomiku2023: {
            is_enable: true,
            display_name: "KimIToMIKU 2023~",
            default_prosce: "formats/kimitomiku2023/prosceniumScreen-safetyZone_2023_KTMcolor.mp4",
            default_main: "formats/kimitomiku2023/mainScreen-safetyZone_2023_KTMcolor.mp4",
            css: "formats/kimitomiku2023/format_kimitomiku2023.css"
        },
        mikunity2023: {
            is_enable: true,
            display_name: "MIKUnity 2023 暫定版",
            default_prosce: "formats/mikunity2023/MIKUnity2023_clearance_prosce.mp4",
            default_main: "formats/kimitomiku2023/mainScreen-safetyZone_2023_KTMcolor.mp4",
            css: "formats/mikunity2023/format_mikunity2023.css"
        },
        mikunity2023_002: {
            is_enable: true,
            display_name: "MIKUnity 2023/10/18修正版",
            default_prosce: "formats/mikunity2023_002/MIKUnity2023_clearance_prosce_003-arrow.mp4", /* 1900x208, 上余白の高さ29px */
            default_main: "formats/mikunity2023_002/MIKUnity2023_clearance_main_002.mp4",
            css: "formats/mikunity2023_002/format_mikunity2023_002.css"
        },
        test: {
            is_enable: false,
            display_name: "test optionテスト",
            default_prosce: "formats/mikunity2023/MIKUnity2023_clearance_prosce.mp4",
            default_main: "formats/kimitomiku2023/mainScreen-safetyZone_2023_KTMcolor.mp4",
            css: "formats/mikunity2023/format_mikunity2023.css"
        },
        cannotchoose: {
            is_enable:false
        }
    }
}

const FORMAT_SELECTBOX = document.getElementById("format");

function fileSelect(e){
    let files = Array.from(e.target.files);
    setVideo(files);
}

function setVideo(files,callback){
    const prosce =  document.getElementById("prosceVideo");
    const main =  document.getElementById("mainVideo");
    const videos = document.querySelectorAll("video");
    const playButton = document.getElementById("play");
    const syncButton = document.getElementById("sync");
    const changeButton = document.getElementById("changeMainProsce");
    const playWhenCanplayEventCheck = document.getElementById("playWhenCanplayEvent");
    const autoSyncCheck = document.getElementById("autoSync");
    const openWindowButton = document.getElementById("openWindow");

    // スクロールアニメーションを非表示に
    document.querySelector("div.scroll-animation").style.display = "none";
    // videoからmuted属性とautoplay属性を消す
    videos.forEach(e=>{
        e.removeAttribute("muted");
        e.removeAttribute("autoplay");
        e.muted = false;
        e.autoplay = false;
    })


    if (FILES == 0 && files.length == 1){
        // 選択されたファイルが一つのとき
        // document.querySelector(".prosce-screen img").style.display = "none";
        prosce.src = window.URL.createObjectURL(files[0]);
        prosce.style.display = "block";
        document.querySelector("span.info-prosce-filename").innerText = files[0].name;
        document.querySelectorAll("button.file-select")[0].innerText = "二つ目のファイルを開く...";
        document.querySelectorAll("input[type='file']").forEach( ()=> {
            self.addEventListener("change", (e)=>{
                let newFiles = [files[0], e.target.files[0]];
                setVideo(newFiles);
            }, {once: true});
        });
        FILES = files[0]; // D&D対応する際に追加
    }else{
        if (FILES != 0 && files.length == 1){ // 二つ目をD&Dのとき （D&D対応で追加）
            files.push(FILES);
        }

        if (files.length != 0) {
            // 二つor二つ目が選択されたとき
            let videoFileUrl = [];
            for (file of files){
                console.log(file);
                videoFileUrl.push(window.URL.createObjectURL(file));
            }
            
            // ファイル名からプロセかメインか判別を試みる
            const prosce_keyword = ["prosce", "proscenium", "プロセ", "ﾌﾟﾛｾ", "プロセニウム", "ﾌﾟﾛｾﾆｳﾑ", "プロセニアム", "ﾌﾟﾛｾﾆｱﾑ"];
            const main_keyword = ["main", "メイン", "ﾒｲﾝ"];
            let isFile0Prosce = isFile0Main = isFile1Prosce = isFile1Main = false;
            prosce_keyword.forEach( w =>{ isFile0Prosce = isFile0Prosce? true : files[0].name.includes(w); });
            prosce_keyword.forEach( w =>{ isFile1Prosce = isFile1Prosce? true : files[1].name.includes(w); });
            main_keyword.forEach( w =>{ isFile0Main = isFile0Main? true : files[0].name.includes(w); });
            main_keyword.forEach( w =>{ isFile1Main = isFile1Main? true : files[1].name.includes(w); });
            console.log(`isFile0Prosce:${isFile0Prosce} isFile0Main:${isFile0Main} isFile1Prosce:${isFile1Prosce} isFile1Main:${isFile1Main}`);
            if ((isFile0Prosce || isFile1Main) || !(isFile0Main || isFile0Prosce || isFile1Main || isFile1Prosce)){
                // 0がプロセ OR 1がメイン もしくは 判定不可能の場合
                prosce.src = videoFileUrl[0];
                main.src = videoFileUrl[1];
                document.querySelector("span.info-prosce-filename").innerText = files[0].name;
                document.querySelector("span.info-main-filename").innerText = files[1].name;
            }else if (isFile1Prosce || isFile0Main){
                // 1がプロセ OR 0がメイン
                prosce.src = videoFileUrl[1];
                main.src = videoFileUrl[0];
                document.querySelector("span.info-prosce-filename").innerText = files[1].name;
                document.querySelector("span.info-main-filename").innerText = files[0].name;
            }else{
                prosce.src = videoFileUrl[0];
                main.src = videoFileUrl[1];
                document.querySelector("span.info-prosce-filename").innerText = files[0].name;
                document.querySelector("span.info-main-filename").innerText = files[1].name;
            }

            prosce.style.display = "block";
            main.style.display = "block";
            
        }

        // 動画時間表示のためsecからタイムコードへ変換する関数を定義
        function secToTimecode(sec){
            let hour, min, rem, frame = "";
            // 参考 https://1-notes.com/javascript-convert-seconds/
            if (parseFloat(sec)>=0){
                hour = ( '00' + Math.floor(sec / 3600) ).slice( -2 ) ;  // 3600秒=1時間
                min = ( '00' + Math.floor(sec % 3600 / 60) ).slice( -2 );
                rem = ( '00' + Math.floor(sec % 60) ).slice( -2 );
                frame = ( '00' + Math.floor((sec % 60 - rem) * 60) ).slice( -2 );
                // let milliSec = (sec % 60 - rem) * 1000
            }else if(parseFloat(sec)<0){
                secForCalc = sec * (-1);
                hour = "-" + ( '00' + Math.floor(secForCalc / 3600) ).slice( -2 ) ;  // 3600秒=1時間
                min = ( '00' + Math.floor(secForCalc % 3600 / 60) ).slice( -2 );
                rem = ( '00' + Math.floor(secForCalc % 60) ).slice( -2 );
                frame = ( '00' + Math.floor((secForCalc % 60 - rem) * 60) ).slice( -2 );
            }
            
            return `${hour}:${min}:${rem}:${frame} ${sec}`
        }
        

        // 親子判定(長さが短い方が親)及びそれに付随する操作
        // promiseとpromise.allを使って、二つとも読み込まれる(loadedmetadataイベント)のを待つ
        
        // 動画長さ(秒)取得・表示
        const prosceLoadPromise = new Promise(resolve => {
            const fire = ()=>{
                resolve();
                prosce.removeEventListener("loadedmetadata", fire, false);
            };
            prosce.addEventListener("loadedmetadata", fire, false);
        }).then(()=>{
            let duration = prosce.duration;
            document.querySelector("span.info-prosce-duration").innerText = secToTimecode(duration);
            return duration
        });
        const mainLoadPromise = new Promise(resolve =>{
            const fire = ()=>{
                resolve();
                main.removeEventListener("loadedmetadata", fire, false);
            };
            main.addEventListener("loadedmetadata", fire, false);
        }).then(()=>{
            let duration = main.duration;
            document.querySelector("span.info-main-duration").innerText = secToTimecode(duration);
            return duration
        });
        
        // 親子判定(動画時間が短い方が親)
        let parentVideo, childVideo;
        Promise.all([prosceLoadPromise, mainLoadPromise]).then(res =>{ // 二つとも読み込まれた後の処理
            if (prosce.duration <= main.duration){
                parentVideo = prosce;
                childVideo = main;
                parentInfoStatus = document.querySelector("span.info-prosce-status");
                childInfoStatus = document.querySelector("span.info-main-status");
            }else{
                parentVideo = main;
                childVideo = prosce;
                parentInfoStatus = document.querySelector("span.info-main-status");
                childInfoStatus = document.querySelector("span.info-prosce-status");
            }
            console.log("parent:", parentVideo);
            parentVideo.controls = true;
            childVideo.controls = false;
            // 子動画を連打するとcontrol表示
            childVideo.addEventListener("click",()=>{
                (CNT[1] > 9)? childVideo.controls = true : CNT[1]++;
            }, false);
        }).then(()=>{  // 親子判定後にする操作
            // 再生ボタン有効化
            playButton.disabled = false;
            function changePlayPauseButtonStatus(status){
                if (status == "play"){
                    playButton.innerText = "▶️ 同時再生";
                }else if (status == "pause"){
                    playButton.innerText = "⏸ 一時停止";
                }
            }
            
            // 再生チェックボックスの設定 チェック外されたときの処理を変更する場合,再生終了時の処理も要確認
            playWhenCanplayEventCheck.addEventListener("change", ()=>{
                if (playWhenCanplayEventCheck.checked){
                    // 再生する チェックされたとき
                    parentVideo.play();
                    changePlayPauseButtonStatus("pause");
                    changeButton.disabled = true;
                }else{
                    // 再生する チェック外された時
                    parentVideo.pause();
                    changePlayPauseButtonStatus("play");
                    syncVideosCurrentTime();
                    changeButton.disabled = false;
                }
            });

            // ズレ修正ボタン登録
            syncButton.addEventListener("click", syncVideosCurrentTime);
            syncButton.disabled = false;

            // 親動画のコントロール操作監視
            parentVideo.addEventListener("pause", ()=>{
                childVideo.pause();
            });
            parentVideo.addEventListener("play", ()=>{ 
                childVideo.play();
                if (!playWhenCanplayEventCheck.checked){
                    // playWhenCanplayEventCheck.checked = true;
                    playWhenCanplayEventCheck.click(); // clickじゃないとイベントが発火しない
                }
            });
            parentVideo.addEventListener("ratechange", ()=> childVideo.playbackRate = parentVideo.playbackRate );

            // 読み込みによる再生停止&再開の連動
            parentVideo.addEventListener("waiting", ()=>{
                childVideo.pause();
                parentInfoStatus.innerText = "waiting";
            });
            parentVideo.addEventListener("playing", ()=>{
                childVideo.play(); 
                parentInfoStatus.innerText = "";
            });
            parentVideo.addEventListener("canplay", ()=>{
                if(playWhenCanplayEventCheck.checked){
                    parentVideo.play();
                }
                parentInfoStatus.innerText = "";
            });
            childVideo.addEventListener("waiting", ()=>{
                parentVideo.pause();
                childInfoStatus.innerText = "waiting";
            });
            childVideo.addEventListener("playing", ()=>{
                parentVideo.play();
                childInfoStatus.innerText = "";
            });
            childVideo.addEventListener("canplay", ()=>{
                if(playWhenCanplayEventCheck.checked){
                    parentVideo.play();
                }
                childInfoStatus.innerText = "";
            });

            // 再生終了時にボタンの表示を変更
            parentVideo.addEventListener("ended", ()=>{
                if (playWhenCanplayEventCheck.checked){
                    // playWhenCanplayEventCheck.click(); だとズレ修正される→最終フレームで止まらない
                    // ズレ修正処理を走らせないために、再生チェックボックスのchangeイベントを発火させず、ここでボタン表示変更処理を行う
                    playWhenCanplayEventCheck.checked = false;
                    changePlayPauseButtonStatus("play");
                    // syncVideosCurrentTime(); 最終フレームで止まらせるためにズレ修正処理はしない
                    changeButton.disabled = false;
                }
            });
            childVideo.addEventListener("ended", ()=>{ // parentのほうが動画時間短い=先に終わる のでここが呼ばれることはあまりないかも?
                if (playWhenCanplayEventCheck.checked){
                    parentVideo.pause(); // childがpauseしたときの親の処理はないのでここで止める
                    playWhenCanplayEventCheck.checked = false;
                    changePlayPauseButtonStatus("play");
                    // syncVideosCurrentTime(); 最終フレームで止まらせるためにズレ修正処理はしない
                    changeButton.disabled = false;
                }
            });
            
            //video要素のEventをデバッグ
            function dbgEventFunc(e){
                let now = new Date();
                console.log(`${e.type} ${e.target.id} ${now.getSeconds()}`);
            }
            let dbgEventList = ["click", "stalled", "suspend", "play", "pause", "playing", "canplay", "canplaythrough", "error", "waiting", "ended" /* , "seeking", "seeked" */];
            document.querySelectorAll("video").forEach( v =>{
                dbgEventList.forEach( dbgEvent =>{
                    v.addEventListener(dbgEvent, dbgEventFunc);
                });
            });

            // 動画シーク時の動作
            parentVideo.addEventListener("seeking", ()=>{childVideo.currentTime = parentVideo.currentTime;}, false);
            parentVideo.addEventListener("seeked", ()=>{childVideo.currentTime = parentVideo.currentTime; if(!parentVideo.paused){childVideo.play();} }, false); // 本当は子のシークが終わるまで親を待たせた方がずれにくい？

            // 音声切り替えプルダウン登録
            videos.forEach( (e) => e.volume = 0.25); // 2つ合わせて0.5くらいになるように
            const selectMute = document.getElementById("selectMute");
            selectMute.disabled = false;
            selectMute.addEventListener("change", selectMuteFunc);
            parentVideo.addEventListener("volumechange", syncVolume);
            function selectMuteFunc(){ // モード変更時に親動画の音量は変えない、両方のミュートの切り替えと子動画の音量のみを変更
                if (selectMute.value == "noMute"){
                    parentVideo.muted = false;
                    parentVideo.volume = Math.min(Math.max(parentVideo.volume, 0.05), 1); // parentVideoの音量が[0.05, 1]に収まるように
                    childVideo.muted = false;
                    childVideo.volume = Math.max(parentVideo.volume, 0.05);
                }else if (selectMute.value == "oneMute"){ 
                    // より動画時間が長い子動画の音を出すことで音声ブチ切りを再現 (動画時間が長い=短い方より曲が遅れて終わる と予想)
                    parentVideo.muted = true;
                    childVideo.muted = false;
                    childVideo.volume = Math.min(Math.max(parentVideo.volume * 2, 0.1), 1); // [0.1,1]の範囲で 親動画の音量*2 にする
            }else if(selectMute.value == "allMute"){
                    parentVideo.muted = true;
                    childVideo.muted = true;
                }
            }
            function syncVolume(Event){
                if (selectMute.value == "noMute"){ // 音声モードが両方出力のときに親動画と子動画の音量を同期させる
                    childVideo.volume = parentVideo.volume;
                }
            }

            // 別ウィンドウで再生する機能
            let mainOutputWindowPrx;
            let prosceOutputWindowPrx;
            openWindowButton.addEventListener("click", ()=>{
                function draw(ctx, image, dx, dy, dWidth, dHeight){
                    ctx.drawImage(image, dx, dy, dWidth, dHeight);
                    requestAnimationFrame(()=>{draw(ctx, image, dx, dy, dWidth, dHeight)});
                }
                window.addEventListener("message", (event) => {
                    if (event.origin !== "http://127.0.0.1:5500") return;
                    if (event.data == "DOMContentLoaded"){
                        console.log("message", event)
                        console.log(event.source.name)
                        let sourceWindow = event.source
                        sourceWindow.document.title = sourceWindow.name + " screen output | KGM - KTM映像確認ツール";
                        canvas = sourceWindow.document.getElementById("output");
                        ctx = canvas.getContext("2d");
                        draw(ctx, document.getElementById(`${sourceWindow.name}Video`), 0, 0, canvas.width, canvas.height);
                    }
                }); 
                if(mainOutputWindowPrx === undefined || mainOutputWindowPrx.closed){
                    mainOutputWindowPrx = window.open("output.html", "main", "popup");
                }
                if(prosceOutputWindowPrx === undefined || prosceOutputWindowPrx.closed){
                    prosceOutputWindowPrx = window.open("output.html", "prosce", "popup");
                }
                console.log({mainOutputWindowPrx, prosceOutputWindowPrx});
                if(mainOutputWindowPrx && prosceOutputWindowPrx){
                    openWindowButton.innerText = "別ウィンドウで再生";
                }else{
                    openWindowButton.innerText = "もう一度押してください";
                }
            });
            openWindowButton.disabled = false;
        });

        // ズレ修正処理
        function syncVideosCurrentTime(){
            let syncTime = Math.floor(parentVideo.currentTime * 10) / 10; // 小数点第2位以下を切り捨て
            parentVideo.currentTime = syncTime;
            childVideo.currentTime = syncTime;
        }

        // 再生時間表示
        prosce.addEventListener("timeupdate", ()=>{
            document.querySelector("span.info-prosce-timecode").innerText = secToTimecode(prosce.currentTime);
            updateTimeDifference();
        }, false);
        main.addEventListener("timeupdate", ()=>{
            document.querySelector("span.info-main-timecode").innerText = secToTimecode(main.currentTime);
            updateTimeDifference();
        }, false);
        //   動画時間の差を更新
        function updateTimeDifference(){
            let timeDifference = prosce.currentTime - main.currentTime;
            document.querySelector("span.info-time-difference").innerText = secToTimecode(timeDifference);
            // ズレが大きいとき自動で修正
            const lagFrame = 1;
            const fps = 60;
            if (((timeDifference > 0 && timeDifference >= (1/fps) * lagFrame) || (timeDifference < 0 && timeDifference*(-1) >= (1/fps) * lagFrame)) && autoSyncCheck.checked){
                console.log("ズレ修正 " + timeDifference);
                syncVideosCurrentTime();
            }
        }

        // 動画入れ替えbutton登録(一つも動画が読み込まれていない場合を除く)
        if (files.length != 0){
            changeButton.addEventListener("click",()=>{
                if (prosce.paused && main.paused){
                    files.reverse();
                    setVideo(files);
                    changeButton.disabled = true;
                }
            }, {once: true});
            changeButton.disabled = false;
        }

        // ファイル選択ボタンを再読み込みボタンへ変更
        document.querySelector("button.file-select").innerText = "リセット";
        document.querySelector("button.file-select").removeEventListener("click", fileSelectFunc);
        document.querySelector("button.file-select").addEventListener("click", ()=>{location.reload();});
        
        // コールバック関数
        return (typeof(callback)=="function")? callback() : ()=>{return};
    }
}

function dbg(){
    // ブックマークレットとして実行させることでクロスドメイン制限を突破
    const prosce = window.prompt("prosce url?"), main = window.prompt("main url?");
    let prosceCode = (prosce)? `d.getElementById("prosceVideo").src="${prosce}";` : "";
    let mainCode = (main)? `d.getElementById("mainVideo").src="${main}";` : "";
    setVideo([],()=>{});
    window.prompt(
        "1. 以下をコピーしてブラウザのアドレスバーに貼り付け/n2. 先頭の # を消して開く",
        `# javascript:((d)=>{${prosceCode}${mainCode}})(document);`
    );
}

function fileSelectFunc(){
    this.nextElementSibling.click();
}

function whenChangeFormat(){
    console.log(FORMAT_SELECTBOX.value);
    document.getElementById("format-css").href = FORMATS.list[FORMAT_SELECTBOX.value]["css"];
    if (document.querySelector("button.file-select").innerText != "リセット"){
        document.getElementById("prosceVideo").src = FORMATS.list[FORMAT_SELECTBOX.value]["default_prosce"];
        document.getElementById("mainVideo").src = FORMATS.list[FORMAT_SELECTBOX.value]["default_main"];
    }
}

function setDrugAndDrop(e){
    // 参考 https://note.affi-sapo-sv.com/js-dandfile.php
    
    // const ddarea = document.getElementById("ddarea");
    const ddarea = document.body;
    // const tarea = document.getElementById("txtarea");

        // ドラッグされたデータが有効かどうかチェック
    const isValid = e => e.dataTransfer.types.indexOf("Files") >= 0;

    const ddEvent = {
        "dragover" : e=>{
            e.preventDefault(); // 既定の処理をさせない
            if( !e.currentTarget.isEqualNode( ddarea ) ) {
                    // ドロップエリア外ならドロップを無効にする
                e.dataTransfer.dropEffect = "none";return;
            }
            e.stopPropagation(); // イベント伝播を止める

            if( !isValid(e) ){
                    // 無効なデータがドラッグされたらドロップを無効にする
                e.dataTransfer.dropEffect = "none";return;
            }
                    // ドロップのタイプを変更
            e.dataTransfer.dropEffect = "copy";
            ddarea.classList.add("ddefect");
        },
        "dragleave" : e=>{
            if( !e.currentTarget.isEqualNode( ddarea ) ) {
                return;
            }
            e.stopPropagation(); // イベント伝播を止める
            ddarea.classList.remove("ddefect");
        },
        "drop":e=>{
            e.preventDefault(); // 既定の処理をさせない
            e.stopPropagation(); // イベント伝播を止める

            const files = e.dataTransfer.files;

            /* tarea.value +=`${files.length}のファイルがドロップされた。`;
            for( file of files ) tarea.value += `name:${file.name} type:${file.type}` ;

            ddarea.classList.remove("ddefect"); */
            
            setVideo(Array.from(files));
        }
    };

    Object.keys( ddEvent ).forEach( e=>{
        ddarea.addEventListener(e,ddEvent[e]);
        document.body.addEventListener(e,ddEvent[e])
    });
}

function addDomEvents(){
    // ファイル選択用button 
    document.querySelector("button.file-select").addEventListener("click", fileSelectFunc);

    // ファイル選択input
    document.querySelectorAll("input[type='file']").forEach( ()=> self.addEventListener("change", fileSelect) );

    // ドラッグ&ドロップ
    setDrugAndDrop();

    // 再生ボタン押下時の関数を定義
    document.getElementById("play").addEventListener("click", playButtonFunc);
    function playButtonFunc(Event) {
        document.getElementById("playWhenCanplayEvent").click();
    }

    // 仕様選択セレクトボックス設定
    for (const format_key in FORMATS["list"]){
        if (FORMATS["list"][format_key]["is_enable"]){
            const opt = document.createElement("option");
            opt.value = format_key;
            opt.text = FORMATS["list"][format_key]["display_name"];
            if (FORMATS.default == format_key){
                opt.selected = true;
            }
            FORMAT_SELECTBOX.add(opt);
        }
    }
    whenChangeFormat(); // デフォルトの仕様設定
    FORMAT_SELECTBOX.addEventListener("change", whenChangeFormat);

    // デバッグ用関数設定
    document.querySelector("footer").addEventListener("click", ()=>{(CNT[0] > 8)? dbg() : CNT[0]++});
}


window.addEventListener('DOMContentLoaded', addDomEvents);
