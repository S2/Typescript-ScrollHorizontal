var CreateOption = (function () {
    function CreateOption() {
    }
    return CreateOption;
})();

var thisObject;
var scrollElement = (function () {
    function scrollElement(imgSrc, linkURL) {
        this.isIOS = false;
        this.isIPad = false;
        this.isIPod = false;
        this.isIPhone = false;
        this.isAndroid = false;
    }
    scrollElement.prototype.setURL = function (linkURL) {
    };

    scrollElement.prototype.addBeforeClickHook = function (method) {
    };
    return scrollElement;
})();
