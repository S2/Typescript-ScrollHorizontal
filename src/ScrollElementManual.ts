/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElement.ts" />

// Add the missing definitions: 

class ScrollElementManual extends ScrollElement{
    /**
        @class ScrollElementManual
        @constructor
        @param imgSrc {string} banner url 
        @param linkURL {string} banner link url
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
        @param marginRight {number} Optional marginRight
    */
    constructor(imgSrc : string , linkURL : string , width : number , height : number , marginRight : number){
        super()
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
    /**
        右側マージン変更<br>
        @method getMarginRight
        @return number
    */
    /**
        URL変更<br>
        @method setURL
        @param linkURL {string} 
        @return void
    */
    /**
        リンククリック前にメソッドをフックする<br>
        @method setURL
        @param method {method} 
        @return void
    */
    /**
        要素取得<br>
        主にマネージャークラスから呼び出す<br>
        @method getElement
        @return HTMLElement
    */
    public getElement():HTMLElement{
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
