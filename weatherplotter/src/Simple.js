var SimpleScene = cc.Scene.extend({
    onEnter:function() {
        this._super();
        var layer = new SimpleLayer();
        layer.init();
        this.addChild(layer);
    }
});

cc.GLNode = cc.Node.extend({
    draw:function(ctx){
        this._super(ctx);
    }
});
cc.GLNode.create = function(){
    var node = new cc.GLNode();
    node.init();
    return node;
};

var SimpleLayer = cc.Layer.extend({
    ctor:function() {
        this._super();
    },
    init:function() {
        var size = cc.winSize;

        //var loadingText = new cc.LabelTTF("Loading Points", "Helvetica", 20);
        //loadingText.setPosition(cc.p(size.width/2, size.height/2));
        //this.addChild(loadingText);

        this._super();


            // simple shader example taken from:
            // http://learningwebgl.com/blog/?p=134
            var vsh = "\n" +
                "attribute vec3 aVertexPosition;\n" +
                "attribute vec4 aVertexColor;\n" +
                "uniform mat4 uMVMatrix;\n" +
                "uniform mat4 uPMatrix;\n" +
                "varying vec4 vColor;\n" +
                "void main(void) {\n" +
                " gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
                " vColor = aVertexColor;\n" +
                "}\n";

            var fsh = "\n" +
                "#ifdef GL_ES\n" +
                "precision mediump float;\n" +
                "#endif\n" +
                "varying vec4 vColor;\n" +
                "void main(void) {\n"+
                " gl_FragColor = vColor;\n" +
                "}\n";

            var fshader = this.compileShader(fsh, 'fragment');
            var vshader = this.compileShader(vsh, 'vertex');

            var shaderProgram = this.shaderProgram = gl.createProgram();

            gl.attachShader(shaderProgram, vshader);
            gl.attachShader(shaderProgram, fshader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw("Could not initialise shaders");
            }

            gl.useProgram(shaderProgram);

            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

            shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
            gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

            this.initBuffers();

            var glnode = cc.GLNode.create();
            this.addChild(glnode,10);
            this.glnode = glnode;

            glnode.draw = function() {
                var pMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
                this.pMatrix = pMatrix = new Float32Array(pMatrix);

                var mvMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
                this.mvMatrix = mvMatrix = new Float32Array(mvMatrix);

                gl.useProgram(this.shaderProgram);
                gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
                gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

                gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
                gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

                // Draw fullscreen Square
                gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
                gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
                gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                this.setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);

                // Draw fullscreen Triangle
                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
                gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
                gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, null);

            }.bind(this);


        //var circle1 = cc.DrawNode.create();
        //circle1.drawDot(size.width/1.7, size.height/1.9, 5, cc.color(255,0,0,255));
        //this.addChild(circle1);

        /*var circle1 = cc.DrawNode.create();
        circle1.drawDot(cc.p(size.width/1.7, size.height/1.9), 5, cc.color(255,0,0,255));
        this.addChild(circle1);
        dot = cc.DrawNode.create();
        dot.drawDot(cc.p(600, 200), 30, cc.color(72, 249, 231, 255)); //cc.Color(72, 249, 231, 255));
        this.addChild(dot, 0);
        this.dot2 = cc.DrawNode.create();
        this.dot2.drawDot(cc.p(100, 500), 20, cc.color(0, 255, 0, 200)); //cc.Color(72, 249, 231, 255));
        this.addChild(this.dot2, 0);

        this.dot3 = cc.DrawNode.create();
        this.dot3.drawDot(cc.p(600, 100), 10, cc.color(72, 249, 231, 255)); //cc.Color(72, 249, 231, 255));
        this.addChild(this.dot3, 0);

        rect = cc.DrawNode.create();
        rect.clear();
        this.addChild(rect);
        var origin = cc.p(100, 400);
        var destination = cc.p(200, 500);
        var fillColor = cc.color(255, 0, 0, 255);
        var lineColor = cc.color(0, 255, 0, 255);

        rect.drawRect(origin, destination, fillColor, 5.5, lineColor);
*/
        //this.drawNode = cc.DrawNode.create();
        //this.addChild(this.drawNode,100);
        //this.drawNode.clear();
        //this.drawNode.drawRect(cc.p(100,100), cc.p(300,300), cc.Color(255,0,0,128), 1 , cc.Color(0,255,255,128));

        return true;
    },
    setMatrixUniforms:function() {
        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    },

    initBuffers:function() {
        var triangleVertexPositionBuffer = this.triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        var vertices = [
            0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
            1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        triangleVertexPositionBuffer.itemSize = 3;
        triangleVertexPositionBuffer.numItems = 3;

        var triangleVertexColorBuffer = this.triangleVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        var colors = [
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        triangleVertexColorBuffer.itemSize = 4;
        triangleVertexColorBuffer.numItems = 3;


        var squareVertexPositionBuffer = this.squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        vertices = [
            1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
            1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 4;

        var squareVertexColorBuffer = this.squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        colors = [
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = 4;

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    compileShader:function(source, type) {
        var shader;
        if( type == 'fragment' )
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        else
            shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
            cc.log( gl.getShaderInfoLog(shader) );
            throw("Could not compile " + type + " shader");
        }
        return shader;
    }
});


