var renderer = new PIXI.autoDetectRenderer(768, 768);
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
  var size = 16;

  for (i = 0; i < size; i++) {
    for (u = 0; u < size; u++) {
      var tile = new PIXI.Sprite(resources['sprites_0008'].texture);

      tile.scale.x = 2;
      tile.scale.y = 2;

      stage.addChild(tile);

      tile.x = 48 * i;
      tile.y = 48 * u;

      renderer.render(stage);
    }
  }

  renderer.render(stage);
});
