var smhiData;
var width = 246;
var height = 268;
var pointArray = new Array(width);
  for(var i = 0; i < width; i++) 
  {
    pointArray[i] = new Array(height);
  }

var MenuLayer = cc.Layer.extend({
    spriteSheet:null,
    sprite:null,
    rect:null,
    node:null,
    ctor:function () {

        this._super();
    },
    init:function(){

        var size = cc.winSize;
                                
        cache = cc.spriteFrameCache;
        cache.addSpriteFrames(res.test_plist, res.test_png);
        var test = cc.Sprite.create(cache.getSpriteFrame("CloseNormal.png"));
        test.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(test);

        /*var loadingText = new cc.LabelTTF("Loading Points", "Helvetica", 20);
        loadingText.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(loadingText);
*/
        var circle1 = cc.DrawNode.create();
        circle1.drawDot(cc.p(size.width/1.7, size.height/1.9), 5, cc.color(255,0,0,255));
        this.addChild(circle1);

        var circle2 = cc.DrawNode.create();
        circle2.drawDot(cc.p(size.width/1.7, size.height/2), 3, cc.color(0,255,0,255));
        this.addChild(circle2);
        var circle3 = cc.DrawNode.create();
        circle3.drawDot(cc.p(size.width/1.7, size.height/2.1), 2, cc.color(0,0,255,255));
        this.addChild(circle3);

        cc.loader.loadJson("res/smhi_data_every5.json", function(error, data){
          smhiData = data;
          getPoint();
          cc.director.runScene(new PlayScene(pointArray));
          //drawPointSprite();
        });
        return true;
    }

});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});


function getPoint(){

        var xStart = 30;
        var xEnd = 230;
        var yStart = 5;
        var yEnd = 255;
        var arrCount = 0;
        var count = 0;

        for(var x = 0; x < width; x++) 
        {
          for(var y = 0; y < height; y++) 
          {
              pointArray[x][y] = 0;
          }
        }

        for(var x = xStart; x < xEnd; x += 5) {
          for(var y = yEnd-5; y >= yStart; y -= 5) {
            //console.log('x: ' + x + ' y: ' + y)
                pointArray[x][y] = smhiData.SMHIPoints[arrCount];
                //console.log(pointArray[x][y]);
                arrCount++;
                count++;
            }
        }
        
        cc.log(count + ' points loaded!');
}


function graySprite(sprite)
{
    var shader = new cc.GLProgram();//cc.GLProgram.create("gray.vsh", "gray.fsh");
    shader.retain();
    shader.initWithVertexShaderFilename(res.vert_shader, res.frag_shader);
    shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
    shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
    shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

    shader.link();
    shader.updateUniforms();
    sprite.setShaderProgram(shader);
}



