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
  'sprites_0008'
];

function getSprite(resources, sprite) {
  return new PIXI.Sprite(resources[sprite].texture);
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

  for (i=0;i<size;i++) {
    for (u=0;u<size;u++){
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
        if (spriteNum < 6) {
          var brick = new PIXI.Sprite(resources['sprites_000' + spriteNum].texture);

          brick.scale.x = 2;
          brick.scale.y = 2;

          gameBlockContainer.addChild(brick);

          brick.x = 48*i;
          brick.y = 48*u;
        }
      }
    }
  }

  console.log(gameBlockContainer);
  stage.addChild(gameBlockContainer);
  renderer.render(stage);
});
