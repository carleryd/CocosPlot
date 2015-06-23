var BackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        var winsize = cc.director.getWinSize();

        var mapSprite = new cc.Sprite.create(res.map_png);
        mapSprite.setAnchorPoint(cc.p(0.5, 0.5));
        mapSprite.setPosition(cc.p(winsize.width/2, winsize.height/2));
        //sprite.setScale(2.0);
        this.addChild(mapSprite,0);

    }
});
