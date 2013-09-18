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
    elements : ScrollElement[] = [] ;
    width  : number ;
    height : number;

    leftButtonSrc : string;
    rightButtonSrc : string;

    bannerList : HTMLUListElement;
    bannerListParent : HTMLDivElement;

    moveUnit : number = 5;
    animationUnit : number = 5;

    elementMarginRight : number = 20;
    allElementLength : number;

    constructor(width : number , height : number){
        this.width = width;
        this.height = height;
    }

    public setButtonSrc(leftButtonSrc:string , rightButtonSrc:string){
        this.leftButtonSrc = leftButtonSrc;
        this.rightButtonSrc = rightButtonSrc;
    }

    public addElement(scrollElement:ScrollElement){
        this.elements.push(scrollElement);
    }
    
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
        leftButton.addEventListener('click' , function(){thisObject.moveToLeft(100)} , false);

        var rightImage:HTMLImageElement = document.createElement("img");
        rightImage.src = this.rightButtonSrc;
        rightButton.appendChild(rightImage);
        rightButton.addEventListener('click' , function(){thisObject.moveToRight(100)} , false);
        
        var ul = document.createElement("ul");
        ul.appendChild(document.createElement("li").appendChild(leftButton));
        ul.appendChild(document.createElement("li").appendChild(rightButton));
        return ul;
    }

    private createList():HTMLDivElement{
        var ul = document.createElement("ul");

        for( var j = 0 ; j < 3; j++){
            var allWidth = 0;
            for( var i = 0 , arrayLength = this.elements.length ; i < arrayLength ; i++){
                var element:ScrollElement = this.elements[i];
                var htmlElement = element.getElement();
                htmlElement.style.marginRight = this.elementMarginRight + "px";
                allWidth += this.elementMarginRight + element.width;
                ul.appendChild(htmlElement);
            }
            this.allElementLength = allWidth;
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
                initX = null;
        } , false);
        divInner.addEventListener("touchmove" , function(e:any){
                var touch = e.touches[0];
                var currentX = touch.pageX;
                if(initX){
                    var diffX:number = currentX - initX;
                    thisObject.moveToRight(diffX);
                    initX = currentX;
                }else{
                    initX = currentX;
                }
        } , true);
        
        divInner.addEventListener("mouseout" , function(e:Event){
                initX = null;
        } , false);
        divInner.addEventListener("mousemove" , function(e:Event){
                var currentX = e.pageX;
                if(initX){
                    var diffX:number = currentX - initX;
                    thisObject.moveToRight(diffX);
                    initX = currentX;
                }else{
                    initX = currentX;
                }
        } , false);

        this.bannerListParent = divInner;

        return divInner;
    }
    
    private moveToRightScroll():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }

    private moveToLeftScroll():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }

    private moveToRight(movePixel:number):void{
        var movePixelAbsolute = movePixel >  0 ? movePixel : movePixel * -1;
        var moveUnit = this.moveUnit;
        var animationUnit = this.animationUnit;
        var bannerList = this.bannerList;
        var allElementLength = this.allElementLength;

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
            
            if(leftNumber > 0){
                leftNumber -= allElementLength;
            }else if(leftNumber < -2 * allElementLength ){
                leftNumber += allElementLength;
            }
            bannerList.style.left = leftNumber + "px";

            if(movePixelAbsolute > 0){
                setTimeout(function(){
                    move();
                } , animationUnit);
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
