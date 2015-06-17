var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    rect:null,
    node:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
       // var closeItem = new cc.MenuItemImage(
       //     res.CloseNormal_png,
       //     res.CloseSelected_png,
       //     function () {
       //         cc.log("Menu is clicked!");
       //     }, this);
       // closeItem.attr({
       //     x: size.width - 20,
       //     y: 20,
       //     anchorX: 0.5,
       //     anchorY: 0.5
       // });

       // var menu = new cc.Menu(closeItem);
       // menu.x = 0;
       // menu.y = 0;
       // this.addChild(menu, 1);

        // Manually written code:

        this.sprite = cc.Sprite.create(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);
        graySprite(this.sprite);

        this.node = cc.DrawNode.create();
        this.addChild(this.node, 0);
        this.node.drawRect(cc.p(100,100), cc.p(200, 200), cc.color(100, 100, 200, 255), 3, cc.color(0,255,0,255));
        graySprite(this.node);

        return true;
    }
});

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

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

