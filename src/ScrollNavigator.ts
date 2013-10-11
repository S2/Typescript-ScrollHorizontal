/// <reference path="jquery.d.ts" />
/// <reference path="ScrollNavigatorElement.ts" />

// Add the missing definitions: 

interface Event{
    identifier : number;
    screenX    : number;
    screenY    : number;
    clientX    : number;
    clientY    : number;
    pageX      : number;
    pageY      : number;
};

class ScrollNavigator{
    elements : ScrollNavigatorElement[] = [] ;
    width  : number;
    height : number;

    /**
        @class ScrollNavigator
        @param width  {number} NavigatorArea Width
        @param height {number} NavigatorArea Height
        @constructor
    */
    constructor(width : number , height : number){
    }

    /**
        @method addScrollNavigatorElement
        @param element {ScrollNavigatorElement} 
        @return void
    */
    public addScrollNavigatorElement(element : ScrollNavigatorElement){
        this.elements.push(element)
    }

    /**
        @method displayNavigator
        @return HTMLUListElement
    */
    public displayNavigator():HTMLUListElement{
        var ul = document.createElement("ul");
        for( var i = 0 , arrayLength = this.elements.length ; i < arrayLength ; i++){
            var row :HTMLElement = this.elements[i].getElement();
            ul.appendChild(row);
        }
        return ul;
    }

    /**
        @method moveAction
        @param event {event} 
        @return void
    */
    public changeActive(activeIndexes : number[]){
        var activeIndexesHash = {};
        for( var i = 0 , arrayLength = activeIndexes.length ; i < arrayLength ; i++){
            var activeIndex:number = activeIndexes[i];
            activeIndexesHash[activeIndex] = true;
        }
        for( var i = 0 , arrayLength = this.elements.length ; i < arrayLength ; i++){
            var row:ScrollNavigatorElement = this.elements[i];
            if(activeIndexesHash[i]){
                row.changeActive();
            }else{
                row.changeNotActive();
            }
        }
    }
}
