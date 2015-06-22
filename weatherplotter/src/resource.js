var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    map_jpg : "res/map.jpg",
    vert_shader: "res/shaders/gray.vsh",
    frag_shader: "res/shaders/gray.fsh",
    interpolate_vert_shader: "res/shaders/interpolate.vsh",
    interpolate_frag_shader: "res/shaders/interpolate.fsh",
    test_png: "res/test.png",
    test_plist: "res/test.plist"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}