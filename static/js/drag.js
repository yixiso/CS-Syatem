var jGraph = $('#graph_svg');

var isDown = 0;
var downX = 0;
var downY = 0;
var moveX = 0;
var moveY = 0;
var offsetX = 0;
var offsetY = 0;
var curX = 0;
var curY = 0;
var perspective = 5000;
var curWhl = 1;

function drag_svg() {
    var mDom = function(selector){
            return  document.querySelector(selector);
        },
        graph_box = mDom(".graph_box");

    graph_box.onmousedown = function(e){
        var e = e || window.event;
        downX = e.clientX;
        downY = e.clientY;
        isDown = 1;
    }

    graph_box.onmouseup = function(e){
        isDown = 0;
        curX = offsetX + curX;
        curY = offsetY + curY;
    }

    graph_box.onmousemove = function(e){
        var e = e || window.event;
        if(isDown){
            moveX = e.clientX;
            moveY = e.clientY;

            offsetX = moveX - downX;
            offsetY = moveY - downY;

            jGraph.css({'transform': 'translate('+ (curX + offsetX) +'px, '+ (curY + offsetY) +'px)scale('+curWhl+')'});
        }
    }

    graph_box.onwheel = function(e){
        e = e||window.event;
        if(e.deltaY > 0){
            curWhl = curWhl - 0.1;
            if(curWhl > 0)  jGraph.css({'transform': 'translate('+ curX +'px, '+ curY +'px)scale('+curWhl+')'});
        }else if(e.deltaY < 0){
            curWhl = curWhl + 0.1;
            if(curWhl <= 10) jGraph.css({'transform': 'translate('+ curX +'px, '+ curY +'px)scale('+curWhl+')'});
        }
        e.preventDefault();
    }
}

function undrag_svg() {
    var mDom = function(selector){
            return  document.querySelector(selector);
        },
        graph_box = mDom(".graph_box");

    graph_box.onmousedown = null;

    graph_box.onmouseup = null;

    graph_box.onmousemove = null;

    graph_box.onwheel = null;
}

function resetDrag() {
    jGraph.css({'transform': 'translate(0px, 0px)scale(1)'});
    isDown = 0;
    downX = 0;
    downY = 0;
    moveX = 0;
    moveY = 0;
    offsetX = 0;
    offsetY = 0;
    curX = 0;
    curY = 0;
    perspective = 5000;
    curWhl = 1;
}

function moveToNodeSvg(id) {
    let c = $('#'+id);
    let cx = parseInt(RENDERER['winWidth']) / 2;
    let cy = parseInt(RENDERER['winHeight']) / 2;
    let target_x = cx - c.attr('cx');
    let target_y = cy - c.attr('cy');
    if(target_x != undefined && target_y != undefined){
        offsetX = target_x;
        offsetY = target_y;
        console.log(offsetX +':' + offsetY)
        jGraph.css({'transform': 'translate('+ (curX + offsetX) +'px, '+ (curY + offsetY) +'px)scale('+curWhl+')'});
        curX = cx;
        curY = cy;
    }
}
