
const round= x=> Math.floor(x*1000000000+0.5)/1000000000;

// TODO Take this from config, lazybones!
const blocktime = 6000;
const days= round((24*60*60*1000)/blocktime);


const emptyCurve= ()=>({
  a:0, b:0, c:0, start: null
})

const curveString = (curve, timeUnit='days')=>{
  //NB recalculate aStart etc taking into account aSteep
  const params=Object.keys(curve);
  let { a, aStart, aSteep, b, bStart, c, max, expiry } = curve;
  timeUnit=timeUnit || 'blocks';

  if (timeUnit==='days') {
    a= round(a/(days*days)) || a;
    b= round(b/(days)) || b;
    c= round(c);
    aStart= round(aStart/(days)) || aStart;
    bStart= round(bStart/(days)) || bStart;
    expiry= round(expiry/(days)) || expiry;
    // TODO: some calculation required for aSteep!

  }

  if (max)
    return `${curveString({...curve, max:0 })} (up to a maximum of ${max})`
  if (expiry)
    return `${curveString({...curve, expiry:0 })} (until ${expiry} ${timeUnit}, then zero)`
  if (aStart)
    return `${curveString({...curve, a:0, aStart:0 })}, ${curveString({...curve, aStart:0 })} after ${aStart} ${timeUnit}`
  if (bStart)
    return `${curveString({...curve, b:0, bStart:0 })}, ${curveString({...curve, bStart:0 })} after ${bStart} ${timeUnit}`
  if (!a && !b)
    return `${ c ?  'constant ' : '' }${ c ? c : 'zero'}`
  return `${ a ?`quadratic: ${a}x^2` :'' }${ b ? `${ !a ? 'linear: ' : ''}${ a&&(b>0) ?'+' :''}${b}x` : `${''}` }${ c ? `${ (a||b)&&(c>0) ?'+' :'' }${c}` : `${''}` }`

}

const nowt=(e, d)=> { console.log(e, d); }

const fakeWait = (ms, result)=> new Promise(resolve=>{
  setTimeout(()=>{ resolve((typeof result === 'function') ? result() : result); }, ms)
})

const paramOrEmptyArr=(obj, propName) =>{
  if (obj && obj[propName]) {
    return Array.isArray(obj[propName])
      ? obj[propName] 
      : [obj[propName]]
  } else 
  return []
}


// For React controlled / uncontrolled input components' different interfaces
const safeNewVal= (unknownThing, expectedType='number')=>
  typeof unknownThing===expectedType
    ? unknownThing 
    : (unknownThing.target && unknownThing.target.value)


const stringChop = (str, size)=> 
  str
    ? size > 0 ? 
      str.match(new RegExp('.{1,' + size + '}', 'g')) 
      : [str]
    : []

const shorten = (str, size=15)=> 
  str
    ? `${str.slice(0, (size-3)/2)}...${str.slice((str.length-(size-3)/2))}`
    : null



export { emptyCurve, curveString, fakeWait, nowt, paramOrEmptyArr, safeNewVal, stringChop, shorten, blocktime, days }

