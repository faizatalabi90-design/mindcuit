(function(){
 var AC=window.AudioContext||window.webkitAudioContext,ctx,master,active={},tid;
 function init(){if(ctx)return;ctx=new AC();master=ctx.createGain();master.gain.value=vol.value/100*.8;master.connect(ctx.destination)}
 function noise(type){var n=ctx.sampleRate*4,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0),l=0;
  for(var i=0;i<n;i++){var w=Math.random()*2-1;if(type==='brown'){l=(l+.02*w)/1.02;d[i]=l*3.5}else d[i]=w*.5}
  var s=ctx.createBufferSource();s.buffer=b;s.loop=true;return s}
 function lfo(f,depth,param){var o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=f;g.gain.value=depth;o.connect(g);g.connect(param);o.start();return o}
 var make={
  rain:function(out){var n=noise('white'),h=ctx.createBiquadFilter(),l=ctx.createBiquadFilter();h.type='highpass';h.frequency.value=900;l.type='lowpass';l.frequency.value=7000;n.connect(h);h.connect(l);l.connect(out);out.gain.value=.35;n.start();return[n]},
  ocean:function(out){var n=noise('brown'),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='lowpass';f.frequency.value=600;g.gain.value=.5;n.connect(f);f.connect(g);g.connect(out);out.gain.value=1;n.start();return[n,lfo(.1,.4,g.gain),lfo(.1,250,f.frequency)]},
  wind:function(out){var n=noise('brown'),f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=450;f.Q.value=.8;n.connect(f);f.connect(out);out.gain.value=1.2;n.start();return[n,lfo(.07,200,f.frequency)]},
  brown:function(out){var n=noise('brown');n.connect(out);out.gain.value=.7;n.start();return[n]},
  pad:function(out){var g=ctx.createGain(),o=[];g.gain.value=.5;g.connect(out);out.gain.value=.25;
   [110,164.81,220,277.18].forEach(function(f,i){var s=ctx.createOscillator();s.type='sine';s.frequency.value=f;s.detune.value=i*3;var x=ctx.createGain();x.gain.value=.25;s.connect(x);x.connect(g);s.start();o.push(s)});
   o.push(lfo(.12,.25,g.gain));return o}
 };
 var vol=document.getElementById('vol'),status=document.getElementById('status');
 function stop(k){var a=active[k];if(!a)return;var t=ctx.currentTime;a.out.gain.cancelScheduledValues(t);a.out.gain.setValueAtTime(a.out.gain.value,t);a.out.gain.linearRampToValueAtTime(0,t+1);
  setTimeout(function(){a.src.forEach(function(s){try{s.stop()}catch(e){}});a.out.disconnect()},1100);delete active[k]}
 function setBtn(k,on){var b=document.querySelector('[data-s='+k+']');b.setAttribute('aria-pressed',on);b.textContent=on?'Pause':'Play'}
 function stopAll(){Object.keys(active).forEach(function(k){stop(k);setBtn(k,false)});status.textContent=Object.keys(active).length?'':'All sounds stopped.'}
 if(!AC){status.textContent='Your browser does not support audio playback here.';return}
 document.getElementById('sounds').addEventListener('click',function(e){var b=e.target.closest('[data-s]');if(!b)return;var k=b.dataset.s;init();ctx.resume();
  if(active[k]){stop(k);setBtn(k,false)}else{var out=ctx.createGain();out.connect(master);var src=make[k](out);active[k]={out:out,src:src};setBtn(k,true);status.textContent=''}});
 vol.addEventListener('input',function(){if(master)master.gain.value=vol.value/100*.8});
 document.getElementById('stopAll').onclick=stopAll;
 document.getElementById('timer').addEventListener('change',function(e){clearTimeout(tid);var m=+e.target.value;
  if(m){status.textContent='Sounds will fade out in '+m+' minutes.';tid=setTimeout(stopAll,m*60000)}else status.textContent=''});
})();
