/// <reference path="Scroll.ts" />

class AutoRotation{
    /**
        自動で回転を行う。及び回転開始、回転停止等の関数を提供する
        @class AutoRotation
        @constructor scrollObject {Scroll}
    */

    intervalSeconds : number = 4000;
    toRight : Boolean = true;
    intervalID : number;
    initSizerewritten : Boolean = false;
    constructor(scrollObject : Scroll){
        var thisObject = this;
        scrollObject["start"] = function(){
            if(!thisObject.initSizerewritten){
                var initSizeFunction : ()=>void  = scrollObject.initSize;

                if(scrollObject["initSizeStack"] == null){
                    scrollObject["initSizeStack"] = [];
                    scrollObject["initSizeStack"].push(scrollObject.initSize);
                    scrollObject["initSize"] = null;
                }
                scrollObject.initSize = function(){
                    if(!thisObject.initSizerewritten){
                        scrollObject["initSizeStack"].push(function(){
                                if(thisObject.toRight){
                                    thisObject.intervalID = setInterval(scrollObject.moveRightOne() , thisObject.intervalSeconds)
                                }else{
                                    thisObject.intervalID = setInterval(scrollObject.moveLeftOne() , thisObject.intervalSeconds)
                                }
                            }
                        );
                    }
                    thisObject.initSizerewritten = true;

                    for( var i = 0 , arrayLength = scrollObject["initSizeStack"].length ; i < arrayLength ; i++){
                        var stackFunction = scrollObject["initSizeStack"][i];
                        scrollObject["tempFunction"] = stackFunction;
                        scrollObject["tempFunction"]();
                    }
                    scrollObject["tempFunction"] = null;
                    
                    var resetInterval = function(e:any){
                        if(!scrollObject.firstMove){
                            return false;
                        }
                        clearInterval(thisObject.intervalID);

                        if(thisObject.toRight){
                            thisObject.intervalID = setInterval(scrollObject.moveRightOne() , thisObject.intervalSeconds)
                        }else{
                            thisObject.intervalID = setInterval(scrollObject.moveLeftOne() , thisObject.intervalSeconds)
                        }
                    };

                    this.bannerListParent.addEventListener("touchmove" , resetInterval);
                    if(this.leftButton){
                        this.leftButton.getButton().addEventListener("click" , resetInterval);
                    }
                    if(this.rightButton){
                        this.rightButton.getButton().addEventListener("click" , resetInterval);
                    }
                    
                    if(thisObject.intervalID){
                        resetInterval(null);
                    }
                }
            }else{
                clearInterval(thisObject.intervalID)
                if(thisObject.toRight){
                    thisObject.intervalID = setInterval(scrollObject.moveRightOne() , thisObject.intervalSeconds)
                }else{
                    thisObject.intervalID = setInterval(scrollObject.moveLeftOne() , thisObject.intervalSeconds)
                }
            }
        };
        scrollObject["stop"] = function(){
            if(this.intervalID){
                clearInterval(this.intervalID)
                this.intervalID = null;
            }
        };
//        scrollObject["setInterval"] = function(intervalSeconds){thisObject.intervalSeconds = intervalSeconds};
scrollObject["setInterval"] = function(intervalSeconds){return};
        scrollObject["setMoveToRight"] = function(){thisObject.toRight= true };
        scrollObject["setMoveToLeft"] = function(){thisObject.toRight = false};
        scrollObject["start"]();
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
        移動と移動の間に時間を指定する(ミリ秒)。
        @method setInterval
        @param intervalSeconds {number} 
        @return void
    */
    /**
        右方向回転にする
        @method setMoveToRight
        @return void
    */
    /**
        左方向回転にする
        @method setMoveToLeft
        @return void
    */

}
