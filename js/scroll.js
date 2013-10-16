var ScrollElement = (function () {
    function ScrollElement() {
        this.hooks = [];
    }
    /**
    右側マージン変更<br>
    @method setMarginRight
    @param marginRight {number}
    @return void
    */
    ScrollElement.prototype.setMarginRight = function (marginRight) {
        this.marginRight = marginRight;
    };

    /**
    右側マージン変更<br>
    @method getMarginRight
    @return number
    */
    ScrollElement.prototype.getMarginRight = function () {
        return this.marginRight;
    };

    /**
    横幅変更<br>
    @method setWidth
    @return void
    */
    ScrollElement.prototype.setWidth = function (width) {
        this.width = width;
    };

    /**
    URL変更<br>
    @method setURL
    @param linkURL {string}
    @return void
    */
    ScrollElement.prototype.setURL = function (linkURL) {
        this.linkURL = linkURL;
    };

    /**
    リンククリック前にメソッドをフックする<br>
    @method setURL
    @param method {method}
    @return void
    */
    ScrollElement.prototype.addBeforeClickHook = function (method) {
        this.hooks.push(method);
    };

    /**
    要素取得<br>
    主にマネージャークラスから呼び出す<br>
    @method getElement
    @return HTMLElement
    */
    ScrollElement.prototype.getElement = function () {
        throw "override";
    };
    return ScrollElement;
})();
var NothingValueError = (function () {
    function NothingValueError(message) {
        this.code = 100;
        this.message = message;
    }
    NothingValueError.prototype.getCode = function () {
        return this.code;
    };
    return NothingValueError;
})();
;

var ScrollNavigator = (function () {
    /**
    @class ScrollNavigator
    @param width  {number} NavigatorArea Width
    @param height {number} NavigatorArea Height
    @constructor
    */
    function ScrollNavigator(width, height) {
        this.elements = [];
    }
    /**
    @method addScrollNavigatorElement
    @param element {ScrollNavigatorElement}
    @return void
    */
    ScrollNavigator.prototype.addScrollNavigatorElement = function (element) {
        this.elements.push(element);
    };

    /**
    @method displayNavigator
    @return HTMLUListElement
    */
    ScrollNavigator.prototype.displayNavigator = function () {
        var ul = document.createElement("ul");
        for (var i = 0, arrayLength = this.elements.length; i < arrayLength; i++) {
            var row = this.elements[i].getElement();
            ul.appendChild(row);
        }
        return ul;
    };

    /**
    @method moveAction
    @param event {event}
    @return void
    */
    ScrollNavigator.prototype.changeActive = function (activeIndexes) {
        var activeIndexesHash = {};
        for (var i = 0, arrayLength = activeIndexes.length; i < arrayLength; i++) {
            var activeIndex = activeIndexes[i];
            activeIndexesHash[activeIndex] = true;
        }
        for (var i = 0, arrayLength = this.elements.length; i < arrayLength; i++) {
            var row = this.elements[i];
            if (activeIndexesHash[i]) {
                row.changeActive();
            } else {
                row.changeNotActive();
            }
        }
    };
    return ScrollNavigator;
})();
/// <reference path="jquery.d.ts" />
// Add the missing definitions:
var ScrollButton = (function () {
    function ScrollButton() {
        this.hooks = [];
    }
    /**
    右側マージン変更<br>
    @method setMarginRight
    @param marginRight {number}
    @return void
    */
    ScrollButton.prototype.setMarginRight = function (marginRight) {
        this.marginRight = marginRight;
    };

    /**
    右側マージン変更<br>
    @method getMarginRight
    @return number
    */
    ScrollButton.prototype.getMarginRight = function () {
        return this.marginRight;
    };

    /**
    要素取得<br>
    主にマネージャークラスから呼び出す<br>
    @method getElement
    @return HTMLElement
    */
    ScrollButton.prototype.getButton = function () {
        throw "must overrride";
    };
    return ScrollButton;
})();
/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElement.ts" />
/// <reference path="NothingValueError.ts" />
/// <reference path="ScrollNavigator.ts" />
/// <reference path="ScrollButton.ts" />
// Add the missing definitions:
var Scroll = (function () {
    function Scroll(width, height) {
        /**
        @class Scroll
        @constructor
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
        */
        this.elements = [];
        this.DomElements = [];
        this.moveUnit = 10;
        this.animationUnit = 10;
        this.elementMarginRight = 20;
        this.moveBannersCount = 1;
        this.scrollSensitive = 10;
        this.currentFocusArea = 0;
        this.focusArea = [];
        this.displayedArea = [];
        this.initSizeFinished = false;
        this.useNavigator = false;
        this.createButton = false;
        this.widthAreaPercent = 100;
        this.moving = false;
        this.ulPaddingLeft = 10;
        this.locked = false;
        /**
        navigatorClassName
        @property navigatorClassName
        @type String
        @default "navigator"
        **/
        this.navigatorClassName = "navigator";
        /**
        nextButtonClassName
        @property nextButtonClassName
        @type String
        @default "nextButton"
        **/
        this.nextButtonClassName = "nextButton";
        /**
        previousButtonClassName
        @property previousButtonClassName
        @type String
        @default "previousButton"
        **/
        this.previousButtonClassName = "previousButton";
        /**
        bannerListClassName
        @property bannerListClassName
        @type String
        @default "bannerList"
        **/
        this.bannerListClassName = "bannerList";
        /**
        bannerListParentClassName
        @property bannerListParentClassName
        @type String
        @default "bannerListParent"
        **/
        this.bannerListParentClassName = "bannerListParent";
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
    Scroll.prototype.setScrollSensitive = function (sensitive) {
        this.scrollSensitive = sensitive;
    };

    Scroll.prototype.lock = function () {
        this.locked = true;
    };

    Scroll.prototype.incremenetCurrentFocus = function () {
        this.currentFocusArea += 1;
        if (this.currentFocusArea > this.elements.length) {
            this.currentFocusArea -= this.elements.length;
        }
    };
    Scroll.prototype.decremenetCurrentFocus = function () {
        this.currentFocusArea -= 1;
        if (this.currentFocusArea <= 0) {
            this.currentFocusArea += this.elements.length;
        }
    };

    /**
    左右のボタンを作成しないようにします。
    @method setNoCreateButton
    @return void
    */
    Scroll.prototype.setNoCreateButton = function () {
        this.createButton = false;
    };

    /**
    左右のボタンを作成するようにします。
    @method setCreateButton
    @return void
    */
    Scroll.prototype.setCreateButton = function () {
        this.createButton = true;
    };

    /**
    センター出しをします<br>
    
    @method setScrollCenter
    @param {}
    @return void
    */
    Scroll.prototype.setScrollCenter = function (distanceLeft) {
        this.ulPaddingLeft = distanceLeft;
        this.bannerList.style.paddingLeft = distanceLeft + "px";
    };

    /**
    バナー移動のアニメーションの単位移動ピクセルを指定します。。<br>
    
    @method setAnimationMoveUnitDistance
    @param moveUnit {number}
    @return void
    */
    Scroll.prototype.setAnimationMoveUnitDistance = function (moveUnit) {
        this.moveUnit = moveUnit;
    };

    /**
    水平方向の画像移動時に、count個分移動します。。<br>
    
    @method setMoveBannersCount
    @param count {number}
    @return void
    */
    Scroll.prototype.setMoveBannersCount = function (count) {
        this.moveBannersCount = count;
    };

    /**
    バナー移動のアニメーションの単位移動時間をミリ秒で指定します。<br>
    
    @method setAnimationMoveUnitTime
    @param milliSeconds {number}
    @return void
    */
    Scroll.prototype.setAnimationMoveUnitTime = function (millSeconds) {
        this.animationUnit = millSeconds;
    };

    /**
    画像間のマージンを指定します。実態は画像右側のマージンです。<br>
    
    @method setMarginRight
    @param marginRight {number}
    @return void
    */
    Scroll.prototype.setMarginRight = function (marginRight) {
        this.elementMarginRight = marginRight;
    };

    /**
    右ボタン、左ボタンの画像のパスをしていします。<br>
    
    @method setButtons
    @param leftButton {ScrollButton} 左に進むボタンURL
    @param rightButton {ScrollButton} 右に進むボタンURL
    
    @return void
    */
    Scroll.prototype.setButtons = function (leftButton, rightButton) {
        this.createButton = true;
        this.leftButton = leftButton;
        this.rightButton = rightButton;
    };

    /**
    スクロールエリアに表示する画像エレメントを追加します。<br>
    
    @method addScrollElement
    @param scrollElement {ScrollElement}
    @return void
    */
    Scroll.prototype.addScrollElement = function (scrollElement) {
        this.elements.push(scrollElement);
    };

    /**
    スクロールエリア、左右ボタンエリアを含むDiv要素を返します。
    
    @method create
    @return HTMLDivElement
    */
    Scroll.prototype.create = function () {
        var scrollObject = this.createList();
        var div = document.createElement("div");
        div.style.width = this.width ? this.width + "px" : "100%";
        div.style.height = this.height + "px";
        div.appendChild(scrollObject);
        if (this.createButton) {
            var buttons = this.createButtons();
            div.appendChild(buttons);
        }

        return div;
    };

    Scroll.prototype.createButtons = function () {
        var thisObject = this;

        var leftButton = this.leftButton.getButton();
        leftButton.className = this.previousButtonClassName;
        leftButton.addEventListener('click', function (e) {
            var bannerList = thisObject.bannerList;
            var left = bannerList.style.left;
            if (!left) {
                var bannerListStyle = window.getComputedStyle(bannerList);
                left = bannerListStyle.left;
            }
            var leftNumber = parseInt(left.replace("px", ""));
            while (leftNumber < -1 * thisObject.allElementLength) {
                leftNumber += thisObject.allElementLength;
            }

            var returnArray;
            for (var i = 0, arrayLength = thisObject.focusArea.length; i < arrayLength; i++) {
                var row = thisObject.focusArea[i];
                returnArray = row(leftNumber);
                if (returnArray) {
                    break;
                }
            }
            thisObject.decremenetCurrentFocus();
            var moveTo = returnArray[0] + leftNumber;
            thisObject.moveToLeft(moveTo);
        }, false);

        var rightButton = this.rightButton.getButton();
        rightButton.className = this.nextButtonClassName;
        rightButton.addEventListener('click', function (e) {
            var bannerList = thisObject.bannerList;
            var left = bannerList.style.left;
            if (!left) {
                var bannerListStyle = window.getComputedStyle(bannerList);
                left = bannerListStyle.left;
            }
            var leftNumber = parseInt(left.replace("px", ""));
            while (leftNumber < -1 * thisObject.allElementLength) {
                leftNumber += thisObject.allElementLength;
            }

            var returnArray;
            for (var i = 0, arrayLength = thisObject.focusArea.length; i < arrayLength; i++) {
                var row = thisObject.focusArea[i];
                var returnArrayInner = row(leftNumber);
                if (returnArrayInner) {
                    returnArray = returnArrayInner;
                }
            }

            thisObject.incremenetCurrentFocus();

            //var moveTo = returnArray[1] + leftNumber;
            var moveTo = returnArray[1] - returnArray[0];
            thisObject.moveToRight(moveTo * -1);
        }, false);

        var ul = document.createElement("ul");
        ul.appendChild(document.createElement("li").appendChild(leftButton));

        if (this.useNavigator) {
            var navigatorElement = this.navigator.displayNavigator();
            var navigatorLi = document.createElement("li");
            navigatorLi.appendChild(navigatorElement);
            navigatorLi.className = this.navigatorClassName;
            ul.appendChild(navigatorLi);
        }

        ul.appendChild(document.createElement("li").appendChild(rightButton));
        return ul;
    };

    Scroll.prototype.createList = function () {
        var ul = document.createElement("ul");
        this.focusArea = [];
        this.DomElements = [];

        for (var j = 0; j < 3; j++) {
            for (var i = 0, arrayLength = this.elements.length; i < arrayLength; i++) {
                var element = this.elements[i];
                var previousElement = this.elements[i - 1];
                var htmlElement = element.getElement();

                var elementMarginRight = element.getMarginRight();
                if (elementMarginRight) {
                    htmlElement.style.marginRight = elementMarginRight + "px";
                } else {
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
        divInner.className = this.bannerListParentClassName;
        divInner.appendChild(ul);

        var initX = null;
        var thisObject = this;

        divInner.addEventListener("touchstart", function (e) {
            var touch = e.touches[0];
            thisObject.firstMove = true;
            initX = touch.pageX;
        }, false);

        divInner.addEventListener("touchmove", function (e) {
            var touch = e.touches[0];
            if (!thisObject.firstMove) {
                initX = touch.pageX;
                return false;
            }
            thisObject.firstMove = false;
            var currentX = touch.pageX;

            var bannerList = thisObject.bannerList;
            var left = bannerList.style.left;
            if (!left) {
                var bannerListStyle = window.getComputedStyle(bannerList);
                left = bannerListStyle.left;
            }
            var leftNumber = parseInt(left.replace("px", ""));
            while (leftNumber < -1 * thisObject.allElementLength) {
                leftNumber += thisObject.allElementLength;
            }

            var returnArray;
            if (currentX - initX < -1 * thisObject.scrollSensitive) {
                for (var i = 0, arrayLength = thisObject.focusArea.length; i < arrayLength; i++) {
                    var row = thisObject.focusArea[i];
                    returnArray = row(leftNumber);
                    if (returnArray) {
                        break;
                    }
                }

                thisObject.incremenetCurrentFocus();
                var moveTo = returnArray[0] + leftNumber;
                thisObject.moveToRight(moveTo);
            } else if (currentX - initX > thisObject.scrollSensitive) {
                for (var i = 0, arrayLength = thisObject.focusArea.length; i < arrayLength; i++) {
                    var row = thisObject.focusArea[i];
                    var returnArrayInner = row(leftNumber);
                    if (returnArrayInner) {
                        returnArray = returnArrayInner;
                    }
                }

                thisObject.decremenetCurrentFocus();
                var moveTo = returnArray[1] - returnArray[0];
                thisObject.moveToLeft(moveTo * -1);
            } else {
                initX = touch.pageX;
                thisObject.firstMove = true;
            }
        }, false);

        this.bannerListParent = divInner;
        return divInner;
    };

    Scroll.prototype.initSize = function () {
        if (this.initSizeFinished) {
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

        var createFunction = function (start, end, moveToLeft, moveToRight) {
            return function (left) {
                left *= -1;
                if (start <= left && end >= left) {
                    return [moveToLeft, moveToRight];
                } else {
                    return null;
                }
            };
        };

        var createFunctionDisplayedArea = function (start, end) {
            return function (left) {
                var width = thisObject.width ? thisObject.width : parseInt(thisObject.bannerListParent.style.width);
                var allWidth = thisObject.allElementLength;

                while (end > allWidth) {
                    end -= allWidth;
                    start -= allWidth;
                }

                if (left <= start && left + width >= end) {
                    return true;
                }

                if (left <= start && left + width > start && left + width < end) {
                    var displayedEnd = left + width;
                    var percent = 100 * (displayedEnd - start) / (end - start);
                    if (thisObject.widthAreaPercent <= percent) {
                        return true;
                    }
                    return false;
                }

                if (left > start && left + width >= end && end > left) {
                    var displayedStart = left;
                    var percent = 100 * (end - displayedStart) / (end - start);
                    if (thisObject.widthAreaPercent <= percent) {
                        return true;
                    }
                    return false;
                }

                left -= allWidth;

                if (left <= start && left + width >= end) {
                    return true;
                }

                if (left <= start && left + width > start && left + width < end) {
                    var displayedEnd = left + width;
                    var percent = 100 * (displayedEnd - start) / (end - start);
                    if (thisObject.widthAreaPercent <= percent) {
                        return true;
                    }
                    return false;
                }

                if (left > start && left + width >= end && end > left) {
                    var displayedStart = left;
                    var percent = 100 * (end - displayedStart) / (end - start);
                    if (thisObject.widthAreaPercent <= percent) {
                        return true;
                    }
                    return false;
                }

                // left ~ left - widthが表示領域
                return false;
            };
        };

        var $ul = $(this.bannerList);
        var ulPaddingLeft = parseInt($ul.css('padding-left'));

        for (var i = 0, arrayLength = elements.length; i < arrayLength; i++) {
            var row = elements[i];

            var allWidthInit = allWidth;

            allWidth += parseInt($(row).css("margin-right")) + parseInt($(row).css("width"));

            var allWidthMoveToRight = allWidth;
            var allWidthMoveToLeft = allWidth;

            for (var z = 0; z < moveBannersCount - 1; z++) {
                allWidthMoveToRight += parseInt($(row).css("margin-right")) + parseInt($(row).css("width"));
            }

            var allWidthMoveToLeft = allWidth;
            for (var z = 0; z < moveBannersCount; z++) {
                var count = z;
                while (count < 0) {
                    count += arrayLength;
                }
                allWidthMoveToLeft -= parseInt($(row).css("margin-right")) + parseInt($(row).css("width"));
            }
            thisObject.focusArea.push(createFunction(allWidthInit, allWidth, allWidthMoveToLeft, allWidthMoveToRight));

            thisObject.displayedArea.push(createFunctionDisplayedArea(allWidthInit + ulPaddingLeft, allWidth + ulPaddingLeft));
            if ((i + 1) % (arrayLength / 3) == 0) {
                thisObject.allElementLength = allWidth;
                thisObject.initAllElementLength = -1 * allWidth;
                allWidth = 0;
            }
        }

        $(this.bannerList).css("left", this.initAllElementLength + "px");
        if (thisObject.useNavigator) {
            thisObject.navigator.changeActive(thisObject.getDisplayedBanners());
        }
    };

    /**
    @method setNavigatorElements
    @return HTMLUlistElement
    */
    Scroll.prototype.setNavigatorElements = function (navigatorElements, width, height) {
        var navigator = new ScrollNavigator(width, height);
        for (var i = 0, arrayLength = navigatorElements.length; i < arrayLength; i++) {
            var row = navigatorElements[i];
            navigator.addScrollNavigatorElement(row);
        }
        this.useNavigator = true;
        this.navigator = navigator;
    };

    Scroll.prototype.moveToRight = function (movePixel) {
        if (this.moving) {
            return;
        }
        if (this.locked) {
            return;
        }
        this.moving = true;
        var movePixelAbsolute = movePixel > 0 ? movePixel : movePixel * -1;
        var moveUnit = this.moveUnit;
        var animationUnit = this.animationUnit;
        var bannerList = this.bannerList;
        var allElementLength = this.allElementLength;

        var thisObject = this;

        var move = function () {
            if (movePixelAbsolute > moveUnit) {
                movePixelAbsolute -= moveUnit;
            } else {
                moveUnit = movePixelAbsolute;
                movePixelAbsolute = 0;
                if (thisObject.useNavigator) {
                    thisObject.navigator.changeActive(thisObject.getDisplayedBanners());
                }
            }
            var left = bannerList.style.left;
            if (!left) {
                var bannerListStyle = window.getComputedStyle(bannerList);
                left = bannerListStyle.left;
            }
            var leftNumber = parseInt(left.replace("px", ""));
            if (movePixel > 0) {
                leftNumber += moveUnit;
            } else {
                leftNumber -= moveUnit;
            }

            if (leftNumber >= 0) {
                leftNumber -= allElementLength;
            } else if (leftNumber <= -2 * allElementLength) {
                leftNumber += allElementLength;
            }
            bannerList.style.left = leftNumber + "px";

            if (movePixelAbsolute > 0) {
                setTimeout(function () {
                    move();
                }, animationUnit);
            } else {
                thisObject.firstMove = true;
                thisObject.moving = false;
            }
        };
        move();
    };

    Scroll.prototype.moveToLeft = function (movePixel) {
        this.moveToRight(-1 * movePixel);
    };

    Scroll.prototype.scroll = function () {
        return function (e) {
            return false;
        };
    };

    /**
    表示されている横幅がpercentより大きければ、ナビゲーション上で表示されている状態とする
    @method setWidthAreaPercent
    @param percent {number}
    @return void
    */
    Scroll.prototype.setWidthAreaPercent = function (percent) {
        this.widthAreaPercent = percent;
    };

    Scroll.prototype.getDisplayedBanners = function () {
        var displayed = [];

        var bannerList = this.bannerList;
        var left = bannerList.style.left;
        if (!left) {
            var bannerListStyle = window.getComputedStyle(bannerList);
            left = bannerListStyle.left;
        }
        var leftNumber = parseInt(left.replace("px", ""));
        leftNumber *= -1;
        while (leftNumber >= this.allElementLength) {
            leftNumber -= this.allElementLength;
        }
        var elementCount = this.focusArea.length / 3;
        for (var i = 0, arrayLength = this.focusArea.length; i < arrayLength; i++) {
            var row = this.displayedArea[i];
            if (row(leftNumber)) {
                var j = i;
                while (j > elementCount) {
                    j -= elementCount;
                }
                displayed.push(j);
            }
        }

        return displayed;
    };
    return Scroll;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElement.ts" />
var ScrollElementJQuery = (function (_super) {
    __extends(ScrollElementJQuery, _super);
    function ScrollElementJQuery(jQueryObject) {
        _super.call(this);
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
    ScrollElementJQuery.prototype.getElement = function () {
        this.jQueryObject.removeClass("scrollElement");
        this.jQueryObject.addClass("scrollElement");
        var returnElement = this.jQueryObject.clone(true).get()[0];
        if (returnElement.tagName == "A") {
            returnElement.childNodes[0].style.width = this.width + "px";
        } else {
            returnElement.style.width = this.width + "px";
        }
        returnElement.style.width = this.width + "px";
        return returnElement;
    };
    return ScrollElementJQuery;
})(ScrollElement);
/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElement.ts" />
// Add the missing definitions:
var ScrollElementManual = (function (_super) {
    __extends(ScrollElementManual, _super);
    /**
    @class ScrollElementManual
    @constructor
    @param imgSrc {string} banner url
    @param linkURL {string} banner link url
    @param width {number} ScrollArea Width
    @param height {number} ScrollArea Height
    @param marginRight {number} Optional marginRight
    */
    function ScrollElementManual(imgSrc, linkURL, width, height, marginRight) {
        _super.call(this);
        this.imgSrc = imgSrc;
        this.linkURL = linkURL;
        this.width = width;
        this.height = height;
        if (marginRight) {
            this.marginRight = marginRight;
        }
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
    ScrollElementManual.prototype.getElement = function () {
        var img = document.createElement("img");
        var a = document.createElement("a");
        img.src = this.imgSrc;
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        a.href = this.linkURL;
        a.appendChild(img);
        a.className = "scrollElement";
        return a;
    };
    return ScrollElementManual;
})(ScrollElement);
/// <reference path="jquery.d.ts" />
/// <reference path="ScrollElementJQuery.ts" />
var ScrollElementTag = (function (_super) {
    __extends(ScrollElementTag, _super);
    /**
    @class ScrollElementTag
    @constructor
    @param HTMLTag {string} タグ文字列。そのままjQueryに食わせる
    */
    function ScrollElementTag(tag) {
        _super.call(this, jQuery(tag));
    }
    return ScrollElementTag;
})(ScrollElementJQuery);
/// <reference path="jquery.d.ts" />
/// <reference path="ScrollNavigatorElement.ts" />
// Add the missing definitions:
var ScrollNavigatorElementImage = (function () {
    /**
    @class Scroll
    @constructor
    @param width {number} ScrollArea Width
    @param height {number} ScrollArea Height
    */
    function ScrollNavigatorElementImage(width, height, activeImageSrc, notActiveImageSrc) {
        this.width = width;
        this.height = height;
        this.activeImageSrc = activeImageSrc;
        this.notActiveImageSrc = notActiveImageSrc;
    }
    ScrollNavigatorElementImage.prototype.getElement = function () {
        var element = document.createElement("img");
        element.src = this.notActiveImageSrc;
        this.element = element;
        return element;
    };
    ScrollNavigatorElementImage.prototype.changeActive = function () {
        (this.element).src = this.activeImageSrc;
    };
    ScrollNavigatorElementImage.prototype.changeNotActive = function () {
        (this.element).src = this.notActiveImageSrc;
    };
    return ScrollNavigatorElementImage;
})();
/// <reference path="jquery.d.ts" />
/// <reference path="ScrollButton.ts" />
// Add the missing definitions:
var ScrollButtonImage = (function (_super) {
    __extends(ScrollButtonImage, _super);
    function ScrollButtonImage(imageSrc) {
        _super.call(this);
        this.imageSrc = imageSrc;
    }
    /**
    要素取得<br>
    主にマネージャークラスから呼び出す<br>
    @method getButton
    @return HTMLElement
    */
    ScrollButtonImage.prototype.getButton = function () {
        var button = document.createElement("button");
        var image = document.createElement("img");
        image.src = this.imageSrc;
        button.appendChild(image);
        return button;
    };
    return ScrollButtonImage;
})(ScrollButton);
/// <reference path="jquery.d.ts" />
/// <reference path="ScrollButton.ts" />
// Add the missing definitions:
var ScrollButtonJQuery = (function (_super) {
    __extends(ScrollButtonJQuery, _super);
    function ScrollButtonJQuery(jQueryElement) {
        _super.call(this);
        this.jQueryElement = jQueryElement;
    }
    /**
    要素取得<br>
    主にマネージャークラスから呼び出す<br>
    @method getElement
    @return HTMLElement
    */
    ScrollButtonJQuery.prototype.getButton = function () {
        return this.jQueryElement.get()[0];
    };
    return ScrollButtonJQuery;
})(ScrollButton);
/// <reference path="jquery.d.ts" />
/// <reference path="ScrollButtonJQuery.ts" />
// Add the missing definitions:
var ScrollButtonTag = (function (_super) {
    __extends(ScrollButtonTag, _super);
    /**
    @class Scroll
    @constructor
    @param width {number} ScrollArea Width
    @param height {number} ScrollArea Height
    */
    function ScrollButtonTag(tag) {
        _super.call(this, jQuery(tag));
    }
    return ScrollButtonTag;
})(ScrollButtonJQuery);
/// <reference path="jquery.d.ts" />
/// <reference path="Scroll.ts" />
// Add the missing definitions:
var StaticSizeScroll = (function (_super) {
    __extends(StaticSizeScroll, _super);
    /**
    @class StaticSizeScroll
    @constructor
    @param width {number} ScrollArea Width
    @param height {number} ScrollArea Height
    @param bannerWidth {number} bannerWidth
    @param bannerDisplayCount {number} バナー表示数 でフォルト1
    */
    function StaticSizeScroll(width, height, bannerWidth, bannerMarginRight, bannerDisplayCount) {
        _super.call(this, width, height);

        this.bannerWidth = bannerWidth;
        this.bannerMarginRight = bannerMarginRight;
        bannerDisplayCount = bannerDisplayCount || 1;
        this.bannerDisplayCount = bannerDisplayCount;
        if (width && bannerDisplayCount * bannerWidth + (bannerDisplayCount - 1) * bannerMarginRight > width) {
            throw ("widthが足りません");
        }
    }
    StaticSizeScroll.prototype.addScrollElement = function (scrollElement) {
        scrollElement.setWidth(this.bannerWidth);
        scrollElement.setMarginRight(this.bannerMarginRight);
        this.elements.push(scrollElement);
    };

    StaticSizeScroll.prototype.resize = function () {
        this.initSizeFinished = false;
        this.width = null;
        this.initSize();
        this.changeFocus();
    };

    StaticSizeScroll.prototype.initSize = function () {
        this.setCenter();
        _super.prototype.initSize.call(this);
    };

    StaticSizeScroll.prototype.changeFocus = function () {
        var moveTo = this.currentFocusArea * this.bannerWidth + (this.currentFocusArea) * this.bannerMarginRight;
        $(this.bannerList).css("left", (this.initAllElementLength - moveTo) + "px");

        if (this.useNavigator) {
            this.navigator.changeActive(this.getDisplayedBanners());
        }
    };

    StaticSizeScroll.prototype.setCenter = function () {
        if (!this.width) {
            this.width = parseInt($(this.bannerListParent).css("width"));
        }
        console.log(this.width);
        var distanceLeft = (this.width - (this.bannerDisplayCount * this.bannerWidth + (this.bannerDisplayCount - 1) * this.bannerMarginRight)) / 2;
        this.setScrollCenter(distanceLeft);
    };
    return StaticSizeScroll;
})(Scroll);
