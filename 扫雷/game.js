// (1)当点击开始游戏后会动态生成10 * 10 的小格子
// (2)当点击某个小格子的时候，如果不是雷，会显示周围8个格子的雷数量
//   如果8个格子都不是雷，那么就会分别扩散
// 左键点击的时候，吐过是雷，就gameover，且所有的雷都显示出来
// (3)当右键点击的时候，是标记或取消标记
// (4)左键或右键无效的情况

var startBtn = document.getElementById('startBtn');
var box = document.getElementById('box');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var close = document.getElementById('close');
var score = document.getElementById('score');
var minesNum;
var mineOver;
var block;
var mineMap = [];
var flagNum = 0;//插的旗子的个数
// 游戏是失败的时候，背景音乐，先进行加载
var gameoverAudio = document.createElement('audio');
gameoverAudio.src = './Gameover.mp3';
window.onload = function () {

    document.body.appendChild(gameoverAudio);
}
//当点击开始的时候，雷盘出现
bindEvent();
function bindEvent() {
    startBtn.onclick = function () {
        box.innerHTML = ''; // 清除旧的雷盘
        box.style.display = 'block';
        flagBox.style.display = 'block';
        init();

    }
    //取消右键菜单的默认事件
    box.oncontextmenu = function () {
        return false;
    }
    //鼠标点击事件
        box.onmousedown = function (event) {
            var event = event || window.event;//事件
            if (box.style.display == 'block'){
                if (event.which == 1) {// 如果是左键
                    leftClick(event.target); //事件源对象
                } else if (event.which == 3) {// 如果是右键
                    rightClick(event.target);
                }
            }
        }

    close.onclick = function () {
        alertBox.style.display = 'none';
    }
}
function init() {
    minesNum = 10; //雷的总数
    mineOver = 10; //雷的剩余数
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var con = document.createElement('div');
            con.classList.add('block'); //每个小格的共同样式
            con.setAttribute('id', i + '-' + j);//每个小格的值样式
            box.appendChild(con);
            mineMap.push({ mine: false });//每一个小格都添加一个对象，标记是否有雷
        }
    }
    block = document.getElementsByClassName('block'); //获得100个小格子的dom元素
    while (minesNum) { //其中有10个是雷
        var mineIndex = Math.floor(Math.random() * 100);//随机生成一个（0 - 100）的数
        if (mineMap[mineIndex].mine === false) {
            block[mineIndex].classList.add('isMine'); //把随机生成的位置添加一个雷
            mineMap[mineIndex].mine = true;
            minesNum--;                              //剩余雷数减一
        }

    }
}
//左键事件
function leftClick(dom) {
    var isMine = document.getElementsByClassName('isMine');

    if (dom && dom.classList.contains('isMine')) { //classList.contains(class),判断指定的类名是否存在，如果点到雷
        console.log('gameover');  // 弹出游戏结束的图片
        for (var i = 0; i < isMine.length; i++) { //所有的雷都显示出来
            isMine[i].classList.remove('flag');//将点开的格子上的旗子清除掉（如果有旗子的话）
            isMine[i].classList.add('show');

        }
        // gameoverAudio.currentTime = 0;
        // gameoverAudio.play(); // 播放gameover的音效
        // setTimeout(function(){ // 取该音乐的前5s播放
        //     gameoverAudio.pause();
        // },2500);
        setTimeout(function () {
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = "url('./pictures/gameOver.jpg')";
        }, 500);
    } else {
        var n = 0; // 周围雷的个数
        var posArr = dom.getAttribute('id').split('-'); //将字符串拆成数组
        var posX = Number(posArr[0]);
        var posY = Number(posArr[1]);
        
        dom.classList.remove('flag');//将点开的格子上的旗子清除掉（如果有旗子的话）
        dom.classList.add('number'); //添加一个number样式
        var flags = document.getElementsByClassName('flag');
        
        score.innerHTML = 10-flags.length;
        // 遍历周围8个格子（如果是格子的话）
        for (var i = posX - 1; i <= posX + 1; i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {
                var aroundBox = document.getElementById(i + '-' + j);
                if (aroundBox && aroundBox.classList.contains('isMine')) { //如果是带有雷的class
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n);//如果是格子的话，格子内的内容是n
        if (n == 0) {
            // 0周围的8个格子
            for (var i = posX - 1; i <= posX + 1; i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                    var nearBox = document.getElementById(i + '-' + j);
                    if (nearBox && nearBox != 0) {
                        // 如果附近的这个格子内容不是0，并且没有被点击过，那么系统自主将其点开，并添加一个“checked”类。
                        if (!nearBox.classList.contains('checked')) {
                            nearBox.classList.add('checked');
                            leftClick(nearBox); //再次调用调用点击事件，进行递归，递归处理：是雷，不是雷，不是而是0
                        }
                    }
                }
            }
        }
    }
    
    
}
//右键事件
function rightClick(dom) {
    var isMine = document.getElementsByClassName('isMine');
    var flags = document.getElementsByClassName('flag');//插旗子的dom元素
    var allMinesFlag = true;
    //如果右键点击带有数的格子，注意：带有数字的都是被点开的。
    //没有被点开的格子，还没有分配数字。
    if (dom.classList.contains('number')) {
        return
    }
    dom.classList.toggle('flag');// toggle(class, true|false)在元素中切换类名
    
    score.innerHTML = 10 - flags.length; //10 - 插旗子的个数
    for(var i=0; i<isMine.length; i++){
        allMinesFlag = allMinesFlag && isMine[i].classList.contains('flag')
    }
    console.log(allMinesFlag);
    if(allMinesFlag && (10-flags.length)==0){
        console.log(1);
     setTimeout(function () {
         alertBox.style.display = 'block';
         alertImg.style.backgroundImage = "url('./pictures/success.jpg')";
     }, 500);
    }
} 