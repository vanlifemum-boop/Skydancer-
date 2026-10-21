import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

class Element {
  constructor(attrs={}) { this.attrs=attrs; this.listeners={}; this.children={}; this.groups={}; this.dataset={}; this.textContent=''; this.classes=new Set(); this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c),toggle:(c,v)=>v?this.classes.add(c):this.classes.delete(c)}; }
  addEventListener(name, callback) { this.listeners[name]=callback; }
  getAttribute(name) { return this.attrs[name] ?? null; }
  setAttribute(name,value) { this.attrs[name]=value; }
  querySelector(selector) { if(!this.children[selector]) throw new Error(`Missing selector ${selector}`); return this.children[selector]; }
  querySelectorAll(selector) { return this.groups[selector] ?? []; }
  closest() { return null; }
  focus() { this.focused=true; }
  setPointerCapture() {}
  fire(name,event={}) { this.listeners[name]({...event,preventDefault(){}}); }
}
const elements={};
for(const selector of ['#configuration','#selection-summary','.menu-button','#main-navigation','.vehicle-stage','#view-label','#feature-title','#feature-text','#feature-icon use','[data-view="previous"]','[data-view="next"]','#service-caption']) elements[selector]=new Element();
const form=elements['#configuration'];
form.values={furniture:'Graphit',upholstery:'Nachtschwarz',edition:'Autark',weight:'3,5 t'};
const enquiryLinks=[new Element(),new Element()];
const stage=elements['.vehicle-stage'];
stage.children['.vehicle-image']=new Element();
stage.children.source=new Element();
stage.groups['.hotspot']=['Dach','Kamera','Internet'].map(title=>{
  const e=new Element();e.dataset={title,description:title+' Info'};e.children.use=new Element({href:'#icon-'+title});return e;
});
const services=['Kameraspiegel','Surround','Control','Internet'].map(title=>{const e=new Element();e.dataset={title,description:title+' Info'};return e;});
const doc=new Element();
doc.documentElement=new Element();
doc.children=elements;
doc.groups={'[data-configuration-link]':enquiryLinks,'.service-pin':services};
const sandbox={document:doc,FormData:class {constructor(f){this.values=f.values}get(k){return this.values[k]}},encodeURIComponent};
vm.runInNewContext(fs.readFileSync(fileURLToPath(new URL('../assets/site-v2.js',import.meta.url)),'utf8'),sandbox);
assert.equal(elements['#selection-summary'].textContent,'Diamond · Autark · 3,5 t');
form.values={furniture:'Arktisweiß',upholstery:'Ozeanblau',edition:'Winter',weight:'4,5 t'};
form.fire('change');
assert.equal(elements['#selection-summary'].textContent,'Diamond · Winter · 4,5 t');
for(const link of enquiryLinks){const body=decodeURIComponent(link.href);for(const value of Object.values(form.values))assert.ok(body.includes(value));assert.ok(body.startsWith('mailto:milakubinsky@gmail.com?'));}
const menu=elements['.menu-button'];
menu.fire('click');assert.equal(menu.getAttribute('aria-expanded'),'true');
assert.ok(elements['#main-navigation'].classes.has('nav-open'));
doc.fire('keydown',{key:'Escape'});assert.equal(menu.getAttribute('aria-expanded'),'false');assert.ok(menu.focused);
menu.fire('click');elements['#main-navigation'].fire('click',{target:{closest:()=>true}});assert.equal(menu.getAttribute('aria-expanded'),'false');
elements['[data-view="next"]'].fire('click');
assert.equal(elements['#view-label'].textContent,'Diamond · Seitenansicht');
assert.ok(stage.children.source.srcset.includes('side-768.webp'));
assert.ok(stage.groups['.hotspot'].every(e=>e.hidden));
elements['[data-view="next"]'].fire('click');assert.equal(stage.children['.vehicle-image'].width,1400);
elements['[data-view="next"]'].fire('click');assert.equal(elements['#view-label'].textContent,'Diamond · Frontansicht');
assert.ok(stage.groups['.hotspot'].every(e=>!e.hidden));
stage.fire('keydown',{key:'ArrowLeft',target:stage});assert.equal(elements['#view-label'].textContent,'Diamond · Panoramaansicht');
stage.fire('pointerdown',{button:0,clientX:20,clientY:20,pointerId:1,target:stage});
stage.fire('pointerup',{clientX:90,clientY:21});assert.equal(elements['#view-label'].textContent,'Diamond · Seitenansicht');
stage.fire('pointerdown',{button:0,clientX:20,clientY:20,pointerId:1,target:stage});
stage.fire('pointerup',{clientX:21,clientY:200});assert.equal(elements['#view-label'].textContent,'Diamond · Seitenansicht');
stage.groups['.hotspot'][1].fire('click');assert.equal(elements['#feature-title'].textContent,'Kamera');assert.equal(elements['#feature-icon use'].getAttribute('href'),'#icon-Kamera');
assert.equal(stage.groups['.hotspot'][1].getAttribute('aria-pressed'),'true');
assert.equal(stage.groups['.hotspot'][0].getAttribute('aria-pressed'),'false');
services[2].fire('click');assert.equal(elements['#service-caption'].textContent,'Control: Control Info');assert.equal(services[2].getAttribute('aria-pressed'),'true');
assert.ok(doc.documentElement.classes.has('js-ready'));
console.log('PASS: configuration and email summary; menu/Escape/navigation; gallery buttons, keyboard and horizontal swipe; no vertical-swipe regression; hotspots and service pins.');
