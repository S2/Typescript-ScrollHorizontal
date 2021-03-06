/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElement.ts" />

class ScrollElementJQuery extends ScrollElement{
    /**
        @class ScrollElementJQuery
        @constructor
        @param jQueryObject {jQuery} outputJqueryObject
    */
    jQueryObject:JQuery;
    constructor(jQueryObject : JQuery){
        super()
        this.jQueryObject = jQueryObject;
        this.width = parseInt(jQueryObject.css("width"));
        this.height = parseInt(jQueryObject.css("height"));
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
        this.jQueryObject.removeClass("scrollElement");
        this.jQueryObject.addClass("scrollElement");
        var returnElement = this.jQueryObject.clone(true).get()[0];
        if(returnElement.tagName == "A"){
            returnElement.childNodes[0].style.width = this.width + "px";
        }else{
            returnElement.style.width = this.width + "px";
        }
        returnElement.style.width = this.width + "px";
        return returnElement;
    }
}
