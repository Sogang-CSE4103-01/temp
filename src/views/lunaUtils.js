/* eslint-disable */
//import LS2Request from "../../__mock__/@enact/webos/LS2Request";
import LS2Request from "@enact/webos/LS2Request";
const request = new LS2Request();

//import { WebOS } from 'webos-service'; 

//var lunaClient = new WebOS.LunaServiceClient();
//lunaClient.connect();

/*
export const getLunaSystemResource = async => {
    return new Promise((resolve, reject) => {
        new LS2Request().send({
            service : 'luna://com.webos.service.systemservice',
            method: 'getSystemStatus',
            parameters : {},
            onSuccess : (res) => resolve=(res),
            onFailure:(err) => reject(err),
        });
    });
}; */

export const getLunaSystemResource = async () => {
    return new Promise((resolve, reject) => {
        new LS2Request().send({
            service : 'luna://com.webos.service.memorymanager',
            method: 'getMemoryStatus',
            parameters : {subscribe:true},
            onSuccess : (res) => {
                
                //const cpuUsage = res.cpuUsage || 0;
                const memTotal = res.system.total || 0;
                const memoryUsed = res.system.avaliable || 0;

                resolve({
                    //cpuUsage,
                    memoryUsage: {
                        total : Math.round(memTotal / 1024),
                        used : Math.round(memoryUsed / 1024),
                    },
                });
            },
            onFailure:(err) => {
                console.error('Luna Failure : ', err);
                reject(err);
            },
        });
    });
};