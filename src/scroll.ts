/// <reference path="jquery.d.ts" />
/// <reference path="scroll_element.ts" />

// Add the missing definitions: 

class Scroll{
    elements : ScrollElement[] = [] ;
    constructor(width : number , height : number){
    }

    public addElement(scrollElement:ScrollElement){
        this.elements.push(scrollElement);
    }
    
    public create():HTMLDivElement{
        var scrollObject = this.createList();
        var buttons = this.createButtons();
        var div = document.createElement("div");
        div.appendChild(scrollObject);
        div.appendChild(buttons);
        return div;
    }

    private createButtons():HTMLUListElement{
        return document.createElement("ul");
    }

    private createList():HTMLUListElement{
        var ul = document.createElement("ul");
        for( var i = 0 , arrayLength = this.elements.length ; i < arrayLength ; i++){
            var element:ScrollElement = this.elements[i];
            ul.appendChild(element.getElement());
        }
        return ul;
    }
    
    private moveToRight():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }

    private moveToLeft():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }

    private scroll():(e:Event)=>Boolean{
        return function(e:Event){
            return false;
        }
    }
}
