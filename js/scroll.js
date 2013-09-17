var scrollElement = (function () {
    function scrollElement(imgSrc, linkURL, width, height) {
        this.hooks = [];
        this.imgSrc = imgSrc;
        this.linkURL = linkURL;
        this.width = width;
        this.height = height;
    }
    scrollElement.prototype.setURL = function (linkURL) {
        this.linkURL = linkURL;
    };

    scrollElement.prototype.addBeforeClickHook = function (method) {
        this.hooks.push(method);
    };

    scrollElement.prototype.getElement = function () {
        var img = document.createElement("img");
        var a = document.createElement("a");
        img.src = this.imgSrc;
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        a.href = this.linkURL;
        a.appendChild(img);
        return a;
    };
    return scrollElement;
})();
