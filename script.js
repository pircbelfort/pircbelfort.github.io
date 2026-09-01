const intro=document.getElementById("intro");window.addEventListener("load",()=>setTimeout(()=>intro.classList.add("out"),6000));
const dot=document.querySelector(".cursor-dot"),ring=document.querySelector(".cursor-ring");let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+"px";dot.style.top=my+"px"});
(function loop(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop)})();
document.querySelectorAll("[data-cursor]").forEach(x=>{x.onmouseenter=()=>x.dataset.cursor==="view"&&ring.classList.add("view");x.onmouseleave=()=>ring.classList.remove("view")});
document.querySelectorAll(".magnetic").forEach(el=>{el.addEventListener("mousemove",e=>{let r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.1,y=(e.clientY-r.top-r.height/2)*.1;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener("mouseleave",()=>el.style.transform="")});
const orb=document.querySelector(".glow");addEventListener("pointermove",e=>{let x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;document.querySelectorAll(".element-card").forEach((c,i)=>c.style.transform=`rotateY(${i? -12+x*4:12+x*4}deg) rotateZ(${i?3+x*2:-3+x*2}deg) translate(${x*(i?7:-7)}px,${y*(i?8:-8)}px)`)});
document.querySelector(".menu").onclick=()=>document.querySelector("#work").scrollIntoView({behavior:"smooth"});

const atmosphere=document.querySelector(".hero-atmosphere");
window.addEventListener("pointermove",e=>{
  if(!atmosphere)return;
  const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;
  atmosphere.querySelectorAll(".float-card").forEach((c,i)=>{
    const f=(i+1)*7;
    c.style.translate=`${x*f}px ${y*f}px`;
  });
});
const inquiryForm=document.getElementById("inquiryForm");
if(inquiryForm){
  const submitBtn=inquiryForm.querySelector("button[type='submit']");
  const note=document.getElementById("formNote");
  inquiryForm.addEventListener("submit",function(e){
    e.preventDefault();
    if(note){note.textContent="Sending...";note.classList.remove("error")}
    if(submitBtn){submitBtn.disabled=true}
    fetch(inquiryForm.action,{
      method:"POST",
      body:new FormData(inquiryForm),
      headers:{"Accept":"application/json"}
    }).then(res=>{
      if(res.ok){
        if(note){note.textContent="Thanks — your message has been sent. I'll get back to you soon.";note.classList.remove("error")}
        inquiryForm.reset();
      }else{
        return res.json().then(data=>{
          const msg=data&&data.errors&&data.errors.length?data.errors.map(x=>x.message).join(", "):"Something went wrong. Please try again or email me directly.";
          if(note){note.textContent=msg;note.classList.add("error")}
        });
      }
    }).catch(()=>{
      if(note){note.textContent="Something went wrong. Please check your connection and try again.";note.classList.add("error")}
    }).finally(()=>{
      if(submitBtn){submitBtn.disabled=false}
    });
  });
}

document.querySelectorAll(".project .art").forEach(art=>{
  art.addEventListener("mousemove",e=>{
    const r=art.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    const tile=art.querySelector(".tile"),word=art.querySelector(".project-word"),poster=art.querySelector(".poster");
    if(tile)tile.style.translate=`${x*18}px ${y*18}px`;
    if(word)word.style.translate=`${x*-10}px ${y*-6}px`;
    if(poster)poster.style.translate=`${x*10}px ${y*10}px`;
  });
  art.addEventListener("mouseleave",()=>{
    art.querySelectorAll(".tile,.project-word,.poster").forEach(x=>x.style.translate="");
  });
});
