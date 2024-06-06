import axios from "axios"

const localhost="http://localhost:3030";
const remoteHost="https://signalserver-i68m.onrender.com/";
// const baseURL = localhost;
const baseURL = remoteHost;

const client=axios.create({baseURL})
export default client;