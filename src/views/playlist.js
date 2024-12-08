import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ADDR_ } from './address';
import { getUserId } from './address';
import { Button, Popup, InputField } from '@enact/sandstone'; // Assuming these components are being used

//const Playlist = () => {
  //const [isListAdditionOpen, setIsListAdditionOpen] = useState(false);
  //const [title, setTitle] = useState(''); // State for the playlist title

  //const userId = getUserId();

//export  const createPlaylist = async (title) => {

 export  const usePlaylist = () => {   
    const userId = getUserId();
    const [page, setPage] = useState(1);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPlaylists, setTotalPlaylists] = useState(null); 
    const size = 10;

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
        setLoading(true); // 로딩 시작
        //const userId = getUserId(); // 사용자 ID 가져오기
        const response = await fetch(`${ADDR_}/api/getPlaylist/${userId}?page=${page}&size=${size}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setPlaylists((prev) => [...prev, ...data.playlists]); // 기존 데이터에 추가
            console.log(`Fetched playlists for page ${page}:`, data.playlists);
            console.log(data.size);
        } else {
            console.error(`Failed to fetch playlists for page ${page}`);
        }
    } catch (error) {
        console.error('Error fetching playlists:', error);
    } finally {
        setLoading(false); // 로딩 완료
    }
}, []);

const loadPlaylists = useCallback(() => {
    //if (playlists.length < totalPlaylists) {
    fetchPlaylists(page, size); // 현재 페이지와 크기로 데이터 요청
    setPage((prevPage) => prevPage + 1); // 다음 페이지 설정
    //}
}, [page, size, totalPlaylists, playlists.length, fetchPlaylists]);

/*
    const fetchPlaylists = async (userId, page, size) => {
        const response = await fetch(`${ADDR_}/api/getPlaylist?userId=${userId}&page=${page}&size=${size}`);
        if (response.ok) {
            const data = await response.json();
            //setPlaylists(data.playlists || []);
            setPlaylists((prevplaylists) => [...prevplaylists, ...data.playlists]);
            console.log("fetch playlist");
        } else {
            console.error('Failed to fetch playlists');
        }
    }; 


    useEffect(() => {
        fetchPlaylists(userId, page, size);
    }, [userId, page]);

    const loadMorePlaylists = () => {
        setPage((prevPage) => prevPage + 1);
    }

    const handlePlaylistClick = (id) => {
        console.log("clicked playlist : ", id);
    } */


    useEffect(() => {
        const initialize = async () => {
            //await fetchTotalPlaylists(); // 총 플레이리스트 수 가져오기
            await fetchPlaylists(page, size); // 첫 페이지 데이터 로드
        };
        initialize();
    }, [fetchPlaylists, page, size]);    


    const handlePlaylistClick = (id) => {
        console.log('Clicked playlist ID:', id);
    };


  return {
    createPlaylist,
    page,
    playlists,
    loading,
    fetchPlaylists,
    loadPlaylists,
    handlePlaylistClick,
    //handlePlaylistClick,
  };
 };


  //return (
    //createPlaylist,
    {/*
    <div>
      <Button onClick={() => setIsListAdditionOpen(true)}>Add New Playlist</Button>
      <Popup open={isListAdditionOpen} onClose={() => setIsListAdditionOpen(false)}>
        <h2>Create a New Playlist</h2>
        <InputField
          placeholder="Enter the title..."
          value={title}
          onChange={(e) => setTitle(e.value)}
          style={{ marginTop: '10px' }}
        />
        <Button onClick={createPlaylist}>Create Playlist</Button>
        <Button onClick={() => setIsListAdditionOpen(false)}>Cancel</Button>
      </Popup>
    </div> */}
  //);
//};

//export default Playlist;
