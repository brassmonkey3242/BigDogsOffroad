function F_cFly(theObject, theParm) {
this.type = "move";
this.object = theObject;
this.controller = new F_cEffectController(theObject, theParm);
if(F_NN && (theObject.parent != null)) {
var topOffset = theObject.getTop('absolute') - (theObject.parent.getTop('absolute') + theObject.parent.getClipTop());
var leftOffset = theObject.getLeft('absolute') - (theObject.parent.getLeft('absolute') + theObject.parent.getClipLeft());
var bottomOffset = theObject.parent.getClipHeight() - topOffset;
var rightOffset = theObject.parent.getClipWidth() - leftOffset;
} else {
var topOffset = theObject.getTop('absolute') - theObject.getPageYOffset();
var leftOffset = theObject.getLeft('absolute') - theObject.getPageXOffset();
var bottomOffset = theObject.getWindowInnerHeight() - topOffset;
var rightOffset = theObject.getWindowInnerWidth() - leftOffset;
}
var clipX = theObject.getClipWidth();
var clipY = theObject.getClipHeight();
var d = this.controller.theDirection;
if((d == 0) || (d > 270))
{
var p = F_calcDirection(d, leftOffset + clipX, topOffset + clipY);
}
else
{
if(d <= 90)
{
var p = F_calcDirection(d, rightOffset, topOffset + clipY);
}
else
{
if(d <= 180)
{
var p = F_calcDirection(d, rightOffset, bottomOffset);
}
else
{
if(d <= 270)
{
var p = F_calcDirection(d, leftOffset + clipX, bottomOffset);
}
}
}
}
this.controller.setDestination(p.x, -p.y, 0, 0, 0, 0);
}
F_cFly.prototype = new F_effectPrototype;
function F_cMoveBy(theObject, theParm) {
this.type = "move";
this.object = theObject;
this.controller = new F_cEffectController(theObject, theParm);
this.controller.showHide = "";
this.controller.resetPosition = false;
var x = theParm.getParm( "x", 0);
var y = theParm.getParm( "y", 0);
this.controller.setDestination(x, y, 0, 0, 0, 0);
}
F_cMoveBy.prototype = new F_effectPrototype;
function F_cMoveTo(theObject, theParm) {
this.type = "move";
this.object = theObject;
this.controller = new F_cEffectController(theObject, theParm);
this.controller.showHide = "";
this.controller.resetPosition = false;
if(theParm == "Saved Position") {
var x = theObject.savedPosition.x - theObject.getLeft('style');
var y = theObject.savedPosition.y - theObject.getTop('style');
} else {
var x = theParm.getParm( "x", 0) - theObject.getLeft('absolute');
var y = theParm.getParm( "y", 0) - theObject.getTop('absolute');
}
this.controller.setDestination(x, y, 0, 0, 0, 0);
}
F_cMoveTo.prototype = new F_effectPrototype;
function F_cPeek(theObject, theParm) {
this.type = "transition";
this.object = theObject;
this.controller = new F_cEffectController(theObject, theParm);
var width = theObject.getClipWidth();
var height = theObject.getClipHeight();
var p = F_calcDirection(this.controller.theDirection, width, height);
var t = new cEffectParms(0,0,0,0,0,0);
t.x = p.x;
t.y = -p.y;
F_calculateClip(this.controller.theDirection, t, p);
this.controller.setDestination(t.x, t.y, t.top, t.right, t.right, t.left);
}
F_cPeek.prototype = new F_effectPrototype;
function F_cWipe(theObject, theParm) {
this.type = "transition";
this.object = theObject;
this.controller = new F_cEffectController(theObject, theParm);
this.controller.theDirection = (180+this.controller.theDirection)%360;
var width = theObject.getClipWidth();
var height = theObject.getClipHeight();
var p = F_calcDirection(this.controller.theDirection, width, height);
var t = new cEffectParms(0,0,0,0,0,0);
F_calculateClip(this.controller.theDirection, t, p);
this.controller.setDestination(t.x, t.y, t.top, t.right, t.bottom, t.left);
}
F_cWipe.prototype = new F_effectPrototype;
function F_cIris(theObject, theParm) {
this.type = "transition";
this.object = theObject;
this.controller = new F_cEffectController(theObject, theParm);
var width = Math.ceil(theObject.getClipWidth()/2);
var height = Math.ceil(theObject.getClipHeight()/2);
this.controller.setDestination(0, 0, height, -width, -height, width);
}
F_cIris.prototype = new F_effectPrototype;
function F_effectPrototype() {
this.interupt = F_effectInterupt;
this.start = F_effectStart;
this.finish = F_effectFinish;
this.stop = F_effectStop;
this.restart = F_effectRestart;
this.service = F_service;
}
function F_service() {
return(this.controller.effectService(new Date()));
}
function F_effectStart() {
this.object.setClosing();
if(!document.main.closing)
sendMsg(this.object.styleID, (this.type == "move" ? 'Motion Started ': 'Transition Started'), '', this);
this.controller.effectService("start");
this.service();
}
function F_effectFinish() {
this.controller.effectService("finish");
if(!document.main.closing) {
sendMsg(this.object.styleID, (this.type == "move"? 'Motion Ended' : 'Transition Ended'), '', this);
if(this.controller.message!="")
sendMsg(this.object.styleID, this.controller.message, '', this);
}
this.object.checkHandler();
this.object.resetClosing();
}
function F_effectInterupt(){
if(document.main.closing)
return(false);
clearTimeout(this.timer);
this.controller.effectService("finish");
return(true);
}
function F_effectStop(){
clearTimeout(this.timer);
return(true);
}
function F_effectRestart(){
this.timer = setTimeout( this.object.textRef + '.serviceEffect("' + this.type + '");', this.controller.rate);
return(true);
}
function F_cEffectController (theObject, theParm){
this.object = theObject;
if(typeof(theParm) == "string") {
this.duration = 10;
this.inDuration = 2;
this.outDuration = 2;
this.rate = 10;
this.repeat = 1;
this.reverse = true;
this.theDirection = (F_getDirection (theParm) % 360);
this.showHide = F_hideShow (theParm);
this.message = "";
}
else if (typeof(theParm['functionParams']) == "string")
{
param = theParm['functionParams'];
this.duration = 10;
this.inDuration = 2;
this.outDuration = 2;
this.rate = 10;
this.repeat = 1;
this.reverse = true;
this.theDirection = (F_getDirection (param) % 360);
this.showHide = F_hideShow (param);
this.message = "";
}
else {
this.duration = theParm.getParm( "duration", 10);
this.inDuration = theParm.getParm( "inDuration", 2);
this.outDuration = theParm.getParm( "outDuration", 2);
if(this.duration == 0) this.duration = 1;
if(this.inDuration >= this.duration) {
this.inDuration = this.duration-1;
this.outDuration = 0;
} else {
if((this.inDuration + this.outDuration) >= this.duration) {
this.outDuration = this.duration - this.inDuration - 1;
}
}
this.rate = theParm.getParm( "rate", 10);
this.repeat = theParm.getParm( "repeat", 1);
this.reverse = (theParm.getParm( "reverse", false));
this.theDirection = theParm.getParm( "direction", 90) % 360;
this.showHide = theParm.getParm( "hide", "show").toLowerCase();
this.message = theParm.getParm( "message", "");
}
this.resetPosition = true;
this.I = 2 * this.inDuration / Math.PI;
this.O = 2 * this.outDuration / Math.PI;
this.Mid = this.duration - this.inDuration - this.outDuration;
this.factor = 1/(this.Mid + this.I + this.O);
this.midTest = this.inDuration + this.Mid;
this.inRad = Math.PI / (2 * this.inDuration);
this.outRad = Math.PI / (2 * this.outDuration);
this.flipped = false;
this.offset = new cEffectParms(0,0,0,0,0,0);
this.effectSetTime();
}
function cEffectParms(x, y, top, right, bottom, left) {
this.x = Math.floor(x);
this.y = Math.floor(y);
this.top = Math.floor(top);
this.right = Math.floor(right);
this.bottom = Math.floor(bottom);
this.left = Math.floor(left);
}
F_prototypeF("F_cEffectController.prototype.",
"effectGetFactor",
"effectService",
"setDestination",
"doEffect",
"effectSetTime" );
function F_effectService(theTime) {
var d = this.object;
if(theTime == "start")
{
if (this.showHide != "")
this.object.setVisibility("inherit");
return(true);
}
if(theTime == "finish")
{
if ((this.showHide == "hide") && !this.flipped)
d.setVisibility("hidden");
this.flipped=false;
if (this.resetPosition)
this.doEffect(0);
return(false);
}
var theRatio = this.effectGetFactor(theTime);
if ( this.showHide == "show" )
theRatio = 1 - theRatio;
if (this.flipped)
theRatio = 1 - theRatio;
this.doEffect(theRatio);
if(theTime.getTime() > this.endTime) {
if(--this.repeat > 0) {
if(this.reverse) {
this.flipped = !this.flipped;
}
this.effectSetTime();
} else {
return(false);
}
}
if (d.moveCollision != null) F_checkCollision(d, "move");
return(true);
}
function F_doEffect(theRatio) {
var d = this.object;
with(this.dest) {
var newOffset = new cEffectParms(
Math.ceil(x * theRatio),
Math.ceil(y * theRatio),
Math.ceil(top * theRatio),
Math.ceil(right * theRatio),
Math.ceil(bottom * theRatio),
Math.ceil(left * theRatio));
}
var a = ( parseInt( newOffset.x ) - parseInt( this.offset.x) );
var b = ( parseInt( newOffset.y ) - parseInt( this.offset.y ) );
if((a != 0) || (b != 0)) {
d.offset(a, b);
}
with(d.style) {
if( ( navigator.appName=='Netscape' ) && ( parseInt( navigator.appVersion ) < 5 ) ) {
clip.top = clip.top + (newOffset.top - this.offset.top);
clip.right = clip.right + (newOffset.right - this.offset.right);
clip.bottom = clip.bottom + (newOffset.bottom - this.offset.bottom);
clip.left = clip.left + (newOffset.left- this.offset.left);
} else {
with(d) {
this.object.setClipRect(new F_cRect(
getClipLeft() + ( parseInt( newOffset.left ) - this.offset.left ),
getClipTop() + ( parseInt( newOffset.top ) - this.offset.top ),
getClipRight() + ( parseInt( newOffset.right ) - this.offset.right ),
getClipBottom() + ( parseInt( newOffset.bottom ) - this.offset.bottom )
));
}
}
}
this.offset = newOffset;
}
function F_effectGetFactor(theTime) {
with(this) {
var time = (theTime.getTime() - this.startTime)/(100)
if ( time < inDuration ) {
return((I - (Math.cos(time *inRad) * I)) * factor);
}
else {
if ( time <= midTest) {
return((time - inDuration + I) * factor);
}
else {
if ( time >= duration ) return(1);
return(((Math.sin((time - inDuration - Mid) * outRad) * O) + I + Mid) * factor);
}
}
}
}
function F_setDestination(x, y, top, right, bottom, left) {
this.dest = new cEffectParms(x, y, top, right, bottom, left);
}
function F_effectSetTime() {
this.startTime = (new Date()).getTime();
this.endTime = this.startTime + (this.duration*100);
}
function F_serviceEffect(theType) {
var theEffect = this[theType];
if(theEffect != null) {
if(theEffect.service())
theEffect.timer = F_setTimeout(this.timeoutTest, this.textRef, 'serviceEffect("' + theEffect.type + '")', theEffect.controller.rate);
else
this.endEffect(theType);
}
}
function F_startEffect(theEffect, theParm) {
var t = new theEffect(this, theParm);
if(this[t.type] != null) {
if(!this[t.type].interupt())
return(false);
}
this[t.type] = t;
this[t.type].start();
this[t.type].timer = F_setTimeout(this.timeoutTest, this.textRef, 'serviceEffect("' + this[t.type].type + '")', this[t.type].controller.rate);
return(true);
}
function F_endEffect(theType) {
var t = this[theType];
this[theType] = null;
t.finish();
}
F_prototype("F_cObject.prototype.",
"serviceEffect", "F_serviceEffect",
"endEffect", "F_endEffect",
"startEffect", "F_startEffect");
function F_calcDirection(theDirection, theWidth, theHeight)
{
theDirection = theDirection % 360;
theRadians = theDirection * (Math.PI/180);
if ((theDirection % 90) == 0)
{
xMove = 0;
yMove = 0;
if(theDirection == 0) yMove = theHeight;
if(theDirection == 90) xMove = theWidth;
if(theDirection == 180) yMove = -theHeight;
if(theDirection == 270) xMove = -theWidth;
}
else
{
xMove = theWidth;
yMove = theWidth / Math.tan(theRadians);
if(theDirection >=180)
{
yMove = -yMove;
xMove = -xMove;
}
if (Math.abs(yMove) > theHeight)
{
yMove = theHeight;
xMove = theHeight * Math.tan(theRadians);
if((theDirection > 90) && (theDirection < 270))
{
yMove = -yMove;
xMove = -xMove;
}
}
}
return(new F_cPoint(xMove, yMove));
}
function F_calculateClip(theDirection, clip, point) {
if((theDirection == 0) || (theDirection > 270)){
clip.left = -point.x;
clip.top = point.y;
}
else
if(theDirection <= 90) {
clip.right = -point.x;
clip.top = point.y;
}
else
if(theDirection <= 180) {
clip.right = -point.x;
clip.bottom = point.y;
}
else
if(theDirection <= 270) {
clip.left = -point.x;
clip.bottom = point.y;
}
}
function F_hideShow (theString) {
if (theString.substring(0,2) == "In") return("show");
if (theString.substring(0,3) == "Out") return("hide");
return("");
}
function F_getDirection (theString) {
var t = theString;
if (t.indexOf("Top Right") != -1) return (45);
if (t.indexOf("Top Left") != -1) return (315);
if (t.indexOf("Bottom Right") != -1) return (135);
if (t.indexOf("Bottom Left") != -1) return (225);
if (t.indexOf("Top") != -1) return (0);
if (t.indexOf("Bottom") != -1) return (180);
if (t.indexOf("Right") != -1) return (90);
if (t.indexOf("Left") != -1) return (270);
return(0)
}
function F_clearCollision () {
this.dragCollision = null;
this.dropCollision = null;
this.moveCollision = null;
}
function F_addCollision (theParm) {
var o = theParm.getParm( "objectID", null);
if(document.objectModel[o]) {
var t = theParm.getParm( "when", "drop") + "Collision";
if(this[t] == null)
this[t] = new Array(0);
this[t][this[t].length] = new F_cCollision(
o,
theParm.getParm( "message", "collision"),
theParm.getParm( "type", "intersection"));
}
}
function F_cCollision(detectID, message, type) {
this.detectID = detectID;
this.message = message;
this.type = type;
this.tripped = false;
this.testCollision = F_testCollision;
}
function F_resetCollision(dragObj) {
with(dragObj) {
if(dragCollision!=null)
for ( var i = 0; i < dragCollision.length; i++)
dragCollision[i].tripped = false;
if(dropCollision!=null)
for ( var i = 0; i < dropCollision.length; i++)
dropCollision[i].tripped = false;
if(moveCollision!=null)
for ( var i = 0; i < moveCollision.length; i++)
moveCollision[i].tripped = false;
}
}
function F_checkCollision(dragObj, theWhen) {
var c = dragObj[theWhen + "Collision"];
var o = false;
for ( var i = 0; i < c.length; i++) {
var o = false;
var d = c[i];
var obj = document.objectModel[d.detectID];
if ((d.type == "intersection") && F_testCollision(dragObj, obj, "int"))
o = true;
if ((d.type == "not intersection") && !F_testCollision(dragObj, obj, "int"))
o = true;
if ((d.type == "contained by") && F_testCollision(dragObj, obj, "cont"))
o = true;
if ((d.type == "not contained by") && !F_testCollision(dragObj, obj, "cont"))
o = true;
if ((d.type == "contains") && F_testCollision(obj, dragObj, "cont"))
o = true;
if ((d.type == "not contains") && !F_testCollision(obj, dragObj, "cont"))
o = true;
if ((d.type == "mouse inside") && F_pointInObject(obj, window.NOFevent.pageX, window.NOFevent.pageY))
o = true;
if ((d.type == "mouse not inside") && !F_pointInObject(obj, window.NOFevent.pageX, window.NOFevent.pageY))
o = true;
if(o) {
if (d.tripped==false) {
sendMsg(dragObj.styleID, d.message, d.detectID, dragObj.styleID);
d.tripped = true;
}
}
else
d.tripped = false;
}
}
function F_testCollision(obj1, obj2, test) {
with(obj1) {
var x = getLeft('absolute');
var y = getTop('absolute');
var l1 = x + getClipLeft();
var t1 = y + getClipTop();
var r1 = x + getClipRight();
var b1 = y + getClipBottom();
}
with(obj2) {
var x = getLeft('absolute');
var y = getTop('absolute');
var l2 = x + getClipLeft();
var t2 = y + getClipTop();
var r2 = x + getClipRight();
var b2 = y + getClipBottom();
}
if (test== "int")
if((l1 >= l2 && l1 <= r2) || (r1 >= l2 && r1 <= r2) || (l1 < l2 && r1 > r2))
if((t1 >= t2 && t1 <= b2) || (b1 >= t2 && b1 <= b2) || (t1 < t2 && b1 > b2))
return(true);
if (test== "cont")
if((l1 >= l2) && (r1 <= r2))
if((t1 >= t2) && (b1 <= b2))
return(true);
return(false);
}
function F_setDrag(theParm) {
with(document) {
if(F_dragLayer == null)
F_dragLayer = new Array;
var index = -1;
for(var i=(F_dragLayer.length-1);i>-1;i--)
if(F_dragLayer[i].layer == this)
index = i;
if(index != -1)
F_dragLayer[index] = {layer:this,type:theParm};
else
F_dragLayer[F_dragLayer.length] = {layer:this,type:theParm};
F_resetCollision(this);
if(navigator.appName=='Netscape') {
document.captureEvents(Event.MOUSEMOVE);
this.oldx = window.NOFevent.pageX;
this.oldy = window.NOFevent.pageY;
} else {
document.onmousemove = F_ie_mouseMove;
this.oldx = window.NOFevent.pageX;
this.oldy = window.NOFevent.pageY;
}
this.fastDrag=false;
if(this.actions) {
this.sendBeginDrag = (this.actions['Drag Started'] != null);
this.fastDrag=((!this.sendBeginDrag)&&(this.dragBoundries=="none")&&(this.actions['Dragged'] == null)&&(this.dragCollision == null));
}
}
}
function F_drag (x, y) {
if(document.F_dragLayer != null) {
for (var i = (document.F_dragLayer.length-1); i > -1; i--) {
var dObj = document.F_dragLayer[i];
var d = dObj.layer;
if(d.sendBeginDrag) {
sendMsg(d.styleID, 'Drag Started', '', null);
d.sendBeginDrag = false;
}
if (typeof d.oldx == "undefined"){
d.oldx = x;
d.oldy = y;
}
var xMove = d.oldx - x;
var yMove = d.oldy - y;
if((d.parent!= null) && (d.dragBoundries=="to container object")) {
if( (d.getLeft('absolute') + d.getClipLeft() - d.parent.getClipLeft() - d.parent.getLeft('absolute') - xMove) < 0 )
xMove = d.getLeft('absolute')+ d.getClipLeft() - d.parent.getClipLeft() - d.parent.getLeft('absolute');
if( (d.getLeft('absolute')+ d.getClipRight() - xMove) > (d.parent.getClipRight() + d.parent.getLeft('absolute')) )
xMove = d.getLeft('absolute')+ d.getClipRight() - (d.parent.getClipRight() + d.parent.getLeft('absolute'));
if( (d.getTop('absolute')+ d.getClipBottom() - yMove) > (d.parent.getClipBottom() + d.parent.getTop('absolute')) )
yMove = d.getTop('absolute')+ d.getClipBottom() - d.parent.getClipBottom() - d.parent.getTop('absolute');
if( (d.getTop('absolute')+ d.getClipTop() - d.parent.getClipTop() - d.parent.getTop('absolute') - yMove) < 0 )
yMove = d.getTop('absolute')+ d.getClipTop() - d.parent.getClipTop() - d.parent.getTop('absolute');
}
d.oldx = d.oldx - xMove ;
d.oldy = d.oldy - yMove;
d.offset (-xMove, -yMove);
if(d.actions['Dragged'] != null)
sendMsg(d.styleID, 'Dragged', '', null);
if (d.dragCollision != null)
F_checkCollision(d, "drag");
}
}
}
function F_endDrag () {
if(document.F_dragLayer) {
sendMsg(this.styleID, 'Drag Ended', '', null);
if (this.dropCollision != null) F_checkCollision(this, "drop");
var d = new Array(0);
for(var i=0;i<document.F_dragLayer.length;i++) {
if(document.F_dragLayer[i].layer != this)
d[d.length] = document.F_dragLayer[i];
}
if(d.length>0) {
document.F_dragLayer = d;
} else {
document.F_dragLayer = null;
if(navigator.appName=='Netscape') {
document.releaseEvents (Event.MOUSEMOVE);
} else {
document.onmousemove = null;
window.event.returnValue = false
window.event.cancelBubble = true
}
}
}
}
F_prototype("F_cObject.prototype.",
"addCollision", "F_addCollision",
"clearCollision", "F_clearCollision",
"setDrag", "F_setDrag",
"endDrag", "F_endDrag");
if(navigator.appName=='Netscape')
{
}else{
}
function F_setSrc(theParm) {
if(typeof this.objRef != "undefined") {
this.objRef.src=theParm;
}
}
function F_setLowsrc(theParm) {
if(typeof this.objRef != "undefined") {
this.objRef.src=theParm;
}
}
function F_setImage(theParm) {
var a = ["Image 1 (Normal)","Image 2 (Highlighted)","Image 3 (Depressed)","Image 4 (Selected)","Image 5","Image 6","Image 7","Image 8","Image 9","Image 10"];
if (typeof theParm != "object") return(false);
for ( var i=0; i< a.length; i++ ) {
var b = theParm.getParm( a[i], "");
if(b!="") {
this.images[a[i]] = new Object();
this.images[a[i]].image = new Image();
if(!F_NN) this.images[a[i]].image.src = b;
this.images[a[i]].source = b;
this.images[a[i]].complete = false;
}
}
if(F_NN) {
this.setImageLoad();
}
return(true);
}
function F_setImageLoad(p) {
if(p) {
this.images[p].complete = true;
}
for ( var i in this.images ) {
with(this.images[i]) {
if(!complete) {
image.src = source;
image.onLoad = new Function(this.textRef+".setImageLoad('"+i+"')");
break;
} else {
if(typeof image != "undefined") {
image.onLoad = null;
}
}
}
}
}
function F_setImageExpression() {
var a = ["Image 1 (Normal)","Image 2 (Highlighted)","Image 3 (Depressed)","Image 4 (Selected)","Image 5","Image 6","Image 7","Image 8","Image 9","Image 10"];
var o = new Object();
for ( var i=0; i< a.length; i++ ) {
if(F_setImageExpression.arguments.length > i)
{
o[a[i]] = F_setImageExpression.arguments[i];
}
}
return(o);
}
function F_useImage(theName) {
var t = theName;
if(typeof this.objRef != "undefined")
if((typeof this.images[t]!="undefined") && (this.images[t]!=null))
this.objRef.src=this.images[t].source;
}
function F_IEsound(command) {
if ( !(!F_NN && F_MAC) ) {
if (command == "play")
if(this.objRef.run) this.objRef.run();
if (command == "stop")
if(this.objRef.stop) this.objRef.stop();
if (command == "pause")
if(this.objRef.pause) this.objRef.pause();
}
}
function F_windowUtil(f, theParm) {
if(typeof theParm == "object") {
var theLeft = parseInt(theParm.getParm( "left", 0));
var theTop = parseInt(theParm.getParm( "top", 0));
var theWidth = parseInt(theParm.getParm( "width", 0));
var theHeight = parseInt(theParm.getParm( "height", 0));
}
if (f=="open") {
var n = theParm.getParm( "name", "myWindow").replace(/\W/gi,"");
var p = "width="+theParm.getParm( "width", "")+
",height="+theParm.getParm( "height", "")+
",top="+theParm.getParm( "top", "")+
",left="+theParm.getParm( "left", "")+
",toolbar="+theParm.getParm( "toolbar", "")+
",location="+theParm.getParm( "location", "") +
",menubar="+theParm.getParm( "menubar", "")+
",status="+theParm.getParm( "status", "")+
",resizable="+theParm.getParm( "resizable", "")+
",directories="+theParm.getParm( "directories", "")+
",scrollbars="+theParm.getParm("scrollbars", "");
var w = (window.open(theParm.getParm( "URL", ""), n, p))
document.F_windows[n] = w;
if(F_NN) w.focus();
return(w);
}
if (f=="prompt")
return(window.prompt(theParm.getParm( "message", ""), theParm.getParm("defaultValue", "")));
if (f=="set status") {
if ( document.all ) {
window.defaultStatus = theParm
windowStatus = theParm;
return false;
}
window.status=theParm;
return(false);
}
if (f=="move to")
window.moveTo(theLeft, theTop);
if (f=="move by")
window.moveBy(theLeft, theTop);
if (f=="resize to") {
if(navigator.appName=='Netscape')
top.resizeTo(theWidth, theHeight);
else
top.resizeTo(theWidth, theHeight);
}
if (f=="resize by")
window.resizeBy(theWidth, theHeight);
if (f=="scroll to")
window.scrollTo(theLeft, theTop);
if (f=="scroll by")
window.scrollBy(theLeft, theTop);
if (f=="delayed action") {
var m = 'sendMsg("'+this.styleID+'", "'+theParm.getParm("action", "")+'")';
var d = theParm.getParm("delay", "60")*1000;
var test = "top.frames['"+self.name+"'].sendMsg";
if(theParm.getParm("continuous", false)) {
F_setInterval(this.timeoutTest, F_getFrameRef(), m, d);
} else {
F_setTimeout(this.timeoutTest, F_getFrameRef(), m, d);
}
}
if (f=="browser type") {
var ms = navigator.appVersion.indexOf("MSIE");
var nn = navigator.appName == "Netscape";
var ie4 = (ms>0) && (parseInt(navigator.appVersion.substring(ms+5, ms+6)) >= 4);
var nn4 = (nn) && (parseInt(navigator.appVersion.substring(0, 1)) >= 4);
var t = theParm;
if((t == "Is Navigator") && (nn4))
return(true);
if((t == "Is Internet Explorer") && (ie4))
return(true);
return(false);
}
if (f=="message to window") {
msg = new F_cMessage(theParm.getParm("message", ""), new F_Parm(),false, null);
var w = document.F_windows[theParm.getParm("window", "")];
if (typeof w == "undefined")
var w = window.open("",theParm.getParm("window", ""));
if(typeof w != "undefined")
if(typeof w.document != "undefined")
if(typeof w.document.objectModel != "undefined") {
var target = w.document.objectModel[theParm.getParm("object", "")];
if(typeof target != "undefined") {
return(msg.send(target));
}
}
}
return(null);
}
function F_commandsInit() {
for (var c in this.commands) {
this.commands[c].addCommands = F_addCommands;
this.commands[c].addCommands(c);
}
}
function F_addCommands(theType) {
if(theType == "vis") {
F_addCommandsLoop(this, new Array(
"Move To", "this.startEffect(F_cMoveTo, msg.data)",
"Move By", "this.startEffect(F_cMoveBy, msg.data)",
"Fly", "this.startEffect(F_cFly, msg.data)",
"Iris", "this.startEffect(F_cIris, msg.data)",
"Peek", "this.startEffect(F_cPeek, msg.data)",
"Wipe", "this.startEffect(F_cWipe, msg.data)",
"Hide", "this.hide()",
"Show", "this.show()",
"Toggle Visibility", "this.setVisibility('toggle')",
"Bring To Front", "this.bringToFront()",
"Send To Back", "this.sendToBack()",
"DataSourceNextPage", "this.datasourceNavigator('next', msg.data)",
"DataSourcePrevPage", "this.datasourceNavigator('prev', msg.data)",
"DataSourceLastPage", "this.datasourceNavigator('last', msg.data)",
"DataSourceFirstPage", "this.datasourceNavigator('first', msg.data)",
"DataSourceAddRecord", "this.gotoURL(msg.data)",
"DataSourceEditRecord", "this.gotoURL(msg.data)",
"DataSourceDeleteRecord", "this.datasourceDeleteRecord(msg.data)",
"DataSourceUpdateRecord", "this.datasourceUpdateRecord(msg.data)",
"DataSourceReloadData", "this.datasourceReloadData(msg.data)",
"Bring Forward", "this.shiftZindex1(1)",
"Send Backward", "this.shiftZindex1(-1)",
"Set Position", "this.setPosition(msg.data)",
"Get Position", "msg.returnValue = this.getPosition('absolute')",
"Get Z-Index", "msg.returnValue = this.getzIndex()",
"Set Z-Index", "msg.returnValue = this.setIndex(msg.data)",
"Save Position", "this.savedPosition=this.getPosition('style')",
"Restore Position", "this.restorePosition(this.savedPosition)",
"Set Left", "this.setLeft(msg.data)",
"Get Left", "msg.returnValue = this.getLeft('absolute')",
"Set Top", "this.setTop(msg.data)",
"Get Top", "msg.returnValue = this.getTop('absolute')",
"Set Clip Left", "this.setClipLeft(msg.data)",
"Set Clip Top", "this.setClipTop(msg.data)",
"Set Clip Right", "this.setClipRight(msg.data)",
"Set Clip Bottom", "this.setClipBottom(msg.data)",
"Get Clip Left", "msg.returnValue = this.getClipLeft()",
"Get Clip Top", "msg.returnValue = this.getClipTop()",
"Get Clip Right", "msg.returnValue = this.getClipRight()",
"Get Clip Bottom", "msg.returnValue = this.getClipBottom()",
"Start Drag", "this.setDrag(msg.data)",
"End Drag", "this.endDrag() ",
"Constrain Drag", "this.dragBoundries=msg.data",
"Set Collision Detection", "this.addCollision(msg.data)",
"Clear Collision Detection","this.clearCollision(msg.data)",
"Set Masking", "this.masked = eval(msg.data)",
"Get Masking", "msg.returnValue = this.masked",
"Set Filter", "this.style.filter=msg.data",
"Delay", "this.windowUtil('delayed action', msg.data)",
"Display File", "this.setSource(msg.data)",
"Display HTML", "this.writeSource(msg.data)",
"Set Draggable", "this.draggable = eval(msg.data)",
"StartAnimation", "this.startAnimation(msg.data)",
"PauseAnimation", "this.pauseAnimation(msg.data)",
"GotoAnimation", "this.gotoAnimation(msg.data)",
"StopAnimation", "this.stopAnimation(msg.data)",
"CancelAnimation", "this.cancelAnimation(msg.data)",
"Play Flash Action", "this.playFlashAction(msg.data)",
"flashPause", "this.flashPause(msg.data)",
"flashPlay", "this.flashPlay(msg.data)",
"flashStop", "this.flashStop(msg.data)",
"Get Draggable", "msg.returnValue = this.draggable" ));
}
if(theType == "img") {
F_addCommandsLoop(this, new Array(
"Set Src", "this.setSrc(msg.data)",
"Set Lowsrc", "this.setLowsrc(msg.data)",
"Set Image", "this.setImage(msg.data)",
"Use Image", "this.useImage(msg.data)"));
F_addCommands_method(this, "getObjectValue", "Src","Lowsrc");
F_addCommands_method(this, "setObjectValue");
this.addCommands("vis");
}
if(theType == "nav") {
this.addCommands("vis");
}
if(theType == "act") {
this.addCommands("vis");
}
if(theType == "vid") {
this.addCommands("vis");
}
if(theType == "shk") {
F_addCommandsLoop(this, new Array(
"Play", "this.objRef.Play()",
"Stop", "this.objRef.Stop()",
"Rewind", "this.objRef.Rewind()",
"Go To Frame", "this.objRef.GotoFrame(msg.data)"));
this.addCommands("vis");
}
if(theType == "jav") {
this.addCommands("vis");
}
if(theType == "jbn") {
this.addCommands("vis");
}
if(theType == "snd") {
if(navigator.appName=='Netscape') {
F_addCommandsLoop(this, new Array(
"Play", "this.objRef!=null?this.objRef.play(false):void(0)",
"Pause", "this.objRef!=null?this.objRef.pause():void(0)",
"Stop", "this.objRef!=null?this.objRef.stop():void(0)",
"Get Volume", "msg.returnValue = this.objRef.GetVolume()"));
} else {
F_addCommandsLoop(this, new Array(
"Play", "this.IEsound('play')",
"Pause", "this.IEsound('pause')",
"Stop", "this.IEsound('stop')"));
}
this.addCommands("vis");
}
if(theType == "txt") {
this.addCommands("vis");
F_addCommandsLoop(this, new Array(
"Set Font Weight", "this.style.fontWeight = msg.data",
"Set Font Size", "this.style.fontSize = msg.data"));
}
if(theType == "tbl") {
this.addCommands("vis");
}
if(theType == "tln") {
if(navigator.appName!='Netscape')
F_addCommandsLoop(this, new Array(
"Set Color", "this.style.color = msg.data",
"Set Font Size", "this.style.fontSize = msg.data"));
}
if(theType == "chk") {
F_addCommandsLoop(this, new Array(
"Check", "this.objRef.checked = true",
"Uncheck", "this.objRef.checked = false",
"Focus", "this.objRef.focus()",
"Blur", "this.objRef.blur()",
"Set Checked", "this.objRef.checked = msg.data",
"Alert If Not Checked", "if(!NOF_isRequired(this.objRef)){alert(msg.data)};this.objRef.focus()",
"StartAnimation", "this.startAnimation(msg.data)",
"PauseAnimation", "this.pauseAnimation(msg.data)",
"GotoAnimation", "this.gotoAnimation(msg.data)",
"StopAnimation", "this.stopAnimation(msg.data)",
"CancelAnimation", "this.cancelAnimation(msg.data)"
));
F_addCommands_method(this, "getObjectValue", "Checked");
this.addCommands("fob");
}
if(theType == "rad") {
F_addCommandsLoop(this, new Array(
"Select", "this.objRef.checked=true",
"Check", "this.objRef.checked = true",
"Uncheck", "this.objRef.checked = false",
"Focus", "this.objRef.focus()",
"Blur", "this.objRef.blur()",
"Set Checked", "this.objRef.checked = msg.data",
"Get Checked", "msg.returnValue = this.objRef.checked",
"Get Name", "msg.returnValue = this.objRef.name",
"Alert If Not Checked", "if(!NOF_isRequired(this.objRef)){alert(msg.data)};this.objRef.focus()",
"StartAnimation", "this.startAnimation(msg.data)",
"PauseAnimation", "this.pauseAnimation(msg.data)",
"GotoAnimation", "this.gotoAnimation(msg.data)",
"StopAnimation", "this.stopAnimation(msg.data)",
"CancelAnimation", "this.cancelAnimation(msg.data)"
));
this.addCommands("fob");
}
if(theType == "tfd") {
F_addCommandsLoop(this, new Array(
"Get Default Value", "msg.returnValue = this.objRef.defaultValue",
"Focus", "this.objRef.focus()",
"Blur", "this.objRef.blur()",
"Select", "this.objRef.select()",
"Set Value", "this.objRef.value = msg.data",
"Alert If Not Filled", "if(!NOF_isRequired(this.objRef)){alert(msg.data)};this.objRef.select()",
"Alert If Not E-MailAddress", "if(!NOF_isEmailAddress(this.objRef)){alert(msg.data)};this.objRef.focus();this.objRef.select()",
"Alert If Not WebDomain Name", "if(!NOF_isDomainName(this.objRef)){alert(msg.data)};this.objRef.focus();this.objRef.select()",
"Alert If Not Number", "if(!NOF_isNumber(this.objRef)){alert(msg.data)};this.objRef.focus();this.objRef.select();",
"Alert If Number Not In Range", "if(!inNrRange(this.objRef,msg.data.getParm( 'minVal', '')),msg.data.getParm( 'maxVal', ''))){alert(msg.data.getParm( 'message', ''))};this.objRef.focus();this.objRef.select();",
"Alert If String Length Not In Range", "if(!inCharLimit(this.objRef,msg.data.getParm( 'minVal', '')),msg.data.getParm( 'maxVal', ''))){alert(msg.data.getParm( 'message', ''))};this.objRef.focus();this.objRef.select();",
"Alert If Not Phone No.", "if(!isPhoneNo(this.objRef)){alert(msg.data)};this.objRef.focus();this.objRef.select();",
"Alert If Not CC No.", "if(!isValidCC(this.objRef,msg.data.getParm( 'CCType', '')))){alert(msg.data.getParm( 'message', ''))};this.objRef.focus();this.objRef.select();",
"Alert If Not Date", "if(!NOF_isValidDate(this.objRef)){alert(msg.data)};this.objRef.focus();this.objRef.select();",
"StartAnimation", "this.startAnimation(msg.data)",
"PauseAnimation", "this.pauseAnimation(msg.data)",
"GotoAnimation", "this.gotoAnimation(msg.data)",
"StopAnimation", "this.stopAnimation(msg.data)",
"CancelAnimation", "this.cancelAnimation(msg.data)"
));
F_addCommands_method(this, "getObjectValue", "Name", "Value");
this.addCommands("fob");
}
if(theType == "sel") {
F_addCommandsLoop(this, new Array(
"Get Selected Value", "msg.returnValue = this.objRef.options[this.objRef.selectedIndex].value",
"Get Selected Index", "msg.returnValue = this.objRef.selectedIndex",
"Get Selected Text", "msg.returnValue = this.objRef.options[this.objRef.selectedIndex].text",
"Select", "this.objRef.options[msg.data].selected = true",
"Restore Default Selection", "F_selectRestoreDefault(this)",
"Delete Option", "this.objRef.options[msg.data] = null",
"Add Option", "this.objRef.options[this.objRef.length] = new Option(msg.data.getParm( 'Option Name', ''),msg.data.getParm( 'Value', ''))",
"Focus", "this.objRef.focus()",
"Blur", "this.objRef.blur()",
"Alert If Not Selected", "if(!NOF_isRequired(this.objRef)){alert(msg.data)};this.objRef.focus()",
"DataSourceReloadData", "this.datasourceReloadData(msg.data)",
"StartAnimation", "this.startAnimation(msg.data)",
"PauseAnimation", "this.pauseAnimation(msg.data)",
"GotoAnimation", "this.gotoAnimation(msg.data)",
"StopAnimation", "this.stopAnimation(msg.data)",
"CancelAnimation", "this.cancelAnimation(msg.data)"
));
F_addCommands_method(this, "getObjectValue", "Name", "Length", "Options");
this.addCommands("fob");
}
if(theType == "btn") {
F_addCommandsLoop(this, new Array(
"Click", "this.objRef.click()",
"Focus", "this.objRef.focus()",
"Blur", "this.objRef.blur()",
"StartAnimation", "this.startAnimation(msg.data)",
"PauseAnimation", "this.pauseAnimation(msg.data)",
"GotoAnimation", "this.gotoAnimation(msg.data)",
"StopAnimation", "this.stopAnimation(msg.data)",
"CancelAnimation", "this.cancelAnimation(msg.data)"
));
F_addCommands_method(this, "getObjectValue", "Name", "Value");
this.addCommands("fob");
}
if(theType == "doc") {
F_addCommandsLoop(this, new Array(
"Set Active Link Color", "document.alinkColor=msg.data",
"Set Visited Link Color", "document.vlinkColor=msg.data",
"Set Link Color", "document.linkColor=msg.data",
"Go To", "this.gotoURL(msg.data)",
"Go To URL", "this.gotoURL(msg.data)",
"Get Location", "msg.returnValue = document.location",
"Set Background Color", "document.bgColor=msg.data"));
this.addCommands("vis");
this.addCommands("win");
}
if(theType == "win") {
F_addCommandsLoop(this, new Array(
"Set Status Bar", "msg.returnValue = this.windowUtil('set status', msg.data)",
"Open Window", "msg.returnValue = this.windowUtil('open', msg.data)",
"Resize To", "this.windowUtil('resize to', msg.data)",
"Resize By", "this.windowUtil('resize by', msg.data)",
"Reposition To", "this.windowUtil('move to', msg.data)",
"Reposition By", "this.windowUtil('move by', msg.data)",
"Scroll To", "this.windowUtil('scroll to', msg.data)",
"Scroll By", "this.windowUtil('scroll by', msg.data)",
"Close", "top.close()",
"Focus Window", "window.focus()",
"Blur Window", "window.blur()",
"Alert", "window.alert(msg.data)",
"Confirm", "msg.returnValue = window.confirm(msg.data)",
"Prompt", "msg.returnValue = this.windowUtil('prompt', msg.data)",
"Check Browser Type", "msg.returnValue = this.windowUtil('browser type', msg.data)",
"Message To Window","this.windowUtil('message to window', msg.data)",
"Get Opener", "msg.returnValue = window.opener",
"Get Name", "msg.returnValue = window.name",
"Set Name", "window.name = msg.data",
"Check Closing", "this.checkClosing()"));
}
if(theType == "lyr" || theType == "wht") {
F_addCommandsLoop(this, new Array(
"Switch To", "this.SwitchTo(msg.data)"));
this.addCommands("vis");
}
if(theType == "fob") {
F_addCommandsLoop(this, new Array(
"Get Form", "msg.returnValue = this.formRef",
"Get Form Object", "msg.returnValue = this.getFormObj(this.formRef.name)"));
}
}
F_prototypeF("F_cObject.prototype.",
"setLowsrc",
"setImage",
"useImage",
"setImageLoad",
"setSrc",
"windowUtil",
"IEsound"
);
F_prototype("F_cMain.prototype.",
"commandsInit", "F_commandsInit"
);

