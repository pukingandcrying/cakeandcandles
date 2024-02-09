import { useEffect, useState } from 'react'
import './App.scss'
import { animate, motion } from 'framer-motion';

function App() {

  let points =     [
    {pos: [15,16], lit: true},
    {pos: [10,10], lit: true},
    {pos: [15,0], lit: true},
    {pos: [20,-5], lit: true},
    {pos: [26,-8], lit: true},
    {pos: [32,-10], lit: true},
    {pos: [38,-12], lit: true},
    {pos: [45,-13], lit: true},
    {pos: [52,-13], lit: true},
    {pos: [59,-12], lit: true},
    {pos: [66,-11], lit: true},
    {pos: [74,-10], lit: true},
    {pos: [82,-6], lit: true},
    {pos: [90,0], lit: true},
    {pos: [95,10], lit: true},
    {pos: [90,14], lit: true},
    {pos: [84,18], lit: true},
    {pos: [78,21], lit: true},
    {pos: [70,23], lit: true},
    {pos: [62,24], lit: true},
    {pos: [55,25], lit: true},
    {pos: [48,25], lit: true},
    {pos: [40,24], lit: true},
  ];
  
    points.sort( (a, b) => a.pos[1] > b.pos[1] );

  const animation = async () => {
    animate(".sitting", {rotate: 2000, x: 400, y: -400}, {duration: 3})
    animate(".cake", {opacity:0}, {delay: 2});
    animate(".message", {opacity:1}, {delay: 2});
  }

  useEffect( () => {
    navigator.mediaDevices
      .getUserMedia({audio:true})
      .then( stream => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const mic = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        mic.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        const loudnessTh = 50;

        scriptProcessor.addEventListener("audioprocess", ()=>{
          
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          let sum = 0;
          array.map( val => {sum += val} );
          let avg = sum/array.length;

          if(avg > loudnessTh){
            console.log("blowing");
            setCandles( prev => {
              let ans = [...prev];
              ans = ans.map( c => (c.lit&&(Math.random() > 0.25))? {...c, lit:false}:c );
              if(ans.findIndex(c => c.lit) == -1){
                animation();
              }
              return ans;
            } )
          }

        });
      } )
      .catch(err=>{ });
  }, [] );

  const [candles, setCandles] = useState(points);

  return (
    <>
      <div>
        <div className="message">
          <h1>
            Hello
          </h1>
          <h3>
             
          </h3>
        </div>
        <div className="cake">
          <div className="plate"></div>
          <div className="layer layer-bottom"></div>
          <div className="layer layer-middle"></div>
          <div className="layer layer-top"></div>
          <div className="icing"></div>
          <div className="drip drip1"></div>
          <div className="drip drip2"></div>
          <div className="drip drip3"></div>
          {
            candles.map( ({pos, lit}) =>{
              console.log(`${50 + pos[0]}%, ${pos[1]}`);
              return <div
                className='candle'
                style={{
                  left:`${pos[0]}%`,
                  top:`${pos[1]}%`
                }}
              >
                {lit && <div className="flame"></div>}
              </div>}
            )
          }
          <img
            className='sitting'
            src="/sitting.gif"
            alt=""
          />
        </div>
      </div>
    </>
  )
}

export default App
