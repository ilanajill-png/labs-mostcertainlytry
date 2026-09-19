(() => {
  'use strict';
  const compoundInfo={
    ethylAcetate:{label:'Ethyl acetate',note:'Fruity at lower levels; solvent-like when elevated.',color:'#e7a6b8'},
    isoamylAcetate:{label:'Isoamyl acetate',note:'Banana and pear-drop ester.',color:'#e7c36d'},
    aceticAcid:{label:'Acetic acid',note:'Volatile-acidity pathway; concentration matters.',color:'#d77760'},
    linalool:{label:'Linalool',note:'Floral terpene; fly response is treated as distributed.',color:'#b69ad7'},
    geosmin:{label:'Geosmin',note:'Earthy compound with a well-described Or56a → DA2 pathway.',color:'#729b79'},
    ethanol:{label:'Ethanol',note:'Matrix and gain modifier—not assigned to one receptor.',color:'#8ba8c7'}
  };
  const presets={
    ester:{name:'Ester-forward ferment',values:[64,70,8,12,0,48],note:'An invented teaching profile emphasizing fruit esters; not a measured wine.'},
    floral:{name:'Floral terpene study',values:[22,18,5,82,0,36],note:'An invented floral profile designed to stress the distributed terpene channel.'},
    volatile:{name:'Volatile-acidity stress',values:[28,20,84,8,0,52],note:'A teaching fault scenario, not a sensory threshold or safety judgment.'},
    earth:{name:'Geosmin trace test',values:[18,14,8,9,68,34],note:'An intervention profile used to isolate the high-confidence DA2 channel.'},
    balanced:{name:'Balanced teaching blend',values:[44,38,12,28,2,46],note:'A neutral starting point for comparisons; not a varietal model.'},
    blank:{name:'Input-free baseline',values:[0,0,0,0,0,0],note:'Control with every external input at zero.'}
  };
  const compoundKeys=Object.keys(compoundInfo);
  const channelNames=['DM1','DM2','DC4','D / DL5','DA2'];
  const channelColors=['#e7a6b8','#e7c36d','#d77760','#b69ad7','#729b79'];
  const map={
    ethylAcetate:[.86,.34,.02,.08,0],isoamylAcetate:[.26,.92,0,.12,0],
    aceticAcid:[0,0,.96,.04,.03],linalool:[.08,.05,0,.72,0],
    geosmin:[0,0,.02,0,1],ethanol:[.14,.12,.08,.04,0]
  };
  const pnToKC=[
    [.72,.18,-.08,.34,-.22],[.14,.82,-.05,.31,-.12],[-.08,.2,.78,-.1,.26],
    [.28,.16,-.18,.76,-.08],[.38,.44,.05,.12,-.18],[-.12,-.08,.18,.05,.9]
  ];
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const clamp=x=>Math.max(0,Math.min(1,x));
  let mode='biological',silenced='none',sampleA=null,sampleB=null,blindAnswer=null;
  function seededShuffle(values,seed=1909){let n=seed>>>0;const r=()=>((n=(n*1664525+1013904223)>>>0)/4294967296);const out=values.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
  function currentValues(){return Object.fromEntries(compoundKeys.map(k=>[k,Number(q(`[data-compound="${k}"]`).value)/100]))}
  function simulate(values){
    const channels=[0,0,0,0,0];
    Object.entries(values).forEach(([name,value])=>map[name].forEach((w,i)=>channels[i]+=w*value));
    const matrixFactor=.72+.28*values.ethanol;
    for(let i=0;i<channels.length;i++)channels[i]=clamp(channels[i]*matrixFactor);
    if(mode==='silenced'&&silenced!=='none')channels[Number(silenced)]=0;
    let matrix=pnToKC.map(row=>row.slice());
    if(mode==='rewired'){const shuffled=seededShuffle(matrix.flat());matrix=matrix.map((row,i)=>row.map((_,j)=>shuffled[i*row.length+j]))}
    const kc=matrix.map(row=>clamp((row.reduce((sum,w,i)=>sum+w*channels[i],0)-.08)/1.55));
    const fruit=clamp((channels[0]+channels[1]+kc[4]) / 2.55);
    const floral=clamp((channels[3]+kc[3]) / 1.7);
    const alert=clamp((channels[2]+channels[4]+kc[5]) / 2.25);
    const separation=clamp(Math.sqrt(channels.reduce((s,x)=>s+x*x,0)/channels.length));
    return {channels,kc,metrics:[fruit,floral,alert,separation],values};
  }
  function update(){
    compoundKeys.forEach(k=>q(`[data-output="${k}"]`).textContent=q(`[data-compound="${k}"]`).value);
    const result=simulate(currentValues());
    renderNetwork(result);renderMetrics(result);renderSamples();renderInspector(result);
    q('#live-region').textContent=`Circuit updated. Fruit ester ${Math.round(result.metrics[0]*100)}, floral ${Math.round(result.metrics[1]*100)}, alert ${Math.round(result.metrics[2]*100)}.`;
  }
  function renderNetwork(result){
    result.channels.forEach((value,i)=>{
      qa(`[data-channel="${i}"]`).forEach(node=>{node.style.setProperty('--strength',value);node.style.setProperty('--node',channelColors[i]);node.classList.toggle('active',value>.025);node.classList.toggle('silenced',mode==='silenced'&&String(i)===silenced)});
      qa(`[data-edge-channel="${i}"]`).forEach(edge=>{edge.style.setProperty('--strength',value);edge.style.setProperty('--edge',channelColors[i]);edge.classList.toggle('active',value>.025)});
    });
    result.kc.forEach((value,i)=>{const node=q(`[data-kc="${i}"]`);node.style.setProperty('--strength',value);node.style.setProperty('--node','#c39542');node.classList.toggle('active',value>.025)});
    const out=[result.metrics[0],result.metrics[1],result.metrics[2]];
    out.forEach((value,i)=>{const node=q(`[data-output-node="${i}"]`);node.style.setProperty('--strength',value);node.style.setProperty('--node',['#e7c36d','#b69ad7','#d77760'][i]);node.classList.toggle('active',value>.025)});
  }
  function renderMetrics(result){
    const labels=['Fruit-esters','Floral channel','Alert channel','Signature energy'];
    result.metrics.forEach((value,i)=>{q(`[data-metric-value="${i}"]`).textContent=Math.round(value*100);q(`[data-meter="${i}"]`).value=value;q(`[data-metric-label="${i}"]`).textContent=labels[i]});
  }
  function summary(sample){if(!sample)return 'No sample saved yet.';const max=sample.metrics.indexOf(Math.max(...sample.metrics.slice(0,3)));return `${['Fruit-esters','Floral','Alert'][max]} leads · energy ${Math.round(sample.metrics[3]*100)}`}
  function renderSample(slot,sample){q(`#sample-${slot}-summary`).textContent=summary(sample);const bars=qa(`#sample-${slot}-bars .nt-bar`);bars.forEach((bar,i)=>{bar.style.height=`${sample?Math.max(3,sample.channels[i]*100):3}%`;bar.style.setProperty('--bar',channelColors[i])})}
  function renderSamples(){renderSample('a',sampleA);renderSample('b',sampleB);const diff=sampleA&&sampleB?Math.sqrt(sampleA.channels.reduce((s,x,i)=>s+(x-sampleB.channels[i])**2,0)/5):null;q('#distance').textContent=diff===null?'—':Math.round(diff*100)}
  function renderInspector(result){const pairs=result.channels.map((v,i)=>[channelNames[i],v]).sort((a,b)=>b[1]-a[1]);const top=pairs[0];const modeText=mode==='biological'?'documented-input map + project-defined reduced circuit':mode==='silenced'?`same circuit with ${silenced==='none'?'no':channelNames[Number(silenced)]} pathway silenced`:'seeded rewiring control';q('#inspector-title').textContent=`Leading channel: ${top[0]} · ${Math.round(top[1]*100)}`;q('#inspector-copy').textContent=`Running ${modeText}. Readouts are engineered display variables, not fly behavior or wine judgments.`}
  function loadPreset(key,announce=true){const preset=presets[key];compoundKeys.forEach((name,i)=>q(`[data-compound="${name}"]`).value=preset.values[i]);q('#preset-note').textContent=preset.note;if(announce)toast(`${preset.name} loaded`);update()}
  function toast(message){const el=q('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2200)}
  qa('[data-compound]').forEach(input=>input.addEventListener('input',()=>{q('#preset').value='custom';q('#preset-note').textContent='Custom blend. Values are relative teaching inputs, not chemical concentrations.';update()}));
  q('#preset').addEventListener('change',e=>{if(e.target.value!=='custom')loadPreset(e.target.value)});
  qa('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;qa('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));q('#silence-field').hidden=mode!=='silenced';update()}));
  q('#silence').addEventListener('change',e=>{silenced=e.target.value;update()});
  q('#reset').addEventListener('click',()=>{mode='biological';silenced='none';qa('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode==='biological')));q('#silence-field').hidden=true;q('#silence').value='none';q('#preset').value='balanced';loadPreset('balanced');sampleA=sampleB=null;renderSamples()});
  q('#save-a').addEventListener('click',()=>{sampleA=simulate(currentValues());renderSamples();toast('Current circuit saved as A')});
  q('#save-b').addEventListener('click',()=>{sampleB=simulate(currentValues());renderSamples();toast('Current circuit saved as B')});
  q('#blind').addEventListener('click',()=>{const keys=['ester','floral','volatile','earth'];blindAnswer=keys[Math.floor(Math.random()*keys.length)];q('#preset').value='custom';loadPreset(blindAnswer,false);q('#preset-note').textContent='Blind profile loaded. Inspect the circuit, make a guess, then reveal.';q('#reveal').hidden=false;toast('Blind profile loaded')});
  q('#reveal').addEventListener('click',()=>{if(!blindAnswer)return;toast(`Answer: ${presets[blindAnswer].name}`);q('#preset-note').textContent=`Revealed: ${presets[blindAnswer].name}. ${presets[blindAnswer].note}`;q('#reveal').hidden=true;blindAnswer=null});
  loadPreset('balanced',false);
})();
