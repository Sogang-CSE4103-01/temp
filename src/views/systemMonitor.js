/* eslint-disable */
import React from 'react';
import { Panel, Header } from '@enact/sandstone/Panels';
import { Scroller } from '@enact/sandstone/Scroller';

const SystemMonitor = () => {

    /*
    const [cpuUsage, setCPUUsage] = useState(0);
    const [memoryUsage, setMemoryUsage] = useState({total : 0, used : 0});

    //var lunaClient = new WebOS.LunaServiceClient();
    //lunaClient.connect();

    useEffect(() => {
        
    
        const fetchData = async () => {
            try{
                const systemData = await getLunaSystemResource();

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
    }, []); */

    const procStat = useProcStat();
    const unitList = useUnitList();

    return (
        <Panel>
            <Header title="System Monitor" />
            <Scroller>
            <h3>CPU 사용량: {procStat.cpu_usage ? `${procStat.cpu_usage}%` : '정보 없음'}</h3>
                <h3>메모리 사용량: {unitList.memory_usage ? `${unitList.memory_usage}MB` : '정보 없음'}</h3>
            </Scroller>
        </Panel>
    );
};

export default SystemMonitor;
