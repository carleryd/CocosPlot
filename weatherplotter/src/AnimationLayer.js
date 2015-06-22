
var nodes = new Array(246);
for(var i = 0; i < 246; i++) {
    nodes[i] = new Array(268);
}


var AnimationLayer = cc.Layer.extend({
    ctor:function ( smhiData ) {
        this._super();
        this.init( smhiData );
    },
    init:function ( smhiData ) 
    {
        this._super();

        var time = 0;
        this.createNodes(smhiData);


        //var time = 0;

        //var circle = drawCircle(250, 100, 15, cc.color(255,0,0,255));
        //this.addChild(circle);


        if(cc.sys.capabilities.hasOwnProperty('keyboard'))
        {
            cc.eventManager.addListener(
            {
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function(key, event)
                {
                    //cc.log("key pressed" + key.toString());

                    switch(key) 
                    {
                        case 49: // left
                            time--
                            drawPointSprite(time, smhiData);
                            break;
                        case 50: // right
                            time++;
                            drawPointSprite(time, smhiData);
                            break;
                    }
                }

            }, this);
        }

        if(cc.sys.capabilities.hasOwnProperty('touches'))
        {
            cc.eventManager.addListener(
            {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan:function(touch, event)
                {
                    //cc.log(touch.getLocationX());
                    time ++;
                    drawPointSprite(time, smhiData);

                    return true;
                }
            }, this);
        }
    },
    createNodes:function(smhiData)
    {
        this._super();

        for(var x = 0; x < 246; x++)
        {
            for(var y = 0; y < 268; y++)
            {
                if (smhiData[x][y] != 0)
                {
                    nodes[x][y] = cc.DrawNode.create();
                    this.addChild(nodes[x][y]);
                }
            }
        }

        drawPointSprite(0, smhiData);
    }
});

function drawCircle(node, x, y, radius, color)
{

    //var drawnode = cc.DrawNode.create();
    node.drawDot(cc.p(x,y),radius,color);

    //return drawnode;
}




function drawPointSprite(time, smhiData){
var offsetX = 480;
var offsetY = 130;
var scaleX = 2.0/3;
var scaleY = 2.5/3;
var color;
    
    for(var x = 0; x < 246; x++)
    {
        for(var y = 0; y < 268; y++)
        {
            if (smhiData[x][y] != 0)
            {
                
                //console.log(smhiData[x][y]);

                xValue = scaleX * (offsetX + x * 2);
                yValue = scaleY * (offsetY + y * 2);

                // if(parameter == "t")
                // {  
                    var temp = smhiData[x][y].timeseries[time].t * 100 / 100;

                    //console.log(temp);
                    if(temp <= 0)
                        color = cc.color(72, 249 , 231, 255);
                    else if(temp > 0 && temp <= 5)
                        color = cc.color(41, 105, 233, 255);
                    else if(temp > 5 && temp <= 10)
                        color = cc.color(3, 36, 102, 255);
                    else if(temp > 10 && temp <= 15)
                        color = cc.color(135, 13, 165, 255);
                    else if(temp > 15 && temp <= 20)
                        color = cc.color(229, 11, 98, 255);
                    else if(temp > 20) {
                        color = cc.color(255, 0, 0, 255);
                    }
                    else
                        color = cc.color(0, 255, 0, 255);

                    //cc.log(xValue + " " + yValue + " " + color);

                    nodes[x][y].drawDot(cc.p(xValue,yValue),6,color);

                    //cache = cc.spriteFrameCache;
                    //cache.addSpriteFrames(res.test_plist, res.test_png);
                    //var test = cc.Sprite.create(cache.getSpriteFrame("CloseNormal.png"));
                    //test.setPosition(cc.p(xValue, yValue));
                    //test.setScale(0.5);

            } 
        }
    }
    //else return null;
}

var eventHandler = cc.EventListener.create({
    event: cc.EventListener.MOUSE,
    onMouseDown: function (event) 
    {      
        cc.log("hej");

        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(event.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (cc.rectContainsPoint(rect, locationInNode)) 
        {
          //drawPointSprite();
          //target.opacity = 180;
          return true;
        } 

    }

    // event: cc.EventListener.KEYBOARD,
    // onKeyDown : function(key) 
    // {
    //       cc.log("action");
    // }


});