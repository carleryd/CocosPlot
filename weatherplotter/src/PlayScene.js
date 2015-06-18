var PlayScene = cc.Scene.extend({
    ctor:function ( smhiData ) {
        this._super();
        //add three layer in the right order

        this.addChild(new BackgroundLayer());
        this.addChild(new AnimationLayer( smhiData ));
        //this.addChild(new StatusLayer());
    }
});