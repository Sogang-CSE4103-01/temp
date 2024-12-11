/* eslint-disable */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {useProcStat, useUnitList} from '../hooks/useData';
import ImageItem from '@enact/sandstone/ImageItem';
import Scroller from '@enact/sandstone/Scroller';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import Icon from '@enact/sandstone/Icon';
import Input, { InputField } from '@enact/sandstone/Input'; // Input 컴포넌트 가져오기
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import { scaleToRem } from '@enact/ui/resolution';
import { useMainState } from './MainState'; // 비디오 데이터를 가져오기 위한 훅
import { useWatchedVideos } from './useWatchedVideos';
import SystemMonitor from './systemMonitor';
import useLogOut from './LogoutState';
import { PanelContext } from './Context'; // PanelContext 가져오기
import Popup from '@enact/sandstone/Popup'; // 팝업 컴포넌트 가져오기
import { ADDR_, getUserId } from './address'; // config에서 setUserId 가져오기
import { QRCodeCanvas } from 'qrcode.react'; // 또는 QRCodeSVG
//import { InputField } from '@enact/sandstone/Input';
//import {createPlaylist} from './playlist';
import { usePlaylist } from './playlist';
import Status from './statusCheck';
import css from './Login.module.less';
import BodyText from '@enact/sandstone/BodyText';
import $L from '@enact/i18n/$L';

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
	const { videoData, loadWatchTime, loadMore, loading, generateFilteredVideoData} = useMainState(); // 비디오 데이터 가져오기 및 시청 시간 로드
	const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태 관리
	const [selectedVideo, setSelectedVideo] = useState(null); // 선택된 비디오 관리
	const userId = getUserId();
	console.log("현재유저", userId);
	const { watchedVideos, fetchWatchedVideos } = useWatchedVideos(userId); // 시청 중인 비디오 가져오기
	const [activeTab, setActiveTab] = useState(0); // 활성 탭 상태 관리
    const [qrUrl, setQrUrl] = useState(''); //QR 코드용
	const [filteredVideos, setFilteredVideos] = useState([]); // 필터링된 비디오 저장
	const [searchString, setSearchString] = useState(''); // 검색 문자열 상태 관리

	const [isListAdditionOpen, setIsListAdditionOpen] = useState(false);  //playlist addition
	const [isPlaylistSelected, setIsPlaylistSelected] = useState(false);
	const [isAddingVideo, setIsAddingVideo] = useState(false);
	const [title, setTitle] = useState('');
	//const [playlistId, setPlaylistId] = useState(-1);

	const {
		createPlaylist,
		page,
		playlists,
		playlistVideo,
		addition,
		setAddition,
		//loading,
		fetchPlaylists,
		loadPlaylists,
		handlePlaylistClick,
		playlistVideos,
		addButton,
		handleAddition,
		addVideos,
	} = usePlaylist();
	//const {createPlaylist} = Playlist(); 

    // 필터링된 비디오 가져오기
    const fetchFilteredVideos = async () => {
        const filtered = await generateFilteredVideoData(searchString);
        setFilteredVideos(filtered); // 필터링된 비디오 저장
    };

	/*useEffect(() => {
	}, [filteredVideos]);*/


	const handleSearchChange = async (event) => {
		const value = event.value; // event.value를 사용
		setSearchString(value); // 입력된 검색 문자열 상태 업데이트
	
		if (value) {
			console.log("검색중", value);
			// 비디오 데이터 필터링
			const filtered = await generateFilteredVideoData(value); // await을 사용하여 결과를 기다립니다.
			setFilteredVideos(filtered); // 필터링된 비디오 저장
		} else {
			setFilteredVideos([]); // 입력이 없을 경우 필터링된 비디오 초기화
		}
	};
	
	
	const handleClick = useCallback(
		index => () => {
			setSelectedVideo(videoData[index]); // 선택된 비디오 설정
			setIsPopupOpen(true); // 팝업 열기
		},
		//[videoData]
	);

	const fhandleClick = useCallback(
		index => () => {
			const selectedVideo = filteredVideos.find(video => video.id === index + 1); // index + 1과 같은 video.id를 가진 비디오 찾기
			if (selectedVideo) {
				setSelectedVideo(selectedVideo); // 선택된 비디오 설정
				setIsPopupOpen(true); // 팝업 열기
			}
		},
		[filteredVideos] // filteredVideos를 의존성으로 추가
	);

	const whandleClick = useCallback(
		index => () => {
			const selectedVideo = watchedVideos.find(video => video.id === index + 1); // index + 1과 같은 video.id를 가진 비디오 찾기
			if (selectedVideo) {
				setSelectedVideo(selectedVideo); // 선택된 비디오 설정
				setIsPopupOpen(true); // 팝업 열기
			}
		},
		[watchedVideos] // filteredVideos를 의존성으로 추가
	);
	
	const handlePopupConfirm = () => {
		const savedTime = loadWatchTime(selectedVideo.id); // 저장된 시청 시간 가져오기
		const startTime = 1; // 시청 시간이 있다면 1, 없다면 0
		console.log("aaa", startTime);
		console.log("재생할 비디오 ID:", selectedVideo.id);
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
	const videoItems = (searchString.length === 0 ? videoData : filteredVideos).map(video => {
	
		// 조건에 따라 클릭 핸들러를 선택
		const handleClickFunction = searchString.length === 0 ? handleClick(video.id - 1) : fhandleClick(video.id - 1);
	
		return (
			<ImageItem
				inline
				key={video.id}
				label={video.title} // 비디오 제목을 레이블로 사용
				src={video.thumbnail} // 비디오 썸네일
				style={{
					width: scaleToRem(768),
					height: scaleToRem(588)
				}}
				onClick={handleClickFunction} // 클릭 시 적절한 핸들러 사용
			>
				{video.title} {/* 비디오 제목을 표시 */}
			</ImageItem>
		);
	});
	
	

	const wvideoItems = watchedVideos.map(video => {
		console.log("시청한 비디오 ID:", video.id); // 시청한 비디오 ID를 콘솔에 출력
	
		return (
			<ImageItem
				inline
				key={video.id}
				label={video.title} // 비디오 제목을 레이블로 사용
				src={video.thumbnail} // 비디오 썸네일
				style={{
					width: scaleToRem(768),
					height: scaleToRem(588)
				}}
				onClick={whandleClick(video.id - 1)} // 클릭 시 팝업 열기
			>
				{video.title} {/* 비디오 제목을 표시 */}
			</ImageItem>
		);
	});
	

	const playlistItems = playlistVideo.map(video => (
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

	const selectableItems = (searchString.length === 0 ? videoData : filteredVideos).map(video => (
        <ImageItem
            inline
            key={video.id}
            label={video.title} // 비디오 제목을 레이블로 사용
            src={video.thumbnail} // 비디오 썸네일
            style={{
                width: scaleToRem(768),
                height: scaleToRem(588)
            }}
            onClick={() => handleAddition(video.id)} // 클릭 시 팝업 열기
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

    const generateRandomURL = () => {
		const randomId = Math.floor(Math.random() * 100000); // 0~99999 사이의 랜덤 숫자
		const randomUrl = `${ADDR_}/register`;
		setQrUrl(randomUrl);
	};


	return (
		<Panel
			{...props}
			style={{
				backgroundImage: 'linear-gradient(to bottom, #00006a, #000000)', // 어두운 파랑(#00008b)에서 검정(#000000)으로 그라데이션
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				height: '100%', // 패널 전체를 덮기 위해 높이 지정
			}}
		>
			<Header title="Player By Me" subtitle={`user ${userId}`} />
			<TabLayout >
			<Tab title={tabsWithIcons[0].title} icon={tabsWithIcons[0].icon}>
                    <InputField
                        type="text"
                        placeholder="검색"
                        value={searchString}
                        onChange={handleSearchChange}
                        
                    />
                    <Scroller>
                        {videoItems.length > 0 ? videoItems : 'No Videos'}
                        <Button onClick={loadMore} disabled={loading}>
                            {loading ? 'Loading...' : 'More'}
                        </Button>
                    </Scroller>
                </Tab>
				<Tab title={tabsWithIcons[5].title} icon={tabsWithIcons[5].icon} onTabClick={() => fetchWatchedVideos()}>
					<Scroller>{wvideoItems.length > 0 ? wvideoItems : 'No Videos'}</Scroller>
				</Tab>
				
				<Tab title={tabsWithIcons[6].title} icon={tabsWithIcons[6].icon}>
					{/*<Scroller>{videoItems.length > 0 ? videoItems : '비디오가 없습니다.'}</Scroller>
					<button onClick={() => setIsListAdditionOpen(true)}>add playlist</button> */}
					<h1>User {userId}'s Playlists</h1>

					<Scroller style={{ maxHeight: '410px' }} >	
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
								{playlists.map((playlist) => (
									<ImageItem
										inline
										key={playlist.id}
										//label={playlist.title}
										label = {" "}
										style={{
											width: scaleToRem(1024),
											height: scaleToRem(200),
										}}
										onClick={() => {
											setIsPlaylistSelected(true);
											handlePlaylistClick(playlist.id);
										}}
									>
										{playlist.title}
									</ImageItem>
								))}
						</div>
					</Scroller>

					
					<div style={{ textAlign: 'center'}}>
						<h1> </h1>

						{(!isPlaylistSelected && !isListAdditionOpen) && (
							<>
							{loading && <p>Loading...</p>}
								<Button 
									onClick={loadPlaylists} 
									disabled={loading} 
									//style={{ minWidth: '200px', height: '48px', fontSize: '18px', margin: '10px 0' }}
								>
									{loading ? 'Loading...' : 'Load More'}
								</Button>
							{/*
							{loading && <p>Loading...</p>}
								<button onClick={loadPlaylists} disabled={loading}>
									{loading ? 'Loading...' : 'Load More'}
								</button> */}

							<Button onClick={() => setIsListAdditionOpen(true)}>Add New Playlist</Button>
							</>
						)}
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


					{/* 팝업 추가 */}

					<Popup open={isPlaylistSelected && !isAddingVideo} onClose={() => setIsPlaylistSelected(false)}>

					<h2>Playlist</h2>

						<Scroller style={{ maxHeight: '500px' }}>
							
							{playlistItems.length > 0 ? playlistItems : 'No Videos'}

							<Button style={{
								//position: 'fixed', // Fix the button's position
								//top: '20px', // Adjust the distance from the top of the screen
								//left: '50%', // Center horizontally
								//transform: 'translateX(-50%)', // Correct centering alignment
								zIndex: 1000, // Ensure the button appears above the popup
							}}
							onClick={() => setIsAddingVideo(true)}
							>Add video
							</Button>
						</Scroller>
					</Popup>

					<Popup open={isAddingVideo} onClose={() => setIsAddingVideo(false) && setIsPlaylistSelected(true)}>
						<Scroller style={{maxHeight : '500px'}}>
							{selectableItems.length > 0 ? selectableItems : 'No Videos'}
							<Button style={{
								//position: 'fixed', // Fix the button's position
								//top: '20px', // Adjust the distance from the top of the screen
								//left: '50%', // Center horizontally
								//transform: 'translateX(-50%)', // Correct centering alignment
								zIndex: 1000, // Ensure the button appears above the popup
							}}
							onClick={() => {
								addVideos();
								setAddition([]);
								setIsAddingVideo(true);
							}}
							>Add
							</Button>
						</Scroller>
					</Popup>
				
				{/*
				<Tab title={tabsWithIcons[6].title} icon={tabsWithIcons[6].icon} onTabClick={() => fetchFilteredVideos()}>
					<Scroller>{fvideoItems.length > 0 ? fvideoItems : '비디오가 없습니다.'}</Scroller> */}
				</Tab>

                <Tab title={tabsWithIcons[7].title} icon={tabsWithIcons[7].icon}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Button onClick={generateRandomURL}>upload video</Button>
                        {qrUrl ? (
                            <div style={{ marginTop: '20px' }}>
                                <p>Generated QR: {qrUrl}</p>
                                <QRCodeCanvas value={qrUrl} size={256} />
                            </div>
                        ) : (
                            <p>Click the Button to Get the QR Code</p>
                        )}
                    </div>
                </Tab>

				{/*}
				<Tab title={tabsWithIcons[1].title} icon={tabsWithIcons[1].icon}>
					<Button icon="demosync">Button 1</Button>
					<Button icon="demosync">Button 2</Button>
					<Button icon="demosync">Button 3</Button>
					<Button icon="demosync">Button 4</Button>
					<Button icon="demosync">Button 5</Button>
				</Tab> 
				<Tab title={tabsWithIcons[2].title} icon={tabsWithIcons[2].icon}>
					<Item slotBefore={<Icon>playcircle</Icon>}>Single Item</Item>
				</Tab>  */}

				<Tab title={tabsWithIcons[3].title} icon={tabsWithIcons[3].icon}>
					{/*<SystemMonitor />*/}
					<Status/>
				</Tab>
				<Tab title={tabsWithIcons[4].title} icon={tabsWithIcons[4].icon}>
					<div className={css.logoutContainer}>
						<BodyText className={css.title}>{$L('Click the Log Out button if you want to quit')}</BodyText>
						<Button onClick={handleLogOut}>
							Log Out
						</Button>
					</div>
				</Tab>
			</TabLayout>

			{/* 팝업 추가 */}
			<Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
				<h2>Would you like to start from where you left off?
					<h5 style={{ fontSize: '0.8rem', margin: 0 }}>
						If you click "No", no watch history will be saved
					</h5>
				</h2>
				<Button onClick={handlePopupConfirm}>Yes</Button>
				<Button onClick={handlePopupCancel}>No</Button>
			</Popup>
		</Panel>
	);
};

export default Main;
