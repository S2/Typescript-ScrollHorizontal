/// <reference path="jquery.d.ts" />
/// <reference path="ScrollButton.ts" />

// Add the missing definitions: 
class ScrollButtonImage extends ScrollButton{
    /**
        @class Scroll
        @constructor
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
    */
    imageSrc :string ;
    constructor(imageSrc : string){
        super();
        this.imageSrc = imageSrc;
    }

    /**
        要素取得<br>
        主にマネージャークラスから呼び出す<br>
        @method getButton
        @return HTMLElement
    */
    getButton():HTMLElement{
        var button:HTMLButtonElement = document.createElement("button");
        var image:HTMLImageElement = document.createElement("img");
        image.src = this.imageSrc;
        button.appendChild(image);
        return button;
    }
}
