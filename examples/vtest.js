var width = 960,
    height = 720,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.linear()
    .range([0, radius]);

var color = d3.scale.category20c();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var partition = d3.layout.partition()
    .value(function(d) { return d.percentage; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var datas = [
    'data/data1.json',
    'data/data2.json',
    'data/data3.json',
    'data/data6.json',
    'data/data7.json',

    'data/data4.json',

    'data/data5.json',
    'data/data8.json',
    'data/data9.json'
];

var data_count = 0;
var mainRoot = null;
var g = null;
var text = null;
var path = null;

setInterval(function() {
  
    d3.json(datas[data_count], function(error, root) {

    
      console.log(datas[data_count]);
      // if (data_count === 0) {
        g = svg.selectAll("g")
            .data(partition.nodes(root.tree))
          .enter().append("g");

        path = g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
          .on("click", click);

        text = g.append("text")
          .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
          .attr("x", function(d) { return y(d.y); })
          .attr("dx", "6") // margin
          .attr("dy", ".35em") // vertical-align
          .text(function(d) { return d.name; });

        data_count++;

        function click(d) {
          // fade out all text elements
          text.transition().attr("opacity", 0);

          path.transition()
            .duration(750)
            .attrTween("d", arcTween(d))
            .each("end", function(e, i) {
                // check if the animated element's data e lies within the visible angle span given in d
                if (e.x >= d.x && e.x < (d.x + d.dx)) {
                  // get a selection of the associated text element
                  var arcText = d3.select(this.parentNode).select("text");
                  // fade in the text element and recalculate positions
                  arcText.transition().duration(750)
                    .attr("opacity", 1)
                    .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
                    .attr("x", function(d) { return y(d.y); });
                }
            });
        }
      if (data_count > 0) {
        // g.exit().remove();
        // path.exit().remove();
        // text.exit().remove();

      //   svg.selectAll("g")
      //   .data(partition.nodes(root.tree))
      //   .exit()
      //   .remove();

      // // var d = mainRoot;
      // var d = root.tree;
      

      //   // text.transition().attr("opacity", 0);

      //     path.transition()
      //       .duration(150)
      //       .attrTween("d", arcTween(d))
      //       .each("end", function(e, i) {
      //           // check if the animated element's data e lies within the visible angle span given in d
      //           if (e.x >= d.x && e.x < (d.x + d.dx)) {
      //             // get a selection of the associated text element
      //             var arcText = d3.select(this.parentNode).select("text");
      //             // fade in the text element and recalculate positions
      //             arcText.transition().duration(750)
      //               .attr("opacity", 1)
      //               .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
      //               .attr("x", function(d) { return y(d.y); });
      //           }
      //       });
      };
      mainRoot = root.tree;
      data_count++;
      if(data_count > datas.length-1) data_count = 0;
    });
    
    
    d3.select(self.frameElement).style("height", height + "px");

    
    

}, 2000);

// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}

