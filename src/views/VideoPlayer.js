/* eslint-disable */
import React, { useRef, createContext, useContext, useState, useEffect } from 'react';
import Button from '@enact/sandstone/Button';
import Scroller from '@enact/sandstone/Scroller';
import {IconItem, Row, Column} from '@enact/sandstone/IconItem';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { Header, Panel } from '@enact/sandstone/Panels';
import { PanelContext } from './Context'; // PanelContext 가져오기
import { useMainState } from './MainState'; // MainState에서 가져오기
import './VideoPlayer.css'; // CSS 파일 추가
import { useBackHandler } from '../App/AppState'; // useBackHandler 가져오기
import ImageItem from '@enact/sandstone/ImageItem'; // 썸네일 이미지 아이템 추가
import Popup from '@enact/sandstone/Popup'; // Popup 컴포넌트 가져오기
import Input, { InputField } from '@enact/sandstone/Input'; // InputField 가져오기
import {username} from './LoginState';
import Icon from '@enact/sandstone/Icon'; // Icon 컴포넌트 추가
import { ADDR_ } from './address';
import { getUserId } from './address'; // config에서 setUserId 가져오기

const flag = 0;

const SelectableVideoPlayer = ({ video, startTime }) => {
    const videoRef = useRef(null);
    const { loadWatchTime, saveWatchTime, videoData } = useMainState(); // 비디오 데이터 가져오기
    const { setPanelData } = useContext(PanelContext); // 패널 데이터 설정 함수 가져오기
    const handleBack = useBackHandler();
    const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태 관리
    const [isBotOpen, setIsBotOpen] = useState(false); // 팝업 상태 관리
    const [comment, setComment] = useState(''); // 댓글 상태 관리
    const [messages, setMessages] = useState([]); // 챗봇 메시지 상태 관리

    const [comments, setComments] = useState([]); // 댓글 목록 상태

    const [page, setPage] = useState(0); // 현재 페이지 번호
    //const [myComment, setMyComments] = useState('');

    const [myComments, setMyComments] = useState([]);
    const [isRecipeOpen, setIsRecipeOpen] = useState(false);
    const [recipe, setRecipe] = useState([]);
    const userId = getUserId();
    const [loopStart, setLoopStart] = useState(null); // Start time for the loop
    const [loopEnd, setLoopEnd] = useState(null); // End time for the loop
    const [isLooping, setIsLooping] = useState(false); // Whether looping is active

    const handleSetStartPoint = () => {
        const videoNode = videoRef.current.getVideoNode();
        if (videoNode) {
            setLoopStart(videoNode.currentTime); // Set the start time
            console.log("Loop start set at:", videoNode.currentTime);
        }
    };

    const handleSetEndPoint = () => {
        const videoNode = videoRef.current.getVideoNode();
        if (videoNode) {
            setLoopEnd(videoNode.currentTime); // Set the end time
            console.log("Loop end set at:", videoNode.currentTime);
        }
    };

    // 재생바의 스타일을 업데이트하기 위한 함수
    const getProgressBarStyle = () => {
        if (loopStart !== null && loopEnd !== null) {
            return {
                background: `linear-gradient(to right, transparent, transparent ${loopStart * 100}%, rgba(255, 0, 0, 0.5) ${loopStart * 100}%, rgba(255, 0, 0, 0.5) ${loopEnd * 100}%, transparent ${loopEnd * 100}%)`
            };
        }
        return {};
    };

    const toggleLoop = () => {
        setIsLooping(!isLooping); // Toggle looping on or off
    };

    const handleTimeUpdate = () => {
        const videoNode = videoRef.current.getVideoNode();
        if (videoNode && isLooping && loopStart !== null && loopEnd !== null) {
            if (videoNode.currentTime >= loopEnd) {
                videoNode.currentTime = loopStart; // Jump back to the start of the loop
                videoNode.play(); // Resume playback
            }
        }
    };

    //console.log("videoplayer.js", videoData);
    
    useEffect(() => {
        console.log("new comments : ", comments);
        //console.log("my comments : ", myComments);
    }, [comments]);

    
    useEffect(() => {
        if(isPopupOpen){
            fetchComments();
        }
    }, [isPopupOpen]) 

    const handleRecipe = () => {
        setIsRecipeOpen(true);
        console.log("recipe", isRecipeOpen);
    }


    const handleGoToDetails = async () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        console.log("!");
        const videoId = video.id;

        try{
            const response_ = await fetch(`${ADDR_}/api/description/${videoId}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
            },
            });
            const response = await response_.text();
            console.log(response);
            const data = response.split("\n").map(line => line.trim()).filter(line => line !== "");
            setRecipe(data);
            console.log(data);
            //setRecipe(response);

            //console.log("Recipe data:", data); // 데이터 확인용
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    };

    const handleVideoEnd = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 시간 가져오기
            saveWatchTime(video.id, userId, currentTime); // 현재 시간을 저장
        }
    };

    const handleLoadedData = async () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        videoNode.pause();
        const savedTime = await loadWatchTime(video.id); // 저장된 시간 불러오기
        console.log("불러온 시간: ", savedTime);
        const videoId = video.id;
    
        if (videoNode && savedTime > 0) {
            videoNode.currentTime = savedTime; // 저장된 시간으로 이동
            videoNode.play(); // 비디오 재생 시작
        }
        videoNode.play(); 
        console.log("Video ID : ", videoId);
    };
    

    const setVideo = (video) => {
        videoRef.current = video; // 비디오 설정
    };

    // 비디오 썸네일 클릭 핸들러
    const handleThumbnailClick = (thumbnailVideo) => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 재생 중인 비디오의 시간
            saveWatchTime(video.id, userId, currentTime); // 현재 비디오 시간을 저장
            console.log("현재 재생중인 동영상 재생시간", currentTime);
        }
        // 클릭된 썸네일 비디오로 이동
        setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: thumbnailVideo } }]); // 해당 비디오 재생 패널로 이동
    };


    const handleSendMessage = async () => {
        if (comment.trim() === '') return; // 빈 메시지 전송 방지
    
        setMessages(prev => [...prev, { sender: 'user', text: comment }]);
    
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': ``, // 여기에 실제 API 키를 입력하세요
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4o', // 사용할 모델
                    messages: [ 
                        { role: 'system', content: "You are a helpful assistant." },
                        { role: 'user', content: comment },
                    ],
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                const botMessage = data.choices[0].message.content; // 챗봇의 응답
                setMessages(prev => [...prev, { sender: 'bot', text: botMessage }]);
            } else {
                console.error('Error from OpenAI API:', data);
                setMessages(prev => [...prev, { sender: 'bot', text: '챗봇 응답을 받을 수 없습니다.' }]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: '네트워크 오류가 발생했습니다.' }]);
        }
    
        setComment(''); // 댓글 입력 초기화
    };

    const fetchComments = async () => {
        //const videoNode = videoRef.current.getVideoNode();
        const videoId = video.id;
        try {
            //const url = `http://localhost:8080/api/comment/${videoId}?page=${page}&size=10` //${pageSize}`;
            const url = `${ADDR_}/api/comment/${videoId}?page=${page}&size=10` //${pageSize}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                console.log("data :", data);
                

                
                setComments((prevComments) => [
                    ...prevComments,
                    ...data.comments.filter(
                        (newComment) => !prevComments.some((prevComment) => prevComment.id === newComment.id)
                    ),
                ]);

            } else {
                console.error("댓글 불러오기 실패:", response.status);
            }
        } catch (error) {
            console.error("댓글 불러오기 오류:", error.message);
        }
    };

    const handleSendComment = async () => {
        if (comment.trim() === '') return; // 빈 댓글 전송 방지

        console.log("sending comments : ", comment);

        await postComment(comment);

        setComment('');
    }
    
    const postComment = async (comment) => {
        if(comment.trim() === '') {
            console.log("empty comment");
            return;
        }

        const videoId = String(video.id); 

        try {
            
            const url = `${ADDR_}/api/comment/create?galaxy=${videoId}&userId=${userId}&content=${comment}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
                //}),
            });
            //); 
            if (response.ok) {
                const newComment = await response.json();
                console.log(newComment.length);
            } else {
                console.error("댓글 전송 실패:", response.status);
            }
        } catch (error) {
            console.error("댓글 전송 오류:", error);
        }
    };
    
    

    return (
        <Panel>
            <Header 
                title={video.title} 
                onBack={() => {
                    const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
                    if (videoNode) {
                        const currentTime = videoNode.currentTime; // 현재 시간 가져오기
                        saveWatchTime(video.id, userId, currentTime); // 현재 시간을 저장
                    }
                    handleBack(); // 패널 이동
                }}
            />
            <div className="video-modal">
                <VideoPlayer
                    loop={false}
                    ref={setVideo}
                    style={{ width: '100%', height: '100%' }} // 전체 화면 차지
                    onEnded={handleVideoEnd} // 비디오 종료 시 핸들러 추가
                    onTimeUpdate={handleTimeUpdate} // Monitor playback time

                    onLoadedData={startTime > 0 ? handleLoadedData : null} // startTime에 따라 호출되는 핸들러 설정 pauseforward pausebackward
                >

                    <MediaControls>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                            <IconItem onClick={handleSetStartPoint} icon="pauseforward" size="small" />
                            <IconItem onClick={handleSetEndPoint} icon="pausebackward" size="small" />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' , justifyContent: 'center'}}>
                            <Button onClick={toggleLoop} size="small">
                                {isLooping ? "Disable Loop" : "Enable Loop"}
                            </Button>
                            <Button size="small" onClick={() => {
                                handleRecipe(),
                                handleGoToDetails() 
                            }}>
                                Go to Recipe
                            </Button> 

                            <Button size="small" onClick={() => { 
                                setIsPopupOpen(true);
                            }}>
                                Comments
                            </Button>

                            <Button size="small" onClick={() => setIsBotOpen(true)}>
                                Chatbot
                            </Button> 

                            <Button size="small" onClick={() => {
                                const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
                                if (videoNode) {
                                    const currentTime = videoNode.currentTime; // 현재 시간 가져오기
                                    saveWatchTime(video.id, userId, currentTime); // 현재 시간을 저장
                                }
                                handleBack(); // 패널 이동
                            }}>
                                Back
                            </Button>
                        </div>
                        {/* 다른 비디오 썸네일 표시 */}
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
                            )) : <div>No Videos</div>}
                        </Scroller>
                    </MediaControls>
                    
                    
                    <source src={video.src} type="video/mp4" />
                </VideoPlayer>
            </div>

            {/* 확인 팝업 (내용이 있는 스크롤 구현) */}
            <Popup
                open={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                style={{ maxWidth: '100%', maxHeight: '500px' }} // 팝업의 최대 크기 제한
            >
                <Scroller style={{ maxHeight: '300px' }}>

                <div>
                    {comments.length > 0 ? (
                        comments.map((c) => (
                            <div key={c.id} style={{ marginBottom: '10px', padding: '5px' }}>
                                <h5 style={{ fontSize: '0.8rem', margin: 0, fontWeight: 'bold' }}>
                                    {c.content}
                                    {/*
                                    <span style={{ fontSize: '0.6rem', marginLeft: '10px', color: '#666' }}>
                                        / User ID: {comment.userId}
                                    </span>  */}
                                </h5>
                                <h5 style={{ fontSize: '0.5rem', margin: 0, color: '#888' }}>
                                    @ {c.user?.username || 'Unknown'} - {String(c.createdAt)}
                                </h5>
                            </div>
                        ))
                    ) : (
                        <div>No Comments</div>
                    )}
                </div>

                </Scroller>
                <InputField
                    placeholder="type the comment..."
                    value={comment}
                    onChange={(e) => setComment(e.value)} // 댓글 상태 업데이트
                    style={{ marginTop: '10px' }} // 입력창 위 여백
                /> 
                {/*
                <Button onClick={
                    postComment
                    }>댓글 남기기</Button> 
                */}
                
                <Button onClick={ async() => {
                    console.log("댓글 남기기:", comment);
                    setMyComments(comment);
                    await postComment(comment);
                    //postComment(comment);
                    setComment(''); // 댓글 입력 초기화
                    console.log('end of post');
                }}>Send Comment</Button>  

                <Button onClick={() => {
                    setPage(prev => prev + 1);
                    fetchComments();
                }}>more</Button>
            </Popup>

            <Popup
                open={isBotOpen}
                onClose={() => setIsBotOpen(false)}
                style={{ maxWidth: '100%', maxHeight: '500px' }} // 팝업의 최대 크기 제한
            >
                <Scroller style={{ maxHeight: '280px' }}>
                {messages.map((msg, index) => (
                <div key={index} style={{ 
                    margin: '5px 0',
                    textAlign: msg.sender === 'user' ? 'right' : 'left', // 메시지 정렬
                    display: 'flex', // Flexbox 사용
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', // 위치 조정
                }}>
                    <div style={{ 
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: msg.sender === 'user' ? '#F1F0F0' : '#F1F0F0', // 메시지 색상
                        maxWidth: '70%', // 최대 너비 설정
                        wordWrap: 'break-word', // 긴 단어 줄바꿈
                        color: 'black',
                    }}>
                        <strong>{msg.sender === 'user' ? 'User:' : 'Bot:'}</strong> {msg.text}
                    </div>
                </div>
                ))}
                </Scroller>
                <InputField
                placeholder="메시지를 입력하세요..."
                value={comment}
                onChange={(e) => setComment(e.value)} // 메시지 상태 업데이트
                style={{ marginTop: '10px', width: '80%' }} // 입력창 위 여백
                />
                <Button onClick={handleSendMessage} size="small">Send</Button>
            </Popup>

            <Popup
                open={isRecipeOpen}
                onClose={() => setIsRecipeOpen(false)}
                //style={{ maxWidth: '100%', maxHeight: '500px' }} // 팝업의 최대 크기 제한
            >
                <Scroller style={{ maxHeight: '500px' }}>
                <h2>Details</h2>
                    {/*
                    {recipe.length > 0 ? (
                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                            {recipe.map((item, index) => (
                                <li key={index} style={{ marginBottom: '10px', fontSize: '16px', color: '#333' }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ fontSize: '16px', color: '#666' }}>No recipe data available.</p>
                    )} */}
                    {recipe.length > 0 ? (
                        <div>
                        {recipe.map((line, index) => (
                            <p key={index} style={{ marginBottom: '10px' }}>
                                {line}
                            </p>
                        ))}
                    </div>
                    ) : (
                        <h4>No Recipe</h4>
                    )}
                            
                </Scroller>
            </Popup>
        </Panel>
    );
};

export default SelectableVideoPlayer;
