import { Button, Slider, Switch, TextField } from "@mui/material"
import { useEffect, useState } from "react"

import { VscGraphLine } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";


function Home() {

  const [ipEsp32State, setIpEsp32State] = useState("")
  const [ipArdMkr1000State, setIpArdMkr1000State] = useState("")

  const [ipEsp32, setIpEsp32] = useState("172.20.10.5")
  const [ipArdMkr1000, setIpArdMkr1000] = useState("172.20.10.3")

  const [unlock1, setUnlock1] = useState(false)
  const [unlock2, setUnlock2] = useState(false)

  const [led1Value, setLed1Value] = useState(0)
  const [led2Value, setLed2Value] = useState(0)

  const [temLimitDHT, setTemLimitDHT] = useState(0)
  const [humLimitDHT, setHumLimitDHT] = useState(0)

  const [temLimitBMP, setTemLimitBMP] = useState(0)
  const [presLimitBMP, setPresLimitBMP] = useState(0)


  const [dht_data, setDht_data] = useState([])

  const [bmp_data, setBmp_data] = useState([])

  const handleIp = () => {
    setIpArdMkr1000(ipArdMkr1000State)
    setIpEsp32(ipEsp32State)
  }

  const navigate = useNavigate()

  const handleLights = async () => {
    if (unlock1) {
      console.log("Sending to ligth 1")
      try {
        await fetch(`http://${ipArdMkr1000}/led/${led1Value}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      } catch (err) {
        console.log(err)
      }
    }

    if (unlock2) {
      try {
        await fetch(`http://${ipEsp32}/led?value=${led2Value}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function fetchData1() {
    if (!unlock1) {
      await fetch(`http://${ipArdMkr1000}/led/0`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } else {
      await fetch(`http://${ipArdMkr1000}/led/${led1Value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }

  useEffect(() => {
    fetchData1()
  }, [unlock1])

  async function fetchData2() {
    if (!unlock2) {
      await fetch(`http://${ipEsp32}/led?value=0`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } else {
      await fetch(`http://${ipEsp32}/led?value=${led2Value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }

  useEffect(() => { 
    fetchData2()
  }, [unlock2])

  //DHT Sensor

  const handleDHT = () => {
    handleHumDHT()
    handleTemDHT()
  }



  const handleTemDHT = async () => {
    try {
      await fetch(`http://${ipArdMkr1000}/tem/${temLimitDHT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleHumDHT = async () => {
    try {
      await fetch(`http://${ipArdMkr1000}/hum/${humLimitDHT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (err) {
      console.log(err)
    }
  }


  const handleBMP = () => {
    handlePresbmp()
    handleTembmp()
  }



  const handleTembmp = async () => {
    try {
      await fetch(`http://${ipEsp32}/tem?value=${temLimitBMP}`)
    } catch (err) {
      console.log(err)
    }
  }

  const handlePresbmp = async () => {
    try {
      await fetch(`http://${ipEsp32}/pres?value=${presLimitBMP}`)
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className="bg-zinc-900 h-screen w-full flex justify-center items-center">



      <div className="h-[80%] w-[50%] flex flex-col justify-center items-center">


        <div className="w-full p-2 flex justify-between">

          <div className="w-[30%] bg-white h-full p-4 shadow-inner mr-4 rounded-lg flex justify-center text-zinc-600 items-center
            hover:bg-zinc-600
            hover:text-zinc-100
            hover:cursor-pointer
            transitions
          " onClick={() => navigate("/graphs")}>
            <VscGraphLine className="text-8xl"/>
          </div>

          <div className="bg-white w-[70%] rounded-lg shadow-inner flex flex-col p-4">
            <div className=" w-full flex justify-between mb-4">
              <span className="font-semibold">IP ASSIGN</span>
              <Button variant="contained" onClick={() => handleIp}>SEND</Button>
            </div>

            <div className="w-full flex justify-between">
              <div>
                <span className="font-light text-zinc-500 text-sm">
                  ArduinoMKR1000
                </span>
                <div className="mt-2">
                  <TextField id="outlined-basic" label="IP Address" variant="outlined" type="text" onChange={(e) => setIpArdMkr1000State(e.target.value)} />
                </div>
              </div>

              <div>
              <span className="font-light text-zinc-500 text-sm">
                  NodMCUEsp32
                </span>

                <div className="mt-2">
                  <TextField id="outlined-basic" label="IP Address" variant="outlined" type="text" onChange={(e) => setIpEsp32State(e.target.value)} />
                </div>
              </div>

            </div>
          </div>


        </div>




        <div className="w-full flex justify-center items-center">

          <div className="w-[70%] h-full flex flex-col justify-between p-2">

            <div className="bg-white w-full h-[50%] rounded-lg shadow-inner p-4">

              <div className="w-full flex justify-between">
                <span className="font-semibold">DHT11</span>
                <Button variant="contained" onClick={() => handleDHT()}>Update</Button>
              </div>

              <div className="flex justify-between mt-4">

                <div className="w-auto flex flex-col items-start mr-4">
                  <span className="font-light text-zinc-500 text-sm">
                    Temperature (°C)
                  </span>

                  <div className="mt-2">
                    <TextField id="outlined-basic" label="Limit" variant="outlined" type="number" onChange={(e) => setTemLimitDHT(e.target.value)} />
                  </div>
                </div>

                <div className="w-auto flex flex-col items-start">
                  <span className="font-light text-zinc-500 text-sm">
                    Humidity (%)
                  </span>

                  <div className="mt-2">
                    <TextField id="outlined-basic" label="Limit" variant="outlined" type="number" onChange={(e) => setHumLimitDHT(e.target.value)} />
                  </div>
                </div>

              </div>

            </div>

            <div className="bg-white w-full h-[50%] rounded-lg shadow-inner p-4 mt-4">

              <div className="w-full flex justify-between">
                <span className="font-semibold">BMP180</span>
                <Button variant="contained" onClick={() => handleBMP()}>Update</Button>
              </div>

              <div className="flex justify-between mt-4">

                <div className="w-auto flex flex-col items-start mr-4">
                  <span className="font-light text-zinc-500 text-sm">
                    Temperature (C°)
                  </span>

                  <div className="mt-2">
                    <TextField id="outlined-basic" label="Limit" variant="outlined" type="number" onChange={(e) => setTemLimitBMP(e.target.value)} />
                  </div>
                </div>

                <div className="w-auto flex flex-col items-start">
                  <span className="font-light text-zinc-500 text-sm">
                    Pressure (hPa)
                  </span>

                  <div className="mt-2">
                    <TextField id="outlined-basic" label="Limit" variant="outlined" type="number" onChange={(e) => setPresLimitBMP(e.target.value)} />
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div className="w-[30%] h-full p-2">
            <div className="w-full h-full bg-white rounded-lg shadow-inner flex flex-col justify-between">
              <div className="w-full h-[40%]">

                <span className="w-full flex justify-between p-4 items-center font-light">
                  <p>Primary Light </p>
                  <Switch onChange={() => setUnlock1(!unlock1)} />
                </span>

                <span className="w-full flex justify-between p-4 items-center font-light">
                  <p>Secondary Light </p>
                  <Switch onChange={() => setUnlock2(!unlock2)} />
                </span>

              </div>

              <div className="w-full h-[60%] flex flex-col justify-between">
                <div className="w-full p-4">

                  <div className="w-full">
                    <p className="text-xs text-zinc-500 font-light">Primary Light</p>
                    <div className="px-2 py-1">
                      <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" onChange={(e) => {
                        setLed1Value(parseInt(parseInt(e.target.value) * 2.55))
                      }} />
                    </div>
                  </div>

                  <div className="w-full">
                    <p className="text-xs text-zinc-500 font-light">Secondary Light</p>
                    <div className="px-2 py-1">
                      <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" onChange={(e) => {
                        setLed2Value(parseInt(parseInt(e.target.value) * 2.55))
                      }} />
                    </div>
                  </div>

                </div>

                <div className="flex justify-end items-end px-4 mb-4">
                  <Button variant="contained" onClick={() => handleLights()}>UPDATE</Button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Home
