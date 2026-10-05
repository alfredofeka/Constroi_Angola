// engine.js — renderer, cena, luzes e helpers 3D
const R=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio||1,2));
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9fd0e8);scene.fog=new THREE.Fog(0x9fd0e8,90,330);
const cam=new THREE.PerspectiveCamera(72,1,.08,900);cam.rotation.order='YXZ';
scene.add(new THREE.HemisphereLight(0xffffff,0x8a7a5a,.85));const sun=new THREE.DirectionalLight(0xffffff,.8);sun.position.set(80,120,40);scene.add(sun);
function rs(){R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();
const mat=c=>new THREE.MeshLambertMaterial({color:c}),mats={},M=c=>mats[c]||(mats[c]=mat(c));
const gB=new THREE.BoxGeometry(1,1,1),gS=new THREE.SphereGeometry(.5,12,10),gP=new THREE.PlaneGeometry(1,1);
const gUnit=new THREE.BoxGeometry(1,1,1).translate(0,.5,0),gRoof=new THREE.ConeGeometry(.7071,1,4).rotateY(Math.PI/4).translate(0,.5,0),gPole=new THREE.CylinderGeometry(.5,.5,1,6).translate(0,.5,0);
const bx=(c,sx,sy,sz,x,y,z,par=scene,g=gB)=>{const o=new THREE.Mesh(g,typeof c==='object'?c:M(c));o.scale.set(sx,sy,sz);o.position.set(x,y,z);par.add(o);return o};
const flat=(c,sx,sz,x,y,z,op)=>{const o=new THREE.Mesh(gP,op?new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op}):M(c));o.rotation.x=-Math.PI/2;o.scale.set(sx,sz,1);o.position.set(x,y,z);scene.add(o);return o};
const D=new THREE.Object3D(),tc=new THREE.Color();
function mkInst(g,max,m){const o=new THREE.InstancedMesh(g,m||new THREE.MeshLambertMaterial(),max);o.count=0;o.frustumCulled=false;scene.add(o);return o}
function addInst(m,x,y,z,sx,sy,sz,col,ry=0){D.position.set(x,y,z);D.scale.set(sx,sy,sz);D.rotation.set(0,ry,0);D.updateMatrix();m.setMatrixAt(m.count,D.matrix);m.setColorAt(m.count,tc.set(col));m.instanceMatrix.needsUpdate=true;m.instanceColor.needsUpdate=true;return m.count++}
