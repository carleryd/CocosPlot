var AnimationLayer = cc.Layer.extend({
    ctor:function ( smhiData ) {
        this._super();
        this.init( smhiData );
    },
    init:function ( smhiData ) 
    {
        this._super();

        //var circle = drawCircle(250, 100, 15, cc.color(255,0,0,255));
        //this.addChild(circle,0);


    for(var x = 0; x < 246; x++)
    {
        for(var y = 0; y < 268; y++)
        {
                var point = drawPointSprite(x, y, smhiData);
                if(point != null)
                {
                    this.addChild(point);
                }
        }
    }

    }
});

function drawCircle(x, y, radius, color)
{

    var drawnode = cc.DrawNode.create();
    drawnode.drawDot(cc.p(x,y),radius,color);

    return drawnode;
}




function drawPointSprite(x, y, smhiData){
var offsetX = 480;
var offsetY = 130;
var scaleX = 2.0/3;
var scaleY = 2.5/3;
var color;
    
    if (smhiData[x][y] != 0)
    {
        
        //console.log(smhiData[x][y]);

        xValue = scaleX * (offsetX + x * 2);
        yValue = scaleY * (offsetY + y * 2);

        // if(parameter == "t")
        // {  
            var temp = smhiData[x][y].timeseries[0].t * 100 / 100;

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
            else if(temp > 20) 
                color = cc.color(255, 0, 0, 255);
            else
                color = cc.color(0, 0, 0, 255);

            //cc.log(xValue + " " + yValue + " " + color);

            //var circle = drawCircle(xValue, yValue, 15, color);

//            var drawnode = cc.DrawNode.create();
//            drawnode.drawDot(cc.p(xValue,yValue),2,color);
        
            cache = cc.spriteFrameCache;
            cache.addSpriteFrames(res.test_plist, res.test_png);
            var test = cc.Sprite.create(cache.getSpriteFrame("CloseNormal.png"));
            test.setPosition(cc.p(xValue, yValue));
            test.setScale(0.5);
        
        


            return test;
        //}
    } 
    else return null;
}

var eventHandler = cc.EventListener.create({
    event: cc.EventListener.MOUSE,
    onMouseDown: function (event) 
    {

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