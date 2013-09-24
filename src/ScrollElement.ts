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
    width   : number;
    height  : number;
    marginRight : number;
    hooks   : Array = [] ;
    /**
        @class ScrollElement
        @constructor
        @param imgSrc {string} banner url 
        @param linkURL {string} banner link url
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
        @param marginRight {number} Optional marginRight
    */

    constructor(imgSrc : string , linkURL : string , width : number , height : number , marginRight : number){
        this.imgSrc = imgSrc;
        this.linkURL = linkURL;
        this.width = width;
        this.height = height;
        if(marginRight){
            this.marginRight = marginRight;
        }
    }

    /**
        右側マージン変更<br>
        @method setMarginRight
        @param marginRight {number} 
        @return void
    */
    public setMarginRight(marginRight:number){
        this.marginRight = marginRight;
    }

    /**
        右側マージン変更<br>
        @method getMarginRight
        @return number
    */
    public getMarginRight():number{
        return this.marginRight;
    }


    /**
        URL変更<br>
        @method setURL
        @param linkURL {string} 
        @return void
    */
    public setURL(linkURL:string){
        this.linkURL = linkURL;
    }

    /**
        リンククリック前にメソッドをフックする<br>
        @method setURL
        @param method {method} 
        @return void
    */
    public addBeforeClickHook(method:()=>void){
        this.hooks.push(method);
    }
    
    /**
        要素取得<br>
        主にマネージャークラスから呼び出す<br>
        @method getElement
        @return HTMLAnchorElement
    */
    public getElement():HTMLAnchorElement{
        var img:HTMLImageElement = document.createElement("img");
        var a:HTMLAnchorElement = document.createElement("a");
        img.src = this.imgSrc;
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        a.href = this.linkURL;
        a.appendChild(img);
        a.className = "scrollElement"
        return a;
    }
}
