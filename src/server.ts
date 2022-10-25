import app from "./app";
import { connect } from "./db";

const port = process.env.PORT || 8080
connect()

app.listen(port,()=>{
    console.log(`running at hhtp//localhost:${port}`)
})