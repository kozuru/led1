/********************/
/*canvas*/
"use strict";
/* Typescript transfomration based on https://codepen.io/giana/details/qbWNYy */
function MyRandom(max, min) {
  if (min === void 0) {min = 0;}
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var Orbit = /** @class */function () {
  function Orbit(width, height) {
    this.cords = { x: 0, y: 0 };
    this.radius = MyRandom(this.MaxOrbit(width, height));
    this.cords.x = width / 2;
    this.cords.y = height / 2;
  }
  Orbit.prototype.MaxOrbit = function (x, y) {
    return Math.round(Math.sqrt(2 * Math.pow(Math.max(x, y), 2)) / 2);
  };
  return Orbit;
}();
var Star = /** @class */function () {
  function Star(canvasWidth, canvasHeigh, totalCount, speedFactor) {
    this.orbit = new Orbit(canvasWidth, canvasHeigh);
    this.radius = MyRandom(60, this.orbit.radius) / 13;
    this.timePassed = MyRandom(0, totalCount);
    this.speed = MyRandom(this.orbit.radius) / speedFactor;
    this.alpha = MyRandom(2, 10) / 10;
    var spark = MyRandom(10);
    if (spark === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else
    if (spark === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }
  }
  Star.prototype.getNewCoordinates = function () {
    this.timePassed += this.speed;
    return {
      x: Math.sin(this.timePassed) * this.orbit.radius + this.orbit.cords.x,
      y: Math.cos(this.timePassed) * this.orbit.radius + this.orbit.cords.y };

  };
  return Star;
}();
var StarsRenderer = /** @class */function () {
  function StarsRenderer(
  /* Defaults do not modify, check the 2nd last line */
  canvasName, hue, speedFactor, starCount) {
    if (canvasName === void 0) {canvasName = 'canvas';}
    if (hue === void 0) {hue = 217;}
    if (speedFactor === void 0) {speedFactor = 5e4;}
    if (starCount === void 0) {starCount = 1100;}
    this.canvasName = canvasName;
    this.hue = hue;
    this.speedFactor = speedFactor;
    this.starCount = starCount;
    this._stars = [];
    var canvas = document.getElementById(canvasName);
    this.height = canvas.height = window.innerHeight;
    this.width = canvas.width = window.innerWidth;
    this._ctx = canvas.getContext('2d');
    //#region Cache Gradient
    this._canvas2 = document.createElement(canvasName);
    var factor = this._canvas2.width / 2;
    var ctx2 = this._canvas2.getContext('2d');
    var gradient2 = ctx2.createRadialGradient(factor, factor, 0, factor, factor, factor);
    gradient2.addColorStop(0.025, '#fff');
    gradient2.addColorStop(0.2, "hsl(" + this.hue + ", 61%,33%)");
    gradient2.addColorStop(0.35, "hsl(" + this.hue + ", 64%,6%)");
    gradient2.addColorStop(1, 'transparent');
    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(factor, factor, factor, 0, Math.PI * 2);
    ctx2.fill();
    //#endregion
    //Generate Stars
    for (var i = 0; i < this.starCount; i++) {
      this._stars.push(new Star(this.width, this.height, this.starCount, this.speedFactor));
    }
  }
  StarsRenderer.prototype.DrawStars = function () {
    for (var i = 0; i < this.starCount; i++) {
      this._ctx.globalAlpha = this._stars[i].alpha;
      var starCoordinates = this._stars[i].getNewCoordinates();
      this._ctx.drawImage(this._canvas2, starCoordinates.x - this._stars[i].radius / 2, starCoordinates.y - this._stars[i].radius / 2, this._stars[i].radius, this._stars[i].radius);
    }
  };
  StarsRenderer.prototype.DrawFrame = function () {
    this._ctx.globalCompositeOperation = 'source-over';
    this._ctx.globalAlpha = 0.8;
    this._ctx.fillStyle = "hsla(" + this.hue + ", 64%,6%,1)";
    this._ctx.fillRect(0, 0, this.width, this.height);
    this._ctx.globalCompositeOperation = 'lighter';
    this.DrawStars();
  };
  return StarsRenderer;
}();
//Animation Function
function animations() {
  starsRenderer.DrawFrame();
  window.requestAnimationFrame(animations);
}

var starsRenderer = new StarsRenderer('canvas', 217, 5e4, 1100);
//Code to intialize the animation
animations();

/**********/
/*本文*/
$('#default').on('click', function(){
  $('.light').attr('class', 'light');
  $('button').removeClass('active');
  $(this).addClass('active');
  setTimeout(function() {
   $('#light-1, #light-2').attr('class', 'light strobe blue');
  $('#light-4, #light-5').attr('class', 'light strobe red delay');
}, 50);

});

$('#alt').on('click', function(){
  $('button').removeClass('active');
  $(this).addClass('active');
  $('.light').attr('class', 'light');
  setTimeout(function() {
    $('#light-1, #light-3, #light-5').attr('class', 'light strobe blue');
  $('#light-2, #light-4, #light-6').attr('class', 'light strobe red delay');
  }, 50);

});

$('#spotlight').on('click',function(){
  if( $('#default.active, #alt.active ,#off.active').length > 0 ){

    if( !$(this).is('.active') ) {
      $(this).addClass('active');
      $('#light-3, #light-4').attr('class', 'light');
      $('#light-3, #light-4').addClass('spotlight');
    } else if ( $(this).is('.active') && $('#default.active').length > 0 ){
      $(this).removeClass('active');
      $('.light').attr('class', 'light');
      setTimeout(function() {
        $('#light-1, #light-2, #light-3').attr('class', 'light strobe blue');
        $('#light-4, #light-5, #light-6').attr('class', 'light strobe red delay');
}, 10);
    } else if ( $(this).is('.active') && $('#alt.active').length > 0 ){
      $(this).removeClass('active');
      $('.light').attr('class', 'light');
      setTimeout(function() {
        $('#light-1, #light-3, #light-5').attr('class', 'light strobe blue');
        $('#light-2, #light-4, #light-6').attr('class', 'light strobe red delay');
  }, 10);
    } else if ( $(this).is('.active') && $('#off.active').length > 0 ){
      $(this).removeClass('active');
      $('.light').attr('class', 'light');
    }

  } else {
    alert('Spotlight is not for use with "Traffic Warnings" because these light sequences are meant to simlulate the view from the rear of the vehicle. :(')
  }
})

$('#off').on('click', function(){
  $('button').removeClass('active');
  $(this).addClass('active');
  $('.light').attr('class', 'light');
})

$('#traffic-default').on('click', function(){
  $('button').removeClass('active');
  $(this).addClass('active');
  $('.light').attr('class', 'light');
  $('#light-1').attr('class', 'light strobe blue');
  $('#light-2, #light-3, #light-4, #light-5').attr('class', 'light warn on');
  $('#light-6').attr('class', 'light strobe red delay');
})

$('#caution').on('click', function(){
  $('button').removeClass('active');
  $(this).addClass('active');
  $('.light').attr('class', 'light caution');
})

$('#warn-left').on('click', function(){
  $('button').removeClass('active');
  $(this).addClass('active');
  $('.light').attr('class', 'light warn left');
})

$('#warn-right').on('click', function(){
  $('button').removeClass('active');
  $(this).addClass('active');
  $('.light').attr('class', 'light warn right');
})

$('#meteor').on('click', function(){
  $('button').removeClass('active');
  $(this).addClass('active');
  $('#light-1,#light-2,#light-4,#light-5').attr('class', 'light meteor');
})
$('#firefly').on('click', function(){
  $('button').removeClass('active');
  $(this).addClass('active');
  $('#light-1,#light-2,#light-4,#light-5').attr('class', 'light firefly');
})

/*cursol stoker*/

  // 「#hide-btn」要素のclickイベントをつくってください
  //マウスストーカー用のdivを取得
const storker = document.getElementById('storker');

//aタグにホバー中かどうかの判別フラグ
let hovFlag = false;

//マウスに追従させる処理 （リンクに吸い付いてる時は除外する）
document.addEventListener('mousemove', function (e) {
    if (!hovFlag) {
    storker.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    }
});

//リンクへ吸い付く処理
const linkElem = document.querySelectorAll('a:not(.no_stick_)');
for (let i = 0; i < linkElem.length; i++) {
    //マウスホバー時
    linkElem[i].addEventListener('mouseover', function (e) {
        hovFlag = true;

        //マウスストーカーにクラスをつける
        storker.classList.add('hov_');

        //マウスストーカーの位置をリンクの中心に固定
        let rect = e.target.getBoundingClientRect();
        let posX = rect.left + (rect.width / 2);
        let posY = rect.top + (rect.height / 2);

        storker.style.transform = 'translate(' + posX + 'px, ' + posY + 'px)';

    });
    //マウスホバー解除時
    linkElem[i].addEventListener('mouseout', function (e) {
        hovFlag = false;
        storker.classList.remove('hov_');
    });
}
