/// <reference path="jquery.d.ts" />

// Add the missing definitions: 
class ScrollButton{
    width   : number;
    height  : number;
    marginRight : number;
    hooks   : Array = [] ;
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
        要素取得<br>
        主にマネージャークラスから呼び出す<br>
        @method getElement
        @return HTMLElement
    */
    getButton():HTMLElement{throw "must overrride"}

}
