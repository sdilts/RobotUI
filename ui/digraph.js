function Vertex(n, x, y) {
  this.name = n;
  this.pos = createVector(x, y);
}

function Digraph() {
  this.matrix = [];

  /*
   *  Initialize dictionary for new vertex.
   */
  this.addVertex = function(v) {
    this.matrix[v.name] = [];
  }
  /*
   * Add edge between Vertex v and Vertex w.
   */
  this.addEdge = function(v, w){
    let d = v.pos.dist(w.pos);
    this.matrix[v.name][w.name] = d;
    this.matrix[w.name][v.name] = d;  //Add both.
  }

  //Helper function for printing matrix.
  this.print = function(){
    console.log(this.matrix);
  }
}
