import LS2Request from "@enact/webos/LS2Request";

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

export const getLunaSystemResource = async => {
    return new Promise((resolve, reject) => {
        new LS2Request().send({
            service : 'luna://com.webos.service.systemservice',
            method: 'getSystemStatus',
            parameters : {},
            onSuccess : (res) => {
                
                const cpuUsage = res.cpuUsage || 0;
                const memTotal = res.memory.total || 0;
                const memoryUsed = res.memory.used || 0;

                resolve=({
                    cpuUsage,
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