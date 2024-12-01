/*
import React, { useRef, useContext, useState } from 'react';
import Button from '@enact/sandstone/Button';
import Scroller from '@enact/sandstone/Scroller';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { Header, Panel } from '@enact/sandstone/Panels';
import { PanelContext } from './Context'; // PanelContext 가져오기
import { useMainState } from './MainState'; // MainState에서 가져오기
import './VideoPlayer.css'; // CSS 파일 추가
import { useBackHandler } from '../App/AppState'; // useBackHandler 가져오기
import ImageItem from '@enact/sandstone/ImageItem'; // 썸네일 이미지 아이템 추가

const SelectableVideoPlayer = ({ video, startTime }) => {
    const videoRef = useRef(null);
    const { loadWatchTime, saveWatchTime, videoData } = useMainState(); // 비디오 데이터 가져오기
    const { setPanelData } = useContext(PanelContext); // 패널 데이터 설정 함수 가져오기
    const handleBack = useBackHandler();
    const [isCommentsOpen, setCommentsOpen] = useState(false); // Comment overlay state
    const [comments, setComments] = useState([
        "Great video!",
        "I learned so much from this.",
        "Awesome content, keep it up!",
        "Can you make a part 2?",
        "Loved the visuals in this video!"
    ]);

    const handleGoToDetails = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 시간 가져오기
            saveWatchTime(video.id, currentTime); // 현재 시간을 저장
            console.log("이전 동영상 재생시간", videoNode.currentTime);
        }
        setPanelData(prev => [...prev, { name: 'detail', data: { index: video.id } }]); // 디테일 패널로 이동
    };

    const handleVideoEnd = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 시간 가져오기
            saveWatchTime(video.id, currentTime); // 현재 시간을 저장
        }
    };

    const handleLoadedData = () => {
        const savedTime = loadWatchTime(video.id); // 저장된 시간 불러오기
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        
        if (videoNode && savedTime > 0) {
            videoNode.currentTime = savedTime; // 저장된 시간으로 이동
            videoNode.play(); // 비디오 재생 시작
        }
    };

    const handlePlayFromStart = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        
        if (videoNode) {
            videoNode.play(); // 비디오 재생 시작
        }
    };

    const setVideo = (video) => {
        videoRef.current = video; // 비디오 설정
    };

    const toggleComments = () => {
        setCommentsOpen(!isCommentsOpen); // Toggle comment overlay
    };

    // 비디오 썸네일 클릭 핸들러
    const handleThumbnailClick = (thumbnailVideo) => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 재생 중인 비디오의 시간
            saveWatchTime(video.id, currentTime); // 현재 비디오 시간을 저장
            console.log("현재 재생중인 동영상 재생시간", currentTime);
        }
        // 클릭된 썸네일 비디오로 이동
        setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: thumbnailVideo } }]); // 해당 비디오 재생 패널로 이동
    };

    return (
        <Panel>
            <Header 
                title={video.title} 
                onBack={() => {
                    const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
                    if (videoNode) {
                        const currentTime = videoNode.currentTime; // 현재 시간 가져오기
                        saveWatchTime(video.id, currentTime); // 현재 시간을 저장
                    }
                    handleBack(); // 패널 이동
                }} 
            />
            <div className="video-modal">
                <VideoPlayer
                    loop
                    ref={setVideo}
                    style={{ width: '100%', height: '100%' }} // 전체 화면 차지
                    onEnded={handleVideoEnd} // 비디오 종료 시 핸들러 추가
                    onLoadedData={startTime > 0 ? handleLoadedData : handlePlayFromStart} // startTime에 따라 호출되는 핸들러 설정
                >
                    <MediaControls>
                        <Button onClick={handleGoToDetails}>Go to Details</Button> //디테일로 이동 버튼 
                        <Button onClick={toggleComments}>{isCommentsOpen ? "Hide Comments" : "Show Comments"}</Button> //댓글 보기/숨기기 버튼 
                        <Button onClick={() => {
                            const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
                            if (videoNode) {
                                const currentTime = videoNode.currentTime; // 현재 시간 가져오기
                                saveWatchTime(video.id, currentTime); // 현재 시간을 저장
                            }
                        }}>Resume Watching</Button> //이어보기 버튼 추가 
                        <Button onClick={() => {
                            const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
                            if (videoNode) {
                                const currentTime = videoNode.currentTime; // 현재 시간 가져오기
                                saveWatchTime(video.id, currentTime); // 현재 시간을 저장
                            }
                            handleBack(); // 패널 이동
                        }}>Back</Button> // 뒤로가기 버튼 추가 

                        //Comment overlay 
                        {isCommentsOpen && (
                            <div className="comment-overlay">
                                <Scroller style={{ padding: '10px', width: '300px', height: '100%', background: 'rgba(0, 0, 0, 0.8)', color: 'white', position: 'absolute', top: 0, right: 0 }}>
                                    <h3>Comments</h3>
                                    {comments.map((comment, index) => (
                                        <div key={index} style={{ marginBottom: '10px' }}>{comment}</div>
                                    ))}
                                </Scroller>
                            </div>
                        )}

                        //다른 비디오 썸네일 표시 
                        <Scroller
                            style={{ padding: '10px 0', height: '150px', width: '100%' }} // 스크롤러의 크기 조정
                            direction="horizontal" // 가로 스크롤 방향 설정
                            horizontalScrollbar="visible" // 항상 가로 스크롤바 보이기
                        >
                            {videoData.length > 0 ? videoData.map(v => (
                                <ImageItem
                                    inline
                                    key={v.id}
                                    label={v.title.length > 15 ? `${v.title.substring(0, 15)}...` : v.title} // 제목 길이 조정
                                    src={v.thumbnail}
                                    onClick={() => handleThumbnailClick(v)} // 클릭 시 해당 비디오 재생
                                    style={{ width: '240px', height: '160px', margin: '5px', cursor: 'pointer' }} // 썸네일 크기 조정
                                >
                                    <div style={{ fontSize: '0.9rem', textAlign: 'center' }}>{v.title}</div>
                                </ImageItem>
                            )) : <div>비디오가 없습니다.</div>}
                        </Scroller>
                    </MediaControls>
                    <source src={video.src} type="video/mp4" />
                </VideoPlayer>
            </div>
        </Panel>
    );
};

export default SelectableVideoPlayer; */



import React, { useRef, useContext, useState } from 'react';
import Button from '@enact/sandstone/Button';
import Scroller from '@enact/sandstone/Scroller';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { Header, Panel } from '@enact/sandstone/Panels';
import { PanelContext } from './Context'; // PanelContext 가져오기
import { useMainState } from './MainState'; // MainState에서 가져오기
import './VideoPlayer.css'; // CSS 파일 추가
import { useBackHandler } from '../App/AppState'; // useBackHandler 가져오기
import ImageItem from '@enact/sandstone/ImageItem'; // 썸네일 이미지 아이템 추가

const SelectableVideoPlayer = ({ video, startTime }) => {
    const videoRef = useRef(null);
    const { loadWatchTime, saveWatchTime, videoData } = useMainState(); // 비디오 데이터 가져오기
    const { setPanelData } = useContext(PanelContext); // 패널 데이터 설정 함수 가져오기
    const handleBack = useBackHandler();
    const [isCommentOpen, setIsCommentOpen] = useState(false); // 댓글 창 상태 관리
    const [commentMessage, setCommentMessage] = useState(''); // 댓글 메시지 상태 관리

    const handleGoToDetails = () => {
        const videoNode = videoRef.current.getVideoNode();
        if (videoNode) {
            const currentTime = videoNode.currentTime;
            saveWatchTime(video.id, currentTime);
        }
        setPanelData(prev => [...prev, { name: 'detail', data: { index: video.id } }]);
    };

    const handleVideoEnd = () => {
        const videoNode = videoRef.current.getVideoNode();
        if (videoNode) {
            const currentTime = videoNode.currentTime;
            saveWatchTime(video.id, currentTime);
        }
    };

    const handleLoadedData = () => {
        const savedTime = loadWatchTime(video.id);
        const videoNode = videoRef.current.getVideoNode();

        if (videoNode && savedTime > 0 && startTime > 0) {
            videoNode.currentTime = savedTime;
            videoNode.play();
        }
    };

    const toggleComment = () => {
        setIsCommentOpen(!isCommentOpen);
    };

    const handleCommentSubmit = () => {
        if (!commentMessage.trim()) {
            //alert('댓글을 입력하세요.');
            return;
        }
        console.log("댓글 남기기:", commentMessage);
        setCommentMessage('');
        toggleComment();
    };

    const handleThumbnailClick = (thumbnailVideo) => {
        const videoNode = videoRef.current.getVideoNode();
        if (videoNode) {
            const currentTime = videoNode.currentTime;
            saveWatchTime(video.id, currentTime);
        }
        setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: thumbnailVideo } }]);
    };

    const commonButtonStyle = {
        margin: '10px 5px',
        padding: '10px',
        width: '120px'
    };

    const commentBoxStyle = {
        position: 'absolute',
        right: 0,
        top: 0,
        width: '300px',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.5)',
        padding: '20px',
        zIndex: 1000
    };

    return (
        <Panel>
            <Header
                title={video.title}
                onBack={() => {
                    const videoNode = videoRef.current.getVideoNode();
                    if (videoNode) {
                        const currentTime = videoNode.currentTime;
                        saveWatchTime(video.id, currentTime);
                    }
                    handleBack();
                }}
            />
            <div className="video-modal" style={{ position: 'relative' }}>
                <VideoPlayer
                    loop
                    ref={videoRef}
                    style={{ width: '100%', height: '100%' }}
                    onEnded={handleVideoEnd}
                    onLoadedData={handleLoadedData}
                >
                    <MediaControls>
                        <Button style={commonButtonStyle} onClick={handleGoToDetails}>Go to Details</Button>
                        <Button style={commonButtonStyle} onClick={toggleComment}>댓글</Button>
                        <Button style={commonButtonStyle} onClick={handleBack}>Back</Button>
                        <Scroller
                            style={{ padding: '10px 0', height: '150px', width: '100%' }}
                            direction="horizontal"
                            horizontalScrollbar="visible"
                        >
                            {videoData.length > 0 ? videoData.map(v => (
                                <ImageItem
                                    inline
                                    key={v.id}
                                    label={v.title.length > 15 ? `${v.title.substring(0, 15)}...` : v.title}
                                    src={v.thumbnail}
                                    onClick={() => handleThumbnailClick(v)}
                                    style={{ width: '240px', height: '160px', margin: '5px', cursor: 'pointer' }}
                                />
                            )) : <div>비디오가 없습니다.</div>}
                        </Scroller>
                    </MediaControls>
                    <source src={video.src} type="video/mp4" />
                </VideoPlayer>

                {isCommentOpen && (
                    <div style={commentBoxStyle}>
                        <h2>댓글</h2>
                        <textarea
                            placeholder="댓글을 입력하세요..."
                            style={{ width: '100%', height: '100px' }}
                            value={commentMessage}
                            onChange={(e) => setCommentMessage(e.target.value)}
                        />
                        <Button onClick={handleCommentSubmit}>댓글 남기기</Button>
                    </div>
                )}
            </div>
        </Panel>
    );
};

export default SelectableVideoPlayer;
