(function(){
 var nav=document.getElementById('nav'),open=document.getElementById('menuOpen'),close=document.getElementById('menuClose');
 function set(s){nav.classList.toggle('open',s);open.setAttribute('aria-expanded',s);document.body.style.overflow=s?'hidden':''}
 if(open){open.onclick=function(){set(true)};close.onclick=function(){set(false)};
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)})}
 var flow=document.getElementById('flow');if(!flow)return;
 var steps=flow.querySelectorAll('.step'),label=document.getElementById('stepLabel'),i=0;
 var ta=document.getElementById('thought'),count=document.getElementById('count'),reply=document.getElementById('reply');
 function show(n){i=n;steps.forEach(function(s,k){s.classList.toggle('active',k===n)});label.textContent=(n+1)+'/3';window.scrollTo(0,0)}
 var replies=[
  [/(stress|overwhelm|pressure|tired|exhaust|too much)/i,"It sounds like you've been carrying a lot lately. It's okay to feel overwhelmed. You're human, and your feelings make sense."],
  [/(alone|lonely|nobody|isolated)/i,"Feeling alone is heavy, and reaching out here took something. Your feelings are valid, and you deserve company and care."],
  [/(sad|down|cry|hopeless|empty|unhappy)/i,"I'm sorry it feels this heavy right now. You don't have to make sense of it all today. Your feelings are valid."]];
 var fallback="Thank you for sharing that. Whatever you're feeling is valid, and you don't have to sort it out all at once.";
 ta.addEventListener('input',function(){count.textContent=ta.value.length+'/500'});
 document.getElementById('next1').onclick=function(){
  var t=ta.value,r=fallback;replies.some(function(x){if(x[0].test(t)){r=x[1];return true}});
  reply.textContent=r+" You don't have to have it all figured out right now. Just take one small step. You're doing better than you think.";show(1)};
 document.getElementById('next2').onclick=function(){show(2)};
 document.getElementById('again').onclick=function(){ta.value='';count.textContent='0/500';show(0)};
 document.getElementById('back').onclick=function(){i>0?show(i-1):history.back()};
 document.getElementById('chips').addEventListener('click',function(e){
  var c=e.target.closest('.chip');if(c)document.getElementById('chipMsg').textContent=c.dataset.msg});
})();
