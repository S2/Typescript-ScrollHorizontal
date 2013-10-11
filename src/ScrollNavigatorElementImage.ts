/// <reference path="jquery.d.ts" />
/// <reference path="ScrollNavigatorElement.ts" />

// Add the missing definitions: 

class ScrollNavigatorElementImage implements ScrollNavigatorElement{
    width:number;
    height:number;
    activeImageSrc :string;
    notActiveImageSrc :string;
    /**
        @class Scroll
        @constructor
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
    */
    constructor(width : number , height : number , activeImageSrc : string, notActiveImageSrc : string){
        this.width = width;
        this.height = height;
        this.activeImageSrc = activeImageSrc;
        this.notActiveImageSrc = notActiveImageSrc;
    }
    
    element : HTMLElement 
    public getElement():HTMLElement{
        var element = document.createElement("img")
        element.src = this.notActiveImageSrc;
        this.element = element;
        return element;
    }
    public changeActive():void{
        (<HTMLImageElement>this.element).src = this.activeImageSrc;
    }
    public changeNotActive():void{
        (<HTMLImageElement>this.element).src = this.notActiveImageSrc;
    }
}
