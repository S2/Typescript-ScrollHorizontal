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

    public resize(){
        this.initSizeFinished = false;
        this.width = null;
        this.initSize();
        this.changeFocus();
    }

    public initSize(){
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
