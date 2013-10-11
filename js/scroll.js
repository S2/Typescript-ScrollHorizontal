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
/// <reference path="ScrollElement.ts" />
/// <reference path="NothingValueError.ts" />
/// <reference path="ScrollNavigator.ts" />
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
        this.moveUnit = 10;
        this.animationUnit = 10;
        this.elementMarginRight = 20;
        this.moveBannersCount = 1;
        this.scrollSensitive = 10;
        this.focusArea = [];
        this.displayedArea = [];
        this.initSizeFinished = false;
        this.useNavigator = false;
        this.widthAreaPercent = 100;
        this.width = width;
        this.height = height;
    }
    /**
    スクロールの感度を設定します。<br>
    タップ中移動したピクセルがこの数値以下の場合、水平方向に移動しません。<br>
    
    @method setScrollSensitive
    @param semsitive {number}
    @return void
    */
    Scroll.prototype.setScrollSensitive = function (sensitive) {
        this.scrollSensitive = sensitive;
    };

    /**
    バナー移動のアニメーションの単位移動ピクセルを指定します。。<br>
    
    @method setAnimationMoveUnitDistance
    @param moveunit {number}
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
    
    @method setButtonSrc
    @param leftButtonSrc {string} 左に進むボタンURL
    @param rightButtonSrc {string} 右に進むボタンURL
    
    @return void
    */
    Scroll.prototype.setButtonSrc = function (leftButtonSrc, rightButtonSrc) {
        this.leftButtonSrc = leftButtonSrc;
        this.rightButtonSrc = rightButtonSrc;
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
        var buttons = this.createButtons();
        var div = document.createElement("div");
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.appendChild(scrollObject);
        div.appendChild(buttons);

        if (this.useNavigator) {
            var navigatorElement = this.navigator.displayNavigator();
            div.appendChild(navigatorElement);
        }
        return div;
    };

    Scroll.prototype.createButtons = function () {
        if (!this.rightButtonSrc) {
            throw new NothingValueError("set RightButton path");
        }
        if (!this.leftButtonSrc) {
            throw new NothingValueError("set LeftButton path");
        }

        var thisObject = this;

        var leftButton = document.createElement("button");
        var rightButton = document.createElement("button");

        var leftImage = document.createElement("img");
        leftImage.src = this.leftButtonSrc;
        leftButton.appendChild(leftImage);
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

            var moveTo = returnArray[0] + leftNumber;
            thisObject.moveToLeft(moveTo);
        }, false);

        var rightImage = document.createElement("img");
        rightImage.src = this.rightButtonSrc;
        rightButton.appendChild(rightImage);
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

            //var moveTo = returnArray[1] + leftNumber;
            var moveTo = returnArray[1] - returnArray[0];
            thisObject.moveToRight(moveTo * -1);
        }, false);

        var ul = document.createElement("ul");
        ul.appendChild(document.createElement("li").appendChild(leftButton));
        ul.appendChild(document.createElement("li").appendChild(rightButton));
        return ul;
    };

    Scroll.prototype.createList = function () {
        var ul = document.createElement("ul");
        this.focusArea = [];

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

                ul.appendChild(htmlElement);
            }
        }
        ul.className = "bannerList";
        this.bannerList = ul;

        var divInner = document.createElement("div");
        divInner.style.border = "solid 1px black";
        divInner.className = "bannerListParent";
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
                var moveTo = returnArray[1] + leftNumber;
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
        this.initSizeFinished = true;
        var elements = $(".scrollElement");
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
                var width = thisObject.width;
                var allWidth = thisObject.allElementLength;

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

        var $ul = $(".bannerList");
        var ulPaddingLeft = parseInt($ul.css('padding-left'));
        var elementCount = 0;
        elements.each(function () {
            elementCount++;

            var allWidthInit = allWidth;

            allWidth += parseInt($(this).css("margin-right")) + parseInt($(this).css("width"));

            var allWidthMoveToRight = allWidth;
            var allWidthMoveToLeft = allWidth;

            for (var z = 0; z < moveBannersCount - 1; z++) {
                allWidthMoveToRight += parseInt($(this).css("margin-right")) + parseInt($(this).css("width"));
            }

            var allWidthMoveToLeft = allWidth;
            for (var z = 0; z < moveBannersCount; z++) {
                var count = z;
                while (count < 0) {
                    count += arrayLength;
                }
                allWidthMoveToLeft -= parseInt($(this).css("margin-right")) + parseInt($(this).css("width"));
            }
            thisObject.focusArea.push(createFunction(allWidthInit, allWidth, allWidthMoveToLeft, allWidthMoveToRight));

            thisObject.displayedArea.push(createFunctionDisplayedArea(allWidthInit + ulPaddingLeft, allWidth + ulPaddingLeft));

            if (elementCount % (arrayLength / 3) == 0) {
                thisObject.allElementLength = allWidth;
                thisObject.initAllElementLength = -1 * allWidth;
                allWidth = 0;
            }
        });

        $(".bannerList").css("left", this.initAllElementLength + "px");
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
                if (thisObject.useNavigator) {
                    thisObject.navigator.changeActive(thisObject.getDisplayedBanners());
                }
                thisObject.firstMove = true;
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
        return this.jQueryObject.clone(true).get()[0];
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
