import fs from 'fs/promises';
//const fs = require('fs').promises;
import { cpuUsage, memoryUsage } from 'process'

export const getSystemResources = async() => {
    try{
        //const stat = await fs.readFile('proc/stat', 'utf8');
        //const meminfo = await fs.readFile('/proc/meminfo', 'utf8');
        const meminfo = await fs.readFile('../__mock__/com.webos.memorymanager/getUnitList-1886768026', 'utf8');
        //console.log(meminfo);

        const stat = await fs.readFile('../__mock__/com.webos.memorymanager/getProcStat-2136700690', 'utf8');
        //console.log(stat);
        //const meminfo = await fs.readFile('../__mock__/com.webos.memorymanager/getProcStat-2136700690', 'utf8');

        const cpuUsage = parseCPUUsage(stat);
        const memoryUsage = parseMemoryUsage(meminfo);

        console.log(cpuUsage, memoryUsage);

        return {cpuUsage, memoryUsage};
    }
    catch(error){
        console.error('Failed to read system resources:', error);
        return {cpuUsage : 0, memoryUsage: {total : 0, used :0}};
    }
};

const parseCPUUsage = (stat) => {
    const cpuLine = stat.split('\n')[0];
    const values = cpuLine.split('').splice(2,6).map(Number);
    const total = values.reduce((acc, val) => acc + val, 0);
    const idle = values[3];
    const usage = ((total - idle)/total)*100;
    return Math.round(usage);
};

const parseMemoryUsage = (meminfo) => {
    const lines = meminfo.split('\n');
    const memTotal = parseInt(lines[0].match(/\d+/)[0], 10);
    const memFree = parseInt(lines[1].match(/\d+/)[0], 10);
    const memUsed = memTotal - memFree;

    return{
        total : Math.round(memTotal / 1024),
        used : Math.round(memUsed / 1024)
    };
};