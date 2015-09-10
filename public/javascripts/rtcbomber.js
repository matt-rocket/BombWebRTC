Array.prototype.containsArray = function(val) {
  var hash = {};
  for(var i=0; i<this.length; i++) {
    hash[this[i]] = i;
  }
  return hash.hasOwnProperty(val);
};

var renderer = new PIXI.autoDetectRenderer(720, 720);
document.getElementById('pixi-field').appendChild(renderer.view);

var stage = new PIXI.Container();
var loader = PIXI.loader;
var textures = [
  'bomberman',
  'bombs_0001',
  'bombs_0002',
  'bombs_0003',
  'bombs_0004',
  'sprites_0000',
  'sprites_0001',
  'sprites_0002',
  'sprites_0003',
  'sprites_0004',
  'sprites_0005',
  'sprites_0006',
  'sprites_0007',
  'sprites_0008',
  'Stone_Brick',
  'Brick'
];
var players = [
  {
    name: 'Player 1',
    currentPos: [],
    sprite: null,
    possibleSpawnPoints: [
      [1,1],
      [0,1],
      [1,0]
    ],
    bombs: [],
    maxBombs: 5,
    bombSize: 3,
    dead: false,
    listeners: []
  },
  {
    name: 'Player 2',
    currentPos: [],
    sprite: null,
    possibleSpawnPoints: [
      [13,1],
      [13,0],
      [14,1]
    ],
    bombs: [],
    maxBombs: 5,
    bombSize: 3,
    dead: false,
    listeners: []
  },
  {
    name: 'Player 3',
    currentPos: [],
    sprite: null,
    possibleSpawnPoints: [
      [1,13],
      [0,13],
      [1,14]
    ],
    bombs: [],
    maxBombs: 5,
    bombSize: 3,
    dead: false,
    listeners: []
  },
  {
    name: 'Player 4',
    currentPos: [],
    sprite: null,
    possibleSpawnPoints: [
      [13,13],
      [13,14],
      [14,13]
    ],
    bombs: [],
    maxBombs: 5,
    bombSize: 3,
    dead: false,
    listeners: []
  }
];
var playingField = [];
var pillars = [];
var brickSprites = [];

var myPlayerNumber = 0;
var bombTime = 2000;

function checkPos(coordinates) {
  var blackList = [
    '0,0',
    '0,1',
    '1,0',
    '1,1',
    '14,14',
    '13,14',
    '14,13',
    '13,13',
    '0,14',
    '1,14',
    '0,13',
    '1,13',
    '14,1',
    '14,0',
    '13,1',
    '13,0'
  ];
  return (_.indexOf(blackList, coordinates) === -1);
}

textures.forEach(function (val) {
  loader.add(val, '/sprites/' + val + '.png');
});

loader.load(function (loader, resources) {
  var backgroundContainer = new PIXI.Container();
  var gameBlockContainer = new PIXI.Container();

  /*
   * Floor rendering
   */
  for (var i = 0; i < 15; i++) {
    for (var u = 0; u < 15; u++) {
      var tile = new PIXI.Sprite(resources['sprites_0008'].texture);

      tile.scale.x = 2;
      tile.scale.y = 2;

      backgroundContainer.addChild(tile);

      tile.x = 48 * i;
      tile.y = 48 * u;
    }
  }

  stage.addChild(backgroundContainer);
  renderer.render(stage);

  /*
   * Wall and vase rendering
   */
  for (var i = 0; i < 15; i++) {
    for (var u = 0; u < 15; u++){
      if ((i + 7) % 7 === 0 && (u + 7) % 7 === 0) {
        var pillar = new PIXI.Sprite(resources['sprites_0006'].texture);

        pillar.scale.x = 2;
        pillar.scale.y = 2;

        gameBlockContainer.addChild(pillar);

        pillar.x = 48*i;
        pillar.y = 48*u;
        pillars.push([i,u]);
      }
      else {
        if (Math.floor((Math.random() * 10)) < 6 && checkPos(i+','+u)) {
          playingField.push([i, u]);
        }
      }
    }
  }

  stage.addChild(gameBlockContainer);
  renderer.render(stage);

  renderBricks(playingField);

  /*
   * Player rendering
   */
  players.forEach(function (player) {
    player.currentPos = player.possibleSpawnPoints[Math.floor((Math.random() * 3))];
    renderBomberMan(player);
  });

  function renderBomberMan(player) {
    var man = player.sprite ? player.sprite : new PIXI.Sprite(resources['bomberman'].texture);
    player.sprite = man;

    man.scale.x = 1.54;
    man.scale.y = 1.54;

    gameBlockContainer.addChild(man);

    man.x = 48 * player.currentPos[0] + 12;
    man.y = 48 * player.currentPos[1];
    renderer.render(stage);
  }

  function renderBrick(i,u) {
    var brick = new PIXI.Sprite(resources['Stone_Brick'].texture);
    brickSprites.push(brick);

    brick.scale.x = 2;
    brick.scale.y = 2;

    gameBlockContainer.addChild(brick);

    brick.x = 48*i;
    brick.y = 48*u;
  }

  function renderBricks(bricks) {
    bricks.forEach(function (coor) {
      renderBrick(coor[0], coor[1]);
    });

    renderer.render(stage);
  }

  function offSetPlayer(i, u) {
    var oldX = players[myPlayerNumber].currentPos[0];
    var oldY = players[myPlayerNumber].currentPos[1];
    var newX = oldX + i;
    var newY = oldY + u;

    if (!playingField.containsArray([newX, newY]) && !pillars.containsArray([newX, newY])) {
      if (newX < 15 && newX >= 0){
        players[myPlayerNumber].currentPos[0] = newX;
      }
      if (newY < 15 && newY >= 0) {
        players[myPlayerNumber].currentPos[1] = newY;
      }
    }

    renderBomberMan(players[myPlayerNumber]);
  }

  function determineDestruction(i, u) {
    // Check if any players are in the coordinates
    players.forEach(function (player) {
      if (player.currentPos[0] === i && player.currentPos[1] === u) {
        player.dead = true;
        gameBlockContainer.removeChild(player.sprite);
        player.sprite.destroy();

        player.listeners.forEach(function (listener) {
          listener.press = null;
          listener.release = null;
        });
      }
    });

    // Check if any bricks are in the coordinates
    if (playingField.containsArray([i,u])) {
      var fieldIndex = _.findIndex(playingField, [i,u]);
      gameBlockContainer.removeChild(brickSprites[fieldIndex]);
      brickSprites[fieldIndex].destroy();
      brickSprites.splice(fieldIndex, 1);
      playingField.splice(fieldIndex, 1);
    }
    renderer.render(stage);
  }

  function placeFlame(i,u, time) {
    var flame = new PIXI.Sprite(resources['bombs_0004'].texture);

    flame.scale.x = 1.7;
    flame.scale.y = 1.7;

    gameBlockContainer.addChild(flame);

    flame.x = 48*(i);
    flame.y = 48*(u);

    setTimeout(function(){
      gameBlockContainer.removeChild(flame);
      flame.destroy();
      determineDestruction(i,u);

      renderer.render(stage);
    }, time);
  }

  function placeBomb(i, u) {
    if (players[myPlayerNumber].bombs.length < players[myPlayerNumber].maxBombs) {
      var bomb = new PIXI.Sprite(resources['bombs_0001'].texture);
      players[myPlayerNumber].bombs.push(bomb);

      bomb.scale.x = 2;
      bomb.scale.y = 2;

      gameBlockContainer.addChild(bomb);

      bomb.x = 48*i + 10;
      bomb.y = 48*u + 10;
      renderer.render(stage);

      setTimeout(function (){
        gameBlockContainer.removeChild(bomb);
        bomb.destroy();

        var explodedBomb = new PIXI.Sprite(resources['bombs_0004'].texture);

        explodedBomb.scale.x = 2;
        explodedBomb.scale.y = 2;

        gameBlockContainer.addChild(explodedBomb);

        explodedBomb.x = 48*i;
        explodedBomb.y = 48*u;

        for (var z = 1; z < players[myPlayerNumber].bombSize; z++) {
          placeFlame(i+z, u, bombTime/3);
          placeFlame(i-z, u, bombTime/3);
          placeFlame(i, u+z, bombTime/3);
          placeFlame(i, u-z, bombTime/3);
        }
        determineDestruction(i,u);
        renderer.render(stage);

        setTimeout(function(){
          gameBlockContainer.removeChild(explodedBomb);
          explodedBomb.destroy();
          players[myPlayerNumber].bombs.pop();

          renderer.render(stage);
        }, bombTime /3);
      }, bombTime);
    }
  }

  /*
   * Enable keyboard
   */
  // Left arrow
  players[myPlayerNumber].listeners.push(keyboard(37, function() { // Pressed
      offSetPlayer(-1, 0);
    }, function () {}));

  // Up arrow
  players[myPlayerNumber].listeners.push(keyboard(38, function() { // Pressed
      offSetPlayer(0, -1);
    }, function (){}));

  // Right arrow
  players[myPlayerNumber].listeners.push(keyboard(39, function() { // Pressed
      offSetPlayer(1, 0);
    }, function (){}));

  // Down arrow
  players[myPlayerNumber].listeners.push(keyboard(40, function() { // Pressed
      offSetPlayer(0, 1);
    }, function () {}));

  // Space bar
  players[myPlayerNumber].listeners.push(keyboard(32, function() {}, function () {
    placeBomb(players[myPlayerNumber].currentPos[0], players[myPlayerNumber].currentPos[1]);
  }));
});

function keyboard(keyCode, pressed, released) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = pressed;
  key.release = released;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
