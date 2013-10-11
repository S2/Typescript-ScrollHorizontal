/// <reference path="jquery.d.ts" />
/// <reference path="ScrollNavigator.ts" />

// Add the missing definitions: 

interface ScrollNavigatorElement{
    getElement():HTMLElement;
    changeActive():void;
    changeNotActive():void;
}
