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
  this.addEdge = function(v, w, l){
    let vx = this.vertices[v]['x'];
    let vy = this.vertices[v]['y'];
    let wx = this.vertices[w]['x'];
    let wy = this.vertices[w]['y'];
    let d = dist(vx, vy, wx, wy);
    if(lengthType.checked()){
      this.matrix[v][w] = d/scl;
      this.matrix[w][v] = d/scl;  //Add both.
    }else{
      this.matrix[v][w] = l;
      this.matrix[w][v] = l;  //Add both.
    }
  }

  //Helper function for printing matrix.
  this.print = function(){
    console.log(this.matrix);
  }

  this.draw = function(){
    textAlign(CENTER);
    for(let a in this.matrix){
      for(let b in this.matrix[a]){
          let x1 = this.vertices[a]['x'];
          let y1 = this.vertices[a]['y'];
          let x2 = this.vertices[b]['x'];
          let y2 = this.vertices[b]['y'];
          stroke(94, 124, 136, 128);
          strokeWeight(lineSize);
          line(x1, y1, x2, y2);
          let mx = (x1+x2)/2;
          let my = (y1+y2)/2;
          let d = Math.floor(this.matrix[a][b]*100)/100;
          noStroke();
          fill(210, 239, 247);
          text(d, mx, my);
      }
    }

    for(let key in this.vertices){
      let x = this.vertices[key]['x'];
      let y = this.vertices[key]['y'];
      if(selected !== null && selected == key){
        stroke(254, 230, 90);
      }else{
        stroke(234, 160, 21);
      }
      strokeWeight(3);
      fill(155, 189, 207);
      ellipse(x, y, pointSize, pointSize);
      noStroke();
      fill(210, 239, 247);
      text(key, x, y-pointSize+10);
    }


  }
}
