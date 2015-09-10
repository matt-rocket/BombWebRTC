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

function checkPos(coordinates, size) {
  var blackList = [
    '0,0',
    '0,1',
    '1,0',
    '1,1',
    size+','+size,
    (size-1)+','+size,
    size+','+(size-1),
    size-1+','+(size-1),
    '0,'+size,
    '1,'+size,
    '0,'+(size-1),
    '1,'+(size-1),
    size + ',1',
    size + ',0',
    (size-1) + ',1',
    (size-1) + ',0'
  ];
  return (_.indexOf(blackList, coordinates) === -1);
}


textures.forEach(function (val) {
  loader.add(val, '/sprites/' + val + '.png');
});

loader.load(function (loader, resources) {
  var size = 15;
  var backgroundContainer = new PIXI.Container();
  var gameBlockContainer = new PIXI.Container();

  for (i = 0; i < size; i++) {
    for (u = 0; u < size; u++) {
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

  for (var i=0;i<size;i++) {
    for (var u=0;u<size;u++){
      if ((i + 7) % 7 === 0 && (u + 7) % 7 === 0) {
        var pillar = new PIXI.Sprite(resources['sprites_0006'].texture);

        pillar.scale.x = 2;
        pillar.scale.y = 2;

        gameBlockContainer.addChild(pillar);

        pillar.x = 48*i;
        pillar.y = 48*u;
      }
      else {
        var spriteNum = Math.floor((Math.random() * 10));
        if (spriteNum < 6 && checkPos(i+','+u, size-1)) {
          var brick = new PIXI.Sprite(resources['Stone_Brick'].texture);

          brick.scale.x = 2;
          brick.scale.y = 2;

          gameBlockContainer.addChild(brick);

          brick.x = 48*i;
          brick.y = 48*u;
        }
      }
    }
  }

  stage.addChild(gameBlockContainer);
  renderer.render(stage);
});
