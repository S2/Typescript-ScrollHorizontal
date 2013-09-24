var ScrollElement = (function () {
    /**
    @class ScrollElement
    @constructor
    @param imgSrc {string} banner url
    @param linkURL {string} banner link url
    @param width {number} ScrollArea Width
    @param height {number} ScrollArea Height
    @param marginRight {number} Optional marginRight
    */
    function ScrollElement(imgSrc, linkURL, width, height, marginRight) {
        this.hooks = [];
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
    @return HTMLAnchorElement
    */
    ScrollElement.prototype.getElement = function () {
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

        var moveBannersCount = this.moveBannersCount;
        for (var j = 0; j < 3; j++) {
            var allWidth = 0;
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
                var allWidthInit = allWidth;

                allWidth += this.elementMarginRight + element.width;
                ul.appendChild(htmlElement);

                var allWidthMoveToRight = allWidth;
                var allWidthMoveToLeft = allWidth;
                for (var z = 0; z < moveBannersCount - 1; z++) {
                    var count = i + z;
                    while (count >= arrayLength) {
                        count -= arrayLength;
                    }
                    allWidthMoveToRight += this.elementMarginRight + this.elements[count].width;
                }
                for (var z = 0; z < moveBannersCount; z++) {
                    var count = i - z;
                    while (count < 0) {
                        count += arrayLength;
                    }
                    allWidthMoveToLeft -= this.elementMarginRight + this.elements[count].width;
                }

                this.focusArea.push(createFunction(allWidthInit, allWidth, allWidthMoveToLeft, allWidthMoveToRight));
            }
            this.allElementLength = allWidth;
            var element = this.elements[0];
            var allWidthInit = allWidth;

            allWidth += this.elementMarginRight + element.width;

            var allWidthMoveToRight = allWidth;
            var allWidthMoveToLeft = allWidth;

            for (var z = 0; z < moveBannersCount - 1; z++) {
                var count = z;
                while (count >= arrayLength) {
                    count -= arrayLength;
                }
                allWidthMoveToRight += this.elementMarginRight + this.elements[count].width;
            }

            var allWidthMoveToLeft = allWidth;
            for (var z = 0; z < moveBannersCount; z++) {
                var count = z;
                while (count < 0) {
                    count += arrayLength;
                }
                allWidthMoveToLeft -= this.elementMarginRight + this.elements[count].width;
            }

            this.focusArea.push(createFunction(allWidthInit, allWidth, allWidthMoveToLeft, allWidthMoveToRight));
        }
        ul.className = "bannerList";
        ul.style.left = -1 * this.allElementLength + "px";
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
