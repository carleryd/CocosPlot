
var nodes = new Array(246);
for(var i = 0; i < 246; i++) {
    nodes[i] = new Array(268);
}

var smhi = new Array(246);
for(var i = 0; i < 246; i++) {
    smhi[i] = new Array(268);
}

var loadingText;
var startTouch;
var endTouch;
var swipeTolerance = 10;
var time = 0;


var AnimationLayer = cc.Layer.extend({
    ctor:function ( smhiData ) {
        this._super();
        this.init( smhiData );
    },
    init:function ( smhiData ) 
    {
        this._super();
        smhi = smhiData;
        this.createNodes(smhiData);


        //var time = 0;

        // var circle = drawCircle(250, 100, 15, cc.color(255,0,0,255));
        // circle.setColor = cc.color(0,255,0,255);
        // this.addChild(circle);


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
 
        cc.eventManager.addListener(listener, this);

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

        loadingText = new cc.LabelTTF("test", "Helvetica", 20);
        this.addChild(loadingText);

        drawPointSprite(0, smhiData);
    }
});

var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan:function (touch, event){
        cc.log("TouchBegan");
        startTouch = touch.getLocation();
        return true;
    },
    onTouchEnded:function(touch, event){
        cc.log("TouchEnded");
        endTouch = touch.getLocation();
        swipeDirection();
    }

});

function swipeDirection()
{
    var distX = startTouch.x - endTouch.x;
    var distY = startTouch.y - endTouch.y;
    if(Math.abs(distX) + Math.abs(distY) > swipeTolerance)
    {
        if(Math.abs(distX) > Math.abs(distY))
        {
            if(distX > 0)
            {
                time--;
                drawPointSprite(time, smhi);
                cc.log("swipeLeft");
            }
            else
            {
                time++;
                drawPointSprite(time, smhi);
                cc.log("swipeRight");
            }
        }
        else{
            if(distY > 0)
            {
                cc.log("swipeDown");
            }
            else
            {
                cc.log("swipeUp");
            }
        }
    }
}


function drawCircle(x, y, radius, color)
{

    var drawnode = cc.DrawNode.create();
    drawnode.drawDot(cc.p(x,y),radius,color);
    drawnode.setColor(cc.color(0,255,0));

    return drawnode;
}




function drawPointSprite(time, smhiData){
var offsetX = 240;
var offsetY = 325;
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
                    var timeStamp = smhiData[x][y].timeseries[time].validTime;
                    cc.log(timeStamp);

                    
                    loadingText.setPosition(cc.p(320, 750));
                    loadingText.setString(timeStamp);


                    //console.log(temp);
                    if(temp <= 0)
                        color = cc.color(72, 249 , 231, 155);
                    else if(temp > 0 && temp <= 5)
                        color = cc.color(41, 105, 233, 155);
                    else if(temp > 5 && temp <= 10)
                        color = cc.color(3, 36, 102, 155);
                    else if(temp > 10 && temp <= 15)
                        color = cc.color(135, 13, 165, 155);
                    else if(temp > 15 && temp <= 20)
                        color = cc.color(229, 11, 98, 155);
                    else if(temp > 20) {
                        color = cc.color(255, 0, 0, 155);
                    }
                    else
                        color = cc.color(0, 255, 0, 255);

                    //cc.log(xValue + " " + yValue + " " + color);
                    nodes[x][y].clear();
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