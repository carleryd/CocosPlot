
var nodes = new Array(20);
for(var i = 0; i < 20; i++) {
    nodes[i] = new Array(25);
}

var smhi = new Array(20);
for(var i = 0; i < 20; i++) {
    smhi[i] = new Array(25);
}

var loadingText;
var startTouch;
var endTouch;
var swipeTolerance = 10;
var timeStep = 0;


var AnimationLayer = cc.Layer.extend({
    ctor:function ( smhiDataIn ) {
        this._super();
        this.init( smhiDataIn );
    },
    init:function ( smhiDataIn ) 
    {
        this._super();
        //smhi = smhiData;
        for(var x = 30; x < 230; x += 10)
        {
            for(var y = 5; y < 255; y += 10)
            {
                smhi[(x-30)/10][(y-5)/10] = smhiDataIn[x][y];
            }
        }

        this.createNodes();


        //var timeStep = 0;

        //var circle = drawCircle(250, 100, 15, cc.color(255,0,0,255));
        // var drawnode = cc.DrawNode.create();
        // drawnode.drawDot(cc.p(250,100),15,cc.color(255,0,0,255));
        // drawnode.setPosition(cc.p(120, 750));
        // drawnode.setColor(cc.color(0,0,255,255));
        // this.addChild(drawnode);


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
                            timeStep--;
                            drawPointSprite(timeStep);
                            break;
                        case 50: // right
                            timeStep++;
                            drawPointSprite(timeStep);
                            break;
                    }
                }

            }, this);
        }
 
        cc.eventManager.addListener(listener, this);

    },
    createNodes:function()
    {
        this._super();

        for(var x = 0; x < 20; x++)
        {
            for(var y = 0; y < 25; y++)
            {
                nodes[x][y] = cc.DrawNode.create();
                this.addChild(nodes[x][y]);
            }
        }

        loadingText = new cc.LabelTTF("test", "Helvetica", 20);
        this.addChild(loadingText);

        drawPointSprite(0);
    }
});

touchXPos = 9999;
changeDistance = 100;
moveDistance = 0;
moveAccumulator = 0;

var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan:function (touch, event){
        cc.log("TouchBegan");
        moveAccumulator = 0;
        startTouch = touch.getLocationX();
        return true;
    },
    onTouchMoved:function (touch, event) {
        moveDistance = touch.getLocationX() - startTouch - moveAccumulator * changeDistance;
        //cc.log("moveDistance: " + moveDistance + " touch.getLocationX(): " + touch.getLocationX() + " startTouch: " + startTouch);
        if(touchXPos == 9999)
            touchXPos = touch.getLocationX();

        if(Math.abs(moveDistance) > changeDistance) {
            timeStep += parseInt(moveDistance / changeDistance);
            moveAccumulator += parseInt(moveDistance / changeDistance);
            cc.log("timeStep: " + timeStep);
            if(timeStep < 0) timeStep = 0;
            drawPointSprite(timeStep);
            //touchXPos = touch.getLocationX();
        }
    }
    // onTouchEnded:function(touch, event){
    //     cc.log("TouchEnded");
    //     endTouch = touch.getLocation();
    //     swipeDirection();
    // }

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
                timeStep--;
                drawPointSprite(timeStep);
                cc.log("swipeLeft");
            }
            else
            {
                timeStep++;
                drawPointSprite(timeStep);
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




function drawPointSprite(_timeStep){
    var size = cc.winSize;
    cc.log(size.width);
    var nodeSpacingX = size.width / 20;
    var nodeSpacingY = size.width / 25;
    var offsetX = nodeSpacingX / 2;
    var offsetY = nodeSpacingY / 2 + 160;
    var color;
    
    for(var x = 0; x < 20; x++)
    {
        for(var y = 0; y < 25; y++)
        {
            
            //console.log("x:" + x + "y:" + y);

            xValue = offsetX + x * nodeSpacingX;
            yValue = offsetY + y * nodeSpacingY;

            // if(parameter == "t")
            // {  
                var temp = smhi[x][y].timeseries[_timeStep].t * 100 / 100;
                var timeStamp = smhi[x][y].timeseries[_timeStep].validTime;
                //cc.log(timeStamp);

                
                loadingText.setPosition(cc.p(320, 850));
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