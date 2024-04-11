var canvas = document.getElementById('graph_canvas');
var context = canvas.getContext("2d");
var RADIUS = 20;

var SIMULATION;
var transform = d3.zoomIdentity;

function drawGraphCanvas(){
    SIMULATION = d3.forceSimulation(GRAPH['nodes'])
        .force("link", d3.forceLink(GRAPH['links']).distance(RENDERER['force_link']))
        .force("center",d3.forceCenter(RENDERER['winWidth']/2, RENDERER['winHeight']/2))
        .force("charge",d3.forceManyBody().strength(-RENDERER['force_manybody']));

    SIMULATION.nodes(GRAPH['nodes'])
              .on("tick", canvasRender);

    SIMULATION.force("link")
              .links(GRAPH['links']);

    d3.select(canvas)
        .call(canvasRender)
        .call(d3.drag().container(canvas).subject(subject_from_event).on("start", drag_started).on("drag", dragged).on("end", drag_ended))
        .call(d3.zoom().scaleExtent([0.1, 10]).on("zoom", function () { transform = d3.event.transform; canvasRender(); }))
        .on("click", canvas_click)
        .on("mousemove", canvas_mouseover);

}


function canvasRender() {
    context.save();
    context.clearRect(0, 0, RENDERER['winWidth'], RENDERER['winHeight']);
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
    //canvas api绘制边
    GRAPH['links'].forEach(function(d){
        context.beginPath();
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
        if(APPEARANCE.theme == 'light'){
            context.strokeStyle = GRAPH['link_color'][d.type];
        }else{
            context.strokeStyle = GRAPH['link_color_dark'][d.type];
        }
        context.stroke();
    });
    //canvas api绘制
    GRAPH['nodes'].forEach(function(d, i) {
        context.beginPath();
        context.fillStyle = GRAPH['color'][d.type];
        RADIUS = 20;
        if ((RENDERER['curNodeId'] != undefined || RENDERER['curNodeId'] != null) && d.id == RENDERER['curNodeId']) {
            RADIUS = 35;
            context.fillStyle = addBright(GRAPH['color'][d.type], 0.1);
        }
        context.arc(d.x, d.y, RADIUS, 0, 2 * Math.PI, true);
        context.fill();
        context.lineWidth = 5;
        if(d.community == '1'){
            context.strokeStyle = GRAPH['community_stroke_color'][0];
            context.stroke();
        }
        if (d.query == '1'){
            context.strokeStyle = GRAPH['query_stroke_color'][0];
            context.stroke();
        }
        if(RENDERER['withLabel'] == 1){
            context.font = "16px TsangerXuanSanM_W03";
            if(APPEARANCE.theme == 'light'){
                context.fillStyle = GRAPH['text_color'][0];
            }else{
                context.fillStyle = GRAPH['text_color_dark'][0];
            }
            context.fillText(d.name, d.x - 20, d.y + 8);
        }
    });
    context.restore();
}

function subject_from_event() {
    var ex = transform.invertX(d3.event.x),
        ey = transform.invertY(d3.event.y);
    var node = SIMULATION.find(ex, ey);
    if(node && ex > node.x - 20 && ex < node.x + 20 && ey > node.y - 20 && ey < node.y + 20){
        node.x = transform.applyX(node.x);
        node.y = transform.applyY(node.y);
        return node;
    }
    return null;
}

function drag_started() {
    d3.event.subject.fx = transform.invertX(d3.event.x);
    d3.event.subject.fy = transform.invertY(d3.event.y);
    if (!d3.event.active) SIMULATION.alphaTarget(0.3).restart();
    d3.event.sourceEvent.stopPropagation();
}
function dragged() {
    d3.event.subject.fx = transform.invertX(d3.event.x);
    d3.event.subject.fy = transform.invertY(d3.event.y);
}
function drag_ended() {
    if (!d3.event.active) SIMULATION.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
}

function canvas_click() {
    const ex = transform.invertX(d3.event.layerX);
    const ey = transform.invertY(d3.event.layerY);
    const node = SIMULATION.find(ex, ey);
    if(node && ex > node.x - 20 && ex < node.x + 20 && ey > node.y - 20 && ey < node.y + 20){
        showNodeInfo(node);
    }
}

function canvas_mouseover() {
    const ex = transform.invertX(d3.event.layerX);
    const ey = transform.invertY(d3.event.layerY);
    const node = SIMULATION.find(ex, ey);
    if(node && ex > node.x - 20 && ex < node.x + 20 && ey > node.y - 20 && ey < node.y + 20){
        canvas.style.cursor = 'pointer';
        RENDERER['curNodeId'] = node.id;
        canvasRender();
    }else{
        canvas.style.cursor = 'default';
        RENDERER['curNodeId'] = null;
        canvasRender();
    }
}

function resetTransform() {
    transform.k = 1;
    transform.x = 0;
    transform.y = 0;
    canvasRender();
}

function moveToNodeCanvas(id) {
    let target_x;
    let target_y;
    GRAPH['nodes'].forEach(function(d, i) {
        if(d.id == id){
            target_x = parseInt(RENDERER['winWidth']) /2 - d.x;
            target_y = parseInt(RENDERER['winHeight']) /2 - d.y;
        }
    });
    if(target_x != undefined && target_y != undefined){
        transform.x = target_x;
        transform.y = target_y;
        canvasRender();
    }
}
