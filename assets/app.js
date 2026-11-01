const [kanjiData, vocabularyData, grammarData, examData] = await Promise.all([
  fetch('./data/kanji.json').then(readJson),
  fetch('./data/vocabulary.json').then(readJson),
  fetch('./data/grammar.json').then(readJson),
  fetch('./data/exam.json').then(readJson),
]);
async function readJson(response) {
  if (!response.ok) throw new Error('Không tải được dữ liệu học: ' + response.url);
  return response.json();
}
const UNITS = kanjiData.units;
const KANJI_DATA = kanjiData.items;
const VOCAB_UNITS = vocabularyData.lessons;
const VOCAB_DATA = vocabularyData.items;
const GRAMMAR = grammarData;
const EXAM_GRAMMAR = examData.grammar;
const EXAM_KANJI = examData.kanji;
const pageNames = ["home","dictionary","grammar","practice","exam","review","stats"];
const pageMarkup = await Promise.all(pageNames.map(name =>
  fetch('./pages/' + name + '.html?v=pixel-20261102b').then(readText)
));
document.getElementById('pageMount').innerHTML = pageMarkup.join('\n');
/* Pixel interface details adapted to the split-page app. */
(() => {
  const palette={k:'#3b3150',o:'#3b3150',e:'#3b3150',w:'#fffaf0',r:'#d9574a',p:'#f6aebd',n:'#e06b7e',y:'#f8d67c',g:'#6fae7b',b:'#6fb3d2',d:'#8a5a3c'};
  const sprites={
    cat:['..oo........oo..','.owwo......owwo.','.owpwoooooowpwo.','.owwwwwwwwwwwwo.','owwwwwwwwwwwwwwo','owwweewwwweewwwo','owwweewwwweewwwo','owppwwwwwwwwppwo','owwwwwwnnwwwwwwo','.owwwwwwwwwwwwo.','.owwwwwwwwwwwwo.','..oooooooooooo..','..oorrrrrrrroo..','...oyyyyyyyyo...','....oooooooo....'],
    torii:['kkkkkkkkkkkkkkkk','.rrrrrrrrrrrrrr.','..rr........rr..','.rrrrrrrrrrrrrr.','..rr........rr..','..rr........rr..','..rr........rr..','..rr........rr..','..kk........kk..'],
    home:['...rr...','..rrrr..','.rrrrrr.','rrrrrrrr','.wwwwww.','.wwddww.','.wwddww.','.wwddww.'],
    book:['bbbbbbbb','bwwbwwwb','bwwbwwwb','bwwbwwwb','bwwbwwwb','bbbbbbbb','.kkkkkk.'],
    scroll:['kkkkkkk.','kwwwwwk.','kwkkkwk.','kwwwwwk.','kwkkkwk.','kwwwwwk.','kkkkkkk.'],
    pencil:['......kk','.....kyk','....kyk.','...kyk..','..kyk...','.kpk....','kpk.....','kk......'],
    test:['kkkkkkk.','kwwwwwk.','kwwwwgk.','kgwwgwk.','kwgggwk.','kwwgwwk.','kwwwwwk.','kkkkkkk.'],
    chart:['........','......bb','......bb','...gg.bb','...gg.bb','rr.gg.bb','rr.gg.bb','rr.gg.bb'],
    flame:['...r....','..rr.r..','..rrrr..','.rryyrr.','.rryyrr.','.rryyyr.','..ryyr..','...rr...'],
    star:['...yy...','...yy...','yyyyyyyy','.yyyyyy.','..yyyy..','...yy...','.yy..yy.','yy....yy']
  };
  const svg=(name,px=4)=>{const rows=sprites[name];if(!rows)return '';let rects='';rows.forEach((row,y)=>[...row].forEach((c,x)=>{if(palette[c])rects+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${palette[c]}"${c==='e'?' class="eye"':''}/>`}));return `<svg viewBox="0 0 ${rows[0].length} ${rows.length}" width="${rows[0].length*px}" height="${rows.length*px}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`};
  const paint=root=>(root||document).querySelectorAll('[data-spr]').forEach(el=>{if(!el.firstChild)el.innerHTML=svg(el.dataset.spr,+el.dataset.px||4)});
  const icons={home:'home',dictionary:'book',grammar:'scroll',practice:'pencil',exam:'test',stats:'chart'};
  document.querySelectorAll('.nav button[data-page],.mobile-nav button[data-page]').forEach(button=>{const name=icons[button.dataset.page];if(name&&!button.querySelector('[data-spr]'))button.insertAdjacentHTML('afterbegin',`<span class="spr" data-spr="${name}" data-px="3"></span>`)});
  document.querySelectorAll('.quick[data-go]').forEach(button=>{const name=button.dataset.go==='exam'?'test':button.dataset.go==='practice'?'pencil':'book';if(!button.querySelector('[data-spr]'))button.insertAdjacentHTML('afterbegin',`<span class="spr" data-spr="${name}" data-px="5"></span>`)});
  const brand=document.querySelector('.brand');if(brand&&!brand.querySelector('[data-spr]'))brand.insertAdjacentHTML('afterbegin','<span class="spr" data-spr="torii" data-px="3"></span>');
  const mobile=document.getElementById('mobileNav');if(mobile&&!mobile.querySelector('[data-page="grammar"]'))mobile.querySelector('[data-page="dictionary"]')?.insertAdjacentHTML('afterend','<button data-page="grammar"><span class="spr" data-spr="scroll" data-px="3"></span>Ngữ pháp</button>');
  paint();
  const decor=document.createDocumentFragment();[['c1',40],['c2',150],['c3',70]].forEach(([cls,top])=>{const cloud=document.createElement('div');cloud.className='cloud '+cls;cloud.style.top=top+'px';decor.append(cloud)});
  for(let i=0;i<10;i++){const petal=document.createElement('div');petal.className='petal';petal.style.left=Math.random()*100+'vw';petal.style.animationDuration=9+Math.random()*9+'s';petal.style.animationDelay=-Math.random()*16+'s';petal.style.setProperty('--dx',Math.random()*160-40+'px');const size=7+Math.random()*6;petal.style.width=petal.style.height=size+'px';decor.append(petal)}
  document.body.append(decor);
})();
async function readText(response) {
  if (!response.ok) throw new Error('Không tải được trang: ' + response.url);
  return response.text();
}
/* ========================= STATE ========================= */
let mode = 'kanji';
let selectedUnits = new Set(UNITS.map(u=>u.code));
let selectedLessons = new Set(VOCAB_UNITS.map(u=>u.code));
let chosenCount = 20;
let quiz = { mode:'kanji', questions:[], idx:0, score:0, wrong:[], answered:false };


// Bổ sung các mục còn thiếu từ Excel bài 36–43; các từ đã có được loại trùng theo kana.

VOCAB_DATA.forEach(e=>{ e.word = e.kanji || e.kana; });
const $=id=>document.getElementById(id);
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let toastTimer=null;
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.remove(),2800)}
function ask(msg,onYes,yesLabel){const root=document.getElementById('modalRoot');root.innerHTML='<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true"><p></p><div class="row"><button class="btn" data-n>Hủy</button><button class="btn primary" data-y></button></div></div></div>';root.querySelector('p').textContent=msg;const y=root.querySelector('[data-y]');y.textContent=yesLabel||'Đồng ý';const close=()=>{root.innerHTML=''};root.querySelector('[data-n]').onclick=close;y.onclick=()=>{close();onYes()};y.focus()}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORE='kotoba_n4_v1';
let state={cards:{},history:[],saved:[]};
try{const raw=JSON.parse(localStorage.getItem(STORE)||'{}');state={...state,...raw};}catch(e){}
state.cards=state.cards&&typeof state.cards==='object'?state.cards:{};
state.history=Array.isArray(state.history)?state.history:[];
state.saved=Array.isArray(state.saved)?state.saved:[];
function persist(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){toast('Không lưu được tiến độ (bộ nhớ trình duyệt đầy hoặc bị chặn). Hãy sao lưu.')}}
function vKey(x){return 'v|'+x.lesson+'|'+x.kana}function kKey(x){return 'k|'+x.unit+'|'+x.kanji}
function allItems(){return [...VOCAB_DATA.map(x=>({type:'vocab',key:vKey(x),front:x.kanji||x.kana,reading:x.kana,meaning:x.meaning,lesson:x.lesson,raw:x})),...KANJI_DATA.map(x=>({type:'kanji',key:kKey(x),front:x.kanji,reading:x.doc||'',meaning:[x.hanViet,x.nghia,x.tuViNghia].filter(Boolean).join(' · '),unit:x.unit,raw:x}))]}
const itemMap=new Map(allItems().map(x=>[x.key,x]));
function ensureCard(it){if(!state.cards[it.key])state.cards[it.key]={box:0,due:Date.now(),seen:0,learned:false};return state.cards[it.key]}
function dueItems(type='all'){return allItems().filter(x=>(type==='all'||x.type===type)&&state.cards[x.key]&&state.cards[x.key].due<=Date.now())}
function learnedCount(){return Object.values(state.cards).filter(x=>x.learned).length}
function showPage(id){if(id==='vocab'||id==='kanji'){setDictionaryTab(id);id='dictionary'}if(id==='dictionary'){renderVocab();renderKanji();setDictionaryTab(document.getElementById('dictTabKanji').classList.contains('primary')?'kanji':'vocab')}document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id==='page-'+id));document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===id));const titles={home:['Tổng quan','Học một ít mỗi ngày.'],dictionary:['Từ điển','Tra cứu từ vựng và Kanji trong cùng một mục.'],grammar:['Ngữ pháp','Tra cứu mẫu câu và cách dùng.'],listen:['Luyện nghe','Luyện nhận diện âm thanh bằng giọng đọc tiếng Nhật.'],practice:['Luyện tập','Chọn dạng bài và nội dung muốn luyện.'],exam:['Giải đề','Hoàn thành câu bằng cách chọn đáp án đúng.'],stats:['Thống kê','Theo dõi quá trình học.']};$('pageTitle').textContent=titles[id][0];$('pageDesc').textContent=titles[id][1];if(id==='stats')renderStats();window.scrollTo(0,0)}
const routePages=new Set(['home','dictionary','grammar','practice','exam','review','stats']);
function pageFromPath(){const name=location.pathname.split('/').pop().replace(/\.html$/,'');return routePages.has(name)?name:'home'}
function navigatePage(id,fromHistory=false){if(!routePages.has(id))id='home';if(id==='exam'&&!$('examPlay').classList.contains('hidden'))return;if(!$('examPlay').classList.contains('hidden')&&id!=='exam'){ask('Thoát đề và bỏ kết quả lượt này?',()=>{examAbort();if(!fromHistory)history.pushState({page:id},'',id==='home'?'./':'./'+id+'.html');showPage(id)},'Thoát');return}if(!fromHistory){const target=id==='home'?'./':'./'+id+'.html';if(location.pathname!==new URL(target,location.href).pathname)history.pushState({page:id},'',target)}showPage(id)}
window.addEventListener('popstate',()=>navigatePage(pageFromPath(),true));
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>navigatePage(b.dataset.page)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>navigatePage(b.dataset.go)));
function fillSelect(id,items,prefix){const el=$(id);items.forEach(x=>el.add(new Option(prefix+x,x)))}
const lessons=[...new Set(VOCAB_DATA.map(x=>String(x.lesson)))].sort((a,b)=>+a-+b);const units=[...new Set(KANJI_DATA.map(x=>String(x.unit)))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
fillSelect('vocabLesson',lessons,'Bài ');fillSelect('kanjiUnit',units,'Unit ');renderMultiChecks('quizLessonChecks',lessons,'Bài ');renderMultiChecks('quizUnitChecks',units,'Unit ');updateQuizFilters();for(let n=26;n<=50;n++)$('grammarLesson').add(new Option('Bài '+n,String(n)));
$('statVocab').textContent=VOCAB_DATA.length.toLocaleString('vi-VN');$('statKanji').textContent=KANJI_DATA.length.toLocaleString('vi-VN');
function updateDashboard(){
 const h=state.history,total=h.reduce((a,x)=>a+(Number(x.total)||0),0),correct=h.reduce((a,x)=>a+(Number(x.correct)||0),0);
 $('homeSessions').textContent=h.length;$('homeAnswers').textContent=total;$('homeAccuracy').textContent=total?Math.round(correct/total*100)+'%':'0%';
 $('todaySummary').textContent=h.length?`Lần luyện gần nhất: ${new Date(h[h.length-1].date).toLocaleString('vi-VN')}.`:'Chưa có lượt luyện nào.';
}
const RANKS=['Tân binh · 新兵','Học trò · 弟子','Chiến binh · 戦士','Samurai · 侍','Sensei · 先生','Thần Kanji · 漢神'];
const XP_PER_LV=60,GOAL=20;
const dk=d=>{const x=new Date(d);return x.getFullYear()+'-'+(x.getMonth()+1)+'-'+x.getDate()};
function paintHero(){
 const el=id=>document.getElementById(id);if(!el('heroLv'))return;
 const h=(typeof state!=='undefined'&&state.history)||[];
 const xp=h.reduce((a,x)=>a+x.correct*2+(x.total-x.correct),0);
 const lv=1+Math.floor(xp/XP_PER_LV),cur=xp%XP_PER_LV;
 el('heroLv').textContent='LV '+lv;
 el('heroRank').textContent=RANKS[Math.min(RANKS.length-1,Math.floor((lv-1)/3))];
 el('heroXpBar').style.width=(cur/XP_PER_LV*100)+'%';
 el('heroXpText').textContent=cur+' / '+XP_PER_LV+' XP';
 const today=dk(Date.now()),n=h.filter(x=>dk(x.date)===today).reduce((a,x)=>a+x.total,0);
 el('goalText').textContent=Math.min(n,GOAL)+' / '+GOAL+' câu';
 el('goalBar').style.width=Math.min(100,n/GOAL*100)+'%';
 const active=new Set(h.map(x=>dk(x.date)));let s=0,c=new Date();c.setHours(0,0,0,0);
 if(!active.has(dk(c)))c.setDate(c.getDate()-1);
 while(active.has(dk(c))&&s<365){s++;c.setDate(c.getDate()-1)}
 el('homeStreak').textContent=s+' ngày';
 const say=!h.length?'Chào bạn! Làm bài đầu tiên nhé!':n>=GOAL?'Xuất sắc! Đủ mục tiêu hôm nay rồi!':n>0?'Giỏi lắm! Còn '+(GOAL-n)+' câu nữa thôi!':s>0?'Giữ chuỗi '+s+' ngày nào!':'Hôm nay học chút nhé!';
 el('mascotSay').textContent=say;
}
const originalUpdateDashboard=updateDashboard;
updateDashboard=function(){originalUpdateDashboard.apply(this,arguments);paintHero()};
const originalShowPage=showPage;
showPage=function(id){originalShowPage.apply(this,arguments);if(id==='home')paintHero();const mn=document.querySelector('.mobile-nav button.active');if(mn&&mn.scrollIntoView)mn.scrollIntoView({block:'nearest',inline:'center'})};
paintHero();
function setDictionaryTab(tab){const v=tab==='vocab';$('page-vocab').classList.toggle('hidden',!v);$('page-kanji').classList.toggle('hidden',v);$('dictTabVocab').classList.toggle('primary',v);$('dictTabKanji').classList.toggle('primary',!v)}
$('dictTabVocab').onclick=()=>setDictionaryTab('vocab');$('dictTabKanji').onclick=()=>setDictionaryTab('kanji');
function renderMultiChecks(id,items,prefix){const el=$(id);el.innerHTML=items.map(v=>`<label><input type="checkbox" value="${esc(v)}" checked> ${esc(prefix+v)}</label>`).join('');el.querySelectorAll('input').forEach(c=>c.addEventListener('change',updateQuizFilters))}
function checkedValues(id){return [...$(id).querySelectorAll('input[type=checkbox]:checked')].map(c=>c.value)}
function countAvailableQuestions(){
 const activity=$('quizActivity').value,mode=$('quizMode').value,lessonsSelected=checkedValues('quizLessonChecks'),unitsSelected=checkedValues('quizUnitChecks');
 const vp=VOCAB_DATA.filter(x=>lessonsSelected.includes(String(x.lesson))&&x.meaning&&x.kana);
 const kp=KANJI_DATA.filter(x=>unitsSelected.includes(String(x.unit))&&x.kanji&&(x.doc||x.hanViet));
 let candidates=[];
 if(activity==='listen')candidates=vp.map(item=>({type:'vocab',item,pool:vp}));
 else if(activity==='fill'||activity==='order'){
  const grammarPool=GRAMMAR.filter(x=>lessonsSelected.includes(String(x.lesson))).flatMap(g=>g.examples.filter(ex=>ex.ja&&ex.ja.trim().split(/\s+/).length>=3).map(ex=>({lesson:g.lesson,title:g.title,ja:ex.ja.trim(),vi:ex.vi||''})));
  candidates=[...vp.filter(x=>String(x.kaiwa||'').trim().split(/\s+/).length>=3).map(item=>({type:'vocab',item,pool:vp})),...grammarPool.map(item=>({type:'grammar',item,pool:grammarPool}))];
 }else if(mode==='vocab')candidates=vp.map(item=>({type:'vocab',item,pool:vp}));
 else if(mode==='kanji')candidates=kp.map(item=>({type:'kanji',item,pool:kp}));
 else candidates=[...vp.map(item=>({type:'vocab',item,pool:vp})),...kp.map(item=>({type:'kanji',item,pool:kp}))];
 return candidates.reduce((total,c)=>{const q=makeQ(c.type,c.item,c.pool,activity);return total+(q&&q.answer&&(activity==='order'||(q.opts&&q.opts.length>=2))?1:0)},0);
}
function updateQuizFilters(){
 const mode=$('quizMode').value;
 const activity=$('quizActivity').value;
 $('quizModeWrap').classList.toggle('hidden',activity!=='choice');
 $('quizVocabGroup').classList.toggle('hidden',activity==='choice'&&mode==='kanji');
 $('quizKanjiGroup').classList.toggle('hidden',activity!=='choice'||mode==='vocab');
 document.querySelectorAll('[data-activity]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.activity===activity)));
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 document.querySelectorAll('[data-count]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.count===$('quizCount').value)));
 $('quizLessonCount').textContent=checkedValues('quizLessonChecks').length+' bài từ vựng đã chọn';
 $('quizUnitCount').textContent=checkedValues('quizUnitChecks').length+' Unit Kanji đã chọn';
 const available=countAvailableQuestions(),requested=$('quizCount').value==='all'?Infinity:Number($('quizCount').value);
 $('quizAvailableCount').textContent=available.toLocaleString('vi-VN')+' câu có thể tạo';
 $('quizAvailableNote').textContent=!available?'Hãy chọn thêm bài hoặc đổi dạng luyện tập để có câu hỏi.':requested===Infinity?'Đề sẽ dùng toàn bộ câu phù hợp.':available<requested?`Bạn chọn ${requested} câu; đề sẽ có ${available} câu.`:`Đề sẽ có ${requested} câu.`;
 $('quizStart').disabled=available===0;
}
document.querySelectorAll('[data-select]').forEach(b=>b.addEventListener('click',()=>{const root=$(b.dataset.select);root.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=true);updateQuizFilters()}));
document.querySelectorAll('[data-clear]').forEach(b=>b.addEventListener('click',()=>{const root=$(b.dataset.clear);root.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);updateQuizFilters()}));
$('quizMode').addEventListener('change',updateQuizFilters);
$('quizActivity').addEventListener('change',updateQuizFilters);
document.querySelectorAll('[data-activity]').forEach(b=>b.addEventListener('click',()=>{$('quizActivity').value=b.dataset.activity;updateQuizFilters()}));
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{$('quizMode').value=b.dataset.mode;updateQuizFilters()}));
document.querySelectorAll('[data-count]').forEach(b=>b.addEventListener('click',()=>{$('quizCount').value=b.dataset.count;updateQuizFilters()}));


function renderVocab(){const q=$('vocabSearch').value.trim().toLowerCase(),l=$('vocabLesson').value,sort=$('vocabSort').value;let arr=VOCAB_DATA.filter(x=>(l==='all'||String(x.lesson)===l)&&[x.kana,x.kanji,x.meaning,x.note,x.kaiwa,x.kaiwaVi].join(' ').toLowerCase().includes(q));if(sort==='jp')arr.sort((a,b)=>a.kana.localeCompare(b.kana,'ja'));$('vocabCount').textContent=arr.length+' / '+VOCAB_DATA.length+' mục';const shown=arr.slice(0,180);$('vocabList').innerHTML=shown.length?shown.map(x=>{return `<article class="item"><div class="item-main"><b class="jp">${esc(x.kanji||x.kana)}　${esc(x.kana)}</b><p>${esc(x.meaning)}</p><div class="meta">Bài ${esc(x.lesson)}${x.note?' · '+esc(x.note):''}</div></div><button class="btn small" data-speak="${esc(x.kana)}">Nghe</button></article>`}).join(''):'<div class="empty">Không tìm thấy từ vựng.</div>';bindSpeak($('vocabList'));}
function renderKanji(){const q=$('kanjiSearch').value.trim().toLowerCase(),u=$('kanjiUnit').value;const arr=KANJI_DATA.filter(x=>(u==='all'||x.unit===u)&&[x.kanji,x.hanViet,x.nghia,x.tuVi,x.doc,x.tuViNghia,x.goiNho].join(' ').toLowerCase().includes(q));$('kanjiList').innerHTML=arr.slice(0,180).map(x=>{return `<article class="item"><div class="item-main"><b class="jp" style="font-size:25px">${esc(x.kanji)}</b> <b>${esc(x.hanViet)}</b><p>${esc(x.nghia||'')}</p><div class="meta">Unit ${esc(x.unit)} · ${esc(x.tuVi||'')} ${esc(x.doc||'')} ${esc(x.tuViNghia||'')}</div>${x.goiNho?`<div class="meta">Mẹo nhớ: ${esc(x.goiNho)}</div>`:''}</div>${x.doc?`<button class="btn small" data-speak="${esc(x.doc)}">Nghe</button>`:''}</article>`}).join('')||'<div class="empty">Không tìm thấy Kanji.</div>';bindSpeak($('kanjiList'))}
function bindSpeak(root){root.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)))}
function speak(text,rate){if(!('speechSynthesis'in window)){toast('Trình duyệt này chưa hỗ trợ đọc văn bản. Thử Chrome hoặc Edge.');return}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ja-JP';u.rate=Number(rate||$('speechRate')?.value||.9);const voices=speechSynthesis.getVoices();const jp=voices.find(v=>v.lang.toLowerCase().startsWith('ja'));if(jp)u.voice=jp;speechSynthesis.speak(u)}catch(e){toast('Không phát được âm thanh trên thiết bị này.')}}
$('vocabSearch').addEventListener('input',renderVocab);$('vocabLesson').addEventListener('change',renderVocab);$('vocabSort').addEventListener('change',renderVocab);$('kanjiSearch').addEventListener('input',renderKanji);$('kanjiUnit').addEventListener('change',renderKanji);
// Flashcard feature removed by request. Dictionary search and filters remain available.\n// Grammar records imported from ngu_phap_N4_bai26-50.json (Lessons 26–50).

function renderGrammar(){
  const lessonFilter = $('grammarLesson').value;
  const query=$('grammarSearch').value.trim().toLocaleLowerCase('vi');
  const list=GRAMMAR.filter(x=>(lessonFilter==='all'||String(x.lesson)===lessonFilter)&&(!query||[x.title,...x.pattern,...x.explanations,...x.examples.flatMap(ex=>[ex.ja,ex.vi]),...x.other].join(' ').toLocaleLowerCase('vi').includes(query)));
  $('grammarCount').textContent=list.length+' mẫu ngữ pháp';
  const cardsByLesson=new Map();
  list.forEach(x=>{
    const patterns=Array.isArray(x.pattern)?x.pattern.filter(Boolean):[];
    const explanations=Array.isArray(x.explanations)?x.explanations.filter(Boolean):[];
    const examples=Array.isArray(x.examples)?x.examples.filter(ex=>ex.ja||ex.vi):[];
    const other=Array.isArray(x.other)?x.other.filter(Boolean):[];
    const visiblePatterns=patterns.slice(0,3),extraPatterns=patterns.slice(3);
    const structure=patterns.length?`<div class="grammar-block"><h4>Cấu trúc</h4><div class="grammar-patterns">${visiblePatterns.map(t=>`<div class="grammar-pattern jp">${esc(t)}</div>`).join('')}</div></div>`:'';
    const mainIdea=explanations.length?`<div class="grammar-main-idea"><b>Dùng khi</b><p>${esc(explanations[0])}</p></div>`:'';
    const usage=explanations.length>1?`<div class="grammar-block"><h4>Cách dùng thêm</h4><ul class="grammar-usage">${explanations.slice(1).map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`:'';
    const exampleMarkup=examples.length?`<div class="grammar-block"><h4>Ví dụ</h4><div class="grammar-examples">${examples.map(ex=>`<div class="grammar-example">${ex.ja?`<div class="jp">${esc(ex.ja)}</div>`:''}${ex.vi?`<div class="grammar-translation">${esc(ex.vi)}</div>`:''}</div>`).join('')}</div></div>`:'';
    const details=extraPatterns.length||other.length?`<details class="grammar-details"><summary>Chi tiết và ghi chú từ tài liệu</summary>${extraPatterns.length?`<div class="grammar-patterns">${extraPatterns.map(t=>`<div class="grammar-pattern jp">${esc(t)}</div>`).join('')}</div>`:''}${other.length?`<ul>${other.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}</details>`:'';
    const card=`<article class="card grammar-card"><div class="grammar-card-meta">BÀI ${x.lesson}<span>MỤC ${x.number}</span></div><h3>${esc(x.title)}</h3>${mainIdea||'<p class="meta">Xem cấu trúc và ví dụ để hiểu cách dùng mẫu câu này.</p>'}${structure}${usage}${exampleMarkup}${details}</article>`;
    cardsByLesson.set(x.lesson,[...(cardsByLesson.get(x.lesson)||[]),card]);
  });
  $('grammarList').innerHTML=list.length?[...cardsByLesson].map(([lesson,cards])=>`<section class="grammar-lesson"><h3 class="grammar-lesson-title">Bài ${lesson}<span>${cards.length} mẫu</span></h3><div class="grammar-lesson-cards">${cards.join('')}</div></section>`).join(''):'<div class="empty">Không tìm thấy mẫu ngữ pháp phù hợp.</div>';
}
$('grammarLesson').onchange = renderGrammar;$('grammarSearch').addEventListener('input',renderGrammar);
// Multiple choice generator. Distractors are restricted to the selected lesson/unit pool.
let quizRun={qs:[],idx:0,correct:0,wrong:[],started:0,answered:false,timer:null};
function vocabRuby(item){
  const kanji=String(item.kanji||item.kana||''),reading=String(item.kana||'');
  if(!item.kanji)return esc(kanji);
  const trailing=(kanji.match(/[ぁ-ゖァ-ヺー]+$/u)||[''])[0];
  if(trailing && reading.endsWith(trailing) && kanji.length>trailing.length){
    const base=kanji.slice(0,-trailing.length),baseReading=reading.slice(0,-trailing.length);
    if(baseReading)return `<ruby>${esc(base)}<rt>${esc(baseReading)}</rt></ruby>${esc(trailing)}`;
  }
  return `<ruby>${esc(kanji)}<rt>${esc(reading)}</rt></ruby>`;
}
function makeQ(type,item,pool,activity='choice'){
  let prompt='',answer='',opts=[],audio='',label='',parts=[];
  const pick=(arr,ans)=>shuffle([ans,...shuffle([...new Set(arr.filter(x=>x&&x!==ans))]).slice(0,3)]);
  if(activity==='listen'){
    prompt='Nghe cách đọc và chọn nghĩa đúng.';answer=item.meaning;audio=item.kana;label='Nghe phát âm';opts=pick(pool.filter(x=>x!==item).map(x=>x.meaning),answer);
  }else if(activity==='fill'){
    const sentence=String(type==='grammar'?item.ja:item.kaiwa||'').trim();
    const parts=sentence.split(/\s+/).filter(Boolean);
    const target=type==='grammar'?shuffle(parts.filter(x=>x.length>=2&&/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(x)))[0]:item.kanji&&sentence.includes(item.kanji)?item.kanji:item.kana;
    if(!sentence||!target||!sentence.includes(target))return null;
    prompt=sentence.replace(target,'＿＿＿');answer=target;label='Điền từ vào câu';
    const distractors=type==='grammar'?pool.flatMap(x=>x.ja.split(/\s+/)):pool.filter(x=>x!==item).map(x=>x.kanji||x.kana);
    opts=pick(distractors,answer);audio=type==='grammar'?sentence:item.kana;
  }else if(activity==='order'){
    const sentence=String(type==='grammar'?item.ja:item.kaiwa||'').trim();parts=sentence.split(/\s+/).filter(Boolean);
    if(parts.length<3)return null;
    answer=parts.join(' ');prompt='Chọn lần lượt các cụm từ để tạo câu đúng.';label='Sắp xếp câu';audio=sentence;
  }else if(type==='vocab'){
    prompt=type==='audio'?'(Nghe và chọn nghĩa)':(item.kanji||item.kana);answer=item.meaning;audio=item.kana;
    label='Nghĩa của từ';
    opts=pick(pool.filter(x=>x!==item).map(x=>x.meaning),answer);
  }else{
    prompt=item.kanji;answer=item.hanViet||item.nghia||item.doc;label='Nghĩa của Kanji';opts=pick(pool.filter(x=>x!==item).map(x=>x.hanViet||x.nghia||x.doc),answer);audio=item.doc||''
  }
  const explain=type==='grammar'?`Bài ${item.lesson} · ${item.title}. Ví dụ: ${item.ja}.${item.vi?' Nghĩa: '+item.vi:''}`:type==='kanji'?`Cách đọc: ${item.doc||'—'}. Âm Hán Việt: ${item.hanViet||'—'}. Nghĩa: ${item.nghia||item.tuViNghia||'—'}.`:`${item.kana}${item.kanji?' · '+item.kanji:''} nghĩa là ${item.meaning}.${item.kaiwa?' Ví dụ: '+item.kaiwa+(item.kaiwaVi?' — '+item.kaiwaVi:''):''}`;
  return {type,item,prompt,answer,opts,audio,label,activity,explain,parts}
}
function startQuiz(){
 try{
  const activity=$('quizActivity').value;
  const mode = $('quizMode').value;
  const lessonsSelected = checkedValues('quizLessonChecks');
  const unitsSelected = checkedValues('quizUnitChecks');
  
  const vp = VOCAB_DATA.filter(x => lessonsSelected.includes(String(x.lesson)) && x.meaning && x.kana);
  const kp = KANJI_DATA.filter(x => unitsSelected.includes(String(x.unit)) && x.kanji && (x.doc || x.hanViet));
  
  const allCount = $('quizCount').value === 'all';
  const requested = allCount ? Infinity : Math.max(1, Number($('quizCount').value) || 10);
  
  if((activity==='listen'||activity==='fill'||activity==='order')&&!lessonsSelected.length){ toast('Dạng luyện tập này cần chọn ít nhất một bài từ vựng.'); return; }
  if(activity==='choice'&&mode === 'vocab' && !lessonsSelected.length){ toast('Hãy chọn ít nhất một bài từ vựng.'); return; }
  if(activity==='choice'&&mode === 'kanji' && !unitsSelected.length){ toast('Hãy chọn ít nhất một Unit Kanji.'); return; }
  if(activity==='choice'&&mode === 'mix' && !lessonsSelected.length && !unitsSelected.length){ toast('Hãy chọn bài từ vựng hoặc Unit Kanji để luyện.'); return; }
  
  let candidates = [];
  if(activity==='listen') candidates=shuffle(vp.filter(x=>x.kana)).map(x=>({type:'vocab',item:x,pool:vp}));
  else if(activity==='fill'||activity==='order'){
    const grammarPool=GRAMMAR.filter(x=>lessonsSelected.includes(String(x.lesson))).flatMap(g=>g.examples.filter(ex=>ex.ja&&ex.ja.trim().split(/\s+/).length>=3).map(ex=>({lesson:g.lesson,title:g.title,ja:ex.ja.trim(),vi:ex.vi||''})));
    candidates=shuffle([...vp.filter(x=>String(x.kaiwa||'').trim().split(/\s+/).length>=3).map(x=>({type:'vocab',item:x,pool:vp})),...grammarPool.map(x=>({type:'grammar',item:x,pool:grammarPool}))]);
  }
  else if(mode === 'vocab') candidates = shuffle(vp).map(x => ({type: 'vocab', item: x, pool: vp}));
  else if(mode === 'kanji') candidates = shuffle(kp).map(x => ({type: 'kanji', item: x, pool: kp}));
  else candidates = shuffle([...shuffle(vp).map(x => ({type: 'vocab', item: x, pool: vp})), ...shuffle(kp).map(x => ({type: 'kanji', item: x, pool: kp}))]);
  
  const questions = [];
  for(const c of candidates){
    const q = makeQ(c.type, c.item, c.pool,activity);
    if(q && q.answer && (activity==='order'||(q.opts&&q.opts.length>=2))) questions.push(q);
  }
  
  if(!questions.length){ toast('Không tạo được câu hỏi từ phạm vi này. Hãy chọn thêm bài hoặc Unit khác.'); return; }
  
  const chosen = allCount ? questions : shuffle(questions).slice(0, Math.min(requested, questions.length));
  
  quizRun.qs = chosen;
  quizRun.idx = 0;
  quizRun.correct = 0;
  quizRun.wrong = [];
  quizRun.started = Date.now();
  quizRun.answered = false;
  quizRun.activity=activity;
  
  clearInterval(quizRun.timer);
  quizRun.timer = setInterval(() => {
    const sec = Math.floor((Date.now() - quizRun.started) / 1000);
    const timerEl = $('quizTimer');
    if(timerEl) timerEl.textContent = String(Math.floor(sec/60)).padStart(2,'0') + ':' + String(sec%60).padStart(2,'0');
  }, 1000);
  
  if($('quizTimer')) $('quizTimer').textContent = '00:00';
  
  if($('quizSetup')) $('quizSetup').classList.add('hidden');
  if($('quizResult')) $('quizResult').classList.add('hidden');
  if($('quizPlay')) $('quizPlay').classList.remove('hidden');
  
  renderQuizQ();
 }catch(err){
  console.error('Quiz start error:', err);
  toast('Có lỗi khi tạo bài trắc nghiệm. Hãy kiểm tra lại lựa chọn của bạn.');
 }
}
function renderQuizQ(){const q=quizRun.qs[quizRun.idx];quizRun.answered=false;$('quizMeta').textContent=`Câu ${quizRun.idx+1}/${quizRun.qs.length} · ${q.label}`;$('quizBar').style.width=(quizRun.idx/quizRun.qs.length*100)+'%';$('quizPrompt').innerHTML=q.activity==='listen'?esc(q.prompt):q.activity==='choice'&&q.type==='vocab'?vocabRuby(q.item):esc(q.prompt);$('quizAudio').classList.toggle('hidden',!q.audio);$('quizAudio').onclick=()=>speak(q.audio);$('quizFeedback').classList.add('hidden');$('quizNext').disabled=true;if(q.activity==='order'){quizRun.orderSelected=[];const tiles=shuffle(q.parts.map((text,index)=>({text,index})));$('quizOptions').style.display='block';$('quizOptions').innerHTML=`<div id="orderAnswer" class="order-answer" style="display:flex;flex-wrap:wrap;gap:8px;min-height:52px;padding:10px;border:1px dashed var(--line);border-radius:10px;margin-bottom:12px"></div><div id="orderTiles" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px"></div><button type="button" class="btn primary" id="orderCheck" style="margin-top:14px" disabled>Kiểm tra câu</button>`;const draw=()=>{$('orderAnswer').innerHTML=quizRun.orderSelected.map(x=>`<button type="button" class="btn soft" data-remove="${x.index}">${esc(x.text)}</button>`).join('')||'<span class="meta">Chọn các cụm từ theo đúng thứ tự.</span>';$('orderTiles').innerHTML=tiles.filter(x=>!quizRun.orderSelected.some(y=>y.index===x.index)).map(x=>`<button type="button" class="btn" data-tile="${x.index}">${esc(x.text)}</button>`).join('');$('orderTiles').querySelectorAll('[data-tile]').forEach(b=>b.onclick=()=>{quizRun.orderSelected.push(tiles.find(x=>x.index===+b.dataset.tile));draw()});$('orderAnswer').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{quizRun.orderSelected=quizRun.orderSelected.filter(x=>x.index!==+b.dataset.remove);draw()});$('orderCheck').disabled=quizRun.orderSelected.length!==q.parts.length;$('orderCheck').onclick=()=>answerQuiz(quizRun.orderSelected.map(x=>x.text).join(' '))};draw()}else{$('quizOptions').style.display='';$('quizOptions').innerHTML=q.opts.map((o,i)=>`<button class="option" data-opt="${i}"><b>${'ABCD'[i]}.</b> ${esc(o)}</button>`).join('');$('quizOptions').querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>answerQuiz(+b.dataset.opt))}}
function answerQuiz(choice){if(quizRun.answered)return;quizRun.answered=true;const q=quizRun.qs[quizRun.idx],i=typeof choice==='number'?choice:-1,selected=typeof choice==='number'?q.opts[i]:choice,ok=selected===q.answer;if(ok)quizRun.correct++;else quizRun.wrong.push({q,selected});$('quizOptions').querySelectorAll('[data-opt]').forEach((b,j)=>{b.disabled=true;if(q.opts[j]===q.answer)b.classList.add('correct');else if(j===i)b.classList.add('wrong')});$('quizOptions').querySelectorAll('[data-tile],[data-remove]').forEach(b=>b.disabled=true);const check=$('orderCheck');if(check)check.disabled=true;$('quizFeedback').innerHTML=`<b style="color:${ok?'var(--green)':'var(--red)'}">${ok?'Chính xác!':'Chưa chính xác.'}</b><div style="margin-top:5px">Đáp án: <b>${esc(q.answer)}</b></div><div style="margin-top:10px;padding-top:9px;border-top:1px solid var(--line)"><b>Vì sao?</b><div style="margin-top:4px;line-height:1.6">${esc(q.explain)}</div></div>`;$('quizFeedback').classList.remove('hidden');$('quizFeedback').scrollIntoView({behavior:'smooth',block:'nearest'});$('quizNext').disabled=false;$('quizNext').textContent=quizRun.idx===quizRun.qs.length-1?'Xem kết quả':'Câu tiếp theo →';$('quizBar').style.width=((quizRun.idx+1)/quizRun.qs.length*100)+'%'}
function finishQuiz(){clearInterval(quizRun.timer);const total=quizRun.qs.length,score=quizRun.correct,accuracy=Math.round(score/total*100);state.history.push({date:Date.now(),total,correct:score,accuracy,mode:$('quizMode').value});state.history=state.history.slice(-100);quizRun.wrong.forEach(x=>{if(x.q.type==='grammar')return;const raw=x.q.item;const it=x.q.type==='kanji'?{type:'kanji',key:kKey(raw),front:raw.kanji,reading:raw.doc||'',meaning:[raw.hanViet,raw.nghia,raw.tuViNghia].filter(Boolean).join(' · '),unit:raw.unit,raw}:{type:'vocab',key:vKey(raw),front:raw.kanji||raw.kana,reading:raw.kana,meaning:raw.meaning,lesson:raw.lesson,raw};const c=ensureCard(it);if(!c.learned)c.due=Math.min(c.due||Date.now(),Date.now())});persist();$('quizPlay').classList.add('hidden');$('quizResult').classList.remove('hidden');$('quizRetryWrong').classList.toggle('hidden',!quizRun.wrong.length);$('quizScore').textContent=`${score} / ${total} · ${accuracy}%`;$('quizMessage').textContent=accuracy>=80?'Rất tốt! Hãy duy trì nhịp học này.':accuracy>=50?'Khá ổn. Hãy xem lại câu sai và thử lại.':'Hãy ôn lại dữ liệu rồi làm thêm một lượt nhé.';$('quizWrong').innerHTML=quizRun.wrong.length?'<h3>Câu cần xem lại</h3>'+quizRun.wrong.map(x=>`<article class="item"><div class="item-main"><b>${esc(x.q.prompt)}</b><p>Đáp án đúng: ${esc(x.q.answer)}</p><div class="meta">Bạn chọn: ${esc(x.selected)}</div></div></article>`).join(''):'<div class="empty">Không có câu sai. Tuyệt vời!</div>';updateDashboard()}
$('quizStart').onclick=startQuiz;$('quizNext').onclick=()=>{if(quizRun.idx<quizRun.qs.length-1){quizRun.idx++;renderQuizQ()}else finishQuiz()};$('quizQuit').onclick=()=>ask('Thoát lượt luyện tập hiện tại?',()=>{clearInterval(quizRun.timer);$('quizPlay').classList.add('hidden');$('quizSetup').classList.remove('hidden')},'Thoát');$('quizAgain').onclick=startQuiz;$('quizBack').onclick=()=>{$('quizResult').classList.add('hidden');$('quizSetup').classList.remove('hidden')};
$('quizRetryWrong').onclick=()=>{const missed=quizRun.wrong.map(x=>x.q);if(!missed.length)return;quizRun.qs=shuffle(missed);quizRun.idx=0;quizRun.correct=0;quizRun.wrong=[];quizRun.started=Date.now();quizRun.answered=false;clearInterval(quizRun.timer);quizRun.timer=setInterval(()=>{const sec=Math.floor((Date.now()-quizRun.started)/1000);$('quizTimer').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')},1000);$('quizResult').classList.add('hidden');$('quizPlay').classList.remove('hidden');renderQuizQ()};
// SRS review session
let reviewQueue=[],reviewIdx=0;function renderReviewList(){const type=$('reviewType').value,items=dueItems(type);$('dueCount').textContent=items.length+' thẻ đến hạn';$('reviewList').innerHTML=items.slice(0,100).map(it=>`<article class="item"><div class="item-main"><b>${esc(it.front)}</b><p>${esc(it.meaning)}</p><div class="meta">${it.type==='vocab'?'Từ vựng · Bài '+it.lesson:'Kanji · Unit '+it.unit}</div></div></article>`).join('')||'<div class="empty">Chưa có thẻ đến hạn. Hãy thêm thẻ từ Từ vựng/Kanji hoặc quay lại sau nhé.</div>'}
$('reviewType').onchange=renderReviewList;$('reviewStart').onclick=()=>{reviewQueue=dueItems($('reviewType').value);reviewIdx=0;if(!reviewQueue.length){toast('Chưa có thẻ đến hạn để ôn.');return}$('reviewList').classList.add('hidden');$('reviewSession').classList.remove('hidden');showReviewCard()};function showReviewCard(){const it=reviewQueue[reviewIdx];$('reviewFront').textContent=it.front;$('reviewBack').innerHTML=`<div>${esc(it.reading||'')}</div><div>${esc(it.meaning)}</div>`;$('reviewBack').classList.add('hidden');$('reviewProgress').textContent=`${reviewIdx+1} / ${reviewQueue.length}`;$('reviewFlip').disabled=false}
$('reviewFlip').onclick=()=>{$('reviewBack').classList.toggle('hidden')};document.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>{if($('reviewBack').classList.contains('hidden')){toast('Hãy lật thẻ xem đáp án trước khi tự đánh giá.');return}const it=reviewQueue[reviewIdx],c=ensureCard(it),g=b.dataset.grade;c.seen=(c.seen||0)+1;c.lastReviewed=Date.now();if(g==='again'){c.box=0;c.learned=false;c.due=Date.now()+10*60000}else{const step={hard:1,good:2,easy:4}[g];c.box=Math.min(5,c.box+step);c.learned=true;c.due=Date.now()+({hard:1,good:3,easy:7}[g])*Math.pow(2,Math.max(0,c.box-1))*86400000}persist();reviewIdx++;if(reviewIdx<reviewQueue.length)showReviewCard();else{$('reviewSession').classList.add('hidden');$('reviewList').classList.remove('hidden');renderReviewList();updateDashboard();renderStats();toast('Đã xong lượt ôn.')}});
// Stats + data portability
function renderStats(){
 const h=state.history,total=h.reduce((a,x)=>a+x.total,0),correct=h.reduce((a,x)=>a+x.correct,0);
 $('historySessions').textContent=h.length;$('historyAnswers').textContent=total;$('historyAccuracy').textContent=total?Math.round(correct/total*100)+'%':'0%';
 const dayKey=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
 const active=new Set(h.map(x=>dayKey(x.date)));
 let streak=0,cursor=new Date();cursor.setHours(0,0,0,0);if(!active.has(dayKey(cursor)))cursor.setDate(cursor.getDate()-1);while(active.has(dayKey(cursor))&&streak<365){streak++;cursor.setDate(cursor.getDate()-1)}$('historyStreak').textContent=streak;
 const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(6-i));return d});
 $('activityWeek').innerHTML=days.map(d=>{const key=dayKey(d),n=h.filter(x=>dayKey(x.date)===key).reduce((a,x)=>a+x.total,0);return `<div class="bar-row"><span>${d.toLocaleDateString('vi-VN',{weekday:'short',day:'2-digit'})}</span><div class="bar"><i style="width:${Math.min(100,n*5)}%"></i></div><b>${n}</b></div>`}).join('');
 const recent=h.slice(-7).reverse();$('historyBars').innerHTML=recent.length?recent.map(x=>`<div class="bar-row"><span>${new Date(x.date).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})}</span><div class="bar"><i style="width:${x.accuracy}%"></i></div><b>${x.accuracy}%</b></div>`).join(''):'<p class="meta">Chưa có lịch sử. Hãy làm một bài luyện tập để bắt đầu thống kê.</p>';
}
function exportData(){const blob=new Blob([JSON.stringify({app:'kotoba-n4',version:1,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='kotoba-n4-backup.json';a.click();URL.revokeObjectURL(a.href)}function importData(file){const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);if(!data.state||typeof data.state!=='object')throw new Error();const next={cards:data.state.cards||{},history:data.state.history||[],saved:data.state.saved||[]};ask('Nhập bản sao lưu và thay thế tiến độ hiện tại?',()=>{state=next;persist();updateDashboard();renderReviewList();renderStats();renderVocab();renderKanji();toast('Đã khôi phục tiến độ.')},'Khôi phục')}catch(e){toast('File sao lưu không hợp lệ.')}};r.readAsText(file)}
$('exportBtn').onclick=exportData;$('exportBtn2').onclick=exportData;$('homeBackup').onclick=()=>$('exportBtn').click();$('importBtn').onclick=()=>$('importFile').click();$('importBtn2').onclick=()=>$('importFile').click();$('importFile').onchange=e=>{if(e.target.files[0])importData(e.target.files[0]);e.target.value=''};$('clearProgress').onclick=()=>ask('Xóa toàn bộ tiến độ, lịch sử và thẻ ôn trên thiết bị này? Dữ liệu từ vựng/Kanji gốc không bị xóa.',()=>{state={cards:{},history:[],saved:[]};persist();updateDashboard();renderStats();renderReviewList();renderVocab();renderKanji()},'Xóa');

// Exam simulator refreshed from the two supplied JSON datasets.
// Grammar coverage: Lessons 26–50; Kanji sentences and vocabulary: Units 36–50.


let examRun={qs:[],idx:0,answers:[],started:0,remaining:70*60,timer:null,answered:false};
function examShuffle(a){return shuffle(a.slice())}
function examPickDistinct(arr,n){const seen=new Set();return examShuffle(arr).filter(q=>{const key=String(q.prompt||'').normalize('NFKC').replace(/[\s　]/g,'');if(!key||seen.has(key))return false;seen.add(key);return true}).slice(0,Math.min(n,seen.size))}
function examBuildQuestions(){
 const qs=[];
 // Cloze-style Kanji/vocabulary questions use actual Japanese practice sentences from Units 36–50.
 qs.push(...examPickDistinct(EXAM_KANJI,25));
 // Grammar cloze questions span the supplied grammar guide, Lessons 26–50.
 qs.push(...examPickDistinct(EXAM_GRAMMAR,Math.min(30,EXAM_GRAMMAR.length)));
 return examShuffle(qs.map(q=>({...q,opts:examShuffle(q.opts)})));
}
function examRenderQuestion(){
 const q=examRun.qs[examRun.idx];if(!q)return examFinish();
 examRun.answered=false;
 $('examSectionName').textContent=q.section;
 $('examQuestionMeta').textContent=`Câu ${examRun.idx+1}/${examRun.qs.length}`;
 $('examTypeLabel').textContent=q.section.toUpperCase();
 $('examPrompt').textContent=q.prompt;
 $('examOptions').innerHTML=q.opts.map((o,i)=>`<button class="option" data-exam-opt="${i}"><b>${'1234'[i]||i+1}.</b> ${esc(o)}</button>`).join('');
 $('examFeedback').classList.add('hidden');$('examNext').disabled=true;
 $('examNext').textContent=examRun.idx===examRun.qs.length-1?'Nộp bài':'Câu tiếp theo →';
 $('examProgressBar').style.width=(examRun.idx/examRun.qs.length*100)+'%';
 $('examOptions').querySelectorAll('[data-exam-opt]').forEach(b=>b.onclick=()=>examAnswer(+b.dataset.examOpt));
}
function examAnswer(i){
 if(examRun.answered)return;examRun.answered=true;
 const q=examRun.qs[examRun.idx],selected=q.opts[i],correct=selected===q.answer;
 examRun.answers[examRun.idx]={selected,correct};
 $('examOptions').querySelectorAll('[data-exam-opt]').forEach((b,j)=>{b.disabled=true;if(q.opts[j]===q.answer)b.classList.add('correct');else if(j===i)b.classList.add('wrong')});
 $('examFeedback').innerHTML=`<b>${correct?'Đúng':'Chưa đúng'}</b><div>Đáp án: <strong>${esc(q.answer)}</strong></div><div class="meta">${esc(q.explain||'')}</div>`;
 $('examFeedback').classList.remove('hidden');$('examNext').disabled=false;
 $('examProgressBar').style.width=((examRun.idx+1)/examRun.qs.length*100)+'%';
}
function examStart(){
 clearInterval(examRun.timer);examRun.qs=examBuildQuestions();examRun.idx=0;examRun.answers=[];examRun.started=Date.now();examRun.remaining=70*60;
 if(!examRun.qs.length){toast('Chưa tạo được đề. Kiểm tra dữ liệu câu hỏi.');return}
 $('examSetup').classList.add('hidden');$('examResult').classList.add('hidden');$('examPlay').classList.remove('hidden');document.body.classList.add('exam-focus');
 $('examTimer').textContent='70:00';examRenderQuestion();requestAnimationFrame(()=>{window.scrollTo(0,0);$('examPrompt').focus({preventScroll:true})});
 examRun.timer=setInterval(()=>{examRun.remaining--;const m=Math.floor(Math.max(0,examRun.remaining)/60),sec=Math.max(0,examRun.remaining)%60;$('examTimer').textContent=String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');if(examRun.remaining<=0)examFinish()},1000);
}
function examFinish(){
 clearInterval(examRun.timer);
 const total=examRun.qs.length,correct=examRun.answers.filter(x=>x&&x.correct).length,answered=examRun.answers.filter(Boolean).length,accuracy=total?Math.round(correct/total*100):0;
 state.history.push({date:Date.now(),total,correct,accuracy,mode:'exam'});state.history=state.history.slice(-100);persist();updateDashboard();
 $('examPlay').classList.add('hidden');$('examResult').classList.remove('hidden');document.body.classList.remove('exam-focus');$('examScore').textContent=`${correct} / ${total} · ${accuracy}%`;
 $('examSummary').textContent=`Đã trả lời ${answered}/${total} câu · Thời gian ${Math.floor((Date.now()-examRun.started)/60000)} phút. Kết quả đã được lưu vào thống kê.`;
 $('examReview').innerHTML='<h3>Đáp án và giải thích</h3>'+examRun.qs.map((q,i)=>{const a=examRun.answers[i];return `<div class="exam-review-row"><b>${i+1}. ${esc(q.section)}</b><p style="white-space:pre-line;margin:5px 0">${esc(q.prompt)}</p><p class="${a&&a.correct?'correct-answer':''}" style="margin:4px 0">Đáp án: <b>${esc(q.answer)}</b>${a?` · Bạn chọn: ${esc(a.selected)} ${a.correct?'✓':'✗'}`:' · Chưa trả lời'}</p><div class="meta">${esc(q.explain||'')}</div></div>`}).join('');
 renderStats();
}
function examAbort(){clearInterval(examRun.timer);examRun.timer=null;examRun.qs=[];examRun.answers=[];$('examPlay').classList.add('hidden');$('examSetup').classList.remove('hidden');document.body.classList.remove('exam-focus')}
$('examStart').onclick=examStart;$('examRetry').onclick=()=>{examStart();$('examReview').classList.add('hidden');$('examReviewToggle').textContent='Xem đáp án'};
$('examNext').onclick=()=>{if(examRun.idx<examRun.qs.length-1){examRun.idx++;examRenderQuestion()}else examFinish()};
$('examQuit').onclick=()=>ask('Thoát đề và bỏ kết quả lượt này?',examAbort,'Thoát');
$('examReviewToggle').onclick=()=>{const shown=!$('examReview').classList.contains('hidden');$('examReview').classList.toggle('hidden',shown);$('examReviewToggle').textContent=shown?'Xem đáp án':'Ẩn đáp án'};

// Initial render
setDictionaryTab('vocab');renderVocab();renderKanji();renderGrammar();renderReviewList();updateDashboard();showPage(pageFromPath());
if('speechSynthesis'in window)speechSynthesis.getVoices();

