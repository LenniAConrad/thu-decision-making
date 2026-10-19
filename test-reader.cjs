const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
class LocalResources extends ResourceLoader{fetch(url){const name=decodeURIComponent(new URL(url).pathname).replace(/^\//,'');const file=path.resolve(name);if(!file.startsWith(process.cwd()+path.sep))throw Error('Outside fixture');return fs.existsSync(file)?Promise.resolve(fs.readFileSync(file)):null;}}
async function page(file,hash='',storage={},options={}){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!String(e).includes('Could not parse CSS stylesheet'))errors.push(String(e));});
 const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://decision.test/'+file+hash,runScripts:'dangerously',resources:new LocalResources(),pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};/* jsdom has no SVG layout; this fixture only checks editor initialization. */w.SVGElement.prototype.getBBox=()=>({x:0,y:0,width:0,height:0});w.matchMedia=()=>({matches:options.reducedMotion!==false,addEventListener(){},removeEventListener(){}});if(options.frames){let time=0,id=0,frames=new Map();w.requestAnimationFrame=fn=>{frames.set(++id,fn);return id;};w.cancelAnimationFrame=id=>frames.delete(id);w.advanceFrame=delta=>{time+=delta;const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(time));};w.pendingFrames=()=>frames.size;}for(const [k,v] of Object.entries(storage))w.sessionStorage.setItem(k,JSON.stringify(v));}});
 await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
 const w=dom.window,d=w.document;if(errors.length)console.error(file,errors);assert.deepEqual(errors,[],file+' startup');
 return {w,d,errors,close:()=>w.close(),async route(hash){w.location.hash=hash;await new Promise(r=>w.setTimeout(r,20));assert.deepEqual(errors,[],file+' navigation');}};
}
function event(w,el,type='input'){el.dispatchEvent(new w.Event(type,{bubbles:true,cancelable:true}));}
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
module.exports={page,event,near};
