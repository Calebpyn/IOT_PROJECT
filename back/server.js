const express = require("express");
const cors  = require("cors");
const morgan = require("morgan");

const app = express();

const port = 4000;

app.use(cors());
app.use(morgan("dev"));

app.get("/:tem/:hum", async (req, res) => {
    
    const {tem, hum} = req.params;

    const dummy = {
        "dht_t": tem,
        "dht_h": hum
      }

    await fetch("https://pmvkjhoxsepoqquuwada.supabase.co/rest/v1/dht_data?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdmtqaG94c2Vwb3FxdXV3YWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMTM1NzMsImV4cCI6MjAyODY4OTU3M30.cri1tY-kWYlOlQl1kWQo23CQoj-zRkGcg94TGglYJnU", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(dummy)

    })

    
    res.send(tem + " / " + hum);
})

app.get("/", (req, res) => {
    res.send("OK")
})


app.listen(port, () => console.log(`Listening to port ${port}...`));

