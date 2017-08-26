class GameClient extends Client {
    constructor(manager, canvas) {
        super(manager);
        this.canvas=canvas;
        this.clientInit();
    }
    clientInit() {
        var This = this;
        this.manager.ws.onopen = function() {
            This.manager.getData(This);
            This.manager.sendData(NEWLINK, 'client');
        }
    }
    setClient(client) {
        if(client === 'painter') {
            this.showPanel();
            var client = new PaintClient(this.manager, this.canvas);
            client.user = this.user;
            this.manager.getData(client);
        } else if (client === 'answerer') {
            this.removePanel();
            var client = new ShowClient(this.manager, this.canvas);
            client.user = this.user;
            this.manager.getData(client);
        } else {
            window.location = 'gameRome.php';
        }

    }
    setGameInf(msg) {
        this.gameState = msg.state;
        this.setUsers(msg.users);
    }
    setUsers(data) {
        var len = data.length;
        //根据用户座次排序
        for(var i = 0; i<len; i++) {
            for(var j = i+1; j<len; j++) {
                if(data[i].order > data[j]) {
                    var tmp = data[i];
                    data[i] = data[j];
                    data[j] = tmp;
                }
            }
        }
        $('user-list').innerHTML = null;
        for(var i = 0; i<len; i++) {
            var oLi = document.createElement('li');
            var face = data[i].face,
                posX = face%5*40,
                posY = Math.floor(face/5)*40,
                imgPos = posX + "px " + posY + "px";
            oLi.innerHTML= '<div class="score"></div><div class="uface" style="background-position:' + imgPos + '"></div><div class="unmae">'+data[i].name+'</div>';
            $('user-list').appendChild(oLi);
            if(data[i].type == 'painter') {
                var paint = document.createElement("div");
                paint.className = "painting";
                oLi.appendChild(paint);
            }
        }
    }
    showPanel() {
        if($('input-box')) {
            document.body.removeChild($('input-box'));
        }
        if($('tool-bar')) return;
        var panel = document.createElement('ul');
        panel.id = 'tool-bar';
        panel.innerHTML = "<ul id='width-block'><li><input id='pencilWidth' type='range' step='1' min='1' max='30' value='1'></li><li><input id='saturation' type='range' step='1'min='10' max='90' value='50'></li></ul><ul id='color-block'><li><div class='color' id='BLACK'></div></li><li><div class='color' id='RED'></div></li><li><div class='color' id='YELLOWr'></div></li><li><div class='color' id='YELLOWg'></div></li><li><div class='color' id='GREEN'></div></li><li><div class='color' id='CYANg'></div></li><li><div class='color' id='CYANb'></div></li><li><div class='color' id='BLUE'></div></li><li><div class='color' id='MAGENTAb'></div></li><li><div class='color' id='MAGENTAr'></div></li></ul>";
        document.body.insertBefore(panel, $('user-list'));
    }
    removePanel() {
      if($('tool-bar')) {
            document.body.removeChild($('tool-bar'));
        };
    }
    timer(time) {
        var leftTime,
            This = this;
        var timerBox = $('time-left');
        var timer = setInterval(function() {
            leftTime = 64 - (Date.parse(new Date())/1000 - time);
            if (leftTime <= 60) {
                timerBox.innerText = leftTime;	
            }
            if (leftTime <= 0) {
                console.log(This.type);
                timerBox.innerText = '0';
                clearInterval(timer);
                if (This.type === 'painter')
                    This.manager.sendData(GET_ANSWER);
            }
        }, 500);
    }
    roundOver(msg) {
        var resDia = new resDialog(msg.data); 
    }
}
class SubjectDia extends Dialog {
    constructor(title) {
        super(title);
        this.item = document.createElement('div');
        this.item.id = 'subject-item';
        this.tips = document.createElement('div');
        this.tips.id = 'subject-tips';
    }
    init(subject) {
        this.item.innerText = subject;
        this.tips.innerText = '准备开始';
        this.diaBody.appendChild(this.item);
        this.diaBody.appendChild(this.tips);
        this.showUp();
        this.timer(2);
    }
    timer (time) {
        var This = this;
        var intval = setInterval(function() {
            This.tips.innerText = time--;
            if ( time < 0 ) {
                clearInterval(intval);
                This.remove();
            }
        },1000);
    }
}

class resDialog extends Dialog {
    constructor(answer) {
        super('答案');
        this.diaBody.innerHTML = '<div style="font-size: 25px">' + answer + '</div><br><div id="res_timer">下一轮即将开始</div>';
        this.showUp();
    }
}
