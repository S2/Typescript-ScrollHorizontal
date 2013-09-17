/// <reference path="jquery.d.ts" />

// Add the missing definitions: 
interface HTMLElement{
    requestFullscreen();
    webkitRequestFullScreen();
    mozRequestFullScreen();
}

interface HTMLDocument{
}

class CreateOption{
}

class scrollElement{
    isIOS       : bool = false;
    isIPad      : bool = false;
    isIPod      : bool = false;
    isIPhone    : bool = false;
    isAndroid   : bool = false;

    constructor(imgSrc : string , linkURL : string){
    }

    public setURL(linkURL:string){
    }

    public addBeforeClickHook(method:()=>void){
    }

}
