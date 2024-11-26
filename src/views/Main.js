import ImageItem from '@enact/sandstone/ImageItem';
import Scroller from '@enact/sandstone/Scroller';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import Icon from '@enact/sandstone/Icon';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import { scaleToRem } from '@enact/ui/resolution';
import { useCallback, useContext } from 'react';
import { PanelContext } from './Context';
import { useMainState } from './MainState'; // 비디오 데이터를 가져오기 위한 훅
import SystemMonitor from './systemMonitor';
import useLogOut from './LogoutState';


const tabsWithIcons = [
	{ title: 'Home', icon: 'home' },
	{ title: 'Button', icon: 'gear' },
	{ title: 'Item', icon: 'trash' },
	{ title : "ProcState", icon : 'tvguidefvp'},
	{ title : "Log Out", icon : "logout"}
];

const Main = (props) => {
	const { setPanelData } = useContext(PanelContext);
	const { videoData } = useMainState(); // 비디오 데이터 가져오기

	const {
        isLoggedOut,
        setUsername,
        setPassword,
        handleLogOut
    } = useLogOut();

	const handleClick = useCallback(
		index => () => {
			// 비디오 재생 패널로 이동
			console.log('Selected Video:', videoData[index]); // 클릭한 비디오 정보 로그
			setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: videoData[index] } }]);
		},
		[setPanelData, videoData]
	);

	// 비디오 컴포넌트 렌더링
	const videoItems = videoData.map(video => (
		<ImageItem
			inline
			key={video.id}
			label={video.title} // 비디오 제목을 레이블로 사용
			src={video.thumbnail} // 비디오 썸네일
			style={{
				width: scaleToRem(768),
				height: scaleToRem(588)
			}}
			onClick={handleClick(video.id - 1)} // 클릭 시 비디오 재생 패널로 이동
		>
			{video.title} {/* 비디오 제목을 표시 */}
		</ImageItem>
	));

	return (
		<Panel {...props}>
			<Header title="Sandstone TabLayout" subtitle="Basic TabLayout" />
			<TabLayout>
				<Tab title={tabsWithIcons[0].title} icon={tabsWithIcons[0].icon}>
					<Scroller>{videoItems.length > 0 ? videoItems : '비디오가 없습니다.'}</Scroller>
				</Tab>
				<Tab title={tabsWithIcons[1].title} icon={tabsWithIcons[1].icon}>
					<Button icon="demosync">Button 1</Button>
					<Button icon="demosync">Button 2</Button>
					<Button icon="demosync">Button 3</Button>
					<Button icon="demosync">Button 4</Button>
					<Button icon="demosync">Button 5</Button>
				</Tab>
				<Tab title={tabsWithIcons[2].title} icon={tabsWithIcons[2].icon}>
					<Item slotBefore={<Icon>playcircle</Icon>}>Single Item</Item>
				</Tab>
				<Tab title={tabsWithIcons[3].title} icon={tabsWithIcons[3].icon}>
					<SystemMonitor/>
				</Tab>
				<Tab title={tabsWithIcons[4].title} icon={tabsWithIcons[4].icon}>
                    <Button onClick={handleLogOut} >
                        Log Out
                    </Button>
                </Tab>
			</TabLayout>
		</Panel>
	);
};

export default Main;
