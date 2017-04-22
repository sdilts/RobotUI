function Vertex(n, x, y) {
  this.name = n;
  this.pos = createVector(x, y);
}

function Digraph() {
  this.matrix = new Object; //Adjacency matrix using dictionary.
  this.vertices = new Object;
  /*
   *  Initialize dictionary for new vertex.
   */
  this.addVertex = function(v) {
    let point = new Object;
    point['x'] = v.pos.x;
    point['y'] = v.pos.y;
    this.matrix[v.name] = new Object;
    this.vertices[v.name] = point;
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

  this.draw = function(){
    for(let key in this.vertices){
      let x = this.vertices[key]['x'];
      let y = this.vertices[key]['y'];
      stroke(254, 180, 28);
      strokeWeight(3);
      fill(155, 189, 207);
      ellipse(x, y, 30, 30);
      textAlign(CENTER);
      noStroke();
      text(key, x, y-25);
    }
  }
}
