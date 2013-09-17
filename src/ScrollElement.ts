/// <reference path="jquery.d.ts" />

// Add the missing definitions: 
interface HTMLElement{
    requestFullscreen();
    webkitRequestFullScreen();
    mozRequestFullScreen();
}


class ScrollElement{
    imgSrc  : string;
    linkURL : string;
    width   :  number;
    height  : number;
    hooks   : Array = [] ;

    constructor(imgSrc : string , linkURL : string , width : number , height : number){
        this.imgSrc = imgSrc;
        this.linkURL = linkURL;
        this.width = width;
        this.height = height;
    }

    public setURL(linkURL:string){
        this.linkURL = linkURL;
    }

    public addBeforeClickHook(method:()=>void){
        this.hooks.push(method);
    }
    
    public getElement():HTMLAnchorElement{
        var img:HTMLImageElement = document.createElement("img");
        var a:HTMLAnchorElement = document.createElement("a");
        img.src = this.imgSrc;
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        a.href = this.linkURL;
        a.appendChild(img);
        return a;
    }
}
