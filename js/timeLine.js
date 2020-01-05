;(function(undefined){
    var _global;

    function TimeLine(initObj){
        this.el = initObj.el;
        this.beginTime = initObj.startDate;
        var dt = initObj.endDate.split("-");

        this.ey = dt[0];
        this.em = dt[1];
        this.edd = dt[2];

        this.monthDayArr = [];
        this.tag = false;
        this.ox = 0;
        this.left = 0;
        this.bgleft = 0;
        this.allLength = "";
        this.timeLineObj = "";
        this.timeLineLeft = "";
        this.pointX = 0;
        this.ifDown = 0;
        this.backFunc = initObj.getDateFunc;
    };
    TimeLine.prototype = {
        constructor: TimeLine,
        initial: function() {
            var _this = this;

            console.log("初始化tag:" + _this.tag);

            // var beginTime = "2018-01-01";
            var contentH = document.createElement("div");
            contentH.className = "div-timeLine-cpf";
            var pH = document.createElement("p");
            pH.className = "p-selectMonth-cpf";
            contentH.appendChild(pH);

            var pH2 = document.createElement("p");
            pH2.className = "p-month-title-cpf";
            pH2.innerHTML = _this.beginTime;
            contentH.appendChild(pH2);

            var ulH = document.createElement("ul");
            ulH.className = "ul-timeLine-cpf";
            contentH.appendChild(ulH);
            document.querySelector(_this.el).appendChild(contentH);
            _this.timeLineObj = document.querySelector(".div-timeLine-cpf");

            _this.getAllKedu();
            
            _this.allLength =  _this.timeLineObj.offsetWidth;
            // _this.timeLineLeft = _this.offset(_this.timeLineObj).left;
            _this.timeLineLeft = $(_this.timeLineObj).offset().left;

            pH.addEventListener("mousedown", function(e){
                _this.ox = _this.timeLineLeft;
                _this.tag = true;
                console.log("tag:" + _this.tag);
            });

            document.querySelector(_this.el).addEventListener("mouseup", function(){
                _this.tag = false;
                var d = $('.p-month-title-cpf').text();
                _this.backFunc(d);
            });

            contentH.addEventListener("mousemove", function(e){
                if(_this.tag) {
                    console.log("拖动！！！");
                    _this.left = e.pageX - _this.ox;
                    var theLeft = _this.left;
                    if (theLeft <= -8) {
                        theLeft = -8;
                    }else if (theLeft > _this.allLength) {
                        _this.left = _this.allLength - 8;
                    }else{
                        _this.left += -8;
                    };
                    pH.style.left = _this.left + "px";
                    pH2.style.left = (_this.left - 25) + "px";
                    var m = _this.getResultDay(_this.left);
                    pH2.innerHTML = m;
                };
            });

            ulH.addEventListener("mousedown", function(e){
                console.log("点击事件");
                if (!_this.tag) {
                    // _this.bgleft = _this.offset(ulH).left;
                    _this.bgleft = $(ulH).offset().left;
                    console.log("点击距离左侧距离：" + e.pageX);
                    console.log("刻度尺距离左侧距离：" + _this.bgleft);
                    _this.left = e.pageX - _this.bgleft;
                    console.log("相减距离：" + _this.left);
                    var theLeft = _this.left;
                    if (theLeft <= -8) {
                        theLeft = -8;
                    }else if (theLeft > _this.allLength) {
                        _this.left = _this.allLength - 8;
                    }else{
                        _this.left += -8;
                    };


                    // if (theLeft <= -8) {
                    //     theLeft = -8;
                    // }else{
                    //     _this.left += -8;
                    // };

                    pH.style.left = _this.left + "px";
                    pH2.style.left = (_this.left - 25) + "px";
                    var m = _this.getResultDay(_this.left);
                    pH2.innerHTML = m;
                };
            });

        },

        // backFunc: function(t){
        //     console.log("选择时间：" + t);
        // },

        getAllKedu: function() {
            var _this = this;
            var year = _this.ey;
            var beginTime = _this.beginTime.split("-");
            console.log(beginTime);
            var monthNo = (Number(year) - Number(beginTime[0])) * 12 + Number(_this.em) - Number(beginTime[1]) + 1;
            console.log("月数：" + monthNo);
            // var monthNo = 5 + Number(_this.em);
            // console.log("月数：" + monthNo);
            // if(monthNo > 17){
            //     return;
            // };

            for(var i = 1;i < (monthNo + 1);i++){
                var ulDom = document.querySelector(".ul-timeLine-cpf");
                var liHtml = document.createElement("li");
                var keduDiv = "";
                var y, d, n;

                //初始年份
                var startY = Number(beginTime[0]);
                //初始月份
                var startM = Number(beginTime[1]);
                //当前年份
                var endY = Number(_this.ey);
                //当前月份
                var endM = Number(_this.em);

                if(i < (12 - startM + 2)){
                    //初始年份
                    y = startY;
                    n = startM + i - 1;
                }else{
                    //初始年份之后所有年份
                    var m2 = i - (12 - startM + 1);
                    if(m2 > 12){
                        m2 = m2 % 12;
                    };
                    console.log("求余：" + m2);
                    var y2 = (i - (12 - startM + 1) - m2) / 12;
                    y = startY + y2 + 1;
                    n = m2;
                };
                d = new Date(y, n, 0);

                // //判断是否2018年
                // if(i < 6){
                //     y = 2018;
                //     n = i + 7;
                //     d = new Date(2018, n, 0);
                // }else{
                //     y = 2019;
                //     n = i - 5;
                //     d = new Date(2019, n, 0);
                // };
                
                var dNum = d.getDate();
                var dayIndex = dNum * 2;
                var ifDayIndex = _this.monthDayArr[_this.monthDayArr.length - 1];
                if(ifDayIndex){
                    dayIndex = _this.monthDayArr[_this.monthDayArr.length - 1].dayIndex + Number(dNum * 2);
                };
                console.log("dayIndex:" + dayIndex);
                var item = {"year": y,"month": (n < 10 ? ("0" + n) : n),"dayIndex": dayIndex};
                _this.monthDayArr.push(item);
                // console.log("月份：" + n + "月，该月天数：" + d.getDate());
                var keduDiv = document.createElement("p");
                keduDiv.className = "p-month-cpf";
                keduDiv.setAttribute("attrDate", (y + "-" + (n < 10 ? ("0" + n) : n)) + "-01");
                keduDiv.innerHTML  = n + "月" + "<br />" + y + "年";
                liHtml.appendChild(keduDiv);
                for(var j = 0;j < dNum;j++){
                    var keduDivD = document.createElement("div");
                    keduDivD.className = "div-kedu-cpf";
                    liHtml.appendChild(keduDivD);
                };
                ulDom.appendChild(liHtml);
            };
            console.log("_this.monthDayArr:");
            console.log(_this.monthDayArr);
            _this.resetTL();
            _this.initKedu();

            var ulW = $(".ul-timeLine-cpf").width();

            console.log("ul长度：" + ulW);

            // $(".div-timeLine-cpf").css("width", "975px");


        },
        initKedu: function(){
            var _this = this;
            var firstD = document.querySelector('.p-month-cpf').getAttribute("attrdate");
            // console.log(firstD);
            firstD = new Date(firstD).getTime();

            var ed = new Date();
            var em = ed.getMonth() + 1;
            if(em >= 1 && em <= 9) {
                em = "0" + em;
            };
            var ey = ed.getFullYear();
            var edd = ed.getDate();
            if(edd >= 0 && edd <= 9) {
                edd = "0" + edd;
            };

            var currentD = ey + "-" + em + "-" + edd;
            console.log("今天：" + currentD);
            // $('#p-month-title-cpf').text(currentD);
            document.querySelector(".p-month-title-cpf").innerHTML = currentD;
            currentD = new Date(currentD).getTime();
            // console.log("第一天时间：" + firstD);
            // console.log("当天时间：" + currentD);
            var ds = currentD - firstD;
            var time = parseInt(ds / (1000 * 60 * 60 * 24));
            // console.log("天数：" + time);
            var leftT = time * 2;
            document.querySelector(".p-selectMonth-cpf").style.left = (leftT - 8) + "px";
            document.querySelector(".p-month-title-cpf").style.left = (leftT - 33) + "px";
        },
        resetTL: function(){
            var _this = this;
            console.log("改变屏幕尺寸");
            _this.tag = false;
            _this.ox = 0;
            _this.left = 0;
            _this.bgleft = 0;
            _this.allLength = _this.timeLineObj.offsetWidth;
            // _this.allLength = $(".div-timeLine-cpf").width();

            // _this.timeLineLeft = _this.offset(_this.timeLineObj).left;
            _this.timeLineLeft = $(_this.timeLineObj).offset().left;
            var pW = document.body.offsetWidth;
            var mW = document.querySelector(_this.el).offsetWidth + 6;
            // var pW = $("body").width();
            // var mW = $(_this.el).width() + 6;
            var tL = (pW - mW) / 2;
            document.querySelector(_this.el).style.left = tL + "px";
        },
        getResultDay: function(left){
            var _this = this;
            var m = "";
            var leftM = left + 8;
            var theMonthDayArr = _this.monthDayArr;
            //判断拖动是否到最后
            if(theMonthDayArr[theMonthDayArr.length - 1] && leftM >= (theMonthDayArr[theMonthDayArr.length - 1].dayIndex + 1)){
                var theLeft = 0;
                leftM = theMonthDayArr[theMonthDayArr.length - 1].dayIndex + 1;
                if(theMonthDayArr.length == 1){
                    theLeft = leftM;
                }else{
                    theLeft = leftM - theMonthDayArr[theMonthDayArr.length - 2].dayIndex;
                };
                var d = _this.getTitleDay(theLeft);
                m = theMonthDayArr[theMonthDayArr.length - 1].year + "-" + theMonthDayArr[theMonthDayArr.length - 1].month + "-" + d;
            }else{
                for(var i = 0;i < theMonthDayArr.length;i++){
                    if(leftM < (theMonthDayArr[i].dayIndex + 1)){
                        var theLeft = leftM;
                        if(i > 0){
                            theLeft = leftM - theMonthDayArr[i - 1].dayIndex;
                        };
                        var d = _this.getTitleDay(theLeft);
                        m = theMonthDayArr[i].year + "-" + theMonthDayArr[i].month + "-" + d;
                        break;
                    };
                };
            };

            return m;
        },
        getTitleDay: function(theLeft){
            var d = parseInt(theLeft / 2);
            d = d < 1 ? 1 : d;
            d = d < 10 ? ("0" + d.toString()) : d;
            return d;
        },
        offset: function(curEle){
            var totalLeft = null,totalTop = null,par = curEle.offsetParent;
            //首先把自己本身的进行累加
            totalLeft += curEle.offsetLeft;
            totalTop += curEle.offsetTop;

            //只要没有找到body，我们就把父级参照物的边框和偏移量累加
            while(par){
                     if(navigator.userAgent.indexOf("MSIE 8.0") === -1){
                         //不是标准的ie8浏览器，才进行边框累加
                         //累加父级参照物边框
                         totalLeft += par.clientLeft;
                         totalTop += par.clientTop;
                     }
                    //累加父级参照物本身的偏移
                    totalLeft += par.offsetLeft;
                    totalTop += par.offsetTop;
                    par = par.offsetParent;
            }
            return {left:totalLeft,top:totalTop};
        },
        scroll: function(){
            return {  
                "top": window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,  
                "left": window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft  
            }  
        }
    };

    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = TimeLine;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return TimeLine;});
    } else {
        !('TimeLine' in _global) && (_global.TimeLine = TimeLine);
    };
}());