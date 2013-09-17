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
        return a;
    };
    return ScrollElement;
})();
var Scroll = (function () {
    function Scroll(width, height) {
        this.elements = [];
    }
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
        return document.createElement("ul");
    };

    Scroll.prototype.createList = function () {
        return document.createElement("ul");
    };

    Scroll.prototype.moveToRight = function () {
        return function (e) {
            return false;
        };
    };
    Scroll.prototype.moveToLeft = function () {
        return function (e) {
            return false;
        };
    };
    Scroll.prototype.scroll = function () {
        return function (e) {
            return false;
        };
    };
    return Scroll;
})();
