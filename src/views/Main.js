/* eslint-disable */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import ImageItem from '@enact/sandstone/ImageItem';
import Scroller from '@enact/sandstone/Scroller';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import Icon from '@enact/sandstone/Icon';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import { scaleToRem } from '@enact/ui/resolution';
import { useMainState } from './MainState'; // 비디오 데이터를 가져오기 위한 훅
import { useWatchedVideos } from './useWatchedVideos';
import SystemMonitor from './systemMonitor';
import useLogOut from './LogoutState';
import { PanelContext } from './Context'; // PanelContext 가져오기
import Popup from '@enact/sandstone/Popup'; // 팝업 컴포넌트 가져오기
import { getUserId } from './address'; // config에서 setUserId 가져오기
import { QRCodeCanvas } from 'qrcode.react'; // 또는 QRCodeSVG
import { InputField } from '@enact/sandstone/Input';
//import {createPlaylist} from './playlist';
import { usePlaylist } from './playlist';


const tabsWithIcons = [
	{ title: 'Home', icon: 'home' },
	{ title: 'Button', icon: 'gear' },
	{ title: 'Item', icon: 'trash' },
	{ title: "ProcState", icon: 'tvguidefvp' },
	{ title: "Log Out", icon: "logout" },
	{ title: "Watching video", icon: "liveplay" },
	{ title: "Playlist", icon: "demosync" },
    { title: "Upload", icon: "folderupper"},
];

const Main = (props) => {
	const { setPanelData } = useContext(PanelContext);
	const { videoData, loadWatchTime, loadMore, loading } = useMainState(); // 비디오 데이터 가져오기 및 시청 시간 로드
	const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태 관리
	const [selectedVideo, setSelectedVideo] = useState(null); // 선택된 비디오 관리
	const userId = getUserId();
	console.log("현재유저", userId);
	const { watchedVideos, fetchWatchedVideos } = useWatchedVideos(userId); // 시청 중인 비디오 가져오기
	const [activeTab, setActiveTab] = useState(0); // 활성 탭 상태 관리
    const [qrUrl, setQrUrl] = useState(''); //QR 코드용

	const [isListAdditionOpen, setIsListAdditionOpen] = useState(false);  //playlist addition
	const [title, setTitle] = useState('');

	const {
		createPlaylist,
		page,
		playlists,
		//loading,
		fetchPlaylists,
		loadPlaylists,
		handlePlaylistClick,} = usePlaylist();
	//const {createPlaylist} = Playlist(); 

	const handleClick = useCallback(
		index => () => {
			setSelectedVideo(videoData[index]); // 선택된 비디오 설정
			setIsPopupOpen(true); // 팝업 열기
		},
		[videoData]
	);
	

	const handleAddition = () => {
		setIsListAdditionOpen(true);
	};

	const handlePopupConfirm = () => {
		const savedTime = loadWatchTime(selectedVideo.id); // 저장된 시청 시간 가져오기
		const startTime = 1; // 시청 시간이 있다면 1, 없다면 0
		console.log("aaa", startTime);
		// 비디오 재생 패널로 이동
		setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: selectedVideo, startTime } }]);
		setIsPopupOpen(false); // 팝업 닫기
	};

	const {
		isLoggedOut,
		setUsername,
		setPassword,
		handleLogOut
	} = useLogOut();

	const handlePopupCancel = () => {
		// 비디오를 처음부터 재생
		const startTime = 0;
		console.log("bbb", startTime);
		setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: selectedVideo, startTime } }]);
		setIsPopupOpen(false); // 팝업 닫기
	};


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
			onClick={handleClick(video.id - 1)} // 클릭 시 팝업 열기
		>
			{video.title} {/* 비디오 제목을 표시 */}
		</ImageItem>
	));

	const wvideoItems = watchedVideos.map(video => (
		<ImageItem
			inline
			key={video.id}
			label={video.title} // 비디오 제목을 레이블로 사용
			src={video.thumbnail} // 비디오 썸네일
			style={{
				width: scaleToRem(768),
				height: scaleToRem(588)
			}}
			onClick={handleClick(video.id - 1)} // 클릭 시 팝업 열기
		>
			{video.title} {/* 비디오 제목을 표시 */}
		</ImageItem>
	));

	const userVideoItems = videoData.filter(video => video.id % userId === 0).map(video => (
		<ImageItem
			inline
			key={video.id}
			label={video.title}
			src={video.thumbnail}
			style={{
				width: scaleToRem(768),
				height: scaleToRem(588)
			}}
			onClick={handleClick(video.id - 1)} // 클릭 시 팝업 열기
		>
			{video.title}
		</ImageItem>
	));

	/*
	//const PlaylistItem = {
	const PlaylistItems = playlists.map(playlist => (
		<ImageItem
			inline
			key={playlist.id}
			//label={video.title} // 비디오 제목을 레이블로 사용
			//src={video.thumbnail} // 비디오 썸네일
			style={{
				width: scaleToRem(1024),
				height: scaleToRem(200)
			}}
			//onClick={handleClick(video.id - 1)} // 클릭 시 팝업 열기
		>
			{playlist.title} 
		</ImageItem>
	)); */

    const generateRandomURL = () => {
		const randomId = Math.floor(Math.random() * 100000); // 0~99999 사이의 랜덤 숫자
		const randomUrl = `http://192.168.0.2:8080/register`;
		setQrUrl(randomUrl);
        console.log(qrUrl, setQrUrl);
	};

	console.log("userid for main panner", userId);

	return (
		<Panel {...props}>
			<Header title="Sandstone TabLayout" subtitle={`user ${userId}`} />
			<TabLayout >
				<Tab title={tabsWithIcons[0].title} icon={tabsWithIcons[0].icon}>
					<Scroller>{videoItems.length > 0 ? videoItems : '비디오가 없습니다.'}
						<Button onClick={loadMore} disabled={loading}>
							{loading ? 'Loading...' : 'More'}
						</Button>
					</Scroller>
				</Tab>
				<Tab title={tabsWithIcons[5].title} icon={tabsWithIcons[5].icon} onTabClick={() => fetchWatchedVideos()}>
					<Scroller>{wvideoItems.length > 0 ? wvideoItems : '비디오가 없습니다.'}</Scroller>
				</Tab>
				<Tab title={tabsWithIcons[6].title} icon={tabsWithIcons[6].icon}>
					{/*<Scroller>{videoItems.length > 0 ? videoItems : '비디오가 없습니다.'}</Scroller>
					<button onClick={() => setIsListAdditionOpen(true)}>add playlist</button> */}
					
					<div>
						<h1>User Playlists</h1>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
							{playlists.map((playlist) => (
								<ImageItem
									inline
									key={playlist.id}
									label={playlist.title}
									style={{
										width: scaleToRem(1024),
										height: scaleToRem(200),
									}}
									onClick={() => handlePlaylistClick(playlist.id)}
								>
									{playlist.title}
								</ImageItem>
							))}
						</div>
						{loading && <p>Loading...</p>}
						<button onClick={loadPlaylists} disabled={loading}>
							{loading ? 'Loading...' : 'Load More'}
						</button>
					</div>

					{/*}
					<div style={{ display: 'flex', overflowX: 'auto', gap: scaleToRem(100) }}>
						{PlaylistItems} {/* Render the array directly 
					</div> */}


					{/*
					<div style={{ display: 'flex', overflowX: 'auto', gap: scaleToRem(24) }}>
						<PlaylistItems/>
						
						{videoData.map(video => (
							<PlaylistItems
							//key={video.id}
							//video={video}
							//onClick={() => onVideoClick(video.id)}
							/>
						))}  
					</div> */}

					
					<div style={{ textAlign: 'center', padding: '20px' }}>
						<Button onClick={() => setIsListAdditionOpen(true)}>Add New Playlist</Button>
					</div>

					<Popup open={isListAdditionOpen} onClose={() => setIsListAdditionOpen(false)}>
						<h2>Create a New Playlist</h2>

						<InputField
							placeholder="enter the title..."
							value={title}
							onChange={(e) => setTitle(e.value)} // 댓글 상태 업데이트
							style={{ marginTop: '10px' }} // 입력창 위 여백
						/> 
						
						<Button onClick={() => {
							// Handle the playlist creation logic here
							console.log('New playlist created!');
							createPlaylist(title);
							console.log('calling create playlist');
							setIsListAdditionOpen(false); // Close the popup
						}}>
							Yes
						</Button> 
						<Button onClick={() => setIsListAdditionOpen(false)}>Cancel</Button> 
					</Popup> 
					
				</Tab>

                <Tab title={tabsWithIcons[7].title} icon={tabsWithIcons[7].icon}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Button onClick={generateRandomURL}>임의 URL QR 코드 생성</Button>
                        {qrUrl ? (
                            <div style={{ marginTop: '20px' }}>
                                <p>생성된 URL: {qrUrl}</p>
                                <QRCodeCanvas value={qrUrl} size={256} />
                            </div>
                        ) : (
                            <p>QR 코드를 생성하려면 버튼을 클릭하세요.</p>
                        )}
                    </div>
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
					<SystemMonitor />
				</Tab>
				<Tab title={tabsWithIcons[4].title} icon={tabsWithIcons[4].icon}>
					<Button onClick={handleLogOut}>
						Log Out
					</Button>
				</Tab>
			</TabLayout>

			{/* 팝업 추가 */}
			<Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
				<h2>이전 시청 기록부터 보시겠습니까?
					<h5 style={{ fontSize: '0.8rem', margin: 0 }}>
						'아니오'를 선택할 경우 시청기록이 저장되지 않습니다,
					</h5>
				</h2>
				<Button onClick={handlePopupConfirm}>예</Button>
				<Button onClick={handlePopupCancel}>아니오</Button>
			</Popup>
		</Panel>
	);
};

export default Main;
