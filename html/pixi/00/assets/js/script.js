let app = new PIXI.Application({
  width:      window.innerWidth,
  height:     window.innerHeight,
  antialias: true,
  transparent: true
});
// HTMLの#appに上で作ったPIXIアプリケーション(app)のビュー(canvas)を突っ込む
let el = document.getElementById('app');
el.appendChild(app.view);




//video
//--------------------------------------------------------------------------------
//スプライト（videoタグをテクスチャに）
const videoRef = document.querySelector("video");
const videoTexture = PIXI.Texture.from(videoRef);
const videoSprite = new PIXI.Sprite(videoTexture);
const videoController = videoSprite.texture.baseTexture.resource.source;
//幅・高さ（全画面に）
videoSprite.width = window.innerWidth;
videoSprite.height = window.innerHeight;
//add
//app.stage.addChild(videoSprite);
//ブラー設定
const blurFilter = new PIXI.filters.BlurFilter();
blurFilter.blur = 20;
//videoSprite.filters = [blurFilter];



//gameover（クラゲの説明）
//--------------------------------------------------------------------------------
//スプライト
const gameoverTexture = PIXI.Texture.fromImage('assets/img/gameover.png');
const gameover = new PIXI.Sprite(gameoverTexture);
//位置
gameover.position.set(10, 10); //set(x, y)でまとめて指定できる




//start
//--------------------------------------------------------------------------------
//スタートテキスト
const startTexture = PIXI.Texture.fromImage('assets/img/start.png');
const startText = new PIXI.Sprite(startTexture);
//基準点
startText.anchor.set(0.5, 0.5); //基準点を設定(%) 0.5はそれぞれの中心 位置・回転の基準になる
//位置
startText.x = window.innerWidth / 2;
startText.y = window.innerHeight / 2;
//クリック
startText.interactive = true; //クリック可能に
startText.buttonMode = true; //ポインター変更
startText.on('pointertap', init);
//add
app.stage.addChild(startText);
//アニメーション
TweenMax.to(startText, 0.9, //引数1：ターゲット, 引数2：秒数
  {
    pixi: { 
        scale: 1.05, //大きさ
    },
    ease: Power1.easeInOut, //イージング
    repeat: -1, //リピート回数（-1でループ）
    yoyo: true //反復リピート
  }
);
//スタートアニメーション
function startAnime() {
  TweenMax.to(startText, 0.8,
    {
      pixi: { 
        alpha: 0, //透明度
        scale: 2
      },
      ease: Back.easeOut.config(0.8)
    }
  );
  //フェードアウト後にremove
  setTimeout(() => {
    app.stage.removeChild(startText);
  }, 800);
}




//fish
//--------------------------------------------------------------------------------
//魚グループ
const fishSprites = [];
//テクスチャ
const fishTextures = [
  'assets/img/fish01.png',
  'assets/img/fish02.png',
  'assets/img/fish03.png'
];
//魚量産
const fishNum = 50; //魚の数
for (let i = 0; i < fishNum; i++){
  //テクスチャ（1～3のどれか）
  const texture = PIXI.Texture.fromImage(fishTextures[Math.floor(Math.random() * 3)]);
  //スプライトを生成＆配列に追加
  fishSprites.push(new PIXI.Sprite(texture));
  //基準点
  fishSprites[i].anchor.set(0.5, 0.5);
  //位置
  fishSprites[i].position.x = window.innerWidth + ((Math.random() * 100) + 300);
  fishSprites[i].position.y = window.innerHeight - ((Math.random() * 800) + 100);
  //大きさ
  fishSprites[i].scale.set(0.5, 0.5);
  //クラゲ生成（1/5の割合）
  if( (i % 5) == 0 ){
    fishSprites[i].name = 'jelly'; //nameを設定しておく
    fishSprites[i].texture = PIXI.Texture.fromImage('assets/img/jelly.png'); //テクスチャ変更
    fishSprites[i].scale.set(0.7, 0.7);
  }
}




//fish animation
//--------------------------------------------------------------------------------
function showFish() {
  fishSprites.forEach(fish => {
    //魚を追加
    app.stage.addChild(fish);
    //アニメーション
    TweenMax.to(fish, Math.floor( Math.random() * 8 ) + 5,
      {
        pixi: { 
            x: fish.x - window.innerWidth - 500, //横移動
        },
        ease: Power1.easeInOut,
        repeat: -1
      }
    );
  });
}
function stopFish() {
  fishSprites.forEach(fish => {
    //魚を削除
    app.stage.removeChild(fish);
  });
}




//hoverイベント設定
//--------------------------------------------------------------------------------
fishSprites.forEach(fish => {
  fish.interactive = true;
  //捕獲イベント
  fish.on('pointerover', getEvent); //オブジェクト.on('イベントの種類', イベントハンドラ)
  //クラゲの場合はloseイベント
  if (fish.name == 'jelly') {
    fish.on('pointerover', loseEvent);
  }
});




//get event
//--------------------------------------------------------------------------------
//テキスト
const countTextStyle = {
  fontFamily: 'Mochiy Pop P One',
  fontSize: 30,
  fill : '#efd748',
  stroke : '#004973',
  strokeThickness : 5
};
let getNum = 1; //捕獲した数
let getText; //捕獲時のテキスト
let countText = new PIXI.Text(getText, countTextStyle); //テキスト生成
const winNum = fishNum - (fishNum / 5); //クラゲ以外の魚の数
//イベント
function getEvent() {
  //カウント位置（ホバー位置を基準に）
  countText.x = app.renderer.plugins.interaction.mouse.global.x - 100;
  countText.y = app.renderer.plugins.interaction.mouse.global.y - 50;
  //add
  app.stage.addChild(countText);
  //カウント更新
  getText = `GET! × ${getNum}`;
  countText.text = getText;
  ++getNum;
  //魚削除
  this.parent.removeChild(this);
  //すべて捕獲したらwinイベント
  if (getNum > winNum) {
    winEvent();
  }
}




//lose event
//--------------------------------------------------------------------------------
//テキスト
const loseTexture = PIXI.Texture.fromImage('assets/img/lose.png');
const loseText = new PIXI.Sprite(loseTexture);
loseText.anchor.set(0.5, 0.5);
loseText.x = window.innerWidth / 2;
loseText.y = window.innerHeight / 2;
//イベント
function loseEvent() {
  stopFish();
  stopTimer();
  app.stage.addChild(loseText);
  //カウント表示
  countText.anchor.set(0.5, 0.5);
  countText.x = window.innerWidth / 2;
  countText.y = window.innerHeight / 1.6;
  if (getNum == 2) {
    countText.text = ''; //1匹目からクラゲなら非表示
  }
}




//win event
//--------------------------------------------------------------------------------
//テキスト
const winTexture = PIXI.Texture.fromImage('assets/img/win.png');
const winText = new PIXI.Sprite(winTexture);
winText.anchor.set(0.5, 0.5);
winText.x = window.innerWidth / 2;
winText.y = window.innerHeight / 1.85;
//イベント
function winEvent() {
  stopFish();
  stopTimer();
  particleAnime();
  app.stage.addChild(winText);
  countText.text = '';
  app.stage.addChild(container);
}
//エビパーティクル
let container = new PIXI.ParticleContainer();
container.width = window.innerWidth;
container.height = window.innerHeight;
for (let i = 0; i < 100; ++i) {
  let sprite = PIXI.Sprite.from("assets/img/cursol.png");
  //大きさ
  sprite.scale.set((Math.random() * 0.8) + 0.8);
  //角度
  sprite.angle = Math.random() * 360;
  //位置
  sprite.x = window.innerWidth / 2;
  sprite.y = window.innerHeight / 2.8;
  //コンテナに追加
  container.addChild(sprite);
}
//パーティクルアニメーション
function particleAnime() {
  let w = 1600; //横の範囲調整
  let h = 10; //縦の範囲調整
  for (var i = 0; i < container.children.length; i++) 
    {
      var particle = container.getChildAt(i);
      TweenMax.to(particle, 0.6, {
        pixi: {
          x: (Math.random() * w) + window.innerWidth / 2 - (w / 2),
          y: (window.innerHeight - (window.innerHeight * 1.25)) + h
        },
        ease: Power4.easeOute
      });
      //エビが上に広がるように範囲調整
      if ((i % 5) == 0) {
        w -= 80;
        h += 30;
        console.log(w,h)
      }
    }
}



//timer
//--------------------------------------------------------------------------------
let timer, startTime, nowTime;
//タイマー開始
function startTimer(){
  timer = setInterval(showSecond, 100);
}
//タイマー終了
function stopTimer(){
  clearInterval(timer);
}
//秒数
const timerTextStyle = {
  fontFamily: 'Mochiy Pop P One',
  fontSize: 22,
  fill : '#fff',
  stroke : '#004973',
  strokeThickness : 3
};
//タイマー表示
let elapsedTime = 0;
let timerText = new PIXI.Text(elapsedTime, timerTextStyle);
timerText.anchor.set(0, 0.5);
timerText.x = 55;
timerText.y = 115;
//タイマー更新
function showSecond(){
  nowTime = new Date();
  elapsedTime = ((nowTime - startTime) / 1000).toFixed(2);
  timerText.text = elapsedTime;
}
//タイマーアイコン
const timerTexture = PIXI.Texture.fromImage('assets/img/timer.png');
const timerIcon = new PIXI.Sprite(timerTexture);
timerIcon.anchor.set(0, 0.5);
timerIcon.scale.set(0.12, 0.12);
timerIcon.x = 15;
timerIcon.y = 115;




//init
//--------------------------------------------------------------------------------
function init() {
  //タイマースタート
  startTime = new Date();
  startTimer();
  app.stage.addChild(timerText);
  app.stage.addChild(timerIcon);
  //ブラー解除
  blurFilter.blur = 0;
  //スタートアニメーション
  startAnime();
  //クラゲ説明表示
  app.stage.addChild(gameover);
  //ビデオ再生
  videoSprite.texture.baseTexture.resource.source.play();
  //魚スタート
  showFish();
}