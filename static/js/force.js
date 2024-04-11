var svg = d3.select("#graph_svg");

var SIMULATION;
var SVG_LINKS;
var SVG_NODES;
var SVG_COM;
var SVG_TEXTS;
var MARKER;

var HAS_COM = 0;
var CIRCLE_NODES = [];
var RECT_NODES = [];

function drawGraphSvg(){
    SIMULATION = d3.forceSimulation(GRAPH['nodes'])
        .force("link", d3.forceLink(GRAPH['links']).distance(RENDERER['force_link']))
        .force("center",d3.forceCenter(RENDERER['winWidth']/2, RENDERER['winHeight']/2))
        // 引力
        .force("charge",d3.forceManyBody().strength(-RENDERER['force_manybody']));

    initGraphSvg();

    SIMULATION.nodes(GRAPH['nodes'])
              .on("tick", svgTicked);

    SIMULATION.force("link")
              .links(GRAPH['links']);
}

function initGraphSvg() {
    svg.selectAll("*").remove();

    SVG_LINKS = svg.selectAll("line")
        .data(GRAPH['links'])
        .enter()
        .append("line")
        .style("stroke", function(d,i){
            if(APPEARANCE.theme == 'light'){
                return GRAPH['link_color'][d.type];
            }else{
                return GRAPH['link_color_dark'][d.type];
            }
        })
        .style("stroke-width", 1)
        .call(d3.zoom()
            .scaleExtent([-5, 2])
        );

    SVG_NODES = svg.selectAll("circle")
        .data(GRAPH['nodes'])
        .enter()
        .append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", '20')
        .attr("fill", function(d,i){
            return GRAPH['color'][d.type];
        })
        .attr("id", function(d,i){
            return i;
        })
        .attr("stroke", function (d) {
            let sc = '';
            if(d.community == 1){
                sc = GRAPH['community_stroke_color'][0];
            }
            if(d.query == 1){
                sc = GRAPH['query_stroke_color'][0];
            }
            return sc;
        })
        .attr("stroke-width", 5)
        .attr("class", function(d) {
            return 'n_id_'+d.id;
        })
        .on("click", showNodeInfo)
        .on("mouseover", mouseoverNode)
        .on("mouseleave", mouseleaveNode)
        .call(d3.drag().on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    SVG_TEXTS = svg.selectAll("text")
        .data(GRAPH['nodes'])
        .enter()
        .append("text")
        .attr("fill", function (d) {
            if(APPEARANCE.theme == 'light'){
                return GRAPH['text_color'][0];
            }else{
                return GRAPH['text_color_dark'][0];
            }
        })
        .attr("dx", 20)
        .attr("dy", 8)
        .on("click", showNodeInfo)
        .on("mouseover", mouseoverNode)
        .on("mouseleave", mouseleaveNode)
        .call(d3.drag().on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .text(function(d){
            return d.name;
        });

    if(RENDERER['withLabel'] == 0){
        SVG_TEXTS.attr("style", 'display: none;');
    }else{
        SVG_TEXTS.attr("style", '');
    }

    svgTicked();
}

function dragstarted(d) {
    if (!d3.event.active) SIMULATION.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) SIMULATION.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function svgTicked() {
    SVG_LINKS.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("marker-end", "url(#resolved)");

    SVG_NODES.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    SVG_TEXTS.attr("x", function(d){ return d.x - 40; })
        .attr("y", function(d){ return d.y; });

}

var input_focus = 0;

function input_ok(objList){
    for (var obj of objList){
        obj.css({'border': '2px solid rgba(0, 100, 168, 0.5)'});
    }
}

function input_reset(objList){
    for (var obj of objList) {
        obj.css({'border': '2px solid rgba(0, 0, 0, 0.1)'});
        obj.removeClass('highlight_border_inf');
    }
}

function showNodeInfo(d) {
    scrollToPosition('menu', 0);
    $('#node_id').text(d.id);
    $('#node_type').text(d.type);
    $('#node_info').text(d.prob);
    $('#node_name').text(d.name);
    $('#node_id').css({color: GRAPH['color'][d.type]});
    if(input_focus == 0){
        $('#n1_id').val(d.id);
        input_ok([$('#n1_id')]);
        $('#n2_id').addClass('highlight_border_inf');
    }else if(input_focus == 1){
        $('#n2_id').val(d.id);
        input_ok([$('#n2_id')]);
        $("#search_set").click();
        input_reset([$('#n1_id'),$('#n2_id')]);
    }
    input_focus = (input_focus + 1) % 2;
}

function mouseoverNode(d) {
    var n = $('.n_id_'+d.id);
    n.css({'filter': 'brightness(1.2)'});
    n.attr('r', 25);
}

function mouseleaveNode(d) {
    var n = $('.n_id_'+d.id);
    n.css({'filter': 'brightness(1)'});
    n.attr('r', 20);
}
