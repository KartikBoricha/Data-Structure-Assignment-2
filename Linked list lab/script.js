const $=s=>document.querySelector(s),R=()=>Math.floor(Math.random()*99)+1;
let L=[],T='singly',busy=0,uid=0,M={},E=0,steps=0,H=[],last='',sp=720;
const mk=v=>{uid++;return{id:uid,v,a:'0x'+(4096+uid*16).toString(16).toUpperCase()}};
const sleep=m=>new Promise(r=>setTimeout(r,sp*m));
const log=(t,c='')=>{const d=document.createElement('div');d.className=c;d.textContent=t;$('#log').prepend(d)};
const val=req=>{const x=$('#v').value;if(x===''){if(req)throw Error('Enter a value first.');return R()}return +x};
const idx=()=>{const x=$('#ix').value;if(x==='')throw Error('Enter an index first.');return +x};
const mark=(i,c)=>{if(L[i])M[L[i].id]=c};
const D=()=>T==='doubly'||T==='cdoubly',C=()=>T==='circular'||T==='cdoubly',TN={singly:'singly',doubly:'doubly',circular:'circular',cdoubly:'circular doubly'},cl=()=>C()?' Circular: tail.next = head'+(D()?', head.prev = tail':'')+'.':'';
const CX={ihead:['Insert at head','O(1)','O(1)'],itail:['Insert at tail','O(n)','O(1)'],iat:['Insert at index','O(n)','O(n)'],dhead:['Delete head','O(1)','O(1)'],dtail:['Delete tail','O(n)','O(1)'],dat:['Delete at index','O(n)','O(n)'],dval:['Delete by value','O(n)','O(n)'],search:['Search','O(n)','O(n)'],update:['Update','O(n)','O(n)'],reverse:['Reverse','O(n)','O(n)'],sort:['Sort (bubble)','O(n²)','O(n²)']};

async function trav(to){for(let k=0;k<=to&&k<L.length;k++){M={};mark(k,'visit');steps++;render();await sleep(.8)}}
async function gen(){const n=Math.min(12,Math.max(0,+$('#n').value||0));L=[];render();for(let i=0;i<n;i++){const x=mk(R());L.push(x);E=x.id;steps++;render();await sleep(.5)}log('Built a '+TN[T]+' list with '+n+' node(s).','ok')}
async function ins(i){
  const v=val();if(i<0||i>L.length)throw Error('Index must be between 0 and '+L.length+'.');
  const n=mk(v);if(i>0&&!(D()&&i===L.length))await trav(i-1);
  M={};L.splice(i,0,n);E=n.id;steps++;render();
  log((i===0?'Insert '+v+' at head: new.next = head; head = new.':i===L.length-1?'Insert '+v+' at tail: last.next = new'+(D()?'; new.prev = last':'')+'.':'Insert '+v+' at index '+i+': prev.next = new; new.next = old next.')+cl());
  await sleep(1.2)}
async function del(i){
  if(!L.length)throw Error('The list is empty.');if(i<0||i>=L.length)throw Error('Index must be between 0 and '+(L.length-1)+'.');
  if(i>0&&!(D()&&i===L.length-1))await trav(i-1);
  M={};mark(i,'del');steps++;render();await sleep(1.1);const[x]=L.splice(i,1);log('Deleted '+x.v+' at index '+i+(i===0?': head = head.next.':': prev.next = node.next.')+cl(),'ok')}
async function dval(){const v=val(1);if(!L.length)throw Error('The list is empty.');const i=L.findIndex(x=>x.v===v);if(i<0){await trav(L.length-1);throw Error(v+' is not in the list.')}await del(i)}
async function search(){const v=val(1);for(let k=0;k<L.length;k++){M={};mark(k,'visit');steps++;render();await sleep(.8);if(L[k].v===v){mark(k,'found');render();log('Found '+v+' at index '+k+' after '+(k+1)+' step(s).','ok');await sleep(1.2);return}}
  throw Error(v+' not found after '+L.length+' step(s).')}
async function update(){const i=idx(),v=val(1);if(i<0||i>=L.length)throw Error('Index is outside the list.');await trav(i);L[i].v=v;mark(i,'found');render();log('Node '+i+' now holds '+v+'.','ok');await sleep(1)}
async function reverse(){if(L.length<2)throw Error('Need at least 2 nodes.');for(let k=0;k<L.length;k++){M={};mark(k,'visit');steps++;render();await sleep(.6)}
  L.reverse();M={};L.forEach((_,k)=>mark(k,'found'));render();log('Reversed: each next pointer now points backward, so head and tail swapped.','ok');await sleep(1.2)}
async function sort(){const n=L.length;if(n<2)throw Error('Need at least 2 nodes.');
  for(let a=0;a<n-1;a++)for(let b=0;b<n-1-a;b++){M={};mark(b,'visit');mark(b+1,'visit');steps++;render();await sleep(.45);
    if(L[b].v>L[b+1].v){[L[b].v,L[b+1].v]=[L[b+1].v,L[b].v];M={};mark(b,'swap');mark(b+1,'swap');render();await sleep(.45)}}
  M={};L.forEach((_,k)=>mark(k,'found'));render();log('Sorted ascending by swapping node values.','ok');await sleep(1)}
async function clear(){L=[];log('List cleared: head = null.','ok')}
const F={gen,ihead:()=>ins(0),itail:()=>ins(L.length),iat:()=>ins(idx()),dhead:()=>del(0),dtail:()=>del(L.length-1),dat:()=>del(idx()),dval,search,update,reverse,sort,clear};

async function run(key,label,fn){if(busy)return;busy=1;steps=0;btns();
  try{await fn();if(key!=='gen'&&key!=='clear'){H.push({n:label,s:steps});last=key}}catch(e){log(e.message,'err');if(steps&&key!=='gen'){H.push({n:label,s:steps});last=key}}
  M={};E=0;busy=0;btns();render()}
const btns=()=>document.querySelectorAll('.b,.seg button').forEach(b=>b.disabled=!!busy&&b.id!=='theme');

function render(){
  const st=$('#stage'),n=L.length,d=D(),c=C();
  st.innerHTML=n?(d&&!c?'<span class="nul">null</span><span class="lk">⇄</span>':'')+L.map((x,i)=>
   '<div class="n '+(M[x.id]||'')+' '+(E===x.id?'enter':'')+'"><div class="tg">'+(i===0?'head':'')+(i===0&&i===n-1?' &amp; ':'')+(i===n-1?'tail':'')+'</div><div class="bx">'+(d?'<i class="c">prev</i>':'')+'<b class="d">'+x.v+'</b><i class="c">next</i></div><div class="ix">'+i+'</div></div>'+
   (i<n-1?'<span class="lk">'+(d?'⇄':'→')+'</span>':c?'':'<span class="lk">→</span><span class="nul">null</span>')).join('')
   :'<p class="empty">The list is empty. Set a node count and press Build list, or insert a value.</p>';
  $('#st').innerHTML=[['Size',n],['Head',n?L[0].v:'null'],['Tail',n?L[n-1].v:'null'],['Is empty',n?'false':'true']].map(a=>'<div><span>'+a[0]+'</span><b>'+a[1]+'</b></div>').join('');
  // value chart
  const mx=Math.max(100,...L.map(x=>x.v)),W=Math.max(320,n*52+16),h=160;
  $('#c1').innerHTML=n?'<svg viewBox="0 0 '+W+' '+(h+30)+'">'+L.map((x,i)=>{const bh=Math.max(2,x.v/mx*(h-18));return'<rect class="bar '+(M[x.id]||'')+'" x="'+(12+i*52)+'" y="'+(h-bh)+'" width="40" height="'+bh+'" rx="5"/><text x="'+(32+i*52)+'" y="'+(h-bh-5)+'">'+x.v+'</text><text class="m" x="'+(32+i*52)+'" y="'+(h+16)+'">'+i+'</text>'}).join('')+'</svg>':'<p class="empty">No nodes to chart.</p>';
  // cost chart
  const hh=H.slice(-10),cm=Math.max(4,...hh.map(x=>x.s)),W2=Math.max(320,hh.length*60+16);
  $('#c2').innerHTML=hh.length?'<svg viewBox="0 0 '+W2+' '+(h+44)+'">'+hh.map((x,i)=>{const bh=Math.max(2,x.s/cm*(h-18));return'<rect class="bar cost" x="'+(10+i*60)+'" y="'+(h-bh)+'" width="44" height="'+bh+'" rx="5"/><text x="'+(32+i*60)+'" y="'+(h-bh-5)+'">'+x.s+'</text><text class="m" x="'+(32+i*60)+'" y="'+(h+16)+'">'+x.n.split(' ')[0]+'</text><text class="m" x="'+(32+i*60)+'" y="'+(h+31)+'">'+(x.n.split(' ')[1]||'')+'</text>'}).join('')+'<polyline fill="none" stroke="var(--ptr)" stroke-width="2.5" points="'+hh.map((x,i)=>(32+i*60)+','+(h-Math.max(2,x.s/cm*(h-18)))).join(' ')+'"/></svg>':'<p class="empty">Run an operation to see how many steps it takes.</p>';
  // memory
  $('#mem').innerHTML='<tr><th>address<th>data<th>next'+(d?'<th>prev':'')+'</tr>'+L.map((x,i)=>'<tr class="'+(M[x.id]||'')+'"><td>'+x.a+'<td>'+x.v+'<td>'+(i<n-1?L[i+1].a:c?L[0].a:'null')+(d?'<td>'+(i?L[i-1].a:c?L[n-1].a:'null'):'')+'</tr>').join('')+(n?'':'<tr><td colspan="3">head → null</tr>');
  // complexity
  $('#cx').innerHTML='<tr><th>operation<th>time</tr>'+Object.entries(CX).map(([k,a])=>'<tr class="'+(k===last?'hl':'')+'"><td>'+a[0]+'<td>'+(d?a[2]:a[1])+'</tr>').join('');drawLoop()}
function drawLoop(){const st=$('#stage'),on=C()&&L.length>0,dd=T==='cdoubly';st.classList.toggle('lp',on);st.classList.toggle('lp2',on&&dd);const o=$('#loop');if(o)o.remove();if(!on)return;
  const q=st.querySelectorAll('.bx'),a=q[q.length-1],b=q[0],r=12,x0=a.offsetLeft+a.offsetWidth,y0=a.offsetTop+a.offsetHeight/2,xr=x0+30,yb=a.offsetTop+a.offsetHeight+(dd?40:34),xl=b.offsetLeft-30,y1=b.offsetTop+b.offsetHeight/2,x1=b.offsetLeft,lbl=dd?'tail.next = head, head.prev = tail':'tail.next = head',tw=lbl.length*7.4,P2=()=>{const s=6,xr2=x0+16,xl2=x1-16,yb2=yb-10,ya=y0+12,yh=y1+12;return '<path class="pv" d="M'+x1+' '+yh+'L'+(xl2+s)+' '+yh+'Q'+xl2+' '+yh+' '+xl2+' '+(yh+s)+'L'+xl2+' '+(yb2-s)+'Q'+xl2+' '+yb2+' '+(xl2+s)+' '+yb2+'L'+(xr2-s)+' '+yb2+'Q'+xr2+' '+yb2+' '+xr2+' '+(yb2-s)+'L'+xr2+' '+(ya+s)+'Q'+xr2+' '+ya+' '+(xr2-s)+' '+ya+'"/><polygon class="pv" points="'+x0+','+ya+' '+(x0+10)+','+(ya-6)+' '+(x0+10)+','+(ya+6)+'"/>'};
  st.insertAdjacentHTML('beforeend','<svg id="loop" width="'+st.clientWidth+'" height="'+st.clientHeight+'"><path d="M'+x0+' '+y0+'L'+(xr-r)+' '+y0+'Q'+xr+' '+y0+' '+xr+' '+(y0+r)+'L'+xr+' '+(yb-r)+'Q'+xr+' '+yb+' '+(xr-r)+' '+yb+'L'+(xl+r)+' '+yb+'Q'+xl+' '+yb+' '+xl+' '+(yb-r)+'L'+xl+' '+(y1+r)+'Q'+xl+' '+y1+' '+(xl+r)+' '+y1+'L'+(x1-9)+' '+y1+'"/><polygon points="'+x1+','+y1+' '+(x1-10)+','+(y1-6)+' '+(x1-10)+','+(y1+6)+'"/>'+(dd?P2():'')+'<text class="m" x="'+Math.max(tw/2+4,(xl+xr)/2)+'" y="'+(yb+17)+'">'+lbl+'</text></svg>')}

document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>run(b.dataset.k,b.dataset.l,F[b.dataset.k]));
document.querySelectorAll('#types button').forEach(b=>b.onclick=()=>{if(busy)return;T=b.dataset.t;document.querySelectorAll('#types button').forEach(x=>x.classList.toggle('on',x===b));log('Switched to a '+TN[T]+' list.');render()});
$('#sp').oninput=e=>sp=1500-e.target.value*130;
$('#theme').onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.dataset.theme=dark?'light':'dark'};
addEventListener('resize',drawLoop);render();run('gen','Build',gen);
