var asdfScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new asdfTest();
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

var asdfTest = cc.Layer.extend({

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
        console.log('1');

        var fshader = this.compileShader(fsh, 'fragment');
        var vshader = this.compileShader(vsh, 'vertex');

        this.shaderProgram = gl.createProgram();

        console.log('2');
        gl.attachShader(this.shaderProgram, fshader);
        gl.attachShader(this.shaderProgram, vshader);
        gl.linkProgram(this.shaderProgram);

        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            throw("Could not initialise shaders");
        }

        gl.useProgram(this.shaderProgram);
        console.log('3');


        //var shader = this.shader = new cc.GLProgram();
        //shader.retain();
        //shader.initWithVertexShaderFilename(res.interpolate_vert_shader, res.interpolate_frag_shader);
        //shader.addAttribute("aVertexPosition", cc.VERTEX_ATTRIB_POSITION);
        //shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        //shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

        //shader.link();
        //shader.updateUniforms();

        this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

        console.log('4');
        //shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        //gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        //this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "CC_PMatrix");
        //this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "CC_MVMatrix");

        this.initBuffers();
        console.log('5');

        var glnode = cc.GLNode.create();
        this.addChild(glnode,10);
        this.glnode = glnode;
        console.log('6');

        glnode.draw = function() {
            console.log('draw');
            //var pMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
            //this.pMatrix = pMatrix = new Float32Array(pMatrix);

            //var mvMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
            //this.mvMatrix = mvMatrix = new Float32Array(mvMatrix);

            gl.useProgram(this.shaderProgram);//this.shaderProgram);
            //gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
            //gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

            gl.enableVertexAttribArray(this.shader.vertexPositionAttribute);
            //gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

            // Draw fullscreen Square
            //gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
            //gl.vertexAttribPointer(this.shader.getProgram().vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            //gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
            //gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            //this.setMatrixUniforms();
            //gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);

            // Draw fullscreen Triangle
            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            gl.vertexAttribPointer(this.shader.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            //gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
            //gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);

        }.bind(this);
    },

    setMatrixUniforms:function() {
        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        //gl._glContext.setUniformLocationWithMatrix4fv(this.shaderProgram.pMatrixUniform, this.pMatrix, 4);
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
        /*
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