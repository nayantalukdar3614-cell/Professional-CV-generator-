const $=id=>document.getElementById(id);
const LS="cvgen.data.v2", BK="cvgen.backup.v2";
const LANGS=["Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani","Basque","Belarusian","Bengali","Bosnian","Bulgarian","Burmese","Catalan","Cebuano","Chinese (Mandarin)","Chinese (Cantonese)","Croatian","Czech","Danish","Dutch","English","Estonian","Filipino","Finnish","French","Galician","Georgian","German","Greek","Gujarati","Haitian Creole","Hausa","Hebrew","Hindi","Hungarian","Icelandic","Igbo","Indonesian","Irish","Italian","Japanese","Javanese","Kannada","Kazakh","Khmer","Korean","Kurdish","Kyrgyz","Lao","Latin","Latvian","Lithuanian","Macedonian","Malagasy","Malay","Malayalam","Maltese","Maori","Marathi","Mongolian","Nepali","Norwegian","Odia","Pashto","Persian (Farsi)","Polish","Portuguese","Punjabi","Romanian","Russian","Serbian","Sindhi","Sinhala","Slovak","Slovenian","Somali","Spanish","Swahili","Swedish","Tajik","Tamil","Telugu","Thai","Tibetan","Turkish","Turkmen","Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Xhosa","Yoruba","Zulu","Sign Language"];
const blank=()=>({p:{name:"",jobTitle:"",phone:"",email:"",address:"",website:"",profile:""},d:{father:"",mother:"",dob:"",religion:"",marital:"",blood:"",village:"",postOffice:"",policeStation:"",district:""},photo:"",skills:[],langs:[],
  exp:[{company:"",date:"",role:"",bullets:[]}],edu:[{degree:"",date:"",school:"",gpa:""}],refs:[{name:"",role:"",phone:"",email:""}]});
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const parse=s=>{try{return s?JSON.parse(s):null}catch(e){return null}};
let S=Object.assign(blank(),parse(ls.get(LS))||{});S.d=Object.assign(blank().d,S.d);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const lines=t=>String(t).split(/\n/).map(x=>x.trim()).filter(Boolean);
const save=()=>ls.set(LS,JSON.stringify(S));

const IC={
 phone:'<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
 mail:'<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
 pin:'<svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
 web:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
 user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
 work:'<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/></svg>',
 id:'<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 17c.5-2 5.5-2 6 0M14 9h5M14 13h5"/></svg>',
 edu:'<svg viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2.5 9 2.5 12 0v-5"/></svg>'
};
const heading=(ic,t)=>`<div class="section-heading"><span class="round-icon">${IC[ic]}</span><h3>${t}</h3></div>`;

/* ---------- editors ---------- */
const GROUPS={
 exp:{el:"expEditor",f:[["company","Company"],["date","Date"],["role","Role"],["bullets","Bullet points (one per line)","ta"]],mk:()=>({company:"",date:"",role:"",bullets:[]})},
 edu:{el:"eduEditor",f:[["degree","Degree"],["date","Date"],["school","School/University"],["gpa","CGPA"]],mk:()=>({degree:"",date:"",school:"",gpa:""})},
 refs:{el:"refEditor",f:[["name","Name"],["role","Company / role"],["phone","Phone"],["email","Email"]],mk:()=>({name:"",role:"",phone:"",email:""})}
};
function renderEditors(){
  for(const g in GROUPS){
    const {el,f}=GROUPS[g];
    $(el).innerHTML=S[g].map((it,i)=>`<div class="repeat-card">${i>0?`<button type="button" class="remove-item" data-rm="${g}:${i}">Remove</button>`:""}`+
      f.map(([k,l,t])=>t==="ta"
        ?`<label>${l}<textarea data-g="${g}" data-i="${i}" data-k="${k}">${esc((it[k]||[]).join("\n"))}</textarea></label>`
        :`<label>${l}<input data-g="${g}" data-i="${i}" data-k="${k}" value="${esc(it[k])}"></label>`).join("")+`</div>`).join("");
  }
  document.querySelectorAll("[data-d]").forEach(e=>e.value=S.d[e.dataset.d]||"");
  document.querySelectorAll("[data-p]").forEach(e=>e.value=S.p[e.dataset.p]||"");
  $("skillChips").innerHTML=S.skills.map((s,i)=>`<span class="chip">${esc(s)}<button type="button" data-rs="${i}">✕</button></span>`).join("");
  $("langChips").innerHTML=S.langs.map((l,i)=>`<span class="chip">${esc(l.n)} (${esc(l.l)})<button type="button" data-rl="${i}">✕</button></span>`).join("");
}

/* ---------- CV ---------- */
const filled=o=>Object.values(o).some(v=>Array.isArray(v)?v.length:String(v).trim());
function renderCV(){
  const p=S.p;
  $("cvName").textContent=p.name; $("cvJob").textContent=p.jobTitle;
  const img=$("cvPhoto");
  if(S.photo){img.src=S.photo;img.style.display="block";$("photoPh").style.display="none"}
  else{img.removeAttribute("src");img.style.display="none";$("photoPh").style.display="block"}

  const refs=S.refs.filter(filled), exp=S.exp.filter(filled), edu=S.edu.filter(filled);
  let side="";
  if(S.skills.length) side+=`<section class="side-section"><h3>SKILLS</h3><ul class="bullet-list">${S.skills.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></section>`;
  if(S.langs.length) side+=`<section class="side-section"><h3>LANGUAGES</h3><ul class="bullet-list">${S.langs.map(l=>`<li>${esc(l.n)} (${esc(l.l)})</li>`).join("")}</ul></section>`;
  if(refs.length) side+=`<section class="side-section"><h3>REFERENCE</h3>${refs.map(r=>`<div class="ref">${r.name?`<strong>${esc(r.name)}</strong>`:""}${r.role?`<div>${esc(r.role)}</div>`:""}${r.phone?`<div><b>Phone:</b> ${esc(r.phone)}</div>`:""}${r.email?`<div><b>Email:</b> ${esc(r.email)}</div>`:""}</div>`).join("")}</section>`;
  $("sidebar").innerHTML=side;

  let main="";
  if(p.profile.trim()) main+=`<section class="main-section">${heading("user","PROFILE")}<p class="profile-text">${esc(p.profile)}</p></section>`;
  const c=[["phone",p.phone],["mail",p.email],["pin",p.address],["web",p.website]].filter(x=>x[1].trim());
  if(c.length) main+=`<section class="main-section">${heading("phone","CONTACT")}<div class="contact-grid">${c.map(([i,v])=>`<div class="contact-item">${IC[i]}<span>${esc(v)}</span></div>`).join("")}</div></section>`;
  if(exp.length) main+=`<section class="main-section">${heading("work","WORK EXPERIENCE")}<div class="timeline">${exp.map(e=>`<article class="timeline-item"><div class="item-top"><h4 class="item-title">${esc(e.company)}</h4><span class="item-date">${esc(e.date)}</span></div>${e.role?`<div class="item-role">${esc(e.role)}</div>`:""}${e.bullets.length?`<ul class="item-bullets">${e.bullets.map(b=>`<li>${esc(b)}</li>`).join("")}</ul>`:""}</article>`).join("")}</div></section>`;
  if(edu.length) main+=`<section class="main-section">${heading("edu","EDUCATION")}<div class="timeline">${edu.map(e=>`<article class="timeline-item"><div class="item-top"><h4 class="item-title">${esc(e.degree)}</h4><span class="item-date">${esc(e.date)}</span></div>${e.school?`<div class="edu-school">${esc(e.school)}</div>`:""}${e.gpa?`<div class="edu-gpa">CGPA: ${esc(e.gpa)}</div>`:""}</article>`).join("")}</div></section>`;
  const d=S.d,L=[["Father's Name",d.father],["Mother's Name",d.mother],["Date of Birth",d.dob],["Religion",d.religion],["Marital Status",d.marital],["Blood Group",d.blood]].filter(x=>x[1].trim());
  const A=[["Village",d.village],["Post Office",d.postOffice],["Police Station",d.policeStation],["District",d.district]].filter(x=>x[1].trim());
  if(L.length||A.length) main+=`<section class="main-section">${heading("id","PERSONAL DETAILS")}<div class="details-grid">${L.map(([k,v])=>`<div class="d-item"><b>${k}:</b> ${esc(v)}</div>`).join("")}${A.length?`<div class="d-item d-wide"><b>Permanent Address:</b><div class="d-addr">${A.map(([k,v])=>`<div>${k}: ${esc(v)}</div>`).join("")}</div></div>`:""}</div></section>`;
  $("mainContent").innerHTML=main;
  fit();
}

/* ---------- scale to screen ---------- */
function fit(){
  const MM=96/25.4, W=210*MM, H=297*MM;
  const avail=$("pageBox").parentElement.clientWidth-(innerWidth<=900?0:0);
  const s=Math.min(1,(avail||W)/W);
  $("cvPage").style.transform=`scale(${s})`;
  $("pageBox").style.width=W*s+"px"; $("pageBox").style.height=H*s+"px";
  const over=$("mainContent").scrollHeight>$("mainContent").clientHeight+2||$("sidebar").scrollHeight>$("sidebar").clientHeight+2;
  $("warn").hidden=!over;
}
addEventListener("resize",fit);
function buildPrint(bw){
  const old=$("printRoot");if(old)old.remove();
  const r=document.createElement("div");r.id="printRoot";
  if(bw)r.classList.add("bw");
  const c=$("cvPage").cloneNode(true);
  c.removeAttribute("id");c.querySelectorAll("[id]").forEach(e=>e.removeAttribute("id"));
  c.style.transform="none";r.appendChild(c);document.body.appendChild(r);
}
addEventListener("beforeprint",()=>{if(!$("printRoot"))buildPrint()});
addEventListener("afterprint",()=>{const r=$("printRoot");if(r)r.remove();fit()});

/* ---------- events ---------- */
document.addEventListener("change",e=>{const t=e.target;if(t.tagName==="SELECT"&&t.dataset.d!==undefined){S.d[t.dataset.d]=t.value;save();renderCV()}});
document.addEventListener("input",e=>{
  const t=e.target;
  if(t.dataset.p!==undefined){S.p[t.dataset.p]=t.value}
  else if(t.dataset.d!==undefined){S.d[t.dataset.d]=t.value}
  else if(t.dataset.g){S[t.dataset.g][+t.dataset.i][t.dataset.k]=t.dataset.k==="bullets"?lines(t.value):t.value}
  else return;
  save();renderCV();
});
document.addEventListener("click",e=>{
  const d=e.target.dataset;
  if(d.rm){const[g,i]=d.rm.split(":");S[g].splice(+i,1);renderEditors()}
  else if(d.rs!==undefined)S.skills.splice(+d.rs,1),renderEditors();
  else if(d.rl!==undefined)S.langs.splice(+d.rl,1),renderEditors();
  else return;
  save();renderCV();
});
function addSkill(){const v=$("skillIn").value.trim();if(!v)return;S.skills.push(v);$("skillIn").value="";renderEditors();save();renderCV();$("skillIn").focus()}
$("skillAdd").onclick=addSkill;
$("skillIn").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addSkill()}});
$("langSel").innerHTML=LANGS.map(l=>`<option>${l}</option>`).join("");
$("langSel").value="English";
$("langAdd").onclick=()=>{const n=$("langSel").value,l=$("levelSel").value;
  const x=S.langs.find(o=>o.n===n); if(x)x.l=l; else S.langs.push({n,l});
  renderEditors();save();renderCV()};
[["addExp","exp"],["addEdu","edu"],["addRef","refs"]].forEach(([b,g])=>$(b).onclick=()=>{S[g].push(GROUPS[g].mk());renderEditors();save();renderCV();
  const c=$(GROUPS[g].el).lastElementChild;c&&c.scrollIntoView({block:"nearest"})});

$("photoInput").addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{
    const m=600,k=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement("canvas");
    c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);
    S.photo=c.toDataURL("image/jpeg",.85);save();renderCV()};im.src=r.result};
  r.readAsDataURL(f);
});

function updRestore(){$("restoreBtn").disabled=!ls.get(BK)}
$("clearBtn").onclick=()=>{
  if(!S.photo&&!filled(S.p)&&!filled(S.d)&&!S.skills.length&&!S.langs.length&&!S.exp.some(filled)&&!S.edu.some(filled)&&!S.refs.some(filled))return;
  ls.set(BK,JSON.stringify(S)); window._bk=JSON.stringify(S);
  S=blank();$("photoInput").value="";renderEditors();save();renderCV();updRestore();
};
$("restoreBtn").onclick=()=>{
  const b=parse(ls.get(BK))||parse(window._bk);if(!b)return;
  S=Object.assign(blank(),b);renderEditors();save();renderCV();
};
const colorMode=()=>document.querySelector('input[name=cmode]:checked').value;
$("exportBtn").onclick=()=>{$("exportModal").hidden=false};
$("closeModal").onclick=()=>{$("exportModal").hidden=true};
$("exportModal").addEventListener("click",e=>{if(e.target.id==="exportModal")e.target.hidden=true});
$("doPrint").onclick=()=>{
  const bw=colorMode()==="bw";
  $("exportModal").hidden=true;
  buildPrint(bw);
  setTimeout(()=>{try{window.focus();window.print()}catch(e){alert("Print is blocked here. Open the file directly in Chrome/Edge/Firefox and use Ctrl+P.")}},100);
};
async function makePdf(bw){
  if(!window.html2canvas||!window.jspdf)throw new Error("lib");
  const host=document.createElement("div");
  host.style.cssText="position:fixed;left:0;top:0;z-index:-1;width:210mm;height:297mm;overflow:hidden;background:#fff";
  const c=$("cvPage").cloneNode(true);
  c.removeAttribute("id");c.querySelectorAll("[id]").forEach(e=>e.removeAttribute("id"));
  c.style.cssText="position:relative;left:0;top:0;transform:none;box-shadow:none;width:210mm;height:297mm";
  host.appendChild(c);document.body.appendChild(host);
  try{
    await new Promise(r=>setTimeout(r,60));
    let cv=await html2canvas(c,{scale:2,backgroundColor:"#ffffff",useCORS:true,logging:false});
    if(bw){
      const g=document.createElement("canvas");g.width=cv.width;g.height=cv.height;
      const x=g.getContext("2d");x.drawImage(cv,0,0);
      const im=x.getImageData(0,0,g.width,g.height),d=im.data;
      for(let i=0;i<d.length;i+=4){const y=.299*d[i]+.587*d[i+1]+.114*d[i+2];d[i]=d[i+1]=d[i+2]=y}
      x.putImageData(im,0,0);cv=g;
    }
    const pdf=new window.jspdf.jsPDF({unit:"mm",format:"a4",orientation:"portrait"});
    pdf.addImage(cv.toDataURL("image/jpeg",.95),"JPEG",0,0,210,297);
    return pdf.output("blob");
  }finally{host.remove()}
}
$("doPdf").onclick=async()=>{
  const b=$("doPdf"),old=b.textContent,bw=colorMode()==="bw";
  b.disabled=true;b.textContent="Preparing PDF…";
  try{
    const blob=await makePdf(bw);
    const nm=(S.p.name||"").replace(/[^A-Za-z0-9_\- ]/g,"").trim().replace(/\s+/g,"_")||"CV";
    const filename=nm+(nm==="CV"?"":"_CV")+(bw?"_BW":"")+".pdf";
    let dl=null;
    try{if(window.claude&&window.claude.use)dl=await window.claude.use("downloads")}catch(e){}
    if(dl){await dl.save({filename,data:blob})}
    else{const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
    $("exportModal").hidden=true;
  }catch(e){
    if(e&&e.code==="declined")return;
    alert(e&&e.message==="lib"?"PDF engine could not load (internet needed once). Use the Print button instead.":"Could not create the PDF: "+((e&&e.message)||e));
  }finally{b.disabled=false;b.textContent=old}
};
function setView(v){document.body.dataset.view=v;$("tabEdit").classList.toggle("active",v==="edit");$("tabView").classList.toggle("active",v==="preview");fit();scrollTo(0,0)}
$("tabEdit").onclick=()=>setView("edit");$("tabView").onclick=()=>setView("preview");

renderEditors();renderCV();updRestore();
