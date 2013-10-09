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
        return this.jQueryObject.get()[0];
    }
}
