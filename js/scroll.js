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
        this.moveUnit = 5;
        this.animationUnit = 5;
        this.width = width;
        this.height = height;
    }
    Scroll.prototype.setButtonSrc = function (leftButtonSrc, rightButtonSrc) {
        this.leftButtonSrc = leftButtonSrc;
        this.rightButtonSrc = rightButtonSrc;
    };

    Scroll.prototype.addElement = function (scrollElement) {
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
            thisObject.moveToLeft(100);
        }, false);

        var rightImage = document.createElement("img");
        rightImage.src = this.rightButtonSrc;
        rightButton.appendChild(rightImage);
        rightButton.addEventListener('click', function () {
            thisObject.moveToRight(100);
        }, false);

        var ul = document.createElement("ul");
        ul.appendChild(document.createElement("li").appendChild(leftButton));
        ul.appendChild(document.createElement("li").appendChild(rightButton));
        return ul;
    };

    Scroll.prototype.createList = function () {
        var ul = document.createElement("ul");
        for (var j = 0; j < 3; j++) {
            for (var i = 0, arrayLength = this.elements.length; i < arrayLength; i++) {
                var element = this.elements[i];
                ul.appendChild(element.getElement());
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

        divInner.addEventListener("touchmove", function (e) {
            var currentX = e.pageX;
            if (initX) {
                var diffX = currentX - initX;
                thisObject.moveToRight(diffX);
                initX = currentX;
            } else {
                initX = currentX;
            }
        }, false);

        divInner.addEventListener("mouseout", function (e) {
            initX = null;
        }, false);
        divInner.addEventListener("mousemove", function (e) {
            var currentX = e.pageX;
            if (initX) {
                var diffX = currentX - initX;
                thisObject.moveToRight(diffX);
                initX = currentX;
            } else {
                initX = currentX;
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
                bannerList.style.left = leftNumber + moveUnit + "px";
            } else {
                bannerList.style.left = leftNumber - moveUnit + "px";
            }
            if (movePixelAbsolute > 0) {
                setTimeout(function () {
                    move();
                }, animationUnit);
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
