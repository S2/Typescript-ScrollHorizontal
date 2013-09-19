var ScrollElement = (function () {
    function ScrollElement(imgSrc, linkURL, width, height) {
        this.hooks = [];
        this.imgSrc = imgSrc;
        this.linkURL = linkURL;
        this.width = width;
        this.height = height;
    }
    ScrollElement.prototype.setURL = function (linkURL) {
        this.linkURL = linkURL;
    };

    ScrollElement.prototype.addBeforeClickHook = function (method) {
        this.hooks.push(method);
    };

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
        this.elements = [];
        this.moveUnit = 10;
        this.animationUnit = 10;
        this.elementMarginRight = 20;
        this.focusArea = [];
        this.width = width;
        this.height = height;
    }
    Scroll.prototype.setAnimationMoveUnitDistance = function (moveUnit) {
        this.moveUnit = moveUnit;
    };

    Scroll.prototype.setAnimationMoveUnitTime = function (millSeconds) {
        this.animationUnit = millSeconds;
    };

    Scroll.prototype.setMarginRight = function (marginRight) {
        this.elementMarginRight = marginRight;
    };

    Scroll.prototype.setButtonSrc = function (leftButtonSrc, rightButtonSrc) {
        this.leftButtonSrc = leftButtonSrc;
        this.rightButtonSrc = rightButtonSrc;
    };

    Scroll.prototype.addScrollElement = function (scrollElement) {
        this.elements.push(scrollElement);
    };

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

        var createFunction = function (start, end) {
            return function (left) {
                left *= -1;
                if (start <= left && end >= left) {
                    return [start, end];
                } else {
                    return null;
                }
            };
        };

        for (var j = 0; j < 3; j++) {
            var allWidth = 0;
            for (var i = 0, arrayLength = this.elements.length; i < arrayLength; i++) {
                var element = this.elements[i];
                var previousElement = this.elements[i - 1];
                var htmlElement = element.getElement();
                htmlElement.style.marginRight = this.elementMarginRight + "px";
                var allWidthInit = allWidth;
                allWidth += this.elementMarginRight + element.width;
                this.focusArea.push(createFunction(allWidthInit, allWidth));
                ul.appendChild(htmlElement);
            }
            this.allElementLength = allWidth;
            var element = this.elements[0];
            var allWidthInit = allWidth;
            allWidth += this.elementMarginRight + element.width;
            this.focusArea.push(createFunction(allWidthInit, allWidth));
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
            if (currentX - initX < -5) {
                for (var i = 0, arrayLength = thisObject.focusArea.length; i < arrayLength; i++) {
                    var row = thisObject.focusArea[i];
                    returnArray = row(leftNumber);
                    if (returnArray) {
                        break;
                    }
                }

                var moveTo = returnArray[0] + leftNumber;
                thisObject.moveToLeft(moveTo);
            } else if (currentX - initX > 5) {
                for (var i = 0, arrayLength = thisObject.focusArea.length; i < arrayLength; i++) {
                    var row = thisObject.focusArea[i];
                    var returnArrayInner = row(leftNumber);
                    if (returnArrayInner) {
                        returnArray = returnArrayInner;
                    }
                }
                var moveTo = returnArray[1] + leftNumber;
                thisObject.moveToRight(moveTo);
            } else {
                initX = touch.pageX;
                thisObject.firstMove = true;
            }
        }, false);

        this.bannerListParent = divInner;

        return divInner;
    };

    Scroll.prototype.moveToRightScroll = function () {
        return function (e) {
            return false;
        };
    };

    Scroll.prototype.moveToLeftScroll = function () {
        return function (e) {
            return false;
        };
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
