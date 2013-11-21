/// <reference path="jquery.d.ts" />
/// <reference path="Scroll.ts" />

// Add the missing definitions: 

class StaticSizeScroll extends Scroll{
    bannerWidth:number;
    bannerDisplayCount:number;
    bannerMarginRight:number;
    /**
        @class StaticSizeScroll
        @constructor
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
        @param bannerWidth {number} bannerWidth
        @param bannerMarginRight {number} bannerMarginRight 
        @param bannerDisplayCount {number} バナー表示数 でフォルト1
    */
    constructor(width : number , height : number , bannerWidth:number  , bannerMarginRight : number , bannerDisplayCount:number){
        super(width , height);

        this.bannerWidth = bannerWidth;
        this.bannerMarginRight = bannerMarginRight;
        bannerDisplayCount = bannerDisplayCount || 1;
        this.bannerDisplayCount = bannerDisplayCount;
        if(width && bannerDisplayCount * bannerWidth + (bannerDisplayCount - 1 ) * bannerMarginRight > width){
            throw("widthが足りません")
        }
    }
    
    public addScrollElement(scrollElement:ScrollElement){
        scrollElement.setWidth(this.bannerWidth)
        scrollElement.setMarginRight(this.bannerMarginRight)
        this.elements.push(scrollElement);
    }

    public setMarginRight(marginRight:number){
        super.setMarginRight(marginRight);
        
        var displayedElements = this.DomElements;
        for( var i = 0 , arrayLength = displayedElements.length ; i < arrayLength ; i++){
            var htmlElement = displayedElements[i];
            htmlElement.style.marginRight = this.elementMarginRight + "px";
        }
        this.bannerMarginRight = marginRight;
    }

    public resize(){
        this.initSizeFinished = false;
        this.width = null;
        this.initSize();
        this.changeFocus();
    }

    public initSize(){
        if(this.bannerWidth == null){
            this.bannerWidth = parseInt($(this.bannerListParent).css("width"));
            for( var i = 0 , arrayLength = this.DomElements.length ; i < arrayLength ; i++){
                var row:HTMLElement = this.DomElements[i];
                if(row.tagName == "A"){
                    row.childNodes[0]["style"]["width"] = this.bannerWidth + "px";
                }else{
                    row.style.width = this.bannerWidth + "px";
                }
            }
        }
        this.setCenter();
        super.initSize();
    }

    public changeFocus(){
        var moveTo = this.currentFocusArea * this.bannerWidth + (this.currentFocusArea) * this.bannerMarginRight;
        $(this.bannerList).css("left" , (this.initAllElementLength - moveTo) + "px");

        if(this.useNavigator){
            this.navigator.changeActive(this.getDisplayedBanners());
        }
    }

    private setCenter(){
        if(!this.width){
            this.width = parseInt($(this.bannerListParent).css("width"));
        }
        console.log(this.width);
        var distanceLeft = (this.width - (this.bannerDisplayCount * this.bannerWidth + (this.bannerDisplayCount - 1 )* this.bannerMarginRight)) / 2;
        this.setScrollCenter(distanceLeft);
    }

}
