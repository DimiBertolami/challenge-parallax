(function() {
  let Building, Skyline, dt, sketch, skylines;

  sketch = Sketch.create();

  sketch.mouse.x = sketch.width / 10;

  sketch.mouse.y = sketch.height/5;

  skylines = [];

  dt = 1;

  
  // BUILDINGS

  Building = function(config) {
    return this.reset(config);
  };

  Building.prototype.reset = function(c) {
    this.layer = c.layer;
    this.x = c.x;
    this.y = c.y;
    this.width = c.width;
    this.height = c.height;
    this.color = c.color;
    return random(5, 50);
  };

  Building.prototype.render = function() {
    sketch.fillStyle = sketch.strokeStyle = this.color;
    sketch.lineWidth = 2;
    sketch.beginPath();
    sketch.rect(this.x, this.y, this.width, this.height);
    sketch.fill();
    sketch.stroke();
  };

  
  // SKYLINES

  Skyline = function(c) {
    this.x = 0;
    this.buildings = [];
    this.layer = c.layer;
    this.width = {
      min: c.width.min,
      max: c.width.max
    };
    this.height = {
      min: c.height.min,
      max: c.height.max
    };
    this.speed = c.speed;
    this.color = c.color;
    this.populate();
    return this;
  };

  Skyline.prototype.populate = function() {
    let newHeight, newWidth, results, totalWidth;
    totalWidth = 0;
    results = [];
    while (totalWidth <= sketch.width + (this.width.max * 3)) {
      newWidth = round(random(this.width.min, this.width.max));
      newHeight = round(random(this.height.min, this.height.max));
      this.buildings.push(new Building({
        layer: this.layer,
        x: this.buildings.length === 0 ? 0 : this.buildings[this.buildings.length - 1].x + this.buildings[this.buildings.length - 1].width,
        y: sketch.height - newHeight,
        width: newWidth*4,
        height: newHeight,
        color: this.color
      }));
      results.push(totalWidth += newWidth);
    }
    return results;
  };

  Skyline.prototype.update = function() {
    let firstBuilding, lastBuilding, newHeight, newWidth;
    this.x -= (sketch.mouse.x * this.speed) * dt;
    firstBuilding = this.buildings[0];
    if (firstBuilding.width + firstBuilding.x + this.x < 0) {
      newWidth = round(random(this.width.min, this.width.max));
      newHeight = round(random(this.height.min, this.height.max));
      lastBuilding = this.buildings[this.buildings.length - 1];
      firstBuilding.reset({
        layer: this.layer,
        x: lastBuilding.x + lastBuilding.width,
        y: sketch.height - newHeight,
        width: newWidth,
        height: newHeight,
        color: this.color
      });
      return this.buildings.push(this.buildings.shift());
    }
  };

  Skyline.prototype.render = function() {
    let i;
    i = this.buildings.length;
    sketch.save();
    sketch.translate(this.x, (sketch.height - sketch.mouse.y) / 20 * this.layer);
    while (i--) {
      this.buildings[i].render(i);
    }
    return sketch.restore();
  };

  
  // SETUP

  sketch.setup = function() {
    var i, results;
    i = 50;
    results = [];
    while (i--) {
      results.push(skylines.push(new Skyline({
        layer: i + 1,
        width: {
          min: (i + 1) * 2,
          max: (i + 1) * 3
        },
        height: {
          min: 3 - (i * 5),
          max: 700 - (i * 5)
        },
        speed: (i + 1) * .005,
        color: 'hsl( 100, ' + (((i + 1) * 6) + 300) + '%, ' + (65 - (i * 8)) + '% )'
      })));
    }
    return results;
  };

  
  // CLEAR

  sketch.clear = function() {
    return sketch.clearRect(0, 0, sketch.width, sketch.height);
  };

  
  // UPDATE

  sketch.update = function() {
    let i, results;
    dt = sketch.dt < .1 ? .1 : sketch.dt / 16;
    dt = dt > 5 ? 5 : dt;
    i = skylines.length;
    results = [];
    while (i--) {
      results.push(skylines[i].update(i));
    }
    return results;
  };

  
  // DRAW

  sketch.draw = function() {
    let i, results;
    i = skylines.length;
    results = [];
    while (i--) {
      console.log(i, results, skylines[i]);
      results.push(skylines[i].render(i));
    }
    return results;
  };

  
  // Mousemove Fix rewritten as a normal eventlistener instead of a jquery one since the coaches think
  // we should steer clear from  jquery. I find the syntax so beautiful so i'm in conflict here..
  // better listen to the coaches! these two functions do the exact same..
  // $(window).on('mousemove', function(e) {
  //   sketch.mouse.x = e.pageX;
  //   return sketch.mouse.y = e.pageY;
  // });
  window.addEventListener('mousemove', function (e){
    sketch.mouse.x = e.pageX;
    return sketch.mouse.y = e.pageY;
  });
}).call(this);
