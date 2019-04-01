
export function Graph() {


var svg = d3.select('svg'),
    width =+ svg.attr("width"),
    height =+ svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-30))
    .force("collide", d3.forceCollide(30).strength(0.9))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(3))
    .force('y', d3.forceY(16));

d3.json("data/force.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { 
        if(d.source !== 'Social Emotional Learning'){
          return 0;
        } else {
          return Math.sqrt(d.value);
        }
         });

  var node = svg.append("g")
    .selectAll("a")
    .data(graph.nodes)
    .enter().append("g")

  var circles = node.append("a")
    .attr("xlink:href", function(d){
      return 'https://mindedu.com/' + d.id;
    })
    .append("circle")
      .attr("r", 5)
      .attr('xlink:href', "random.xom")
      .attr("fill", function(d) { 
        if(d.group !== 3){
          return '#fff';
        } else {
          return color(d.group);
        };
         })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  var hrefs = node.append("a")
    .attr("xlink:href", function(d) {
      return d.id;
    })
    .attr('x', 6)
    .attr('y', 3)
    .attr('width' , 10)
    .attr('height', 10)
    .attr('class', 'nodes');

  


  var lables = node.append("text")
    .text(function(d) {
      if(d.group !== 3){
        return '';
      } else {
        return d.id;
      }
    })
    .attr('x', 6)
    .attr('y', 3)
    .attr('class', 'nodes label');
  



  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

};
