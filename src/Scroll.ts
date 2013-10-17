/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElement.ts" />
/// <reference path="NothingValueError.ts" />
/// <reference path="ScrollNavigator.ts" />
/// <reference path="ScrollButton.ts" />

// Add the missing definitions: 

class Scroll{
    /**
        @class Scroll
        @constructor
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
    */
    elements : ScrollElement[] = [] ;
    DomElements = [] ;
    width  : number ;
    height : number;

    leftButton: ScrollButton;
    rightButton: ScrollButton;

    bannerList : HTMLUListElement;
    bannerListParent : HTMLDivElement;

    elementMarginRight : number = 20;
    allElementLength : number;
    initAllElementLength : number;

    moveBannersCount : number = 1

    firstMove : Boolean;
    scrollSensitive = 10;
    
    currentFocusArea : number = 0;
    focusArea = [];
    displayedArea = [];
    initSizeFinished : Boolean= false;

    useNavigator : Boolean = false;
    navigator : ScrollNavigator;
    
    createButton : Boolean = false;

    widthAreaPercent : number =  100;

    moving : Boolean = false;

    ulPaddingLeft:number = 10;
    locked = false;
 
    /**
        navigatorClassName
        @property navigatorClassName
        @type String
        @default "navigator"
    **/
    public navigatorClassName       : string = "navigator";

    /**
        nextButtonClassName
        @property nextButtonClassName
        @type String
        @default "nextButton"
    **/
    public nextButtonClassName       : string = "nextButton";

    /**
        previousButtonClassName
        @property previousButtonClassName
        @type String
        @default "previousButton"
    **/

    public previousButtonClassName   : string = "previousButton";
    /**
        bannerListClassName
        @property bannerListClassName
        @type String
        @default "bannerList"
    **/

    public bannerListClassName       : string = "bannerList";
    /**
        bannerListParentClassName
        @property bannerListParentClassName
        @type String
        @default "bannerListParent"
    **/
    public bannerListParentClassName : string = "bannerListParent";

    constructor(width : number , height : number){
        this.width = width;
        this.height = height;
    }
    /**
        スクロールの感度を設定します。<br>
        タップ中移動したピクセルがこの数値以下の場合、水平方向に移動しません。<br>

        @method setScrollSensitive
        @param sensitive {number} 
        @return void
    */

    public setScrollSensitive(sensitive : number){
        this.scrollSensitive = sensitive;
    }

    public lock(){
        this.locked = true;
    }

    private incremenetCurrentFocus(){
        this.currentFocusArea += 1;
        if(this.currentFocusArea > this.elements.length){
            this.currentFocusArea -= this.elements.length
        }
    }
    private decremenetCurrentFocus(){
        this.currentFocusArea -= 1;
        if(this.currentFocusArea <= 0){
            this.currentFocusArea += this.elements.length
        }
    }

    /**
        左右のボタンを作成しないようにします。
        @method setNoCreateButton
        @return void
    */

    public setNoCreateButton(){
        this.createButton = false;
    }

    /**
        左右のボタンを作成するようにします。
        @method setCreateButton
        @return void
    */

    public setCreateButton(){
        this.createButton = true;
    }
    
    /**
        センター出しをします<br>
        
        @method setScrollCenter 
        @param {} 
        @return void
    */
    public setScrollCenter(distanceLeft : number):void{
        this.ulPaddingLeft = distanceLeft;
        this.bannerList.style.paddingLeft = distanceLeft  + "px";
    }


    moveUnit : number = 10;
    /**
        バナー移動のアニメーションの単位移動ピクセルを指定します。。<br>
        default : 10

        @method setAnimationMoveUnitDistance
        @param moveUnit {number} 
        @return void
    */
    public setAnimationMoveUnitDistance(moveUnit:number){
        this.moveUnit = moveUnit;
    }
    
    /**
        水平方向の画像移動時に、count個分移動します。。<br>
        default : 1

        @method setMoveBannersCount
        @param count {number} 
        @return void
    */
    public setMoveBannersCount(count:number){
        this.moveBannersCount = count;
    }

    /**
        バナー移動のアニメーションの単位移動時間をミリ秒で指定します。<br>
        default : 10

        @method setAnimationMoveUnitTime
        @param milliSeconds {number} 
        @return void
    */
    animationUnit : number = 10;
    public setAnimationMoveUnitTime(millSeconds:number){
        this.animationUnit = millSeconds;
    }

    /**
        画像間のマージンを指定します。実態は画像右側のマージンです。<br>
        default : 20

        @method setMarginRight
        @param marginRight {number} 
        @return void
    */
    public setMarginRight(marginRight:number){
        this.elementMarginRight = marginRight;
    }

    /**
        右ボタン、左ボタンの画像のパスをしていします。<br>

        @method setButtons
        @param leftButton {ScrollButton} 左に進むボタンURL
        @param rightButton {ScrollButton} 右に進むボタンURL

        @return void
    */
    public setButtons(leftButton:ScrollButton , rightButton:ScrollButton){
        this.createButton = true;
        this.leftButton = leftButton;
        this.rightButton = rightButton;
    }

    /**
        スクロールエリアに表示する画像エレメントを追加します。<br>

        @method addScrollElement
        @param scrollElement {ScrollElement}
        @return void
    */
    public addScrollElement(scrollElement:ScrollElement){
        this.elements.push(scrollElement);
    }
    
    /**
        スクロールエリア、左右ボタンエリアを含むDiv要素を返します。

        @method create
        @return HTMLDivElement
    */

    public create():HTMLDivElement{
        var scrollObject = this.createList();
        var div = document.createElement("div");
        div.style.width = this.width ? this.width + "px" : "100%";
        div.style.height = this.height + "px"
        div.appendChild(scrollObject);
        if(this.createButton){
            var buttons = this.createButtons();
            div.appendChild(buttons);
        }
        
        return div;
    }

    private createButtons():HTMLUListElement{
        var thisObject:Scroll = this;

        var leftButton:HTMLElement = this.leftButton.getButton();
        leftButton.className = this.previousButtonClassName;
        leftButton.addEventListener('click' , function(e){
                var bannerList = thisObject.bannerList;
                var left:string = bannerList.style.left;
                if(!left){
                    var bannerListStyle = window.getComputedStyle(bannerList);
                    left = bannerListStyle.left;
                }
                var leftNumber = parseInt(left.replace("px" , ""));
                while(leftNumber < -1 * thisObject.allElementLength){
                    leftNumber += thisObject.allElementLength;
                }

                var returnArray;
                for( var i = 0 , arrayLength = thisObject.focusArea.length ; i < arrayLength ; i++){
                    var row = thisObject.focusArea[i];
                    returnArray = row(leftNumber);
                    if(returnArray){
                        break;
                    }
                }
                thisObject.decremenetCurrentFocus();
                var moveTo = returnArray[0] + leftNumber;
                thisObject.moveToLeft(moveTo)
        } , false);

        var rightButton:HTMLElement = this.rightButton.getButton();
        rightButton.className = this.nextButtonClassName;
        rightButton.addEventListener('click' , function(e){
                var bannerList = thisObject.bannerList;
                var left:string = bannerList.style.left;
                if(!left){
                    var bannerListStyle = window.getComputedStyle(bannerList);
                    left = bannerListStyle.left;
                }
                var leftNumber = parseInt(left.replace("px" , ""));
                while(leftNumber < -1 * thisObject.allElementLength){
                    leftNumber += thisObject.allElementLength;
                }

                var returnArray;
                for( var i = 0 , arrayLength = thisObject.focusArea.length ; i < arrayLength ; i++){
                    var row = thisObject.focusArea[i];
                    var returnArrayInner = row(leftNumber);
                    if(returnArrayInner){
                        returnArray = returnArrayInner;
                    }
                }
                
                thisObject.incremenetCurrentFocus();
                //var moveTo = returnArray[1] + leftNumber;
                var moveTo = returnArray[1] - returnArray[0];
                thisObject.moveToRight(moveTo * -1 )
        } , false);
        
        var ul = document.createElement("ul");
        ul.appendChild(document.createElement("li").appendChild(leftButton));

        if(this.useNavigator){
            var navigatorElement = this.navigator.displayNavigator();
            var navigatorLi = document.createElement("li");
            navigatorLi.appendChild(navigatorElement)
            navigatorLi.className = this.navigatorClassName;
            ul.appendChild(navigatorLi);
        }

        ul.appendChild(document.createElement("li").appendChild(rightButton));
        return ul;
    }

    private createList():HTMLDivElement{
        var ul = document.createElement("ul");
        this.focusArea = [];
        this.DomElements = [];
        
        for( var j = 0 ; j < 3; j++){
            for( var i = 0 , arrayLength = this.elements.length ; i < arrayLength ; i++){
                var element:ScrollElement = this.elements[i];
                var previousElement:ScrollElement = this.elements[i - 1];
                var htmlElement = element.getElement();

                var elementMarginRight = element.getMarginRight();
                if(elementMarginRight){
                    htmlElement.style.marginRight = elementMarginRight + "px";
                }else{
                    htmlElement.style.marginRight = this.elementMarginRight + "px";
                }
                htmlElement.style.marginLeft = "0px";

                ul.appendChild(htmlElement);
                this.DomElements.push(htmlElement);
            }
        }
        ul.className = this.bannerListClassName;
        ul.style.paddingLeft = this.ulPaddingLeft + "px";
        this.bannerList = ul;

        var divInner = document.createElement("div");
        divInner.style.border = "solid 1px black";
        divInner.className = this.bannerListParentClassName ;
        divInner.appendChild(ul);
    
        var initX:number = null;
        var thisObject = this;

        divInner.addEventListener("touchstart" , function(e:any){
                if(thisObject.moving){
                    return
                }
                var touch = e.touches[0];
                thisObject.firstMove = true;
                initX = touch.pageX;
        } , false);

        divInner.addEventListener("touchmove" , function(e:any){
                var touch = e.touches[0];
                if(!thisObject.firstMove){
                    return false;
                }
                thisObject.firstMove = false;

                $("#blank1").html($("#blank1").html() + "1111111111<br>");
                var currentX = touch.pageX;

                var bannerList = thisObject.bannerList;
                var left:string = bannerList.style.left;
                if(!left){
                    var bannerListStyle = window.getComputedStyle(bannerList);
                    left = bannerListStyle.left;
                }
                var leftNumber = parseInt(left.replace("px" , ""));
                while(leftNumber < -1 * thisObject.allElementLength){
                    leftNumber += thisObject.allElementLength;
                }

                var returnArray;
                if(currentX - initX < -1 * thisObject.scrollSensitive){
                    if(!thisObject.moving){
                        e.preventDefault();
                    }
                    for( var i = 0 , arrayLength = thisObject.focusArea.length ; i < arrayLength ; i++){
                        var row = thisObject.focusArea[i];
                        returnArray = row(leftNumber);
                        if(returnArray){
                            break;
                        }
                    }
                    
                    thisObject.incremenetCurrentFocus();
                    var moveTo = returnArray[0] + leftNumber;
                    thisObject.moveToRight(moveTo)
                }else if(currentX - initX > thisObject.scrollSensitive){
                    if(!thisObject.moving){
                        e.preventDefault();
                    }
                    for( var i = 0 , arrayLength = thisObject.focusArea.length ; i < arrayLength ; i++){
                        var row = thisObject.focusArea[i];
                        var returnArrayInner = row(leftNumber);
                        if(returnArrayInner){
                            returnArray = returnArrayInner;
                        }
                    }

                    thisObject.decremenetCurrentFocus();
                    var moveTo = returnArray[1] - returnArray[0];
                    thisObject.moveToLeft(moveTo * -1)
                }else{
//                    initX = touch.pageX;
//                    thisObject.firstMove = true;
                }
        } , false);

        divInner.addEventListener("touchend" , function(e:any){
            e.defaultPrevented = false;
        } , false);

       
        this.bannerListParent = divInner;
        return divInner;
    }

    public initSize(){
        if(this.initSizeFinished){
            return;
        }
        this.locked = false;
        this.displayedArea = [];
        this.focusArea = [];
        this.initSizeFinished = true;
        var elements = this.DomElements;
        var arrayLength = elements.length;
        var allWidth = 0;
        var moveBannersCount = this.moveBannersCount;
        var thisObject = this;

        var createFunction = function(start:number , end:number , moveToLeft:number , moveToRight:number){
            return function(left:number){
                left *= -1;
                if(start <= left && end >= left){
                    return [moveToLeft , moveToRight];
                }else{
                    return null;
                }
            }
        }

        var createFunctionDisplayedArea = function(start:number , end:number):Boolean{
            return function(left:number){
                var width = thisObject.width ? thisObject.width : parseInt(thisObject.bannerListParent.style.width);
                var allWidth = thisObject.allElementLength;

                while(end > allWidth){
                    end -= allWidth
                    start -= allWidth
                }

                // 100%表示
                if(left <= start && left + width >= end){
                    return true;
                }
                
                // 右側にはみ出してる
                if(left <= start && left + width > start && left + width < end){
                    var displayedEnd = left + width;
                    var percent = 100 * (displayedEnd - start) / (end - start) ;
                    if(thisObject.widthAreaPercent <= percent){
                        return true;
                    }
                    return false;
                }

                // 左側にはみ出してる
                if(left > start && left + width >= end && end > left){
                    var displayedStart = left;
                    var percent = 100 * (end - displayedStart) / (end - start) ;
                    if(thisObject.widthAreaPercent <= percent){
                        return true;
                    }
                    return false;
                }

                left -= allWidth;

                // 100%表示
                if(left <= start && left + width >= end){
                    return true;
                }
                
                // 右側にはみ出してる
                if(left <= start && left + width > start && left + width < end){
                    var displayedEnd = left + width;
                    var percent = 100 * (displayedEnd - start) / (end - start) ;
                    if(thisObject.widthAreaPercent <= percent){
                        return true;
                    }
                    return false;
                }

                // 左側にはみ出してる
                if(left > start && left + width >= end && end > left){
                    var displayedStart = left;
                    var percent = 100 * (end - displayedStart) / (end - start) ;
                    if(thisObject.widthAreaPercent <= percent){
                        return true;
                    }
                    return false;
                }

                // left ~ left - widthが表示領域
                return false;
            }
        }

        var $ul = $(this.bannerList);
        var ulPaddingLeft = parseInt($ul.css('padding-left'));
        
        for( var i = 0 , arrayLength = elements.length ; i < arrayLength ; i++){
            var row = elements[i];

            var allWidthInit = allWidth;
            
            allWidth += parseInt($(row).css("margin-right")) + parseInt($(row).css("width"));

            var allWidthMoveToRight = allWidth;
            var allWidthMoveToLeft = allWidth;

            for(var z = 0 ; z < moveBannersCount - 1; z++){
                allWidthMoveToRight += parseInt($(row).css("margin-right")) + parseInt($(row).css("width"));
            }

            var allWidthMoveToLeft = allWidth;
            for(var z = 0 ; z < moveBannersCount; z++){
                var count = z;
                while(count < 0){
                    count += arrayLength;
                }
                allWidthMoveToLeft -= parseInt($(row).css("margin-right")) + parseInt($(row).css("width"));
            }
            thisObject.focusArea.push(createFunction(allWidthInit , allWidth , allWidthMoveToLeft , allWidthMoveToRight));

            thisObject.displayedArea.push(createFunctionDisplayedArea(allWidthInit + ulPaddingLeft , allWidth + ulPaddingLeft));
            if((i + 1) % (arrayLength / 3) == 0){
                thisObject.allElementLength = allWidth;
                thisObject.initAllElementLength = -1 * allWidth;
                allWidth = 0;
            }
        }
        
        $(this.bannerList).css("left" , this.initAllElementLength + "px");
        if(thisObject.useNavigator){
            thisObject.navigator.changeActive(thisObject.getDisplayedBanners());
        }
    }

    /**
        @method setNavigatorElements
        @return HTMLUlistElement
    */
    public setNavigatorElements(navigatorElements:ScrollNavigatorElement[] , width : number , height : number){
        var navigator = new ScrollNavigator(width , height)
            for( var i = 0 , arrayLength = navigatorElements.length ; i < arrayLength ; i++){
            var row = navigatorElements[i];
            navigator.addScrollNavigatorElement(row);
        }
        this.useNavigator = true;
        this.navigator = navigator;
    }
    
    private moveToRight(movePixel:number):void{
        if(this.moving){
            return;
        }
        if(this.locked){
            return;
        }
        this.moving = true;
        var movePixelAbsolute = movePixel >  0 ? movePixel : movePixel * -1;
        var moveUnit = this.moveUnit;
        var animationUnit = this.animationUnit;
        var bannerList = this.bannerList;
        var allElementLength = this.allElementLength;

        var thisObject = this;

        var move = function(){
            if(movePixelAbsolute > moveUnit){
                movePixelAbsolute -= moveUnit;
            }else{
                moveUnit = movePixelAbsolute;
                movePixelAbsolute = 0;
                if(thisObject.useNavigator){
                    thisObject.navigator.changeActive(thisObject.getDisplayedBanners());
                }
            }
            var left:string = bannerList.style.left;
            if(!left){
                var bannerListStyle = window.getComputedStyle(bannerList);
                left = bannerListStyle.left;
            }
            var leftNumber = parseInt(left.replace("px" , ""));
            if(movePixel > 0 ){
                leftNumber += moveUnit;
            }else{
                leftNumber -= moveUnit;
            }
            
            if(leftNumber >= 0){
                leftNumber -= allElementLength;
            }else if(leftNumber <= -2 * allElementLength ){
                leftNumber += allElementLength;
            }
            bannerList.style.left = leftNumber + "px";

            if(movePixelAbsolute > 0){
                setTimeout(function(){
                    move();
                } , animationUnit);
            }else{
                thisObject.firstMove = true;
                thisObject.moving = false;
            }
        };
        move();
    }

    private moveToLeft(movePixel:number):void{
        this.moveToRight( -1 * movePixel);
    }
    
    private scroll():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }

    /**
        表示されている横幅がpercentより大きければ、ナビゲーション上で表示されている状態とする
        @method setWidthAreaPercent
        @param percent {number} 
        @return void
    */
    public setWidthAreaPercent(percent : number){
        this.widthAreaPercent = percent;
    }

    public getDisplayedBanners():number[]{
        var displayed = [];
        
        var bannerList = this.bannerList;
        var left:string = bannerList.style.left;
        if(!left){
            var bannerListStyle = window.getComputedStyle(bannerList);
            left = bannerListStyle.left;
        }
        var leftNumber = parseInt(left.replace("px" , ""));
        leftNumber *= -1;
        while(leftNumber >= this.allElementLength){
            leftNumber -= this.allElementLength;
        }
        var elementCount = this.focusArea.length / 3;
        for( var i = 0 , arrayLength = this.focusArea.length ; i < arrayLength ; i++){
            var row = this.displayedArea[i];
            if(row(leftNumber)){
                var j = i;
                while(j > elementCount){
                    j -= elementCount
                }
                displayed.push(j)
            }
        }

        return displayed;
    }
}
