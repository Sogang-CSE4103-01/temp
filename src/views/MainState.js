/* eslint-disable */
//import { useCallback, useEffect, useState } from 'react';
//import { sam } from '../libs/services';
//import debugLog from '../libs/log';

// 로컬 이미지 불러오기 (src/assets에서)
/*
import video1 from '../assets/video1.jpg';
import video2 from '../assets/video2.jpg';
import video3 from '../assets/video3.jpg';
import video4 from '../assets/video4.jpg';
import video5 from '../assets/video5.jpg';
import video6 from '../assets/video6.jpg';

// 비디오 정보를 관리하기 위한 데이터 타입
export const useMainState = () => {
    const [isPopupOpen, openPopup] = useState(false);
    const [videoData, setVideoData] = useState([]);
	const [loading, setLoading] = useState(true);

	const generateVideoData = async() => {
		const initialVideoData=Array.from({length:20}, (_, index) => ({
			id:index+1,
			title:`video ${index+1}`,
			thumbnail : defualtThumbnail,
			src: `http://media.w3.org/2010/05/video/movie_300.mp4`,
			watchTime:loadWatchTime(index+1),
		}))
	};

	const updatedData = await Promise.all(
		initialVideoData.map(async (video) => {
			try{
				const titleResponse = await fetch(`/api/video_title/${video.id}`);
				const title = titleResponse.ok ? await titleResponse.text() : video.title;

				const thumbnailResponse = await fetch(`/api/thumbnail/${video.id}.jpg`)
				const thumbnail = thumbnailResponse.ok ? `/api/thumbnail/${video.id}.jpg` : video.thumbnail;

				return {
					...video,
					title,
					thumbnail,
					src: `/api/video/${video.id}.mp4`,
				};
			} catch (error) {
				console.error(`Error loading data for video ${video.id}:`, error);
				return video;
			}
		})
	);

	return updatedData;
};
    useEffect(() => {
        // 로컬 저장소에서 시청 시간을 불러와서 초기화
        const initialVideoData = [
            {
                id: 1,
                title: "첫 번째 비디오",
                thumbnail: video1,
                src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
                watchTime: loadWatchTime(1)
            },
            {
                id: 2,
                title: "두 번째 비디오",
                thumbnail: video2,
                src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
                watchTime: loadWatchTime(2)
            },
			{
				id: 3,
				title: "세 번째 비디오",
				thumbnail: video3,
				src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
				watchTime: loadWatchTime(3) // 시청 시간을 추가
				},
				{
				id: 4,
				title: "네 번째 비디오",
				thumbnail: video4,
				src: 'https://example.com/video4.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 5,
				title: "다섯 번째 비디오",
				thumbnail: video5,
				src: 'https://example.com/video5.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 6,
				title: "여섯 번째 비디오",
				thumbnail: video6,
				src: 'https://example.com/video6.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 7,
				title: "일곱 번째 비디오",
				thumbnail: video6,
				src: 'https://example.com/video7.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 8,
				title: "여덟 번째 비디오",
				thumbnail: video6,
				src: 'https://example.com/video8.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 9,
				title: "아홉 번째 비디오",
				thumbnail: video6,
				src: 'https://example.com/video9.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 10,
				title: "열 번째 비디오",
				thumbnail: video1,
				src: 'https://example.com/video10.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 11,
				title: "열한 번째 비디오",
				thumbnail: video2,
				src: 'https://example.com/video11.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 12,
				title: "열두 번째 비디오",
				thumbnail: video3,
				src: 'https://example.com/video12.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 13,
				title: "열세 번째 비디오",
				thumbnail: video4,
				src: 'https://example.com/video13.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 14,
				title: "열네 번째 비디오",
				thumbnail: video5,
				src: 'https://example.com/video14.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 15,
				title: "열다섯 번째 비디오",
				thumbnail: video6,
				src: 'https://example.com/video15.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 16,
				title: "열여섯 번째 비디오",
				thumbnail: video1,
				src: 'https://example.com/video16.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 17,
				title: "열일곱 번째 비디오",
				thumbnail: video2,
				src: 'https://example.com/video17.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 18,
				title: "열여덟 번째 비디오",
				thumbnail: video3,
				src: 'https://example.com/video18.mp4',
				watchTime: 0 // 시청 시간을 추가
				},
				{
				id: 19,
				title: "열아홉 번째 비디오",
				thumbnail: video4,
				src: 'https://example.com/video19.mp4',
				watchTime: 0 // 시청 시간을 추가
				},	
            // ... 나머지 비디오 데이터
            {
                id: 20,
                title: "스무 번째 비디오",
                thumbnail: video5,
                src: 'https://example.com/video20.mp4',
                watchTime: loadWatchTime(20)
            }
        ];
        setVideoData(initialVideoData);
    }, []); // 빈 배열로 하여 컴포넌트가 처음 마운트될 때만 실행

    const handleLaunchApp = useCallback(async () => {
        const result = await sam({
            method: 'launch',
            parameters: { id: 'com.webos.app.self-diagnosis' }
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


****************이 부분 백엔드에서 주고 받고 하도록 수정해야 해요 ! *********************************
	//비디오 시청시간 저장하는 함수
    const saveWatchTime = (videoId, time) => {
		setVideoData(prevData => {
			const updatedData = prevData.map(video => 
				video.id === videoId ? { ...video, watchTime: time } : video
			);
	
			// localStorage에 저장
			if (typeof window !== 'undefined') {/* eslint-disable-next-line no-undef 
				localStorage.setItem(`watchTime_${videoId}`, time);
			}
	
			console.log('Updated Video Data:', updatedData);
			return updatedData;
		});
		console.log(`Watch time for video ${videoId} saved: ${time}`);
	};

    // 비디오의 시청 시간을 불러오는 함수
    const loadWatchTime = (videoId) => {
		 eslint-disable-next-line no-undef 
		if (typeof window !== 'undefined') {/* eslint-disable-next-line no-undef 
			const savedTime = localStorage.getItem(`watchTime_${videoId}`);
			return savedTime ? parseInt(savedTime, 10) : 0; // 저장된 시간이 없으면 0 반환
		}
		return 0; // 클라이언트가 아닐 경우 기본값 0 반환
	};
****************이 부분 백엔드에서 주고 받고 하도록 수정해야 해요 ! *********************************
    return {
        isPopupOpen,
        handlePopupOpen,
        handlePopupClose,
        handleLaunchApp,
        videoData,
        setVideoData,
        saveWatchTime, // 시청 시간 저장 함수 제공
        loadWatchTime // 시청 시간 불러오기 함수 제공
    };
}; */

/* eslint-disable */

/*
import { useCallback, useEffect, useState } from 'react';
import { sam } from '../libs/services';
import debugLog from '../libs/log';

// 로컬 이미지 임포트 (기본 썸네일로 사용)
import defaultThumbnail from '../assets/3.jpg';

export const useMainState = () => {
    const [isPopupOpen, openPopup] = useState(false);
    const [videoData, setVideoData] = useState([]); // 초기값을 빈 배열로 설정
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [index, setIndex] = useState(0);

    // 비디오 데이터를 생성하는 함수 (고정 데이터 + 비동기 썸네일/타이틀 로드)
    const generateVideoData = async () => {
        const initialVideoData = Array.from({ length: 10 }, (_, index) => ({
            id: index + 1,
            title: `비디오 ${index + 1}`, // 기본 타이틀
            thumbnail: defaultThumbnail, // 기본 썸네일
            src: `http://media.w3.org/2010/05/video/movie_300.mp4`, // 기본 비디오 URL
            watchTime: loadWatchTime(index + 1), // 시청 시간 로드
        }));

        const updatedData = await Promise.all(
            initialVideoData.map(async (video) => {
                try {
                    // 비디오 제목 동적 로드
                    //const titleResponse = await fetch(`http://localhost:8080/api/video_title/${video.id}`);
					const titleResponse = await fetch(`/api/video_title/${video.id}`);
                    const title = titleResponse.ok ? await titleResponse.text() : video.title;

                    // 썸네일 동적 로드
                    //const thumbnailResponse = await fetch(`http://localhost:8080/api/thumbnail/${video.id}.jpg`);
					const thumbnailResponse = await fetch(`/api/thumbnail/${video.id}.jpg`);
                    const thumbnail = thumbnailResponse.ok
                        //? `http://localhost:8080/api/thumbnail/${video.id}.jpg`
						? `/api/thumbnail/${video.id}.jpg`
                        : video.thumbnail;

                    return {
                        ...video,
                        title,
                        thumbnail,
                        //src: `http://localhost:8080/api/video/${video.id}.mp4`, // 비디오 동적 URL
						src: `/api/video/${video.id}.mp4`, // 비디오 동적 URL
                    };
                } catch (error) {
                    console.error(`Error loading data for video ${video.id}:`, error);
                    return video; // 오류 발생 시 기본 데이터 유지
                }
            })
        );

        return updatedData;
    };

    // 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            setLoading(true); // 로딩 시작
            try {
                const data = await generateVideoData();
                setVideoData(data); // 상태 업데이트
            } catch (error) {
                console.error('Error generating video data:', error);
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        loadData();
    }, []); // 컴포넌트가 마운트될 때 한 번 실행

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

    // 시청 시간 저장
    const saveWatchTime = (videoId, time) => {
        setVideoData((prevData) =>
            prevData.map((video) =>
                video.id === videoId ? { ...video, watchTime: time } : video
            )
        );

        // localStorage에 저장
        if (typeof window !== 'undefined') {
            localStorage.setItem(`watchTime_${videoId}`, time);
        }

        console.log(`Watch time for video ${videoId} saved: ${time}`);
    };

    // 시청 시간 로드
    const loadWatchTime = (videoId) => {
        if (typeof window !== 'undefined') {
            const savedTime = localStorage.getItem(`watchTime_${videoId}`);
            return savedTime ? parseInt(savedTime, 10) : 0; // 저장된 시간이 없으면 0 반환
        }
        return 0;
    };

    return {
        isPopupOpen,
        handlePopupOpen,
        handlePopupClose,
        handleLaunchApp,
        videoData,
        setVideoData,
        saveWatchTime,
        loadWatchTime,
        loading, // 로딩 상태 반환
    };
};  */

/*
import { useCallback, useEffect, useState } from 'react';
import { sam } from '../libs/services';
import debugLog from '../libs/log';

// 로컬 이미지 임포트 (기본 썸네일로 사용)
import defaultThumbnail from '../assets/3.jpg';

export const useMainState = () => {
    const [isPopupOpen, openPopup] = useState(false);
    const [videoData, setVideoData] = useState([]); // 초기값을 빈 배열로 설정
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [totalVideos, setTotalVideos] = useState(null);

    const fetchTotalVideos = useCallback(async () => {
        try {
            const response = await fetch('/api/num_of_videos');
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
                    const titleResponse = await fetch(`/api/video_title/${index}`);
                    const title = titleResponse.ok ? await titleResponse.text() : defaultVideo.title;

                    const thumbnailResponse = await fetch(`/api/thumbnail/${index}.jpg`);
                    const thumbnail = thumbnailResponse.ok ? `/api/thumbnail/${index}.jpg` : defaultVideo.thumbnail;

                    return {
                        ...defaultVideo,
                        title,
                        thumbnail,
                        src: `/api/video/${index}.mp4`,
                    };
                } catch (error) {
                    console.error(`Error loading data for video ${index}:`, error);
                    return defaultVideo; // 오류 발생 시 기본 데이터 유지
                }
            })
        );

        return videos;
    };

    // 데이터 로드
    const loadData = useCallback(async () => {
        setLoading(true); // 로딩 시작
        try {
            const newVideos = await generateVideoData(page *10 - 9 , page * 10) // Fetch 10 videos based on the current page
            setVideoData((prevData) => [...prevData, ...newVideos]); // Append new videos to the existing ones
        } catch (error) {
            console.error('Error loading video data:', error);
        } finally {
            setLoading(false); // 로딩 완료
        }
    }, [page]);

    useEffect(() => {
        fetchTotalVideos();
        loadData(); // Load the first set of videos on mount
        
    }, [fetchTotalVideos, loadData]);

    const loadMore = () => {
        if (videoData.length < totalVideos) {
            setPage((prevPage) => prevPage + 1); // Increment the page to load the next set of videos
        }
        //setPage((prevPage) => prevPage + 1); // Increment the page to load the next set of videos
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

    // 시청 시간 저장
    const saveWatchTime = (videoId, time) => {
        setVideoData((prevData) =>
            prevData.map((video) =>
                video.id === videoId ? { ...video, watchTime: time } : video
            )
        );

        // localStorage에 저장
        if (typeof window !== 'undefined') {
            localStorage.setItem(`watchTime_${videoId}`, time);
        }

        console.log(`Watch time for video ${videoId} saved: ${time}`);
    };

    // 시청 시간 로드
    const loadWatchTime = (videoId) => {
        if (typeof window !== 'undefined') {
            const savedTime = localStorage.getItem(`watchTime_${videoId}`);
            return savedTime ? parseInt(savedTime, 10) : 0; // 저장된 시간이 없으면 0 반환
        }
        return 0;
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
    };
}; */

/*
import { useCallback, useEffect, useState } from 'react';
import { sam } from '../libs/services';
import debugLog from '../libs/log';

var flag = 0;

// 로컬 이미지 임포트 (기본 썸네일로 사용)
import defaultThumbnail from '../assets/3.jpg';

export const useMainState = () => {
    const [isPopupOpen, openPopup] = useState(false);
    const [videoData, setVideoData] = useState([]); // 초기값을 빈 배열로 설정
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [totalVideos, setTotalVideos] = useState(null);

    const fetchTotalVideos = useCallback(async () => {
        try {
            const response = await fetch('/api/num_of_videos');
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
                    const titleResponse = await fetch(`/api/video_title/${index}`);
                    const title = titleResponse.ok ? await titleResponse.text() : defaultVideo.title;

                    const thumbnailResponse = await fetch(`/api/thumbnail/${index}.jpg`);
                    const thumbnail = thumbnailResponse.ok ? `/api/thumbnail/${index}.jpg` : defaultVideo.thumbnail;

                    return {
                        ...defaultVideo,
                        title,
                        thumbnail,
                        src: `/api/video/${index}.mp4`,
                    };
                } catch (error) {
                    console.error(`Error loading data for video ${index}:`, error);
                    return defaultVideo; // 오류 발생 시 기본 데이터 유지
                }
            })
        );

        return videos;
    };

    // 데이터 로드
    const loadData = useCallback(async () => {
        setLoading(true); // 로딩 시작
        try {

            const startIndex = (page - 1) * 10 + 1;
            const remainingVideos = totalVideos - startIndex;
            const countToFetch = Math.min(10, remainingVideos);

            //if(totalVideos - (page * 10 -9) >= 10){
            if(flag == 0 || countToFetch > 0){
                flag = 1;
                const endIndex = startIndex + countToFetch - 1;
                //const newVideos = await generateVideoData(page *10 - 9 , page * 10) // Fetch 10 videos based on the current page
                const newVideos = await generateVideoData(startIndex , endIndex)
                setVideoData((prevData) => [...prevData, ...newVideos]); // Append new videos to the existing ones
                console.log('load videos : ', startIndex);
            }
            else{
                //const newVideos = await generateVideoData(page *10 - 9 , (page * 10 - 9)+(totalVideos - (page * 10 - 9))) // Fetch 10 videos based on the current page
                //setVideoData((prevData) => [...prevData, ...newVideos]); // Append new videos to the existing ones
                //console.log((page * 10 - 9)+(totalVideos - (page * 10 - 9)));
                console.log('no more vids');
            }
        } catch (error) {
            console.error('Error loading video data:', error);
        } finally {
            setLoading(false); // 로딩 완료
        }
    }, [page, totalVideos, videoData.length, generateVideoData]);

    useEffect(() => {
        fetchTotalVideos();
        loadData(); // Load the first set of videos on mount
        
    }, [fetchTotalVideos, loadData]);

    const loadMore = () => {
        if (videoData.length < totalVideos) {
            setPage((prevPage) => prevPage + 1); // Increment the page to load the next set of videos
        }
        //setPage((prevPage) => prevPage + 1); // Increment the page to load the next set of videos
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

    // 시청 시간 저장
    const saveWatchTime = (videoId, time) => {
        setVideoData((prevData) =>
            prevData.map((video) =>
                video.id === videoId ? { ...video, watchTime: time } : video
            )
        );

        // localStorage에 저장
        if (typeof window !== 'undefined') {
            localStorage.setItem(`watchTime_${videoId}`, time);
        }

        console.log(`Watch time for video ${videoId} saved: ${time}`);
    };

    // 시청 시간 로드
    const loadWatchTime = (videoId) => {
        if (typeof window !== 'undefined') {
            const savedTime = localStorage.getItem(`watchTime_${videoId}`);
            return savedTime ? parseInt(savedTime, 10) : 0; // 저장된 시간이 없으면 0 반환
        }
        return 0;
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
    };
}; */

import { useCallback, useEffect, useState } from 'react';
import { sam } from '../libs/services';
import debugLog from '../libs/log';
import { ADDR_ } from './address';

// 로컬 이미지 임포트 (기본 썸네일로 사용)
import defaultThumbnail from '../assets/3.jpg';

var flag = 0;

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

    /*
    useEffect(() => {
        if (totalVideos > 0){
            loadData();
        }
    }, [totalVideos]); */

    // 데이터 로드
    const loadData = useCallback(async () => {
        setLoading(true); // 로딩 시작
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

    // 시청 시간 저장
    const saveWatchTime = (videoId, time) => {
        setVideoData((prevData) =>
            prevData.map((video) =>
                video.id === videoId ? { ...video, watchTime: time } : video
            )
        );

        // localStorage에 저장
        if (typeof window !== 'undefined') {
            localStorage.setItem(`watchTime_${videoId}`, time);
        }

        console.log(`Watch time for video ${videoId} saved: ${time}`);
    };

    // 시청 시간 로드
    const loadWatchTime = (videoId) => {
        if (typeof window !== 'undefined') {
            const savedTime = localStorage.getItem(`watchTime_${videoId}`);
            return savedTime ? parseInt(savedTime, 10) : 0; // 저장된 시간이 없으면 0 반환
        }
        return 0;
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
    };
};
