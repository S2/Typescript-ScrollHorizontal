/// <reference path="jquery.d.ts" />
/// <reference path="ScrollButton.ts" />

// Add the missing definitions: 
class ScrollButtonJQuery extends ScrollButton{
    /**
        @class Scroll
        @constructor
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
    */
    jQueryElement : JQuery;
    constructor(jQueryElement : JQuery){
        super();
        this.jQueryElement = jQueryElement ;
    }

    /**
        要素取得<br>
        主にマネージャークラスから呼び出す<br>
        @method getElement
        @return HTMLElement
    */
    getButton():HTMLElement{
        return this.jQueryElement.get()[0]
    }
}
