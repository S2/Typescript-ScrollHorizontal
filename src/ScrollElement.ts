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
        @return HTMLElement
    */
    public getElement():HTMLElement{
        throw "override";
    }
}
