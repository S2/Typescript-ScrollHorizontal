/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElementJQuery.ts" />

class ScrollElementTag extends ScrollElementJQuery{
    /**
        @class ScrollElementTag
        @constructor
        @param HTMLTag {string} タグ文字列。そのままjQueryに食わせる
    */
    constructor(tag : string){
        super(jQuery(tag))
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
}
