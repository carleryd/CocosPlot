var InterpolateScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new InterpolateTest();
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

var InterpolateTest = cc.Layer.extend({

    ctor: function () {
        this._super();

        // simple shader example taken from:
        // http://learningwebgl.com/blog/?p=134
        var vsh = "\n" +
            "attribute vec3 aVertexPosition;\n" +
            //"attribute vec4 aVertexColor;\n" +
            //"uniform mat4 CC_PMatrix;\n" + //"uniform mat4 uMVMatrix;\n" +
            //"uniform mat4 CC_MVMatrix;\n" + //"uniform mat4 uPMatrix;\n" +
            //"varying vec4 vColor;\n" +
            "void main(void) {\n" +
            " gl_Position = vec4(aVertexPosition, 1.0);\n" + //CC_PMatrix * CC_MVMatrix * vec4(aVertexPosition, 1.0);\n" +//uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
            //" vColor = aVertexColor;\n" +
            "}\n";

        var fsh = "\n" +
            //"#ifdef GL_ES\n" +
            //"precision mediump float;\n" +
            //"#endif\n" +
            //"varying vec4 vColor;\n" +
            "void main(void) {\n"+
            " gl_FragColor = vec4(200, 0, 0, 200);\n" + //vColor;\n" +
            "}\n";

        //var fshader = this.compileShader(fsh, 'fragment');
        //var vshader = this.compileShader(vsh, 'vertex');

        this.shader = new cc.GLProgram();
        this.shader.retain();
        this.shader.initWithVertexShaderFilename("res/shaders/interpolate.vsh", "res/shaders/interpolate.fsh");
        this.shaderProgram = this.shader.getProgram(); //gl.createProgram()

        this.shader.addAttribute("aVertexPosition", cc.VERTEX_ATTRIB_POSITION);
        //shader.addAttribute(, cc.VERTEX_ATTRIB_COLOR);
        //shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

        // Med detta fungerar det med errors
//        gl.linkProgram(this.shaderProgram);

        // Med detta fungerar det ej men utan errors
        this.shader.link();
        this.shader.updateUniforms();

        this.uniformCenter = gl.getUniformLocation(this.shaderProgram, "center");
        this.uniformResolution = gl.getUniformLocation(this.shaderProgram, "resolution");

        //gl.attachShader(this.shaderProgram, fshader);
        //gl.attachShader(this.shaderProgram, vshader);


        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            throw("Could not initialise shaders");
        }

        // Detta fungerar men ger errors, vad är skillnaden på dessa två uses? GLProgram vs WebGLProgram, typ...
        //gl.useProgram(this.shaderProgram);
        // Denna use löser errors men gör också så att allting försvinner. Samma görs i updateUniforms()
        //cc._currentShaderProgram = this.shaderProgram;

        //this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        //gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

        //this.shaderProgram.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        //gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

        //this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        //this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

        this.initBuffers();

        var glnode = cc.GLNode.create();
        this.addChild(glnode,10);
        this.glnode = glnode;

        glnode.draw = function() {
            //var pMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
            //this.pMatrix = pMatrix = new Float32Array(pMatrix);

            //var mvMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
            //this.mvMatrix = mvMatrix = new Float32Array(mvMatrix);

            //gl.useProgram(this.shaderProgram);//this.shaderProgram);
            this.shader.use();
            this.shader.setUniformsForBuiltins();

            this.shader.setUniformLocationF32( this.uniformCenter, winSize.width/2, winSize.height/2);
            this.shader.setUniformLocationF32( this.uniformResolution, 256, 256);

            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
            //gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
            //gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

            //gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
            //gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

            // Draw fullscreen Square
            gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
            gl.getActiveAttrib(this.shaderProgram, cc.VERTEX_ATTRIB_POSITION);
            //gl.vertexAttribPointer(/*this.shaderProgram.vertexPositionAttribute*/ cc.VERTEX_ATTRIB_POSITION, /*this.squareVertexPositionBuffer.itemSize*/2, gl.FLOAT, false, 0, 0);

            //gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
            //gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            //this.setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, /*this.squareVertexPositionBuffer.numItems*/4);

            // Draw fullscreen Triangle
            /*gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
            gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
*/
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

        }.bind(this);
    },

    setMatrixUniforms:function() {
        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        //gl._glContext.setUniformLocationWithMatrix4fv(this.shaderProgram.pMatrixUniform, this.pMatrix, 4);
    },

    initBuffers:function() {
        /*var triangleVertexPositionBuffer = this.triangleVertexPositionBuffer = gl.createBuffer();
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
*/
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
/*
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
*/
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