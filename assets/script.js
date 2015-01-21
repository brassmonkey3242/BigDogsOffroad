var F_NN = ( navigator.appName=='Netscape' ) && ( parseInt( navigator.appVersion ) < 5 );
var F_MAC = ( navigator.appVersion.indexOf('Macintosh') > -1 );
var F_DOM_NN = false;
var F_DOM_IE = false;
var F_DOM = false;
var NOF_event = null;
var agt = navigator.userAgent.toLowerCase();
is_opera = ( agt.indexOf("opera") != -1 );
if ( document.getElementById && ( navigator.appName=='Netscape' ) )
F_DOM_NN = true;
if ( document.getElementById )
F_DOM = true;
if ( document.getElementById && ( navigator.appName == "Microsoft Internet Explorer" ) )
F_DOM_IE = true;
document.objectModel = new Array(0);
document.F_loaded =false;
document.F_dragLayer =null;
window.NOFevent = new F_cNOFevent();
top.F_curObj = null;
var NOFparameters = null;
var params = NOFparameters;
window.defaultStatus = "";
function F_cMain() {
this.commands = this.initCommands();
this.commandsInit();
if( ( navigator.appName != 'Netscape' ) || F_DOM ) F_cStyles();
if(!F_NN && F_MAC) {
var t = document.all.tags("A");
for( var i = 0; i < t.length; i++ ) {
t[i].ondragstart = F_dragCancel;
}
}
}
function cancelEvent() {
if (NOF_event && NOF_event.stopPropagation)
NOF_event.stopPropagation();
if (F_DOM_IE) {
event.cancelBubble = true;
event.returnValue = false;
}
return false;
}
function F_dragCancel() {
return cancelEvent();
}
F_prototype("F_cMain.prototype.",
"initCommands", "F_initCommands",
"commandsInit", "F_dummy",
"cObject", "F_cObject",
"closing", false,
"closingObjects", 0
);
function F_cNOFevent() {
this.altKey = false;
this.button = 0;
this.ctrlKey = false;
this.keyCode = null;
this.shiftKey = false;
this.pageY = null;
pageY = null;
}
function F_cStyles() {
if( is_opera )
return;
var ss = null;
var docSSs = document.styleSheets;
for (var i=0;i < docSSs.length;i++) {
if ("NOF_STYLE_SHEET" == docSSs[i].title) {
ss = docSSs[i];
break;
}
}
if (ss == null)
ss = docSSs["NOF_STYLE_SHEET"];
if (ss == null)
ss = docSSs[0];
obj = ss.rules;
if( ! obj )
obj = ss.cssRules;
for ( var i = 0; i < obj.length; i++ ) {
var t = obj[i].selectorText;
var theID = t.substring(t.indexOf("#")+1,999);
var theContainer ;
if ( document.all )
theContainer = document.all.tags('SPAN')[theID];
else if ( document.getElementById )
theContainer = document.getElementsByTagName('SPAN')[theID];
if(typeof theContainer == "undefined") {
if ( document.all )
theContainer = document.all.tags('DIV')[theID];
else if ( document.getElementById )
theContainer = document.getElementsByTagName('DIV')[theID];
}
var s = obj[i].style
if(typeof theContainer != "undefined") {
if (typeof(theContainer.style) != "undefined")
with(theContainer.style) {
left = s.left;
top = s.top;
clip = s.clip;
zIndex = s.zIndex;
visibility = s.visibility;
}
}
}
}
var F_bar="Initializing ";
var F_count = 1;
var F_barError = "";
var F_bar="Initializing ";
function F_cObject(theLayerID, theType, theParent, theHandler, isRelative, objectID, formName, objectName, theValue) {
if( F_bar.length > 63 ) F_bar="Initializing " + F_count++;
F_bar += "|";
window.status=F_barError + F_bar;
this.formObj = (theType == "chk") || (theType == "rad") || (theType == "tfd") || (theType == "sel") || (theType == "btn");
this.styleID = objectID;
this.name = objectID;
this.type = theType;
this.childObjects = new Object();
if(theParent == "")
this.parent = null;
else {
this.parent = document.objectModel[theParent];
if(this.parent != null) {
this.parent.childObjects[this.styleID] = this;
this.level = this.parent.level + 1;
}
}
this.timeoutTest = "document.objectModel";
if(parent!=self) {
var f = self;
while(f!=top) {
this.timeoutTest="frames['"+f.name+"']."+this.timeoutTest;
f = f.parent;
}
this.timeoutTest="top."+this.timeoutTest;
}
this.textRef = this.timeoutTest + "['"+ this.styleID+ "']";
this.timeoutTest = "("+this.timeoutTest + "&&"+this.textRef+")";
this.commands = document.main.commands[theType];
if( navigator.appName=='Netscape' && !F_DOM_NN )
{
var theForm = (formName == "")? "" : ".forms['" + formName + "']";
this.style = (this.parent != null) ? this.parent.style : document;
if(theLayerID != "") {
var IDarray = theLayerID.split(":");
this.style = this.style.layers[IDarray[0]];
}
this.objRef = this.style.document[objectID];
this.formRef = (formName == "")? null : this.style.document.forms[formName];
if ((theForm != "") && (objectName!="")) {
if(this.formRef) {
if(objectName == (parseInt(objectName)+"")) {
for (var i = 0; i < this.formRef.length; i++) {
if (this.formRef[i].name == objectName) {
if(((theType == "rad") && (this.formRef[i].value == theValue)) || (theType != "rad")) {
this.objRef = this.formRef[i];
break;
}
}
}
} else {
this.objRef = this.formRef[objectName];
if(theType == "rad") {
this.objRef = this.radioButtonByValue(this.objRef, theValue);
}
}
} else {
F_debug(this.styleID +": the form isn't displaying due to a Netscape bug.");
}
}
if((theType == "snd") || (theType == "vrm")) {
if((this.style.document.embeds.length>0)&&(this.style.document.embeds[0])) {
this.objRef = this.style.document.embeds[0];
} else {
this.objRef = null;
}
}
if(theType == "fra") this.objRef = eval(objectID+".document");
if(theType == "img") {
this.objRef = this.style.document.images[0];
if ( !this.objRef ) {
this.objRef = new Image();
}
}
if(this.type =='jbn'){
if(typeof this.objRef == "undefined")
this.objRef = this.style.document.applets[0];
}
this.styleDiv = this.style;
if(theLayerID == "LayoutLYR") {
document.F_layout_left = parseInt(this.style.left);
document.F_layout_top = parseInt(this.style.top);
}
if(this.formObj && this.formRef && (typeof(this.objRef) == "undefined"))
F_debug(this.styleID +": either the form or the form element doesn't have a name.");
this.savedPosition = new F_cPoint(this.style.left,this.style.top);
} else {
if( theLayerID == "" ) {
if( this.parent != null ) {
this.styleDiv = this.parent.styleDiv
this.style = this.parent.style;
} else {
this.styleDiv = document;
this.style = document.style;
}
} else {
if ( F_DOM_NN )
this.styleDiv = document.getElementsByTagName('SPAN')[theLayerID];
else if( is_opera ) {
nodeList = document.getElementsByTagName('SPAN');
this.styleDiv = nodeList.item(theLayerID);
} else
this.styleDiv = document.all.tags('SPAN')[theLayerID];
if(typeof this.styleDiv == "undefined" || this.styleDiv == null ) {
if ( F_DOM_NN ) {
this.styleDiv = document.getElementById(theLayerID);
}
else if( is_opera ) {
nodeList = document.getElementById(theLayerID);
this.styleDiv = nodeList;
} else
this.styleDiv = document.all.tags('DIV')[theLayerID];
}
this.style = this.styleDiv.style;
}
if ( theLayerID.indexOf("NavigationBar") > -1 && theLayerID.indexOf("LYR") > -1 && document.all ) {
var nof = document.body.NOF;
if ((nof != undefined) && (typeof(nof) == 'string') && (nof.indexOf("L=(") != -1)) {
layoutWidth = nof.split("L=(");
layoutWidth = layoutWidth[1].split(",");
this.style.width = layoutWidth[1];
}
}
if ( F_DOM_NN ) {
this.objRef = ((objectID != "")&&(theType != "doc")&&(theType != "lyr")&&(theType != "nav")&&(theType != "txt")&&(theType != "map"))?
document.getElementById(objectID) : null;
this.formRef = (formName == "")? null : document.forms[formName];
}
else {
this.objRef = ((objectID != "")&&(theType != "doc")&&(theType != "lyr")&&(theType != "nav")&&(theType != "txt")&&(theType != "map"))?
document.all.item(objectID) : null;
this.formRef = (formName == "")? null : document.forms[formName];
}
if(theLayerID == "LayoutLYR") {
if ( F_DOM_NN ) {
document.F_layout_left = ( this.style.left.indexOf('pt') > 0 ) ? this.style.left.substring(0,this.style.left.indexOf('pt') ) :
this.style.left;
document.F_layout_top = ( this.style.top.indexOf('pt') > 0 ) ? this.style.top.substring(0,this.style.top.indexOf('pt') ) :
this.style.top;
} else {
document.F_layout_left = this.style.pixelLeft;
document.F_layout_top = this.style.pixelTop;
}
}
if ( F_DOM_NN ) {
if (typeof(this.style) != "undefined")
this.savedPosition = new F_cPoint(this.style.left,this.style.top);
} else {
if (typeof(this.style) != "undefined")
this.savedPosition = new F_cPoint(this.style.pixelLeft,this.style.pixelTop);
}
}
if((theType == "img") && (typeof this.objRef != "undefined") && (this.objRef != null)){
this.images = new Object();
var i = 'Image 1 (Normal)';
this.images[i] = new Object();
this.images[i].source = this.objRef.src;
this.images[i].complete = true;
}
this.localhandler = F_actionHandler;
this.actions = new Object;
if(theHandler!=null) {
for( var i = 0; i < (theHandler.length - 4); i = i + 5) {
if(typeof this.actions[theHandler[i]]=="undefined"){
this.actions[theHandler[i]] = new Array();
}
var theArray = this.actions[theHandler[i]];
for(var k = i+1; k < i+5; k++) {
theArray[theArray.length] = theHandler[k];
}
}
}
this.lastMessage = this;
this.messageQueue = new F_cQueue();
}
F_prototype("F_cObject.prototype.",
"draggable", false,
"clickable", true,
"level", "1",
"commandHandler", "F_commandHandler",
"dragBoundries", "'none'",
"dropCollision", null,
"dragCollision", null,
"moveCollision", null,
"clickLayer", null,
"masked", false,
"move", null,
"transition", null,
"nextMessage", null,
"currentMessage", null,
"handler", "F_handler",
"checkHandler", "F_checkHandler",
"closing", false);
F_prototypeF("F_cObject.prototype.",
"getObjectValue",
"setObjectValue",
"hide",
"show",
"bringToFront",
"sendToBack",
"datasourceNavigator",
"datasourceDeleteRecord",
"datasourceUpdateRecord",
"datasourceReloadData",
"shiftZindex1",
"setSource",
"writeSource",
"offset",
"setPosition",
"getPosition",
"restorePosition",
"setTop",
"setLeft",
"setClipTop",
"setClipLeft",
"setClipRight",
"setClipBottom",
"setVisibility",
"isVisible",
"getzIndex",
"setzIndex",
"setIndex",
"getTop",
"getLeft",
"getPageTop",
"getPageLeft",
"getPageTop",
"getWidth",
"getHeight",
"getClipTop",
"getClipLeft",
"getClipRight",
"getClipBottom",
"getClipWidth",
"getClipHeight",
"gotoURL",
"SwitchTo",
"framesetGotoURL",
"getPageXOffset",
"getPageYOffset",
"getWindowInnerHeight",
"getWindowInnerWidth",
"radioButtonByValue",
"getFormObj",
"setClosing",
"resetClosing",
"checkClosing",
"startAnimation",
"stopAnimation",
"pauseAnimation",
"gotoAnimation",
"cancelAnimation",
"playFlashAction",
"flashPause",
"flashStop",
"flashPlay");
if( ( navigator.appName == 'Netscape' ) && !F_DOM_NN ) {
} else {
F_prototypeIE("F_cObject.prototype.",
"getTop",
"getLeft",
"getPageTop",
"getPageLeft",
"setClipRect",
"setClipTop",
"setClipLeft",
"setClipRight",
"setClipBottom",
"getClipRect",
"getClipTop",
"getClipLeft",
"getClipRight",
"getClipBottom",
"getClipWidth",
"getClipHeight",
"getPageXOffset",
"getPageYOffset",
"setIndex",
"shiftZindex1",
"bringToFront",
"sendToBack",
"getWindowInnerHeight",
"getWindowInnerWidth",
"radioButtonByValue",
"setSource",
"writeSource",
"offset");
}
function F_getFormObj(theName) {
for ( var obj in document.objectModel) {
if ((document.objectModel[obj].type == "frm") && (document.objectModel[obj].formRef.name == theName)) {
return (document.objectModel[obj]);
}
}
return(null);
}
function F_offset(theLeft, theTop) {
this.style.offset(theLeft, theTop);
}
function F_setIndex(newIndex) {
var oldIndex = this.getzIndex();
if(this.parent == null) {
this.setzIndex(newIndex);
} else {
with(this.parent.style) {
if(oldIndex>newIndex) {
for (var i=0;i<layers.length;i++) {
var theIndex = layers[i].zIndex;
if((theIndex >= newIndex) && (theIndex < oldIndex)) {
layers[i].zIndex=theIndex + 1;
}
}
}
if(oldIndex<newIndex) {
for (var i=0;i<layers.length;i++) {
var theIndex = layers[i].zIndex;
if((theIndex <= newIndex) && (theIndex > oldIndex)) {
layers[i].zIndex=theIndex - 1;
}
}
}
this.setzIndex(newIndex);
}
}
}
function F_IE_setIndex(newIndex) {
var oldIndex = this.getzIndex();
if(this.parent == null) {
this.setzIndex(newIndex);
} else {
if ( F_DOM_NN ) {
var obj = document.getElementsByTagName("div");
if(oldIndex>newIndex) {
for ( var i = 0; i < obj.length; i++ ) {
var theIndex = obj[i].style.zIndex;
if((theIndex >= newIndex) && (theIndex < oldIndex)) {
obj[i].style.zIndex=theIndex + 1;
}
}
}
if(oldIndex<newIndex) {
for (var i=0;i<obj.length;i++) {
var theIndex = children[i].style.zIndex;
if((theIndex <= newIndex) && (theIndex > oldIndex)) {
obj[i].style.zIndex=theIndex - 1;
}
}
}
this.setzIndex(newIndex);
} else {
with(this.parent.styleDiv) {
if(oldIndex>newIndex) {
for (var i=0;i<children.length;i++) {
var theIndex = children[i].style.zIndex;
if((theIndex >= newIndex) && (theIndex < oldIndex)) {
children[i].style.zIndex=theIndex + 1;
}
}
}
if(oldIndex<newIndex) {
for (var i=0;i<children.length;i++) {
var theIndex = children[i].style.zIndex;
if((theIndex <= newIndex) && (theIndex > oldIndex)) {
children[i].style.zIndex=theIndex - 1;
}
}
}
this.setzIndex(newIndex);
}
}
}
}
function F_bringToFront() {
var theIndex = this.getzIndex();
var O = new Array(0);
with(this.parent.style) {
for (var i=0;i<layers.length;i++) {
var theChildIndex = layers[i].zIndex;
if(theChildIndex >= theIndex) {
O[theChildIndex] = layers[i];
}
}
this.setzIndex(O.length);
for (var i=theIndex+1; i<O.length; i++) {
if(O[i] && O[i].zIndex)
O[i].zIndex=i-1;
}
}
this.setzIndex(O.length-1);
}
function F_IE_bringToFront() {
var theIndex = this.getzIndex();
var A = new Array(0);
if ( F_DOM_NN ) {
obj = document.getElementsByTagName("div");
for ( var i = 0; i < obj.length; i++ ) {
var theChildIndex = obj[i].style.zIndex;
if( theChildIndex >= theIndex )
A[theChildIndex] = i;
}
this.setzIndex( A.length );
for ( var i =theIndex + 1 ; i < A.length; i++ ) {
obj[A[i]].style.zIndex=i-1;
}
} else {
with(this.parent.styleDiv) {
for ( var i = 0; i < children.length; i++ ) {
if((children[i].tagName=="DIV")||(children[i].tagName=="SPAN")) {
var theChildIndex = children[i].style.zIndex;
if(theChildIndex >= theIndex) A[theChildIndex] = i;
}
}
this.setzIndex(A.length);
for (var i=theIndex+1; i< A.length; i++) {
children[A[i]].style.zIndex=i-1;
}
}
}
var l = A.length-1;
this.setzIndex(A.length-1);
}
function F_sendToBack() {
var theIndex = this.getzIndex();
var O = new Array(0);
with(this.parent.style) {
for (var i=0;i< layers.length;i++) {
var theChildIndex = layers[i].zIndex;
if(theChildIndex <= theIndex) {
O[theChildIndex] = layers[i];
}
}
this.setzIndex(1);
for (var i=1; i< theIndex; i++) {
if(O[i] && O[i].zIndex)
O[i].zIndex=i+1;
}
}
}
function F_IE_sendToBack() {
var theIndex = this.getzIndex();
var A = new Array(0);
if ( F_DOM_NN ){
obj = document.getElementsByTagName("div");
for ( var i=0; i < obj.length; i++ ) {
if((obj[i].tagName=="DIV")||(obj[i].tagName=="SPAN")) {
var theChildIndex = obj[i].style.zIndex;
if(theChildIndex <= theIndex) A[theChildIndex] = i;
}
}
this.setzIndex(1);
for (var i=1; i< theIndex; i++) {
obj[A[i]].style.zIndex=i+1;
}
} else {
with(this.parent.styleDiv) {
for (var i=0;i<children.length;i++) {
if((children[i].tagName=="DIV")||(children[i].tagName=="SPAN")) {
var theChildIndex = children[i].style.zIndex;
if(theChildIndex <= theIndex) A[theChildIndex] = i;
}
}
this.setzIndex(1);
for (var i=1; i< theIndex; i++) {
children[A[i]].style.zIndex=i+1;
}
}
}
}
function F_datasourceNavigator(where, data) {
eval(data);
cancelEvent();
return false;
}
function F_datasourceDeleteRecord(data){
eval(data);
cancelEvent();
return false;
}
function F_datasourceReloadData(data){
eval(data);
cancelEvent();
return false;
}
function F_datasourceUpdateRecord(data){
var formName="";
var container = NOFparameters.container;
var children = new Array();
for (var i = 0; i < container.childNodes.length; i++)
if (container.childNodes[i].nodeType == 1)
children.push(container.childNodes[i]);
if (children.length == 1 && children[0].tagName != "FORM")
container = children[0];
for (var i = 0; i < container.childNodes.length; i++) {
if (container.childNodes[i].tagName == "FORM") {
formName = container.childNodes[i].name;
break;
}
}
data = data.split("${formName}").join(formName);
eval(data);
cancelEvent();
return false;
}
function F_shiftZindex1(dir) {
var theIndex = this.getzIndex() + dir;
with(this.parent.style) {
for (var i=0;i< layers.length;i++) {
if(layers[i].zIndex == theIndex) {
layers[i].zIndex = theIndex - dir;
this.setzIndex(theIndex);
return true;
}
}
}
return false;
}
function F_IE_shiftZindex1(dir) {
var theIndex = this.getzIndex() + dir;
if ( F_DOM_NN ) {
obj = document.getElementsByTagName("div");
for (var i=0;i<obj.length;i++) {
if((obj[i].tagName=="DIV")||(obj[i].tagName=="SPAN")) {
if(obj[i].style.zIndex == theIndex) {
obj[i].style.zIndex = theIndex - dir;
this.setzIndex(theIndex);
return true;
}
}
}
} else {
with(this.parent.styleDiv) {
for (var i=0;i<children.length;i++) {
if((children[i].tagName=="DIV")||(children[i].tagName=="SPAN")) {
if(children[i].style.zIndex == theIndex) {
children[i].style.zIndex = theIndex - dir;
this.setzIndex(theIndex);
return true;
}
}
}
}
}
return false;
}
function F_show() {
sendMsg(this.styleID, 'Shown', '', '', false);
this.setVisibility('inherit');
}
function F_hide() {
this.setVisibility('hidden');
sendMsg(this.styleID, 'Hidden', '', '', false);
}
function F_setVisibility(theValue) {
if(theValue == "toggle") {
this.style.visibility = ((this.style.visibility == "hidden") || (this.style.visibility == "hide"))? "inherit" : "hidden";
} else {
this.style.visibility = theValue;
}
}
function F_isVisible() {
theLayer = this;
while(theLayer.type != "doc") {
if((theLayer.style.visibility == "hidden") || (theLayer.style.visibility == "hide")) return false;
theLayer = theLayer.parent;
}
return true;
}
function F_setPosition(parm)
{
this.setTop(parm.y);
this.setLeft(parm.x);
}
function F_restorePosition(parm)
{
this.style.top = parm.y;
this.style.left = parm.x;
}
function F_getPosition(parm) {
return(new F_Parm('x',this.getLeft(parm),'y',this.getTop(parm)));
}
function F_setTop(theValue) {
if((this.parent != null) && ((this.parent.type == 'lyr') || (this.parent.type == 'doc'))) {
this.style.top = parseInt(theValue) - parseInt(this.getTop('absolute')) + parseInt(this.getTop('style'));
} else
this.style.top = parseInt(theValue);
}
function F_setLeft(theValue) {
if((this.parent != null) && ((this.parent.type == 'lyr') || (this.parent.type == 'doc'))) {
this.style.left = (parseInt(theValue) - parseInt(this.getLeft('absolute')) + parseInt(this.getLeft('style')));
} else
this.style.left = parseInt(theValue);
}
function F_setClipTop(theValue) {this.style.clip.top = theValue;}
function F_setClipLeft(theValue) {this.style.clip.left = theValue;}
function F_setClipRight(theValue) {this.style.clip.right = theValue;}
function F_setClipBottom(theValue) {this.style.clip.bottom = theValue;}
function F_getzIndex() {
if((this.type == "map") || (this.formObj))
return(parseInt(this.parent.style.zIndex));
return(parseInt(this.style.zIndex));
}
function F_setzIndex(theIndex) {this.style.zIndex = theIndex;}
function F_getLeft(parm) {
if(parm=='screen') {
return(this.style.pageX);
}
if(parm=='absolute') {
return(this.style.pageX-document.F_layout_left);
}
if(parm=='style')
return(this.style.left);
return(parseInt(this.style.left));
}
function F_getTop(parm) {
if(parm=='screen') {
return(this.style.pageY);
}
if(parm=='absolute') {
return(this.style.pageY-document.F_layout_top);
}
if(parm=='style')
return(this.style.top);
return(parseInt(this.style.top));
}
function F_getPageTop() {
var theTop = this.getTop();
theLayer = this.parent;
while (theLayer != null) {
theTop += theLayer.getTop();
theLayer = theLayer.parent;
}
return(theTop);
}
function F_getPageLeft() {
var theLeft = this.getLeft();
theLayer = this.parent;
while (theLayer != null) {
theLeft += theLayer.getLeft();
theLayer = theLayer.parent;
}
return(theLeft);
}
function F_getClipTop() {return(parseInt(this.style.clip.top));}
function F_getClipLeft() {return(parseInt(this.style.clip.left));}
function F_getClipRight() {return(parseInt(this.style.clip.right));}
function F_getClipBottom() {return(parseInt(this.style.clip.bottom));}
function F_getClipWidth() {return(parseInt(this.style.clip.right) - parseInt(this.style.clip.left));}
function F_getClipHeight() {return(parseInt(this.style.clip.bottom) - parseInt(this.style.clip.top));}
function F_NOP() {return(0);}
function F_getWidth() {
return(parseInt(this.getClipWidth()));
}
function F_getHeight() {
return(parseInt(this.getClipHeight()));
}
function F_getPageXOffset() {return(window.pageXOffset);}
function F_getPageYOffset() {return(window.pageYOffset);}
function F_getWindowInnerHeight() {return(window.innerHeight);}
function F_getWindowInnerWidth() {return(window.innerWidth);}
function F_setSource(s) {
if(s!="")
this.style.src=s;
}
function F_writeSource(s) {
this.style.document.open();
this.style.document.write(s);
this.style.document.close();
}
function F_IE_setSource(s) {
if(s!="")
this.styleDiv.innerHTML = "<OBJECT TYPE='text/x-scriptlet' WIDTH="+this.getWidth()+" HEIGHT="+this.getHeight()+" DATA='"+s+"'></OBJECT>";
}
function F_IE_writeSource(s) {
this.styleDiv.innerHTML = s;
}
function F_getZero() { return(0); }
function F_IE_offset( theLeft, theTop ) {
if ( F_DOM_NN ) {
var left = this.style.left;
var top = this.style.top;
if ( left.indexOf("pt") > 0 || left.indexOf("px") > 0 ) {
var pos = ( left.indexOf("pt") > 0 ) ? left.indexOf("pt") : left.indexOf("px");
left = left.substring( 0 , pos );
}
if ( top.indexOf("pt") > 0 || top.indexOf("px") > 0 ) {
var pos = ( top.indexOf("pt") > 0 ) ? top.indexOf("pt") : top.indexOf("px");
top = top.substring( 0 , pos );
}
this.style.left = (parseInt(left) + theLeft) + "px";
this.style.top = (parseInt(top) + theTop) + "px";
} else {
this.style.left = (this.style.pixelLeft + theLeft);
this.style.top = (this.style.pixelTop + theTop);
}
}
function F_IE_setTop(theValue) {
if((this.parent != null) && ((this.parent.type == 'lyr') || (this.parent.type == 'doc'))) {
var t = this.parent.getTop('absolute') - this.getTop('absolute') + this.style.top + parseInt(theValue);
this.style.top = t;
} else
this.style.top = theValue;
}
function F_IE_setLeft(theValue) {
this.style.left = theValue;
}
function F_IE_getLeft(parm) {
if(parm=='screen') {
return(this.getPageLeft());
}
if(parm=='absolute') {
var t = parseInt(this.getPageLeft()) - parseInt(document.F_layout_left);
return t;
}
if(parm=='style') {
if ( F_DOM_NN ) {
return(this.style.left);
}
else {
return(this.style.pixelLeft);
}
}
if ( F_DOM_NN )
return(parseInt(this.style.left));
return(parseInt(this.style.pixelLeft));
}
function F_IE_getTop(parm) {
if(parm=='screen') {
return(this.getPageTop());
}
if(parm=='absolute') {
var t = parseInt(this.getPageTop()+0) - parseInt(document.F_layout_top+0);
return t;
}
if(parm=='style') {
if ( F_DOM_NN )
return(this.style.top);
else
return(this.style.pixelTop);
}
if ( F_DOM_NN )
return(this.style.top);
else
return(this.style.pixelTop);
}
function F_IE_getPageTop() {
var theTop = this.styleDiv.offsetTop;
theLayer = this.parent;
while (theLayer != null) {
theTop += theLayer.styleDiv.offsetTop;
theLayer = theLayer.parent;
}
return(theTop);
}
function F_IE_getPageLeft() {
var theLeft = this.styleDiv.offsetLeft;
theLayer = this.parent;
while (theLayer != null) {
theLeft += theLayer.styleDiv.offsetLeft;
theLayer = theLayer.parent;
}
return(theLeft);
}
function F_IE_getClipRect() {
var clip = this.style.clip;
if( clip == 'rect()' )
clip = '';
if((clip.substring(0,4) == "rect") && (clip.charAt(clip.length-1) == ")")){
if( clip.indexOf( "," > -1 ) ) {
buf = clip.split("," );
clip = "";
for( i = 0; i < buf.length; i++ ) {
clip = clip + buf[i];
}
}
var theRect=clip.substring(5,999).split("px");
return( new F_cRect( parseInt(theRect[3]), parseInt(theRect[0]), parseInt(theRect[1]), parseInt(theRect[2]) ) );
}
if ( this.styleID == "Layout" ) return ( new F_cRect( 0,0,1000,1000 ) );
offsetWidth = ( F_DOM_NN && ( this.type == 'txt' ) ) ? parseInt(this.styleDiv.offsetWidth) * 2 : this.styleDiv.offsetWidth;
offsetHeight = ( F_DOM_NN && ( this.type == 'txt' ) ) ? parseInt(this.styleDiv.offsetHeight) * 2 : this.styleDiv.offsetHeight;
obj = new F_cRect(0 ,0, offsetWidth, offsetHeight );
return obj;
}
function F_IE_getClipTop() {return(this.getClipRect().top);}
function F_IE_getClipLeft() {return(this.getClipRect().left);}
function F_IE_getClipRight() {return(this.getClipRect().right);}
function F_IE_getClipBottom() {return(this.getClipRect().bottom);}
function F_IE_getClipWidth() {return(this.getClipRect().right - this.getClipRect().left);}
function F_IE_getClipHeight() {return(this.getClipRect().bottom - this.getClipRect().top);}
function F_IE_setClipRect(theRect) {
this.style.clip = "rect(" + theRect.top + "px " + theRect.right +
"px " + theRect.bottom + "px " + theRect.left +"px)";
}
function F_IE_setClipTop(theValue) {
theValue = ( theValue == "" ) ? 0 : theValue;
var theRect = this.getClipRect();
theRect.top = theValue;
this.setClipRect(theRect);
}
function F_IE_setClipLeft(theValue) {
theValue = ( theValue == "" ) ? 0 : theValue;
var theRect = this.getClipRect();
theRect.left = theValue;
this.setClipRect(theRect);
}
function F_IE_setClipRight(theValue) {
theValue = ( theValue == "" ) ? 0 : theValue;
var theRect = this.getClipRect();
theRect.right = theValue;
this.setClipRect(theRect);
}
function F_IE_setClipBottom(theValue) {
theValue = ( theValue == "" ) ? 0 : theValue;
var theRect = this.getClipRect();
theRect.bottom = theValue;
this.setClipRect(theRect);
}
function F_IE_getPageXOffset() {
if( F_DOM_NN )
return window.pageXOffset;
else
return(parseInt(document.body.scrollLeft));
}
function F_IE_getPageYOffset() {
if( F_DOM_NN )
return window.pageYOffset;
else
return(parseInt(document.body.scrollTop));
}
function F_IE_getWindowInnerHeight() {
if( F_DOM_NN )
return self.innerHeight;
else
return document.body.clientHeight;
}
function F_IE_getWindowInnerWidth() {
if( F_DOM_NN )
return self.innerWidth;
else
return document.body.clientWidth;
}
function F_handler(msg)
{
top.F_curObj = this;
if(this.formObj && (typeof(this.objRef) == "undefined")) {
return(null);
}
if(msg != null)
{
this.lastMessage.nextMessage = msg;
this.lastMessage = msg;
}
if(this.nextMessage != null)
{
this.messageQueue.push(this.currentMessage);
this.currentMessage = this.nextMessage;
this.nextMessage = this.currentMessage.nextMessage;
this.currentMessage.nextMessage = null;
if (this.nextMessage == null) this.lastMessage = this;
if(this.localhandler != null) this.localhandler(this.currentMessage);
if(this.commandHandler != null) this.commandHandler(this.currentMessage);
if((this.type == "jbn") && (msg.message.substring(0,5) == "BEAN ")) {
var m = msg.message.substring(5,msg.message.length);
var o = this.objRef;
var P = msg.data;
var R = ''
if (F_NN) {
var ParmIsJava = ((typeof P == "object")&& (P.getClass));
} else {
var ParmIsJava = ((typeof P == "object")&&(typeof P.constructor=="undefined"));
}
if (P == '') {
var R = this.objRef[m]();
} else if(ParmIsJava) {
o[m](P);
} else {
if (typeof P == "object") {
var S = 'o[m](';
var A = [];
for (var i in P) {
S += 'A['+A.length+'],';
A[A.length] = P[i];
}
S = S.substr(0, S.length-1)+')';
if(A.length > 0)
var R = eval(S);
else
var R = o[m](P);
} else {
var R = o[m](P);
}
}
this.currentMessage.returnValue = R;
}
if(this.currentMessage.cascade)
for (var child in this.childObjects) {
this.currentMessage.send(this.childObjects[child]);
}
var returnValue = this.currentMessage.returnValue;
this.currentMessage = null;
this.checkHandler();
this.currentMessage = this.messageQueue.pop();
return(returnValue);
}
return null;
}
function F_checkHandler() {
setTimeout( this.timeoutTest+'?'+this.textRef + '.handler(null):null;', 1);
}
function F_actionHandler(msg) {
var t = null;
if(typeof this.actions[msg.message] != "undefined") {
top.F_curObj = this;
NOFparameters = F_paramObject(msg, top.F_curObj);
params = NOFparameters;
var theArray = this.actions[msg.message];
if(theArray) {
for( var i = 0; i < (theArray.length - 3); i = i + 4) {
if(F_ckM(msg, msg.message)) {
if(typeof theArray[i] == "function")
msg.returnValue = theArray[i]();
else {
var P = theArray[i + 2];
var Parm = P;
if((typeof P == "object") && (!F_NN || !P.getClass)) {
if (P[0] == "msg")
Parm = sendMsg(P[1], P[2], P[3], null);
if (P[0] == "exp") {
var func = new Function("return("+(P[1] == ''?"''":P[1])+")");
Parm = func();
if(typeof Parm == "undefined") Parm = new Object();
if((typeof Parm == "object")&&(Parm != null)) Parm.getParm=F_getParm2;
}
}
t = sendMsg(theArray[i], theArray[i + 1], Parm, this, theArray[i + 3]);
msg.returnValue = t;
}
}
}
}
}
return(t);
}
function F_errorMessage (errorMessage,errorURL,errorLineNo) {
alert("Error with user added action: '"+msg.message+"'.");
return false;
}
function F_commandHandler(msg) {
if(typeof this.commands[msg.message] != "undefined") {
if(F_ckM(msg, msg.message)) {
NOFparameters = F_paramObject(msg, top.F_curObj);
params = NOFparameters;
window.onerror = F_errorMessage;
with(this) {
eval(commands[msg.message]);
}
window.onerror = new Function("return(false)");
}
}
}
function F_ckM(msg, theString) {
if((msg.message == theString) && (msg.relay == false)) msg.canceled = true;
return(msg.message == theString);
}
function F_send(theTarget) {
if(this.canceled == false) {
if(typeof theTarget == "undefined") {
F_debug("bad target; msg: '" + this.message + "'");
} else {
if(!theTarget.handler) {
F_debug("bad target; msg: '" + this.message + "'");
} else {
var t = theTarget.handler(this);
return(t);
}
}
} else {
return(null);
}
}
function sendMsg(theTargetName, msgText, msgData, theSender, theCascade) {
if (arguments.length == 4)
msg = new F_cMessage(msgText, msgData,false, theSender);
else if (arguments.length == 5)
msg = new F_cMessage(msgText, msgData,theCascade, theSender);
else
msg = new F_cMessage(msgText, new F_Parm(),false, null);
if (document.F_loaded) {
var targetArray = theTargetName.split(":");
if(targetArray[0]=="_parent") {
if(msgText=="Go To") {
F_framesetGotoURL(msgData);
return false;
} else {
F_debug("targeting frameset with an invalid message");
return false;
}
}
if(targetArray.length == 2) {
var d = parent[targetArray[0]].document;
if ((d.objectModel) && (d.objectModel[targetArray[1]]) && (d.F_loaded)) {
var target = parent[targetArray[0]].document.objectModel[targetArray[1]];
} else {
if(msgText=="Go To") {
parent[targetArray[0]].document.location.href=msg.data;
} else {
msg.target = targetArray[1];
msg.targetFrame = targetArray[0];
frameQueue.push(msg);
return(null);
}
}
} else {
var target = document.objectModel[theTargetName];
}
var t = msg.send(target);
return(t);
} else {
msg.target = theTargetName;
messageQueue.push(msg);
return(null);
}
}
function F_checkFrameQueue() {
while (frameQueue.index > 0) {
var msg = frameQueue.pop()
var d = parent[msg.targetFrame].document;
if ((d.objectModel) && (d.objectModel[msg.target]) && (d.F_loaded)) {
var target = parent[msg.targetFrame].document.objectModel[msg.target];
msg.send(target);
} else {
frameQueue.push(msg);
top.setTimeout("top.frames['"+self.name+"'].F_checkFrameQueue?top.frames['"+self.name+"'].F_checkFrameQueue():null;", 100);
break;
}
}
}
function sendMsgToFrame(theTargetName, msgText, msgData, theSender, theCascade, theTargetFrame) {
if (document.objectModel != null) {
msg = new F_cMessage(msgText, msgData,theCascade, theSender);
var target = eval(theTargetFrame+".document.objectModel[" + theTargetName+"]");
return(msg.send(target));
}
}
function F_cMessage(msg, theData, theCascade, theSender) {
this.message = msg;
this.data = theData;
this.cascade = theCascade;
this.relay = true;
this.canceled = false;
this.nextMessage = null;
this.sender = theSender;
this.senderFrame = null;
this.send = F_send;
}
function F_initCommands() {
var F_commands = new Object();
var a = new Array("img","txt","chk","rad","frm","tfd","sel","btn","doc","lyr","wht","win","map", "tln",
"shk", "snd", "vid", "act", "nav", "tbl", "jav", "com", "jbn", "frm", "vrm", "nbt", "fra", "fst");
for (var i = 0; i < a.length; i++)
F_commands[a[i]] = new F_cCommands(a[i]);
return(F_commands);
}
function F_cCommands(theType) {
}
function F_dummy() {
}
function F_addCommandsLoop (theObject, theCommands) {
for( var i = 0; i < (theCommands.length - 1); i = i + 2)
theObject[theCommands[i]] = theCommands[i + 1];
}
function F_addCommands_method(theObject, theMethod) {
var s = "Set ";
if (theMethod == "getObjectValue") s = "Get ";
for(var i=2; i < arguments.length; i++) {
var t = arguments[i];
theObject[s+t] = "this." + theMethod+ "('" + t.toLowerCase() + "', msg)";
}
}
function F_selectRestoreDefault(theLayer) {
for (var i = 0; i < theLayer.objRef.length; i++) {
if (theLayer.objRef.options[i].defaultSelected == true) {
theLayer.objRef.options[i].selected = true;
} else {
theLayer.objRef.options[i].selected = false;
}
}
}
function F_getObjectValue(theProperty, msg) {
msg.returnValue = this.objRef[theProperty];
}
function F_setObjectValue(theProperty, msg) {
this.objRef[theProperty] = msg.data;
}
function F_radioButtonRef(theRadioButton) {
for(var i = 0; i < theRadioButton.length ; i++)
if(theRadioButton[i].checked)
return(theRadioButton[i]);
return(theRadioButton[0]);
}
function F_radioButtonByValue(theRadioButton, theValue) {
if(theRadioButton) {
if((typeof theRadioButton.length)=="undefined"){
return(theRadioButton)
} else {
for(var i = 0; i < theRadioButton.length ; i++)
if(theRadioButton[i])
if(theRadioButton[i].value==theValue) {
return(theRadioButton[i]);
}
}
}
return(null);
}
function F_IE_radioButtonByValue(theRadioButton, theValue) {
return(theRadioButton);
}
function F_prototype (theRef){
for(var i=1; i < arguments.length; i = i + 2)
eval(theRef + arguments[i] +" = " + arguments[i+1]);
}
function F_prototypeF (theRef){
for(var i=1; i < arguments.length; i++)
eval(theRef + arguments[i] +" = F_" + arguments[i]);
}
function F_prototypeIE (theRef){
for(var i=1; i < arguments.length; i++)
eval(theRef + arguments[i] +" = F_IE_" + arguments[i]);
}
function F_SwitchTo(parm)
{
for (var i in this.childObjects)
{
obj = this.childObjects[i];
if(obj.type == 'lyr')
{
if(obj.name == parm)
obj.style.display = '';
else if(obj.style.display == '')
obj.style.display = 'none';
}
}
}
function F_gotoURL(parm) {
if ( (typeof(parm) == 'string') && parm.indexOf("openpopup") == 0) {
eval(parm);
return;
}
if ( typeof(parm) == 'string')
{
var theName = this.name;
var obj = document.getElementById(theName);
if (obj != null && typeof(obj.src) != 'undefined')
{
obj.src = parm;
return true;
}
}
var theURL = parm;
var theTarget = "This";
if(typeof parm == "object") {
var theURL = parm.URL;
theTarget = parm["Target Frame"];
}
if(theURL == "") return false;
if(theTarget == "Top") {
F_framesetGotoURL(theURL);
return true;
}
if(theTarget == "Other") {
var n = parm["Other Target"];
var t = top.frames[n];
if(t){
t.document.location.href = theURL;
} else {
window.open(theURL, n);
}
return true;
}
var relative = theURL.indexOf(':') < 0;
var p = theURL.split(':')[0];
var f = theURL.split('.');
var t = f[f.length-1].toLowerCase();
if((relative ||(p=="http")||(p=="shttp")||(p=="https")||(p=="file"))&&((t!="wav")&&(t!="au")&&(t!="aif")&&(t!="mid")&&(t!="rmf")&&(t!="avi")&&(t!="mov")&&(t!="mpg"))) {
if(!document.main.closing) {
document.main.closing = true;
this.theURL = F_getCompleteURL(theURL);
if(document.F_topObject) {
if (typeof(document.objectModel[document.F_topObject]) != 'undefined' && document.objectModel[document.F_topObject] != null)
document.objectModel[document.F_topObject].theURL = F_getCompleteURL(theURL);
sendMsg(document.F_topObject, 'Page Exiting', '', null, true);
sendMsg(document.F_topObject, 'Check Closing', '', null);
}
}
} else {
if(theURL!="Javascript:void(0)")
document.location.href = theURL;
}
return true;
}
top.closing = false;
function F_framesetGotoURL(theURL) {
if(!top.closing) {
top.closing = true;
top.theURL = F_getCompleteURL (theURL);
for(var i = 0; i < parent.frames.length; i++) {
with(top.frames[i].document) {
if(document.F_topObject) {
document.main.closing = true;
sendMsg(top.frames[i].name+":"+document.F_topObject, 'Page Exiting', '', null, true);
}
}
}
sendMsg(document.F_topObject, 'Check Closing', '', null);
}
}
function F_getCompleteURL (theURL) {
var relative = theURL.indexOf(':') < 0;
if(relative) {
var loc = top.location.href;
var newURL = loc.substring(0,loc.lastIndexOf('/')+1)
var urlStart = theURL.substring(0,2);
if(urlStart == './') {
newURL += theURL.substring(2,theURL.length)
}
var clippedURL = newURL;
while(urlStart == '..') {
clippedURL = clippedURL.substring(0,clippedURL.lastIndexOf('/',clippedURL.length-2)+1);
theURL = theURL.substring(3,theURL.length);
newURL = clippedURL + theURL;
urlStart = theURL.substring(0,2);
}
return(newURL);
}
return(theURL);
}
function F_checkClosing() {
if(!top.closing) {
if (document.main.closingObjects == 0) {
document.location.href = this.theURL;
document.main.closing = false;
}
} else {
var c = 0;
for(var i = 0; i < parent.frames.length; i++) {
with(top.frames[i].document) {
if(document.F_topObject) {
c += document.main.closingObjects;
}
}
}
if(c == 0)
top.location.href = top.theURL;
}
}
function F_cRect(theLeft, theTop, theRight, theBottom) {
this.left = theLeft ;
this.top = theTop;
this.right = theRight ;
this.bottom = theBottom;
}
function F_cPoint(theX, theY) {
this.x = parseInt(theX);
this.y = parseInt(theY);
}
function F_cQueue () {
this.theQueue = new Array(0);
this.index = 0;
this.push = F_queuePush;
this.pop = F_queuePop;
}
function F_queuePop() {
var theValue = this.theQueue[--this.index];
this.theQueue[this.index] = null;
return(theValue);
}
function F_queuePush(theObject) {
this.theQueue[this.index++] = theObject;
}
function F_roundOff ( theNumber) {
if (theNumber > 0)return(Math.ceil(theNumber)); else return(Math.floor(theNumber));
}
function F_setClosing()
{
if(document.main.closing) {
this.closing = true;
document.main.closingObjects++;
}
}
function F_resetClosing()
{
if(this.closing) {
document.main.closingObjects--;
sendMsg(document.F_topObject, 'Check Closing', '', null);
}
}
function F_setupDrag() {
document.F_dragLayer = null;
if(navigator.appName=='Netscape')
{
if (F_NN) document.captureEvents(Event.MOUSEUP|Event.MOUSEDOWN);
document.onmousedown = F_nn_mouseDown;
document.onmouseup = F_mouseUp;
document.onmousemove = F_nn_mouseMove;
window.offscreenBuffering=true;
} else {
document.onmousemove = F_ie_mouseMove;
document.ondragstart = F_ie_dragStart;
document.onmouseup = F_IE_mouseUp;
}
}
var e;
function F_setEvent(e) {
target = e.target;
if ( F_NN && (target.indexOf(".htm") > -1) ) {
document.location.href = target;
return ;
}
if ( navigator.appName == 'Netscape' ) {
F_nn_setEvent( e );
} else {
F_ie_setEvent();
}
}
function F_nn_setEvent(e) {
window.NOFevent.pageX = e.pageX;
window.NOFevent.pageY = e.pageY;
}
function F_ie_setEvent() {
window.NOFevent.pageX = window.event.clientX;
window.NOFevent.pageY = window.event.clientY;
}
function F_nn_mouseMove (e) {
if ( ( document.F_dragLayer != null ) && ( document.F_dragLayer.length > 0 ) ) {
var d = document.F_dragLayer[0].layer;
d.oldx = isNaN(d.oldx) ? 0 : d.oldx;
d.oldy = isNaN(d.oldy) ? 0 : d.oldy;
if ( ( document.F_dragLayer.length == 1 ) && ( d.fastDrag ) ) {
var xMove = parseInt(d.oldx) - e.pageX ;
var yMove = parseInt(d.oldy) - e.pageY;
d.oldx = parseInt(d.oldx) - xMove ;
d.oldy = parseInt(d.oldy) - yMove;
d.offset (-xMove, -yMove);
} else {
F_drag ( e.pageX, e.pageY );
}
if ( e )
e.returnValue = false;
}
}
function F_clickedOnImage (mouseX, mouseY, imageRef) {
var theRef = null;
var topRef = imageRef;
for (var i in imageRef.childObjects) {
theRef = imageRef.childObjects[i];
if (F_pointInObject(theRef, mouseX, mouseY))
topRef = theRef;
}
return(topRef);
}
function F_pointInObject(obj, mouseX, mouseY) {
if (obj.clickable && obj.isVisible() && !obj.masked && obj.type != "map") {
var theLeft = obj.getLeft('screen') + obj.getClipLeft();
var theTop = obj.getTop('screen') + obj.getClipTop();
if ( (mouseX >= theLeft)
&& (mouseX <= (theLeft + obj.getWidth() - 1))
&& (mouseY >= theTop)
&& (mouseY <= (theTop + obj.getHeight() - 1)) )
return(true)
else return false;
}
if (obj.type == "map" && obj.parent.isVisible()) {
var x = obj.parent.getLeft('screen');
var y = obj.parent.getTop('screen');
if(obj.maptype == "rect") {
var theLeft = x + obj.map.left;
var theTop = y + obj.map.top;
var theRight = x + obj.map.right;
var theBottom = y + obj.map.bottom;
if ( (mouseX >= theLeft)
&& (mouseX <= theRight)
&& (mouseY >= theTop)
&& (mouseY <= theBottom) )
return(true)
else
return false;
} else
if(obj.maptype == "poly") {
var theX = mouseX - x;
var theY = mouseY - y;
if ( F_clickedOnPolygon(theX, theY, obj.map) )
return(true)
else
return false;
} else
if(obj.maptype == "circ") {
var theX = mouseX - x - obj.map.x;
var theY = mouseY - y - obj.map.y;
if ( Math.sqrt((theX * theX) + (theY * theY)) <= obj.map.radius)
return(true)
else
return false;
}
}
}
function F_clickedOnPolygon(x, y, polygon) {
var c = false;
var p1 = polygon[polygon.length-1];
for (var i=0;i<polygon.length;i++) {
p2 = polygon[i];
if((((p1.y<=y) && (y<p2.y)) ||
((p2.y<=y) && (y<p1.y))) &&
(x< (p2.x - p1.x) * (y - p1.y) / (p2.y - p1.y) + p1.x))
c=!c;;
p1 = p2;
}
return(c);
}
function F_nn_mouseDown (e) {
F_setEvent(e);
var retval = (F_NN) ? routeEvent(e) : true;
if ( typeof retval == "undefined" )
return false;
else
return retval;
}
function F_ie_mouseMove () {
if ((document.F_dragLayer != null)&&(document.F_dragLayer.length>0)) {
var d = document.F_dragLayer[0].layer;
if((document.F_dragLayer.length==1)&&(d.fastDrag)) {
if(typeof d.oldx=="undefined"){
d.oldx = event.clientX;
d.oldy = event.clientY;
}
var xMove = d.oldx - event.clientX;
var yMove = d.oldy - event.clientY;
d.oldx = d.oldx - xMove ;
d.oldy = d.oldy - yMove;
d.style.left = (d.style.pixelLeft -xMove);
d.style.top = (d.style.pixelTop -yMove);
} else {
F_drag (event.clientX, event.clientY);
}
event.returnValue = false;
}
}
function F_ie_dragStart () {
event.returnValue = false;
}
function F_mouseUp (e) {
F_setEvent(e);
if(document.F_dragLayer != null) {
for(var i=(document.F_dragLayer.length-1);i>-1;i--) {
if(document.F_dragLayer)
if(document.F_dragLayer[i]) {
var dObj = document.F_dragLayer[i];
if(dObj.type == "Until Mouse Up") {
dObj.layer.endDrag();
}
}
}
}
var retval = (F_NN) ? routeEvent(e) : true;
return true;
}
function F_IE_mouseUp (e) {
F_ie_setEvent();
if(document.F_dragLayer != null) {
for(var i=(document.F_dragLayer.length-1);i>-1;i--) {
if(document.F_dragLayer)
if(document.F_dragLayer[i]) {
var dObj = document.F_dragLayer[i];
if(dObj.type == "Until Mouse Up") {
dObj.layer.endDrag();
}
}
}
}
if (typeof(HideMenu) != "undefined")
HideMenu();
}
var messageQueue = new F_cQueue();
var frameQueue = new F_cQueue();
function F_pageLoaded(theID) {
window.status="Finishing";
F_setupDrag();
if(theID == null) F_debug("ERROR: no parameter passed to F_pageLoaded()");
document.F_topObject = theID;
document.clickLayer = null;
F_addCommandCallback ();
document.F_loaded=true;
while (messageQueue.index > 0) {
var msg = messageQueue.pop()
msg.send(document.objectModel[msg.target]);
}
document.F_windows=new Object();
window.status=F_barError;
sendMsg(theID ,'Page Loaded', '', null, true);
if(parent!=self) {
if(F_NN || !F_MAC) {
if(top.setTimeout) {
top.setTimeout("top.frames['"+self.name+"'].F_checkFrameQueue?top.frames['"+self.name+"'].F_checkFrameQueue():null;", 100);
}
} else {
setTimeout("F_checkFrameQueue?F_checkFrameQueue():null;", 100);
}
}
}
function F_addEventToLinks (theHandle) {
for (var layerNo = 0; layerNo < theHandle.layers.length; layerNo++) {
docHandle = theHandle.layers[layerNo].document;
for(var i = 0;i < docHandle.links.length;i++) {
if(("undefined" == typeof docHandle.links[i].onmouseover)&&("undefined" != typeof docHandle.links[i].onclick)) {
var l = docHandle.links[i].onclick + "";
var t = l.split('"');
docHandle.links[i].onmouseover = new Function("return(F_e('"+ t[1] +"', F_MV))");
}
}
F_addEventToLinks (docHandle)
}
}
function F_paramObject(msg, obj) {
if(obj==null) obj=new Object();
var t = {element:obj.objRef, container:obj.styleDiv,containerStyle:obj.style,id:obj.styleID,type:obj.type,objectRef:obj,childRefs:obj.childObjects,parentRef:obj.parent,form:obj.formRef,message:msg};
return(t);
}
function F_getReference(id) {
return(window.document.objectModel[id]);
}
function F_sendMessage(theTargetID, msgText, msgData, theCascade) {
if(typeof msgData == "object")
msgData.getParm=F_getParm2;
return(sendMsg(theTargetID, msgText, msgData, null, theCascade));
}
function F_e(theTarget, theEvent, browserEvent) {
var oldNOF_event = NOF_event;
NOF_event = typeof(browserEvent) != "undefined" ? browserEvent : null;
var d = document.objectModel[theTarget];
if( !F_NN && !F_DOM_NN && !is_opera && event.srcElement != null) {
var t = event.srcElement.tagName;
var isFontTag = ( (t=='B') || (t=='I') || (t=='FONT') || (t=='SUB') || (t=='SUP') || (t=='STRIKE') || (t=='U') );
if ( ( document.F_loaded ) && ( event.srcElement )
&& !( ( event.srcElement.id == theTarget ) || (event.srcElement.id == theTarget+"LYR") || ( isFontTag ) )
&& (d.type!="map" ) && ( d.type!="img" ) && ( d.type!="b" ) ) {
cancelEvent();
NOF_event = oldNOF_event;
return false;
}
}
if( navigator.appName != 'Netscape' && !is_opera ) {
F_ie_setEvent();
}
if( theEvent == F_MD ) {
var t = theTarget;
if(d.type=="img")
t = F_clickedOnImage(window.NOFevent.pageX,window.NOFevent.pageY , d).styleID;
F_sndMsg(t, theEvent, '');
NOF_event = oldNOF_event;
if(F_MAC)
return(t!=theTarget);
else
return(true)
}
if(theEvent == F_MU) {
if(document.F_dragLayer != null) {
for(var i=(document.F_dragLayer.length-1);i>-1;i--) {
if(document.F_dragLayer) {
if(document.F_dragLayer[i]) {
var dObj = document.F_dragLayer[i];
if(dObj.type == "Until Mouse Up") {
dObj.layer.endDrag();
}
}
}
}
}
if((document.F_loaded)&&(d.type=="img"))
theTarget = F_clickedOnImage(window.NOFevent.pageX,window.NOFevent.pageY , d).styleID;
F_sndMsg(theTarget, theEvent, '');
NOF_event = oldNOF_event;
return true;
}
if(theEvent == F_MV) {
if (document.F_loaded) {
var c = true;
var d = document.objectModel[theTarget];
if (typeof d.actions!="undefined") {
var A = d.actions['Clicked'];
if (typeof A!="undefined") {
for( var i = 0; i < (A.length - 3); i = i + 4) {
if(A[i+1]=="Go To")
c= false;
}
}
}
if(c) {
window.status="";
F_sndMsg(theTarget, theEvent, '');
NOF_event = oldNOF_event;
return(true)
}
}
}
if(theEvent == F_HR) {
F_sndMsg(theTarget, F_CL, '')
NOF_event = oldNOF_event;
return(void(0));
}
F_sndMsg(theTarget, theEvent, '');
if((typeof document.objectModel != "undefined") && (typeof document.objectModel[theTarget] != "undefined") &&
(document.objectModel[theTarget].formObj)) return true;
NOF_event = oldNOF_event;
return false;
NOF_event = oldNOF_event;
}
function F_c() {
window.status="";
}
function F_n(theTarget, theURL) {
if(document.F_loaded) {
F_sndMsg(theTarget, 'Go To', theURL);
}
return false;
}
function F_sndMsg(theTarget, theEvent, theParm) {
sendMsg(theTarget, theEvent, theParm, null, false);
}
function F_s(p,l,t,i,v,c) {
return("position: " + p + "; left:" + l + "; top:" + t + "; z-index: " + i + "; visibility: " + v + "; clip: rect(" + c + ")");
}
var F_A = "Abort";
var F_B = "Blur";
var F_CH = "Change";
var F_CL = "Clicked";
var F_DB = "Double Clicked";
var F_E = "Error";
var F_F = "Focus";
var F_L = "Loaded";
var F_MT = "Mouse Out";
var F_MV = "Mouse Over";
var F_MU = "Mouse Up";
var F_MD = "Mouse Down";
var F_R = "Reset";
var F_SE = "Select";
var F_SU = "Submit";
var F_U = "Unload";
var F_HR = "Map";
function F_Parm() {
var ob = new Object();
ob[0] = "parm";
for(var i=0; i < arguments.length; i = i + 2)
ob[arguments[i]] = arguments[i+1];
ob.getParm = F_getParm2;
return(ob);
}
function F_getParm2(theParamter, theDefault) {
return(typeof(this[theParamter]) != "undefined"?this[theParamter]:theDefault);
}
function F_Exp(t) {
var ob = new Object();
ob[0] = "exp";
ob[1] = t;
ob.getParm=F_getParm2;
return(ob);
}
function F_Action(theTargetName, msgText, msgData, theCascade) {
var P = msgData;
if(typeof P == "object") {
if (P[0] == "msg") {
P = sendMsg(P[1], P[2], P[3], null);
}
if (P[0] == "exp") {
var func = new Function("return("+P[1]+")");
NOFparameters = F_paramObject(msg, top.F_curObj);
params = NOFparameters;
var P = func();
if(typeof P == "undefined") P = new Object();
if((typeof P == "object")&&(P != null)) P.getParm=F_getParm2;
}
}
var t = sendMsg(theTargetName, msgText, P, null, theCascade);
return(t);
}
function F_Msg(a, b, c) {
var ob = new Array();
ob[0] = "msg";
ob[1] = a;
ob[2] = b;
ob[3] = c;
return(ob);
}
function F_OM(objectID, theLayerID, theType, theParent) {
var parms = arguments.length;
var theHandler = (parms<5) ? null : arguments[4];
var formName = (parms<6) ? "" : arguments[5];
var isRelative = (parms<7) ? false : arguments[6];
var objectName = (parms<8) ? false : arguments[7];
var theValue = (parms<9) ? null : arguments[8];
if(typeof document.objectModel[objectID] != "undefined")
F_debug("Duplicate Object ID: " + objectID);
document.objectModel[objectID] = new document.main.cObject(theLayerID, theType, theParent, theHandler, isRelative, objectID, formName, objectName, theValue);
}
function F_OM_Map(objectID, theMapType, theParent, theHandler) {
F_OM(objectID, "", "map", theParent, theHandler);
document.objectModel[objectID].maptype = theMapType;
if(theMapType == "rect") {
document.objectModel[objectID].map = new F_cRect(arguments[4], arguments[5], arguments[6], arguments[7]);
}
if(theMapType == "circ") {
document.objectModel[objectID].map = new Object();
document.objectModel[objectID].map.x = arguments[4];
document.objectModel[objectID].map.y = arguments[5];
document.objectModel[objectID].map.radius = arguments[6];
}
if(theMapType == "poly") {
document.objectModel[objectID].map = new Array(0);
var index = 0;
for(var i=4; i < arguments.length; i = i + 2)
document.objectModel[objectID].map[index++] = new F_cPoint(arguments[i], arguments[i+1]);
}
}
var F_commandObjects = new Array();
var F_commandCommands = new Array();
var F_commandExpression = new Array();
var F_commandType = new Array();
function F_addCommand (theObject, theCommand, theExpression) {
F_commandObjects[F_commandObjects.length] = theObject;
F_commandCommands[F_commandCommands.length] = theCommand;
F_commandExpression[F_commandExpression.length] = theExpression;
F_commandType[F_commandType.length] = "obj";
}
function F_addCommandForID (theID, theCommand, theFunction) {
F_commandObjects[F_commandObjects.length] = theID;
F_commandCommands[F_commandCommands.length] = theCommand;
F_commandExpression[F_commandExpression.length] = theFunction;
F_commandType[F_commandType.length] = "id";
}
function F_addCommandCallback () {
for(var j=0; j < F_commandObjects.length; j++) {
var cmd = F_commandCommands[j];
var exp = F_commandExpression[j];
var obj = F_commandObjects[j];
if(F_commandType[j] == "obj") {
var a = obj.split(",");
for(var i=0; i < a.length; i++) {
if( typeof document.main.commands[a[i]] != "undefined")
document.main.commands[a[i]][cmd] = exp;
if(a[i] == "vis") {
var b = new Array ("img","txt","lyr","nav","tbl","jbn");
for (var k = 0; k < b.length; k++) {
document.main.commands[b[k]][cmd] = exp;
}
}
}
} else {
if(typeof document.objectModel[obj].actions=="undefined") document.objectModel[obj].actions = new Object();
var act = document.objectModel[obj].actions;
if(typeof act[cmd]=="undefined") act[cmd] = new Array();
act[cmd] = act[cmd].concat([exp,'','',0]);
}
}
}
function F_getFrameRef() {
var t = '';
var f = self;
while(f!=top) {
t=".frames['"+f.name+"']"+t;
f = f.parent;
}
t="top"+t;
return(t);
}
function F_setTimeout(timeoutTest, textRef, functionName, theDelay) {
if( F_NN || !F_MAC ) {
if( top.setTimeout ) {
var r = top.setTimeout(timeoutTest+'?'+textRef + '.' + functionName+':null;', theDelay);
}
} else {
var r = setTimeout(textRef + '.' + functionName, theDelay);
}
return(r);
}
function F_setInterval(timeoutTest, textRef, functionName, theDelay) {
if(F_NN || !F_MAC) {
if(top.setTimeout) {
var r = top.setInterval(timeoutTest+'?'+textRef + '.' + functionName+':null;', theDelay);
}
} else {
var r = setInterval(textRef + '.' + functionName, theDelay);
}
return(r);
}
function F_onLoaded(){
window.F_doLoaded = F_doLoaded;
if(parent!=self) {
if((F_NN || !F_MAC)) {
return(top.setTimeout(F_getFrameRef() + '.F_doLoaded();', 100));
} else {
return(setTimeout('window.F_doLoaded();', 100));
}
} else {
return(setTimeout( 'window.F_doLoaded();', 100));
}
}
function F_startAnimation(parm) {
var animationName = '';
if(typeof(parm) == 'string')
animationName = parm;
else
animationName = parm['animationName'];
if(animationName != '')
{
var backward = parm['backward'];
if (backward == 'true')
$.TimelinesManager.ffwdAnimationFrameAndPlayBackward(animationName, parm);
else
$.TimelinesManager.startAnimation(animationName, parm);
}
}
function F_pauseAnimation(parm) {
var animationName = '';
if(typeof(parm) == 'string')
animationName = parm;
else
animationName = parm['animationName'];
if(animationName != '')
$.TimelinesManager.pauseAnimation(animationName);
}
function F_stopAnimation(parm) {
var animationName = '';
if(typeof(parm) == 'string')
animationName = parm;
else
animationName = parm['animationName'];
if(animationName != '')
$.TimelinesManager.stopAnimation(animationName);
}
function F_cancelAnimation(parm)
{
var animationName = '';
if(typeof(parm) == 'string')
animationName = parm;
else
animationName = parm['animationName'];
if(animationName != '')
$.TimelinesManager.cancelAnimation(animationName);
}
function F_gotoAnimation(parm) {
var animationName = '';
var frame = 1;
if(typeof(parm) == 'string')
animationName = parm;
else
{
animationName = parm['animationName'];
frame = parm['frameStep'];
}
if(animationName != '')
{
var backward = parm['backward'];
if (backward == 'true')
$.TimelinesManager.ffwdAnimationFrameAndPlayBackward(animationName, parm);
else
$.TimelinesManager.ffwdAnimationFrameAndPlay(animationName, parm);
}
}
function F_playFlashAction(param) {
var actionName = '';
if(typeof(param) == 'string')
actionName = param;
else
actionName = param['functionParams'];
flashComponentsColl.getMovieById(this.name).callFlashMethod(actionName,"");
}
function F_flashPause(param) {
flashComponentsColl.getMovieById(this.name).callFlashMethod("flashPause","");
}
function F_flashPlay(param) {
flashComponentsColl.getMovieById(this.name).callFlashMethod("flashPlay","");
}
function F_flashStop(param) {
flashComponentsColl.getMovieById(this.name).callFlashMethod("flashStop","");
}
function PlayAction(objectId, params) {
if (typeof(document.objectModel[objectId]) == "undefined") {
for (var key in document.objectModel) {
var o = document.objectModel[key];
if (o.styleDiv.id == objectId) {
objectId = o.styleID;
break;
}
}
}
var functionName = '';
if(typeof(params) == 'string')
functionName = params;
else
functionName = params['functionName'];
F_sendMessage(objectId, functionName, params, null, 0);
}
document.F_debugEnabled = false;
function F_debug(m) {
if(document.F_debugEnabled){
F_barError = '**** ERROR **** ' + m
window.status = F_barError;
window.defaultStatus = F_barError;
}
}

