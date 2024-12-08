/* eslint-disable */
export const getProcStat = async () => {
    const response = await fetch('luna://com.webos.service.systemstats/getProcStat', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch CPU stats');
    }
    return response.json();
};

export const getUnitList = async () => {
    const response = await fetch('luna://com.webos.service.systemstats/getUnitList', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch memory stats');
    }
    return response.json();
};
