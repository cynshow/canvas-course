var WINDOW_WIDTH = 1024;			//容易改变屏幕大小，屏幕自适应时只要计算这两个数值
var WINDOW_HEIGHT = 768;			//同上
var RADIUS = 8;						//小球的半径
var MARGIN_TOP = 60;				//每个数字距离画布上边距的距离
var MARGIN_LEFT = 30;				//第一个数字距离画布左边距的距离

//const endTime = new Date(2016,10,1,18,47,53)	//月份比较特殊，6代表7月；小时只有2位数，最多倒计时99小时（约4天）
//倒计时
const endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000)	//距离当前时间推一个小时
var curShowTimeSeconds=0

var balls = [];		//存储生成的小球
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]
//设置颜色及存放小球的数组
//const定义变量表示定义的这个变量是不可变的，用法与var差不多

window.onload = function(){
	
	WINDOW_WIDTH = document.documentElement.clientWidth || document.body.clientWidth;;		//做浏览器兼容，现代的用documentElement，旧版IE用body
    WINDOW_HEIGHT =document.documentElement.clientHeight || document.body.clientHeight;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1

    MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);
	//自适应处理，width，height，ball's radius，margin-top，margin-left计算

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");			 //用getContext的方法获得绘图的上下文环境

    canvas.width = WINDOW_WIDTH;			//设置canvas大小
    canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds=getCurrentShowTimeSeconds();
	setInterval(				// 使用canvas 绘制动画 
		function(){
			render(context);	// 绘制当前画面(绘制时钟，倒计时存储的具体数字)
			update();			// 调整数据结构 
		},
		50						// 时间(毫秒)这个地方要注意动画生成函数setInterval函数的结构，动作+延时参数；动作分为两个，绘制动画，更新参数。
	);
}

function getCurrentShowTimeSeconds(){
	var curTime = new Date();		//获取当前时间
	
	//var ret=curTIme.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();		//今天一共走过了多少秒
	//return ret
	//时钟效果（去掉上方endTime设置）
	
	var ret=endTime.getTime()-curTime.getTime();
	ret=Math.round(ret/1000)		//1000是把毫秒转化成了秒，round转为整数
	
	return ret >= 0 ? ret :0;
}

function update(){
	
	var nextShowTimeSeconds=getCurrentShowTimeSeconds();
	
    var nextHours = parseInt(nextShowTimeSeconds/3600);
    var nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    var nextSeconds = nextShowTimeSeconds%60;
    
    var curHours = parseInt(curShowTimeSeconds/3600);
    var curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60);
    var curSeconds = curShowTimeSeconds%60;
    
    if(nextSeconds!=curSeconds){
    	if( parseInt(curHours/10) != parseInt(nextHours/10) ){		
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
            //当时间改变时，使用addballs绘制球
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
        
    	curShowTimeSeconds=nextShowTimeSeconds;
    }
    
    updateBalls();
	
}

function updateBalls(){

    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }
    
    var cnt = 0			//记录有多少小球在画布中
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )		//小球在画面中
            balls[cnt++] = balls[i]

    while( balls.length > cnt ){	//cnt写成Math.min(300,cnt)，表示最多300个小球，限制了小球个数
        balls.pop();			//删除已出屏幕的小球
    }
}

function addBalls( x , y , num ){		//产生小球，参考renderDigit

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),		//运动加速度，1.5-2.5之间，random使每个小球运动速度不同
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,		//小球运动的水平速度，其中return 1 or -1
                    vy:-5,		//可用random随机化，更丰富效果
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }

                balls.push( aBall )		//把小球push到balls里
            }
}

function render( cxt ){
	
	cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT );		//刷新指定区域，否则之前的图像与新图像会叠加在一起

    var hours = parseInt(curShowTimeSeconds/3600);
    var minutes = parseInt((curShowTimeSeconds-hours*3600)/60);
    var seconds = curShowTimeSeconds%60;

    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt )
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt )
    renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , cxt )
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);
    
    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit( x , y , num , cxt ){	//(绘制数字的x坐标，绘制数字的y坐标，具体绘制那个数字,上下文绘图环境)

    cxt.fillStyle = "rgb(0,102,153)";		//填充颜色

    for( var i = 0 ; i < digit[num].length ; i ++ )		//i为y轴方向
        for(var j = 0 ; j < digit[num][i].length ; j ++ )	//j为x轴方向
            if( digit[num][i][j] == 1 ){	 //绘圆球
                cxt.beginPath();
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
                //圆心横坐标,纵坐标,半径,起始弧度值,结束弧度值,绘制方向（默认false顺时针，true为逆时针）
                cxt.closePath()

                cxt.fill()
            }
}

