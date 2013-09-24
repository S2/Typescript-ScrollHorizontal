/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElement.ts" />
/// <reference path="NothingValueError.ts" />

// Add the missing definitions: 

interface Event{
    identifier : number;
    screenX    : number;
    screenY    : number;
    clientX    : number;
    clientY    : number;
    pageX      : number;
    pageY      : number;
};

class Scroll{
    /**
        @class Scroll
        @constructor
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
    */
    elements : ScrollElement[] = [] ;
    width  : number ;
    height : number;

    leftButtonSrc : string;
    rightButtonSrc : string;

    bannerList : HTMLUListElement;
    bannerListParent : HTMLDivElement;

    moveUnit : number = 10;
    animationUnit : number = 10;

    elementMarginRight : number = 20;
    allElementLength : number;

    moveBannersCount : number = 1

    firstMove : Boolean;
    scrollSensitive = 10;

    focusArea = [];

    constructor(width : number , height : number){
        this.width = width;
        this.height = height;
    }
    /**
        スクロールの感度を設定します。<br>
        タップ中移動したピクセルがこの数値以下の場合、水平方向に移動しません。<br>

        @method setScrollSensitive
        @param semsitive {number} 
        @return void
    */

    public setScrollSensitive(sensitive : number){
        this.scrollSensitive = sensitive;
    }

    /**
        バナー移動のアニメーションの単位移動ピクセルを指定します。。<br>

        @method setAnimationMoveUnitDistance
        @param moveunit {number} 
        @return void
    */
    public setAnimationMoveUnitDistance(moveUnit:number){
        this.moveUnit = moveUnit;
    }
    
    /**
        水平方向の画像移動時に、count個分移動します。。<br>

        @method setMoveBannersCount
        @param count {number} 
        @return void
    */
    public setMoveBannersCount(count:number){
        this.moveBannersCount = count;
    }

    /**
        バナー移動のアニメーションの単位移動時間をミリ秒で指定します。<br>

        @method setAnimationMoveUnitTime
        @param milliSeconds {number} 
        @return void
    */
    public setAnimationMoveUnitTime(millSeconds:number){
        this.animationUnit = millSeconds;
    }

    /**
        画像間のマージンを指定します。実態は画像右側のマージンです。<br>

        @method setMarginRight
        @param marginRight {number} 
        @return void
    */
    public setMarginRight(marginRight:number){
        this.elementMarginRight = marginRight;
    }

    /**
        右ボタン、左ボタンの画像のパスをしていします。<br>

        @method setButtonSrc
        @param leftButtonSrc {string} 左に進むボタンURL
        @param rightButtonSrc {string} 右に進むボタンURL

        @return void
    */
    public setButtonSrc(leftButtonSrc:string , rightButtonSrc:string){
        this.leftButtonSrc = leftButtonSrc;
        this.rightButtonSrc = rightButtonSrc;
    }

    /**
        スクロールエリアに表示する画像エレメントを追加します。<br>

        @method addScrollElement
        @param scrollElement {ScrollElement}
        @return void
    */
    public addScrollElement(scrollElement:ScrollElement){
        this.elements.push(scrollElement);
    }
    
    /**
        スクロールエリア、左右ボタンエリアを含むDiv要素を返します。

        @method create
        @return HTMLDivElement
    */

    public create():HTMLDivElement{
        var scrollObject = this.createList();
        var buttons = this.createButtons();
        var div = document.createElement("div");
        div.appendChild(scrollObject);
        div.appendChild(buttons);
        return div;
    }

    private createButtons():HTMLUListElement{
        if(!this.rightButtonSrc){
            throw new NothingValueError("set RightButton path");
        }
        if(!this.leftButtonSrc){
            throw new NothingValueError("set LeftButton path");
        }
        
        var thisObject:Scroll = this;

        var leftButton:HTMLButtonElement = document.createElement("button");
        var rightButton:HTMLButtonElement = document.createElement("button");
        
        var leftImage:HTMLImageElement = document.createElement("img");
        leftImage.src = this.leftButtonSrc;
        leftButton.appendChild(leftImage);
        leftButton.addEventListener('click' , function(){
                var bannerList = thisObject.bannerList;
                var left:string = bannerList.style.left;
                if(!left){
                    var bannerListStyle = window.getComputedStyle(bannerList);
                    left = bannerListStyle.left;
                }
                var leftNumber = parseInt(left.replace("px" , ""));
                while(leftNumber < -1 * thisObject.allElementLength){
                    leftNumber += thisObject.allElementLength;
                }

                var returnArray;
                for( var i = 0 , arrayLength = thisObject.focusArea.length ; i < arrayLength ; i++){
                    var row = thisObject.focusArea[i];
                    returnArray = row(leftNumber);
                    if(returnArray){break;}
                }
                
                var moveTo = returnArray[0] + leftNumber;
                thisObject.moveToLeft(moveTo)
        } , false);

        var rightImage:HTMLImageElement = document.createElement("img");
        rightImage.src = this.rightButtonSrc;
        rightButton.appendChild(rightImage);
        rightButton.addEventListener('click' , function(){
                var bannerList = thisObject.bannerList;
                var left:string = bannerList.style.left;
                if(!left){
                    var bannerListStyle = window.getComputedStyle(bannerList);
                    left = bannerListStyle.left;
                }
                var leftNumber = parseInt(left.replace("px" , ""));
                while(leftNumber < -1 * thisObject.allElementLength){
                    leftNumber += thisObject.allElementLength;
                }

                var returnArray;
                for( var i = 0 , arrayLength = thisObject.focusArea.length ; i < arrayLength ; i++){
                    var row = thisObject.focusArea[i];
                    var returnArrayInner = row(leftNumber);
                    if(returnArrayInner){
                        returnArray = returnArrayInner;
                    }
                }
                
                var moveTo = returnArray[1] + leftNumber;
                thisObject.moveToRight(moveTo * -1 )
        } , false);
        
        var ul = document.createElement("ul");
        ul.appendChild(document.createElement("li").appendChild(leftButton));
        ul.appendChild(document.createElement("li").appendChild(rightButton));
        return ul;
    }

    private createList():HTMLDivElement{
        var ul = document.createElement("ul");
        this.focusArea = [];
        
        var createFunction = function(start:number , end:number , moveToLeft:number , moveToRight:number){
            return function(left:number){
                left *= -1;
                if(start <= left && end >= left){
                    return [moveToLeft , moveToRight];
                }else{
                    return null;
                }
            }
        }

        var moveBannersCount = this.moveBannersCount;
        for( var j = 0 ; j < 3; j++){
            var allWidth = 0;
            for( var i = 0 , arrayLength = this.elements.length ; i < arrayLength ; i++){
                var element:ScrollElement = this.elements[i];
                var previousElement:ScrollElement = this.elements[i - 1];
                var htmlElement = element.getElement();
                var elementMarginRight = element.getMarginRight();
                if(elementMarginRight){
                    htmlElement.style.marginRight = elementMarginRight + "px";
                }else{
                    htmlElement.style.marginRight = this.elementMarginRight + "px";
                }
                var allWidthInit = allWidth;

                allWidth += this.elementMarginRight + element.width;
                ul.appendChild(htmlElement);
                
                var allWidthMoveToRight = allWidth;
                var allWidthMoveToLeft = allWidth;
                for(var z = 0 ; z < moveBannersCount - 1; z++){
                    var count = i + z;
                    while(count >= arrayLength){
                        count -= arrayLength;
                    }
                    allWidthMoveToRight += this.elementMarginRight + this.elements[count].width;
                }
                for(var z = 0 ; z < moveBannersCount; z++){
                    var count = i - z;
                    while(count < 0){
                        count += arrayLength;
                    }
                    allWidthMoveToLeft -= this.elementMarginRight + this.elements[count].width;
                }

                this.focusArea.push(createFunction(allWidthInit , allWidth , allWidthMoveToLeft , allWidthMoveToRight));
            }
            this.allElementLength = allWidth;
            var element:ScrollElement = this.elements[0];
            var allWidthInit = allWidth;

            allWidth += this.elementMarginRight + element.width;

            var allWidthMoveToRight = allWidth;
            var allWidthMoveToLeft = allWidth;

            for(var z = 0 ; z < moveBannersCount - 1; z++){
                var count = z;
                while(count >= arrayLength){
                    count -= arrayLength;
                }
                allWidthMoveToRight += this.elementMarginRight + this.elements[count].width;
            }

            var allWidthMoveToLeft = allWidth;
            for(var z = 0 ; z < moveBannersCount; z++){
                var count = z;
                while(count < 0){
                    count += arrayLength;
                }
                allWidthMoveToLeft -= this.elementMarginRight + this.elements[count].width;
            }

            this.focusArea.push(createFunction(allWidthInit , allWidth , allWidthMoveToLeft , allWidthMoveToRight));
        }
        ul.className = "bannerList";
        ul.style.left = -1 * this.allElementLength + "px";
        this.bannerList = ul;

        var divInner = document.createElement("div");
        divInner.style.border = "solid 1px black";
        divInner.className = "bannerListParent";
        divInner.appendChild(ul);
    
        var initX:number = null;
        var thisObject = this;

        divInner.addEventListener("touchstart" , function(e:any){
                var touch = e.touches[0];
                thisObject.firstMove = true;
                initX = touch.pageX;
        } , false);

        divInner.addEventListener("touchmove" , function(e:any){
                var touch = e.touches[0];
                if(!thisObject.firstMove){
                    initX = touch.pageX;
                    return false;
                }
                thisObject.firstMove = false;
                var currentX = touch.pageX;

                var bannerList = thisObject.bannerList;
                var left:string = bannerList.style.left;
                if(!left){
                    var bannerListStyle = window.getComputedStyle(bannerList);
                    left = bannerListStyle.left;
                }
                var leftNumber = parseInt(left.replace("px" , ""));
                while(leftNumber < -1 * thisObject.allElementLength){
                    leftNumber += thisObject.allElementLength;
                }

                var returnArray;
                if(currentX - initX < -1 * thisObject.scrollSensitive){
                    for( var i = 0 , arrayLength = thisObject.focusArea.length ; i < arrayLength ; i++){
                        var row = thisObject.focusArea[i];
                        returnArray = row(leftNumber);
                        if(returnArray){break;}
                    }
                    
                    var moveTo = returnArray[0] + leftNumber;
                    thisObject.moveToRight(moveTo)
                }else if(currentX - initX > thisObject.scrollSensitive){
                    for( var i = 0 , arrayLength = thisObject.focusArea.length ; i < arrayLength ; i++){
                        var row = thisObject.focusArea[i];
                        var returnArrayInner = row(leftNumber);
                        if(returnArrayInner){
                            returnArray = returnArrayInner;
                        }
                    }
                    var moveTo = returnArray[1] + leftNumber;
                    thisObject.moveToLeft(moveTo * -1)
                }else{
                    initX = touch.pageX;
                    thisObject.firstMove = true;
                }
        } , false);
        
        this.bannerListParent = divInner;

        return divInner;
    }
    
    private moveToRight(movePixel:number):void{
        var movePixelAbsolute = movePixel >  0 ? movePixel : movePixel * -1;
        var moveUnit = this.moveUnit;
        var animationUnit = this.animationUnit;
        var bannerList = this.bannerList;
        var allElementLength = this.allElementLength;

        var thisObject = this;

        var move = function(){
            if(movePixelAbsolute > moveUnit){
                movePixelAbsolute -= moveUnit;
            }else{
                moveUnit = movePixelAbsolute;
                movePixelAbsolute = 0;
            }
            var left:string = bannerList.style.left;
            if(!left){
                var bannerListStyle = window.getComputedStyle(bannerList);
                left = bannerListStyle.left;
            }
            var leftNumber = parseInt(left.replace("px" , ""));
            if(movePixel > 0 ){
                leftNumber += moveUnit;
            }else{
                leftNumber -= moveUnit;
            }
            
            if(leftNumber >= 0){
                leftNumber -= allElementLength;
            }else if(leftNumber <= -2 * allElementLength ){
                leftNumber += allElementLength;
            }
            bannerList.style.left = leftNumber + "px";

            if(movePixelAbsolute > 0){
                setTimeout(function(){
                    move();
                } , animationUnit);
            }else{
                thisObject.firstMove = true;
            }
        };
        move();
    }

    private moveToLeft(movePixel:number):void{
        this.moveToRight( -1 * movePixel);
    }
    
    private scroll():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }
}
