/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ADDR_ } from './address';
import { getUserId } from './address';
import { Button, Popup, InputField } from '@enact/sandstone'; // Assuming these components are being used
import { useMainState } from './MainState';
import defaultThumbnail from '../assets/3.jpg'; 

 export  const usePlaylist = () => {   
    const userId = getUserId();
    const [page, setPage] = useState(0);
    const [playlists, setPlaylists] = useState([]);
    //const [loading, setLoading] = useState(false);
    const [totalPlaylists, setTotalPlaylists] = useState(null); 
    const [pid, setPid] = useState(0);
    const size = 10;
    const [playlistVideo, setPlaylistVideo] = useState([]);

    const [addition, setAddition] = useState([]);

    //const { loadWatchTime, saveWatchTime, videoData } = useMainState(); 

    const createPlaylist = async(title) => {
    if (!title) {
      // Prevent submitting if the title is empty
      //alert("Please enter a title for the playlist.");
      return;
    }

    try {
      const response = await fetch(`${ADDR_}/api/makePlaylist?userId=${userId}&title=${title}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({
        //  title: title, // Send the playlist title to the backend
        //}),
      });

      console.log('create');

      const data = await response.json();

      if (response.ok) {
        console.log('New playlist created!', data);
        //alert('Playlist created successfully!');
        //setIsListAdditionOpen(false); // Close the popup after successful submission
      } else {
        console.error('Failed to create playlist:', data);
        //alert('Error creating playlist.');
      }
    } catch (error) {
      console.error('Error:', error);
      //alert('An error occurred while creating the playlist.');
    }
  };


  const fetchPlaylists = useCallback(async () => {
    try {
        //setLoading(true); // 로딩 시작
        //const userId = getUserId(); // 사용자 ID 가져오기
        const response = await fetch(`${ADDR_}/api/getPlaylist/${userId}?page=${page}&size=${size}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            //setPlaylists((prev) => [...prev, ...data.playlists]); // 기존 데이터에 추가

            setPlaylists((prev) => {
              // Prevent duplicate playlist entries
              const newPlaylists = data.playlists.filter(
                  (playlist) => !prev.some((p) => p.id === playlist.id)
              );
              return [...prev, ...newPlaylists];
            });

            console.log(`Fetched playlists for page ${page}:`, data.playlists);
            console.log(data.size);
        } else {
            console.error(`Failed to fetch playlists for page ${page}`);
        }
    } catch (error) {
        console.error('Error fetching playlists:', error);
    } finally {
        //setLoading(false); // 로딩 완료
    }
}, []);

const loadPlaylists = useCallback(() => {
    //if (playlists.length < totalPlaylists) {
    fetchPlaylists(page, size); // 현재 페이지와 크기로 데이터 요청
    setPage((prevPage) => prevPage + 1); // 다음 페이지 설정
    //}
}, [page, size, totalPlaylists, playlists.length, fetchPlaylists]);


  useEffect(() => {
    const initialize = async () => {
      //await fetchTotalPlaylists(); // 총 플레이리스트 수 가져오기
      await fetchPlaylists(page, size); // 첫 페이지 데이터 로드
    };
   initialize();
  }, [fetchPlaylists, page, size]);    


  const handlePlaylistClick = (id) => {
    console.log('Clicked playlist ID:', id);
    setPid(id);
    //p_id = id;
    console.log(pid);
    //playlistVideos();
  };

  useEffect(() => {
    if (pid !== null){
      console.log('updated : ', pid);
      playlistVideos();
    }
  }, [pid]);


  const playlistVideos = useCallback(async () => {
    //setLoading(true);
    try {
        console.log("id:", pid);
        const response = await fetch(`${ADDR_}/api/playlist/${pid}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // API 응답에서 시청 기록이 있는 비디오 필터링
            const playlistVideos = data.map((record) => ({
                id: record.video.id,
                title: record.video.title,
                //title : `${ADDR_}/api/video_title/${id}`,
                //watchedTime: record.watchedTime,
                //watchedAt: record.watchedAt,
                watchedTime : `${ADDR_}/api/videowatched/${record.playlist.user.id}/${record.video.id}.mp4`,
                user: {
                    id: record.playlist.user.id,
                    username: record.playlist.user.username,
                },
                thumbnail: `${ADDR_}/api/thumbnail/${record.video.id}.jpg` || defaultThumbnail,
                src: `${ADDR_}/api/video/${record.video.id}.mp4`,
            }));
            setPlaylistVideo(playlistVideos);
        } else {
            console.error('Failed to fetch watched videos');
        }
    } catch (error) {
        console.error('Error fetching watched videos:', error);
    } finally {
        //setLoading(false);
    }
  });

  const addButton = useCallback(async () => {
    console.log("add button");


  })

  const handleAddition = useCallback(async (key) => {
    console.log('handle addition : ', key);

    //setAddtion((prevKeys) => [...prevKeys, key]);
    setAddition((prevKeys) => {
      const updatedKeys = [...prevKeys, key];
      console.log('Updated addition array:', updatedKeys); // Debugging output
      return updatedKeys;
  });

  }, [])

  const addVideos = useCallback(async() => {
    //setLoading(true);
    console.log(addition);

        try {
            // Replace this URL with the API endpoint to fetch the newly added video
            //const response = await fetch('https://example.com/api/new-video');

            /*
            const response = await fetch(`${ADDR_}/api/addPlaylist/videoId=${videoid}&playlistId=${pid}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch video');
            }

            const videoData = await response.json(); */

            const responses = await Promise.all(
              addition.map(async (videoId) => {
                console.log(videoId, pid);
                const response = await fetch(`${ADDR_}/api/addPlaylist?videoId=${videoId}&playlistId=${pid}` , {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  }
                });
                if (!response.ok) {
                    throw new Error(`Failed to add video with ID: ${videoId}`);
                }
                return response.json();
              })
            );

            // Assuming the video data comes in a format like: { id, title, url }
            //setPlaylistVideo((prevItems) => [...prevItems, responses]);
            playlistVideos();
            console.log(playlistVideo);
            console.log("success : ", responses);

            setAddition([]);
        } catch (error) {
            console.error('Error fetching video:', error);
        } finally {
            //setLoading(false);
        }
    }, [addition, pid]);

  return {
    createPlaylist,
    page,
    playlists,
    //loading,
    addition,
    setAddition,
    playlistVideo,
    fetchPlaylists,
    loadPlaylists,
    handlePlaylistClick,
    playlistVideos,
    addButton,
    handleAddition,
    addVideos
    //handlePlaylistClick,
  };
 };

