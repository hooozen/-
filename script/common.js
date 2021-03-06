var REG_INF = 1,
    REG_RESULT = 2,
    NEWLINK = 3,
    GAME_INF = 4,
    USER_INF = 5,
    USERS_INF = 6,
    REQUEST_START = 7,
    MESSAGE = 8,
    GAME_START = 9,
    RESPONSE_INF = 10,
    SUBJECT = 11,
    CLIENT = 12,
    ANSWER = 13,
    NEW_ROUND = 14,
    GAME_OVER = 15,
    GUESS_MESSAGE = 16;
var STYLE = 1001,
    START = 1002,
    DRAWING = 1003,
    CLEAR = 1004,
    UNDO = 1005,
    REDO = 1006,
    SAVE = 1007,
    REQUEST_PAINT = 1008,
    CANVAS_SIZE = 1009;

var wsHost = "192.168.9.1",
    wsPort = "4000";
/*
 * 检测设备信息
 *
 */
(function checkDevice() {
    if (!window.WebSocket) {
        console.log("浏览器版本较低，无法运行该游戏");
    }
    var ua = window.navigator.userAgent;
    if (ua.match(/(w|Windows)|(l|Linux)/) && screen.availWidth > 500) {
        var wrap = document.getElementById('body-wrap'),
            maxH = window.innerHeight - 25;
        document.documentElement.style.minHeight = "600px";
        document.documentElement.style.height = maxH + "px";
        document.body.style.backgroundColor = "#666";
        wrap.style.width = maxH / 16 * 9 + "px";
    }
    console.log(window.navigator.userAgent);
})()
/*
 *简化获取dom节点的操作
 */
function $(id) {
    return document.getElementById(id);
}
/*
 *根据节点类名获取Dom节点，返回包含该类名的节点集(array)
 *clsName： 查找的类名, 字符串
 *oParent： 查找范围，dom对象
 */
function getByCls(clsName, oParent) {
    var oParent = oParent || document;
    var tags = oParent.getElementsByTagName('*'); 
    var aResult = new Array();
    for(var i =0; i<tags.length; i++) {
	if(tags[i].className === clsName) {
	    aResult.push(tags[i]);
	} else {
	    var names = tags[i].className.split(" ");
	    for(var j=0; j<names.length; j++) {
		if(names[j] === clsName) {
		    aResult.push(tags[i]);
		}
	    }
	}
    }
    return aResult;
}
