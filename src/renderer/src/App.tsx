

import { useEffect, useState } from "react";
import "./assets/main.css"
import sunIcon from './assets/sun.png';

function App(): React.JSX.Element {

  const [monitors, setMonitors] = useState<any[]>([]);

  useEffect(() => {
    const fetchMonitors = async () => {
      const data = await window.api.getMonitors();
      setMonitors(data);
      console.log(data);
    };
    
    fetchMonitors();
  }, [])

  const updateBrightness = (monitorId: string, newValue: number) => {
    window.api.updateBrightness(monitorId, newValue);

    setMonitors(prev =>
      prev.map(m => m.id === monitorId ? { ...m, brightness: newValue } : m)
    )
  }

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const range = e.target;
    const value = range.value;
    
    // Меняем background-size как в твоем примере
    const min = range.min ? parseFloat(range.min) : 0;
    const max = range.max ? parseFloat(range.max) : 100;
    const valuePercent = `${((parseInt(value) - min) / (max - min)) * 100}%`;
    range.style.backgroundSize = `${valuePercent} 100%`;
  };

  return (
    <>
      <div className='main_wrapper'>

        <div className="monitor_box_wrapper">

          {monitors.map(monitor => (
            <div className="monitor_box" key={monitor.id}>
              <div className="input_box">
                <img src={sunIcon} alt="" className="input_img" id="input_img_small" />
                <input type="range" className="range_style" defaultValue={monitor.brightness} onChange={(e) => {handleRangeChange(e); updateBrightness(monitor.id, parseInt(e.target.value))}} style={{backgroundSize: `${monitor.brightness}% 100%`}} step={5}/>
                <img src={sunIcon} alt="" className="input_img" />
              </div>
              <div className="range_name_style">Монитор: {monitor.name}</div>
              <div className="brightness">Яркость: {monitor.brightness}</div>
            </div>
            ))
          }

        </div>
        
      </div>
    </>
  )
}

export default App
