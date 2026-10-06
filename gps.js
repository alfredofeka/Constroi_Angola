// gps.js — rota pelas estradas (BFS), seta de direção e instruções de viragem
const GPS={pts:null,len:0,t:0,ang:0,txt:'',nextD:0};
function nearestRoadTile(tx,ty,rad){if(roadSet.has(tx+','+ty))return[tx,ty];
 for(let r=1;r<=rad;r++){let best=null,bd=1e9;for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(roadSet.has((tx+dx)+','+(ty+dy))){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=[tx+dx,ty+dy]}}}if(best)return best}return null}
function bfsRoute(a,b){const key=(x,y)=>x+','+y,prev=new Map([[key(a[0],a[1]),null]]),q=[a],D=[[1,0],[-1,0],[0,1],[0,-1]];let h=0;
 while(h<q.length){const[x,y]=q[h++];if(x===b[0]&&y===b[1])break;for(const d of D){const nx=x+d[0],ny=y+d[1],k=key(nx,ny);if(!roadSet.has(k)||prev.has(k))continue;prev.set(k,[x,y]);q.push([nx,ny])}}
 if(!prev.has(key(b[0],b[1])))return null;const path=[];let c=b;while(c){path.push(c);c=prev.get(key(c[0],c[1]))}return path.reverse()}
function gpsCompute(tx,tz){const a=nearestRoadTile(Math.floor(pl.x/T),Math.floor(pl.z/T),8),b=nearestRoadTile(Math.floor(tx/T),Math.floor(tz/T),6);let pts=null;
 if(a&&b){const p=bfsRoute(a,b);if(p){pts=[[pl.x,pl.z]];let pd=null;p.forEach((c,i)=>{const nx=p[i+1],dir=nx?[nx[0]-c[0],nx[1]-c[1]]:null;if(i===0||!dir||!pd||dir[0]!==pd[0]||dir[1]!==pd[1])pts.push([(c[0]+.5)*T,(c[1]+.5)*T]);pd=dir});pts.push([tx,tz])}}
 GPS.pts=pts;const P=pts||[[pl.x,pl.z],[tx,tz]];let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);GPS.len=L}
function gpsArrow(tx,tz){const P=GPS.pts||[[pl.x,pl.z],[tx,tz]];let q=P[P.length-1];for(let i=1;i<P.length;i++)if(Math.hypot(P[i][0]-pl.x,P[i][1]-pl.z)>9){q=P[i];break}
 const vx=q[0]-pl.x,vz=q[1]-pl.z,a=playerHeading(),fx=-Math.sin(a),fz=-Math.cos(a),ang=Math.atan2(vx*-fz+vz*fx,vx*fx+vz*fz);GPS.ang=ang;GPS.nextD=Math.hypot(vx,vz);
 GPS.txt=Math.abs(ang)<.45?'segue em frente':Math.abs(ang)>2.5?'faz inversão de marcha':ang>0?'vira à direita':'vira à esquerda'}
const fmtD=d=>d>=1000?(d/1000).toFixed(1)+' km':Math.round(d)+' m';
