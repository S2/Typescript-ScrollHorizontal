/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElement.ts" />
/// <reference path="NothingValueError.ts" />

// Add the missing definitions: 

class Scroll{
    elements : ScrollElement[] = [] ;
    width  : number ;
    height : number;

    leftButtonSrc : string;
    rightButtonSrc : string;

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
        
        var leftButton:HTMLButtonElement = document.createElement("button");
        var rightButton:HTMLButtonElement = document.createElement("button");
        
        var leftImage:HTMLImageElement = document.createElement("img");
        leftImage.src = this.leftButtonSrc;
        leftButton.appendChild(leftImage);
        var rightImage:HTMLImageElement = document.createElement("img");
        rightImage.src = this.rightButtonSrc;
        rightButton.appendChild(rightImage);
        
        var ul = document.createElement("ul");
        ul.appendChild(document.createElement("li").appendChild(leftButton));
        ul.appendChild(document.createElement("li").appendChild(rightButton));
        return ul;
    }

    private createList():HTMLUListElement{
        var ul = document.createElement("ul");
        for( var i = 0 , arrayLength = this.elements.length ; i < arrayLength ; i++){
            var element:ScrollElement = this.elements[i];
            ul.appendChild(element.getElement());
        }
        return ul;
    }
    
    private moveToRight():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }

    private moveToLeft():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }

    private scroll():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }
}
