/* eslint-disable */
import React, {useState, useEffect} from "react";
import ProgressBar from '@enact/sandstone/ProgressBar';
//import { getSystemResources } from "./systemUtils";
import { getLunaSystemResources } from "./lunaUtils";


const SystemMonitor = () => {
    const [cpuUsage, setCPUUsage] = useState(0);
    const [memoryUsage, setMemoryUsage] = useState({total : 0, used : 0});

    useEffect(() => {
        
        const fetchData = async () => {
            try{
                //const systemData = await getSystemResources();
                //const systemData = await getLunaSystemResources();

                if(systemData){
                    setCPUUsage(systemData.cpuUsage);
                    setMemoryUsage(systemData.memoryUsage);
                }
            }    
            catch (error) {
                console.error("getting process info failure", error);
            }
        };

        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>System Monitor</h1>
            <div>
                <h2>CPU Usage</h2>
                <ProgressBar progress = {cpuUsage / 100}/>
                <p>{cpuUsage}%</p>
            </div>

            <div>
                <h2>Memory Usage</h2>
                <ProgressBar progress = {memoryUsage.used / memoryUsage.total} />
                <p>
                    {memoryUsage.used}MB . {memoryUsage.total}MB
                </p>
            </div>
        </div>
    );
};

export default SystemMonitor;


/*
const SystemMonitor = () => {
    const [cpuUsage, setCPUUsage] = useState(0);
    const [memoryUsage, setMemoryUsage] = useState({total : 0, used : 0});

    useEffect(() => {
        const fetchData = async () => {
            const systemData = await getSystemResources();

            if(systemData){
                setCPUUsage(systemData.cpuUsage);
                setMemoryUsage(systemData.memoryUsage);
            }
        };

        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>System Monitor</h1>
            <div>
                <h2>CPU Usage</h2>
                <ProgressBar progress = {cpuUsage / 100}/>
                <p>{cpuUsage}%</p>
            </div>

            <div>
                <h2>Memory Usage</h2>
                <ProgressBar progress = {memoryUsage.used / memoryUsage.total} />
                <p>
                    {memoryUsage.used}MB . {memoryUsage.total}MB
                </p>
            </div>
        </div>
    );
};

export default SystemMonitor; */