/* eslint-disable */
import { useCallback, useEffect, useRef, useState } from 'react';
import { sam } from '../libs/services';
import debugLog from '../libs/log';
import { ADDR_ } from './address';
import { getUserId } from './address'; // config에서 setUserId 가져오기
// 로컬 이미지 임포트 (기본 썸네일로 사용)
import defaultThumbnail from '../assets/3.jpg';
import { string } from 'prop-types';

var flag = 0;

//const flag = useRef(false);

export const useMainState = () => {
    const [isPopupOpen, openPopup] = useState(false);
    const [videoData, setVideoData] = useState([]); // 초기값을 빈 배열로 설정
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [totalVideos, setTotalVideos] = useState(null);

    
    // 로컬스토리지에서 저장된 비디오 데이터 로드
    useEffect(() => {
        const savedVideoData = localStorage.getItem('videoData');
        if (savedVideoData) {
            setVideoData(JSON.parse(savedVideoData)); // 로컬스토리지에서 데이터 불러오기
        }
    }, []);

    // 비디오 데이터를 로컬스토리지에 저장
    useEffect(() => {
        if (videoData.length > 0) {
            localStorage.setItem('videoData', JSON.stringify(videoData)); // 비디오 데이터 로컬스토리지에 저장
        }
    }, [videoData]);   

    console.log("mainstate", videoData);

    const fetchTotalVideos = useCallback(async () => {
        try {
            const response = await fetch(`${ADDR_}/api/num_of_videos`);
            if (response.ok) {
                const count = await response.json();
                console.log(count);
                setTotalVideos(count); // 총 비디오 수 저장
            } else {
                console.error('Failed to fetch total video count');
            }
        } catch (error) {
            console.error('Error fetching total video count:', error);
        }
    }, []);

    // 비디오 데이터를 생성하는 함수 (고정 데이터 + 비동기 썸네일/타이틀 로드)
    const generateVideoData = async (startIndex, endIndex) => {
        const videoIndices = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => startIndex + i);

        const videos = await Promise.all(
            videoIndices.map(async (index) => {
                const defaultVideo = {
                    id: index,
                    title: `비디오 ${index + 1}`,
                    thumbnail: defaultThumbnail,
                    src: `http://media.w3.org/2010/05/video/movie_300.mp4`,
                    watchTime: loadWatchTime(index),
                };

                try {
                    const titleResponse = await fetch(`${ADDR_}/api/video_title/${index}`);  //
                    console.log(index);
                    console.log(titleResponse);
                    const title = titleResponse.ok ? await titleResponse.text() : defaultVideo.title;

                    const thumbnailResponse = await fetch(`${ADDR_}/api/thumbnail/${index}.jpg`);
                    const thumbnail = thumbnailResponse.ok ? `${ADDR_}/api/thumbnail/${index}.jpg` : defaultVideo.thumbnail;

                    return {
                        ...defaultVideo,
                        title,
                        thumbnail,
                        src: `${ADDR_}/api/video/${index}.mp4`,
                    };
                } catch (error) {
                    console.error(`Error loading data for video ${index}:`, error);
                    return defaultVideo; // 오류 발생 시 기본 데이터 유지
                }
            })
        );

        return videos;
    };

     // 특정 문자열로 필터링된 비디오 생성 함수
     const generateFilteredVideoData = async (searchString) => {
        const allVideos = await generateVideoData(1, totalVideos); // 모든 비디오 데이터 가져오기
        const filteredVideos = allVideos.filter(video => 
            video.title.includes(searchString) // 제목에 특정 문자열이 포함되는지 확인
        );
        console.log("aaaa", filteredVideos);
        return filteredVideos;
    };

    /*
    useEffect(() => {
        if (totalVideos > 0){
            loadData();
        }
    }, [totalVideos]); */

    // 데이터 로드
    const loadData = useCallback(async () => {
        console.log("페이지를 불러옵니다");
        setLoading(true); // 로딩 시작

        console.log("load data");

        //if(flag.current) return;
        //flag.current = true;

        try {
            /*
            const start = page * 10 - 9;
            const end = Math.min(start + 9, totalVideos);

            const newVideos = await generateVideoData(start, end); // 필요한 데이터 범위만 호출
            setVideoData((prevData) => {
                const mergedData = [...prevData, ...newVideos];
                const uniqueData = Array.from(new Set(mergedData.map((video) => video.id)))
                    .map((id) => mergedData.find((video) => video.id === id));
                return uniqueData;
            }); */
            
            if (flag == 0 || totalVideos - (page * 10 - 9) >= 10) {
                flag = 1;
                const newVideos = await generateVideoData(page * 10 - 9, page * 10); // Fetch 10 videos based on the current page
                setVideoData((prevData) => {
                    // 기존 비디오 데이터와 새로 로드한 비디오 데이터를 합칠 때 중복 제거
                    const mergedData = [...prevData, ...newVideos];
                    const uniqueData = Array.from(new Set(mergedData.map((video) => video.id)))
                        .map((id) => mergedData.find((video) => video.id === id));
                    return uniqueData; // 중복 제거된 데이터 반환
                });
                console.log(page * 10);
            } else {
                const newVideos = await generateVideoData(
                    page * 10 - 9,
                    (page * 10 - 9) + (totalVideos - (page * 10 - 9))
                ); // Fetch 10 videos based on the current page
                setVideoData((prevData) => {
                    // 기존 비디오 데이터와 새로 로드한 비디오 데이터를 합칠 때 중복 제거
                    const mergedData = [...prevData, ...newVideos];
                    const uniqueData = Array.from(new Set(mergedData.map((video) => video.id)))
                        .map((id) => mergedData.find((video) => video.id === id));
                    return uniqueData; // 중복 제거된 데이터 반환
                });
                console.log((page * 10 - 9) + (totalVideos - (page * 10 - 9))); 
            }
        } catch (error) {
            console.error('Error loading video data:', error);
        } finally {
            setLoading(false); // 로딩 완료
        }
    }, [page, totalVideos]);

    useEffect(() => {
        const fetchAndLoad = async () => {
            await fetchTotalVideos();
            loadData();
        }
        //fetchTotalVideos();
        //loadData(); // Load the first set of videos on mount
        fetchAndLoad();
    }, []);

    const loadMore = () => {
        if (videoData.length < totalVideos) {
            setPage((prevPage) => prevPage + 1); // Increment the page to load the next set of videos

            fetchTotalVideos();
            loadData();
        }
    };

    // 팝업 관련 핸들러
    const handleLaunchApp = useCallback(async () => {
        const result = await sam({
            method: 'launch',
            parameters: { id: 'com.webos.app.self-diagnosis' },
        });
        debugLog('SAM', result);
        openPopup(false);
    }, []);

    const handlePopupOpen = useCallback(() => {
        openPopup(true);
    }, []);

    const handlePopupClose = useCallback(() => {
        openPopup(false);
    }, []);

    const saveWatchTime = async (videoId, userId, watchedTime) => {
        console.log(`Saving watch time using query parameters: videoId=${videoId}, userId=${userId}, watchedTime=${watchedTime}`);
    
        try {
            const watchedTimeInt = Math.floor(watchedTime);
            const response = await fetch(`${ADDR_}/api/videowatched/record?a=${videoId}&b=${userId}&c=${watchedTime}`, {
                method: 'POST',
                headers: {
                    // 바디가 없으므로 Content-Type은 설정하지 않아도 됨.
                    'Content-Type': 'application/json', // 필요하지 않다면 이 줄을 제거하세요.
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to save watch time (query):', errorData);
                return { success: false, error: errorData };
            }
    
            const responseData = await response.json();
            console.log('Watch time saved successfully (query):', responseData);
            return { success: true, data: responseData };
        } catch (error) {
            console.error('Error saving watch time (query):', error);
            return { success: false, error: error.message };
        }
    };
    

    const loadWatchTime = async (videoId) => {
        const userId = getUserId(); // 사용자 ID 가져오기
        console.log(userId, videoId);
        try {
            const response = await fetch(`${ADDR_}/api/videowatched/${userId}/${videoId}`, {
                method: 'GET',
                headers: {
                    // 바디가 없으므로 Content-Type은 설정하지 않아도 됨.
                    'Content-Type': 'application/json', // 필요하지 않다면 이 줄을 제거하세요.
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to load watch time (query):', errorData);
                return { success: false, error: errorData };
            }
            const data = await response.json();
            debugLog('저장시간 로드', data);
            console.log("성공! 읽어온 저장시간: ", data.watchedTime);
            // API 응답에서 watchedTime을 반환
            return data.watchedTime || 0; // watchedTime이 없으면 0 반환
        } catch (error) {
            console.error('Error loading watch time:', error);
            return 0; // 오류 발생 시 0 반환
        }
    };
    

    return {
        isPopupOpen,
        handlePopupOpen,
        handlePopupClose,
        handleLaunchApp,
        videoData,
        loadMore,
        saveWatchTime,
        loadWatchTime,
        loading, // 로딩 상태 반환
        totalVideos,
        generateFilteredVideoData,
    };
};
