class pair {
		constructor(a,b) {
			this.head = a; this.body = b;
		}
	}

var mahjong = new Array("🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏","🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘","🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡","🀀","🀁","🀂","🀃","🀆","🀅","🀄","🀫");
var randeck = new Array("🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏","🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘","🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡","🀀","🀁","🀂","🀃","🀆","🀅","🀄");
var rancheck = new Array();
var hand = new Array();
var deck = new Array();
var chkArray = new Array();
var kkang = new Array();
var max = new pair(new Array(), new Array());
var maxPoint = 0;
var n = 0;
var tsumocnt = 0;
var canKkang = 0;
var canWin = 0;
var choosing = 0;
var canvas = document.getElementById("jsCanvas");
var ctx = canvas.getContext("2d");
const xPadding = 127;
const yPadding = 450;
const cardX = 38;
const cardY = 48;
const trashXPadding = 286;
const trashYPadding = 100;

ctx.font = '42px Arial';

canvas.onclick = function(event) { 
  const x = event.pageX - ctx.canvas.offsetLeft;
  const y = event.pageY - ctx.canvas.offsetTop;
  if (choosing == 0) {
    new tsumo(cardCheck(x, y));
    if (canKkang > 0 && (x > 500 && x < 600) && (y > 350 && y < 390))
      new doKkang(-1);
    if (canWin == 1 && (x > 370 && x < 470) && (y > 350 && y < 390))
      new win();
  }
  else {
    new doKkang(kkangCheck(x, y));
  }
} 

class card {
  constructor(c) {
    this.ch = c;
  }
  show(num) {
    ctx.fillText(this.ch,num,yPadding);
  }
  tShow(x, y) {
    ctx.fillText(this.ch,x,y);
  }
}

function kkangCheck(x, y) { 
  if (y > yPadding + cardY*1.5 - 40 && yPadding + cardY*1.5 + 10 && x < xPadding + cardX*4 + cardX*5*(canKkang-1) && x > xPadding) {
    if (Math.floor((x - xPadding) / cardX) % 5 != 4)
      return Math.floor((x - xPadding) / (cardX*5));
  }
}

function cardCheck(x, y) {
  if (y > yPadding - 40 && y < yPadding + 10 && x < cardX*14 + xPadding + 10) {
    if (x < cardX*13 + xPadding + 10) {
      return Math.floor((x - xPadding) / cardX); }
    else if (x > cardX*13 + xPadding + 10 && x < cardX*14 + xPadding + 10) {
      return 13;
    }
  }
  return -1;
}

function compare(a,b) {
  if (typeof(a) == "object")
    return mahjong.indexOf(a.ch[0]) - mahjong.indexOf(b.ch[0]);
  else
    return mahjong.indexOf(a) - mahjong.indexOf(b);
}

function win() {
  ctx.fillText("Win", 300, 300);
  tsumocnt = 20;
}

function lose() {
  ctx.fillText("Lose", 300, 300);
  tsumocnt = 19;
}

function check(cnt, array, head, body) {
  var useToHead = false;
  if (cnt >= array.length) {
    if (max.body.length < body.length || (max.body.length == body.length && max.head.length < head.length)) max = new pair(head, body);
    if ((head.length == 1 && body.length == 4) || (head.length == 7)) { // 이 부분 나중에 chkPoint로 옮기기
      //tmpPoint = chkPoint();
      //if(maxPoint > tmpPoint) {maxPoint = tmpPoint; max = new pair(head, body);
      max = new pair(head, body);
      canWin = 1;

      ctx.fillStyle = "#DD2200"
      ctx.fillRect(370, 350, 100, 40);
      ctx.fillStyle = "#000000"
    }
    return;
  } 
  this.chkArray = array;

  if (cnt == -1) {
    max = new pair(new Array(), new Array());
    cnt = 0;
    canKkang = 0;
    this.x = -1;
    this.a = -1;
    this.b = -1;
    canWin = 0;

    ctx.clearRect(370, 350, 100, 40);

    for (i = 0; i < chkArray.length; i++) {
      if (chkArray.lastIndexOf(chkArray[i]) - i == 3) { // 깡 체크
        canKkang++;
      }
    }

    if (canKkang > 0) {
      ctx.fillStyle = "#FFEB5A"
      ctx.fillRect(500, 350, 100, 40);
      ctx.fillStyle = "#000000"
    }
    else {
      ctx.clearRect(500, 350, 100, 40);
    }
  }

  this.x = mahjong.indexOf(this.chkArray[cnt]);

  if (this.x < 27) { // 슌쯔
    if (this.x % 9 < 7) {
      this.a = this.chkArray.indexOf(mahjong[this.x + 1]);
      this.b = this.chkArray.indexOf(mahjong[this.x + 2]);

      if (this.a != -1 && this.b != -1) {
        tmpArray = this.chkArray.slice();
        tmpBody = body.slice();
        tmpBody.push(new Array(tmpArray.splice(this.b, 1)[0], tmpArray.splice(this.a, 1)[0], tmpArray.splice(cnt, 1)[0]));
        tmpBody[tmpBody.length - 1].sort(compare);
        check(cnt, tmpArray, head, tmpBody);
      }
    }
  }

  if (this.chkArray.lastIndexOf(this.chkArray[cnt]) - cnt == 2) { // 커쯔
    tmpArray = this.chkArray.slice();
    tmpBody = body.slice();
    tmpBody.push(tmpArray.splice(cnt, 3));
    check(cnt, tmpArray, head, tmpBody);
  }



  if (this.chkArray.lastIndexOf(this.chkArray[cnt]) - cnt == 1) { // 머리
    tmpArray = this.chkArray.slice();
    tmpHead = head.slice();
    tmpHead.push(tmpArray.splice(cnt, 2));
    check(cnt, tmpArray, tmpHead, body);
  }
  check(cnt+1, array, head, body);
}

function doKkang(c) {
  this.a = new Array();
  hand.sort(compare);

  for (i = 0; i < hand.length; i++) {
    chkArray[i] = hand[i].ch[0];
  }
  chkArray.sort(compare);

  if (choosing == 0) {
    if (canKkang == 1) {
      for (i = 0; i < chkArray.length; i++) {
        if (chkArray.lastIndexOf(chkArray[i]) - i == 3) { 
          for (j = 0; j < hand.length; j++) {
            if (hand[j].ch[0] == chkArray[i]) {
              this.a[0] = j; break;
            }
          }
          break;
        }
      }
      ctx.clearRect(0, yPadding - cardY, (hand.length)*cardX + xPadding+30 , 60);
      tmpKkang = new Array();

      for (i = 0; i < 4; i++) {
        hand[this.a[0]].tShow(800 - cardX * (i + 1) - 10, yPadding - cardY * kkang.length);
        tmpKkang.push(hand.splice(this.a[0], 1)[0]);
      }
      kkang.push(tmpKkang);
      tsumocnt--;
      new tsumo(-2);
    }

    if (canKkang >= 2) {
      for (i = 0; i < chkArray.length; i++) {
        if (chkArray.lastIndexOf(chkArray[i]) - i == 3) { 
          for (j = 0; j < hand.length; j++) {
            if (hand[j].ch[0] == chkArray[i]) {
              this.a.push(j); break;
            }
          }
        }
      }

      for (i = 0; i < this.a.length; i++) {
        for (j = 0; j < 4; j++) {
          hand[this.a[i]].tShow(xPadding + cardX*j + cardX*5*i, yPadding + cardY*1.5);
        }
      }
      choosing = 1;
    }

  } else {
    if (c == undefined) return;

    for (i = 0; i < chkArray.length; i++) {
      if (chkArray.lastIndexOf(chkArray[i]) - i == 3) { 
        for (j = 0; j < hand.length; j++) {
          if (hand[j].ch[0] == chkArray[i]) {
            this.a.push(j); break;
          }
        }
      }
    }
    ctx.clearRect(0, yPadding - cardY, (hand.length)*cardX + xPadding+30 , 150);
    tmpKkang = new Array();

    for (i = 0; i < 4; i++) {
      hand[this.a[c]].tShow(800 - cardX * (i + 1) - 10, yPadding - cardY * kkang.length);
      tmpKkang.push(hand.splice(this.a[c], 1)[0].ch);
    }
    kkang.push(tmpKkang);
    tsumocnt--;
    choosing = 0;
    new tsumo(-2);
  }
}

function chkPoint(head, body) {

  // 추가

}

function statusPrint(head, body) {
  ctx.clearRect(0,0, 100, 80);
  ctx.font="20px Georgia";
  ctx.fillText("Head : " + head.length, 20, 30);
  ctx.fillText("Body : " + body.length, 20, 60);
  ctx.font = '42px Arial';
}

function start() {
  for (i = 0; i < 34; i++)
    rancheck[i] = 0;

  for (i = 0; i < 136; i++) {
    n = Math.floor(Math.random()*randeck.length);
    deck.push(randeck[n]);
    rancheck[n]++;
    if (rancheck[n] == 4) {
      rancheck.splice(n, 1);
      randeck.splice(n, 1);
    }
  }

  for (i = 0; i < 13; i++)
    hand.push(new card(deck.splice(0, 1)));

  // 테스트용

  /*
  for (i = 0; i < 4; i++)
    hand.push(new card(new Array('？？')));
  for (i = 0; i < 4; i++)
    hand.push(new card(new Array('？？')));
  for (i = 0; i < 4; i++)
    hand.push(new card(new Array('？？')));
  hand.push(new card(deck.splice(0, 1)));
  */
  hand.sort(compare);
  hand.push(new card(deck.splice(0, 1)));

  for (i = 0; i < 13; i++)
    hand[i].show(i*cardX + xPadding);

  hand[13].show(13*cardX + xPadding+10);

  for (i = 0; i < 14; i++)
    chkArray[i] = hand[i].ch[0];

  chkArray.sort(compare);
  new check(-1, chkArray, new Array(), new Array());
  new statusPrint(max.head, max.body);
}

function tsumo(num) {
  chkArray = [];
  if (num == -1 || tsumocnt > 18 || num >= hand.length) return;

  if (tsumocnt != 18) {
    if (num != -2) { // 깡으로 쯔모하는 게 아닐 때
      hand[num].tShow((tsumocnt % 6) * cardX + trashXPadding, trashYPadding + Math.floor(tsumocnt / 6) * cardY);
      hand.splice(num, 1);
      hand.sort(compare);
      hand.push(new card(deck.splice(0, 1)));
    } else  { // 깡으로 쯔모할 때
      hand.push(new card(deck.splice(deck.length-1, 1)));
    }
    ctx.clearRect(0, yPadding - 60, (hand.length)*cardX + xPadding + 20 , 100);	

    for (i = 0; i < hand.length - 1; i++)
      hand[i].show(i*cardX + xPadding);

    hand[hand.length - 1].show((hand.length - 1)*cardX + xPadding+10);

    for (i = 0; i < hand.length; i++) {
      chkArray[i] = hand[i].ch[0];
    }
  } else {
    ctx.clearRect(0, yPadding - 60, (hand.length)*cardX + xPadding + 20 , 100);
    hand.splice(num, 1);

    for (i = 0; i < hand.length; i++)
      hand[i].show(i*cardX + xPadding);

    for (i = 0; i < hand.length; i++) {
      chkArray[i] = hand[i].ch[0];
    }
  }
  chkArray.sort(compare);
  max = new pair(new Array(), new Array());
  new check(-1, chkArray, new Array(), kkang);
  new statusPrint(max.head, max.body);

  tsumocnt++;

  if (tsumocnt == 19) {
    new lose();
  }
}
new start();