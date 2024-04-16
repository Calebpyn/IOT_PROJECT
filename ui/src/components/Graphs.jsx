import React, { useEffect, useState } from 'react'
import { Button, Slider, TextField } from "@mui/material"
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from 'react-router-dom';

function Graphs() {

    const navigate = useNavigate()


    const [data_dht, setData_dht] = useState([])
    const [data_bmp, setData_bmp] = useState([])

    const [bmp_t_bp, setBmp_t_bp] = useState(1)
    const [bmp_t_bp_input, setBmp_t_bp_input] = useState(1)

    const [bmp_p_bp, setBmp_p_bp] = useState(1)
    const [bmp_p_bp_input, setBmp_p_bp_input] = useState(1)

    const [dht_t_bp, setDht_t_bp] = useState(1)
    const [dht_t_bp_input, setDht_t_bp_input] = useState(1)

    const [dht_h_bp, setDht_h_bp] = useState(1)
    const [dht_h_bp_input, setDht_h_bp_input] = useState(1)


    const [dht_comp_t, setDht_comp_t] = useState([])
    const [bmp_comp_t, setBmp_comp_t] = useState([])



    const [axis_data, setAxis_data] = useState([])


    //Handle fetching

    const handleDataDHT = async () => {
        try {
            const httpResponse = await fetch("https://pmvkjhoxsepoqquuwada.supabase.co/rest/v1/dht_data?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdmtqaG94c2Vwb3FxdXV3YWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMTM1NzMsImV4cCI6MjAyODY4OTU3M30.cri1tY-kWYlOlQl1kWQo23CQoj-zRkGcg94TGglYJnU")

            const data = await httpResponse.json()

            const cleanData = handleDataCleanning(data, "dht_t", "dht_h")

            setData_dht(cleanData)

        } catch (err) {
            console.log(err)
        }
    }

    const handleDataBMP = async () => {
        try {

            const httpResponse = await fetch("https://pmvkjhoxsepoqquuwada.supabase.co/rest/v1/bmp_data?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdmtqaG94c2Vwb3FxdXV3YWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMTM1NzMsImV4cCI6MjAyODY4OTU3M30.cri1tY-kWYlOlQl1kWQo23CQoj-zRkGcg94TGglYJnU")

            const data = await httpResponse.json()

            const cleanData = handleDataCleanning(data, "bmp_t", "bmp_p")

            setData_bmp(cleanData)



        } catch (err) {
            console.log(err)
        }
    }




    //Processing layer
    const handleDataCleanning = (data, x, y) => {
        let dummy = []
        for (let i = 0; i < data.length; i++) {
            let jsonDummy = {
                [x]: data[i][x],
                [y]: data[i][y],
            }
            dummy.push(jsonDummy)
        }
        return dummy
    }

    const handleDataSimplify = (data, element) => {
        let dummy = []
        for (let i = 0; i < data.length; i++) {
            dummy.push(data[i][element])
        }
        return dummy
    }

    const handleDataBreakPoints = (data, element, intervals) => {
        let dummy = []
        for (let i = 0; i < data.length; i += intervals) {
            dummy.push(data[i][element])
        }
        return dummy
    }

    const maxDataLenght = () => {
        var maxValue = 0
        if (data_dht.length > data_bmp.length) {
            maxValue = data_bmp.length - 1
        } else {
            maxValue = data_dht.length - 1
        }

        let dhtDummy = handleDataSimplify(data_dht, "dht_t").slice(1).slice(-maxValue)
        let bmpDummy = handleDataSimplify(data_bmp, "bmp_t").slice(1).slice(-maxValue)

        const dummy = []
        for (let i = 0; i < maxValue; i++) {
            dummy.push(i.toString())
        }

        setDht_comp_t(dhtDummy)
        setBmp_comp_t(bmpDummy)

        setAxis_data(dummy)

        console.log(dummy)

    }



    useEffect(() => {
        handleDataDHT()
        handleDataBMP()

        maxDataLenght()
    }, [])




    //Test zone

    const years = [
        new Date(1990, 0, 1),
        new Date(1991, 0, 1),
        new Date(1992, 0, 1),
        new Date(1993, 0, 1),
        new Date(1994, 0, 1),
        new Date(1995, 0, 1),
        new Date(1996, 0, 1),
        new Date(1997, 0, 1),
        new Date(1998, 0, 1),
        new Date(1999, 0, 1),
        new Date(2000, 0, 1),
        new Date(2001, 0, 1),
        new Date(2002, 0, 1),
        new Date(2003, 0, 1),
        new Date(2004, 0, 1),
        new Date(2005, 0, 1),
        new Date(2006, 0, 1),
        new Date(2007, 0, 1),
        new Date(2008, 0, 1),
        new Date(2009, 0, 1),
        new Date(2010, 0, 1),
        new Date(2011, 0, 1),
        new Date(2012, 0, 1),
        new Date(2013, 0, 1),
        new Date(2014, 0, 1),
        new Date(2015, 0, 1),
        new Date(2016, 0, 1),
        new Date(2017, 0, 1),
        new Date(2018, 0, 1),
    ];

    const FranceGDPperCapita = [
        28129, 28294.264, 28619.805, 28336.16, 28907.977, 29418.863, 29736.645, 30341.807,
        31323.078, 32284.611, 33409.68, 33920.098, 34152.773, 34292.03, 35093.824,
        35495.465, 36166.16, 36845.684, 36761.793, 35534.926, 36086.727, 36691, 36571,
        36632, 36527, 36827, 37124, 37895, 38515.918,
    ];

    const UKGDPperCapita = [
        26189, 25792.014, 25790.186, 26349.342, 27277.543, 27861.215, 28472.248, 29259.764,
        30077.385, 30932.537, 31946.037, 32660.441, 33271.3, 34232.426, 34865.78,
        35623.625, 36214.07, 36816.676, 36264.79, 34402.36, 34754.473, 34971, 35185, 35618,
        36436, 36941, 37334, 37782.83, 38058.086,
    ];

    const GermanyGDPperCapita = [
        25391, 26769.96, 27385.055, 27250.701, 28140.057, 28868.945, 29349.982, 30186.945,
        31129.584, 32087.604, 33367.285, 34260.29, 34590.93, 34716.44, 35528.715,
        36205.574, 38014.137, 39752.207, 40715.434, 38962.938, 41109.582, 43189, 43320,
        43413, 43922, 44293, 44689, 45619.785, 46177.617,
    ];






    return (
        <div className="bg-zinc-900 h-auto w-full flex flex-col items-center pt-20">
            <div className='w-full h-[100px] fixed top-0 flex justify-start items-center pl-10'>
                <Button variant="contained" onClick={() => navigate("/")}>DASHBOARD</Button>
            </div>

            <div>
                <div className='py-10 w-full flex justify-start items-center text-zinc-100 font-semibold'>
                    <span>SENSOR PERFORMANCE</span>
                </div>

                <div className='flex w-full justify-center'>

                    <div className='mr-4'>
                        <div className='bg-white shadow-inner rounded-lg'>
                            <div className='w-full px-4 pt-4 -mb-4'>
                                <span className='text-zinc-500 font-light text-xs'>BMP TEMPERATURE</span>
                            </div>
                            <LineChart
                                yAxis={[{ data: handleDataSimplify(data_bmp, "bmp_t") }]}
                                series={[
                                    {
                                        data: handleDataBreakPoints(data_bmp, "bmp_t", bmp_t_bp),
                                        area: true
                                    },
                                ]}
                                width={500}
                                height={300}
                            />
                            <div className='w-full px-5 pb-4 -mt-2 flex justify-between'>
                                <TextField id="outlined-basic" label="BP" type="number" variant="outlined" onChange={(e) => {
                                    setBmp_t_bp_input(e.target.value)
                                }} />
                                <Button variant="contained" onClick={() => setBmp_t_bp(parseInt(bmp_t_bp_input))}>UPDATE</Button>
                            </div>
                        </div>
                    </div>



                    <div className=''>
                        <div className='bg-white shadow-inner rounded-lg'>
                            <div className='w-full px-4 pt-4 -mb-4'>
                                <span className='text-zinc-500 font-light text-xs'>BMP PRESSURE</span>
                            </div>
                            <LineChart
                                yAxis={[{ data: handleDataSimplify(data_bmp, "bmp_p") }]}
                                series={[
                                    {
                                        data: handleDataBreakPoints(data_bmp, "bmp_p", bmp_p_bp),
                                        area: true
                                    },
                                ]}
                                width={500}
                                height={300}
                            />
                            <div className='w-full px-5 pb-4 -mt-2 flex justify-between'>
                                <TextField id="outlined-basic" label="BP" type="number" variant="outlined" onChange={(e) => {
                                    setBmp_p_bp_input(e.target.value)
                                }} />
                                <Button variant="contained" onClick={() => setBmp_p_bp(parseInt(bmp_p_bp_input))}>UPDATE</Button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='flex w-full justify-center mt-4'>

                    <div className='mr-4'>
                        <div className='bg-white shadow-inner rounded-lg'>
                            <div className='w-full px-4 pt-4 -mb-4'>
                                <span className='text-zinc-500 font-light text-xs'>DHT TEMPERATURE</span>
                            </div>
                            <LineChart
                                yAxis={[{ data: handleDataSimplify(data_dht, "dht_t") }]}
                                series={[
                                    {
                                        data: handleDataBreakPoints(data_dht, "dht_t", dht_t_bp),
                                        area: true
                                    },
                                ]}
                                width={500}
                                height={300}
                            />
                            <div className='w-full px-5 pb-4 -mt-2 flex justify-between'>
                                <TextField id="outlined-basic" label="BP" type="number" variant="outlined" onChange={(e) => {
                                    setDht_t_bp_input(e.target.value)
                                }} />
                                <Button variant="contained" onClick={() => setDht_t_bp(parseInt(dht_t_bp_input))}>UPDATE</Button>
                            </div>
                        </div>
                    </div>



                    <div className=''>
                        <div className='bg-white shadow-inner rounded-lg'>
                            <div className='w-full px-4 pt-4 -mb-4'>
                                <span className='text-zinc-500 font-light text-xs'>DHT HUMIDITY</span>
                            </div>
                            <LineChart
                                yAxis={[{ data: handleDataSimplify(data_dht, "dht_h") }]}
                                series={[
                                    {
                                        data: handleDataBreakPoints(data_dht, "dht_h", dht_h_bp),
                                        area: true
                                    },
                                ]}
                                width={500}
                                height={300}
                            />
                            <div className='w-full px-5 pb-4 -mt-2 flex justify-between'>
                                <TextField id="outlined-basic" label="BP" type="number" variant="outlined" onChange={(e) => {
                                    setDht_h_bp_input(e.target.value)
                                }} />
                                <Button variant="contained" onClick={() => setDht_h_bp(parseInt(dht_h_bp_input))}>UPDATE</Button>
                            </div>
                        </div>
                    </div>



                </div>
            </div>



            <div className='mt-4'>
                <div className='py-10 w-full flex justify-start items-center text-zinc-100 font-semibold'>
                    <span>SENSOR COMPARATION</span>
                </div>
                <div className=''>
                    <div className='bg-white shadow-inner rounded-lg'>
                        <div className='w-full px-4 pt-4 -mb-4'>
                            <span className='text-zinc-500 font-light text-xs'>DHT / BMP TEMPERATURE</span>
                        </div>

                        <LineChart
                            yAxis={[
                                {   
                                    id: "Intervals",
                                    data: axis_data,
                                },
                            ]}

                            series={[
                                {   
                                    id: "DHT TEMPERATURE",
                                    data: dht_comp_t,
                                    showMark: false,
                                },
                                {
                                    id: "BMP TEMPERATURE",
                                    data: bmp_comp_t,
                                    showMark: false,
                                },
                            ]}
                            width={600}
                            height={400}
                            margin={{ left: 70 }}
                        />

                        <div className='w-full px-5 pb-4 -mt-2 flex justify-between'>
                            <TextField id="outlined-basic" label="BP" type="number" variant="outlined" onChange={(e) => {
                                setDht_h_bp_input(e.target.value)
                            }} />
                            <Button variant="contained" onClick={() => setDht_h_bp(parseInt(dht_h_bp_input))}>UPDATE</Button>
                        </div>
                    </div>
                </div>
            </div>


            <div className='w-full h-[100px]'>

            </div>

        </div>
    )
}

export default Graphs