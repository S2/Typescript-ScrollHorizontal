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
        this.initSizeFinished = false;
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
        leftButton.addEventListener('click', function () {
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
        rightButton.addEventListener('click', function () {
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

            var moveTo = returnArray[1] + leftNumber;
            console.log(moveTo);
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

        var thisObject = this;
        var elementCount = 0;
        elements.each(function () {
            elementCount++;
            if (elementCount % (arrayLength / 3) == 0) {
                thisObject.allElementLength = allWidth;
            }

            var allWidthInit = allWidth;

            allWidth += parseInt($(this).css("margin-right")) + parseInt($(this).css("width"));

            var allWidthMoveToRight = allWidth;
            var allWidthMoveToLeft = allWidth;

            for (var z = 0; z < moveBannersCount - 1; z++) {
                var count = z;
                while (count >= arrayLength) {
                    count -= arrayLength;
                }
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

            if (elementCount % (arrayLength / 3) == 0) {
                thisObject.initAllElementLength = -1 * allWidth;
                allWidth = 0;
            }
        });

        console.log(this.focusArea[0](-100));
        console.log(this.focusArea[1](-300));
        console.log(this.focusArea[2](-500));
        console.log(this.focusArea[3](-700));
        console.log(this.focusArea[4](-900));
        console.log(this.focusArea[5](-1100));
        $(".bannerList").css("left", this.initAllElementLength + "px");
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
