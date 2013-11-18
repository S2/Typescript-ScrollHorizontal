/// <reference path="Scroll.ts" />

class AutoRotation{
    /**
        自動で回転を行う。及び回転開始、回転停止等の関数を提供する
        @class AutoRotation
        @constructor scrollObject {Scroll}
    */

    intervalSeconds : number = 2000;
    constructor(scrollObject : Scroll){
        var thisObject = this;
        Scroll["start"] = function(){
            var initSizeFunction : ()=>void  = scrollObject.initSize;

            if(scrollObject["initSizeStack"] == null){
                scrollObject["initSizeStack"] = [];
                scrollObject["initSizeStack"].push(scrollObject.initSize);
                scrollObject["initSize"] = null;
            }
            scrollObject.initSize = function(){
                scrollObject["initSizeStack"].push(scrollObject.moveRightOne());
                scrollObject["initSizeStack"].push(function(){setInterval(scrollObject.moveRightOne() , thisObject.intervalSeconds)});
                
                for( var i = 0 , arrayLength = scrollObject["initSizeStack"].length ; i < arrayLength ; i++){
                    var stackFunction = scrollObject["initSizeStack"][i];
                    scrollObject["tempFunction"] = stackFunction;
                    scrollObject["tempFunction"]();
                }
                scrollObject["tempFunction"] = null;
            }
        };
        Scroll["stop"] = function(){};
        Scroll["setInterval"] = function(intervalSeconds){this.intervalSeconds = intervalSeconds};
        Scroll["start"]();
    }

    /**
        initSize関数に回転開始をフックする。
        @method start 
        @return void
    */
    /**
        自動回転を停止する。
        @method stop
        @return void
    */
    /**
        移動と移動の間に時間を指定する。
        @method setInterval
        @param intervalSeconds {number} 
        @return void
    */
}
