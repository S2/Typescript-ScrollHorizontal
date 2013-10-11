/// <reference path="jquery.d.ts" />
/// <reference path="ScrollButtonJQuery.ts" />

// Add the missing definitions: 
class ScrollButtonTag extends ScrollButtonJQuery{
    /**
        @class Scroll
        @constructor
        @param width {number} ScrollArea Width
        @param height {number} ScrollArea Height
    */
    constructor(tag : string){
        super(jQuery(tag))
    }
}
