import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ADDR_ } from './address';
import { getUserId } from './address';
import { Button, Popup, InputField } from '@enact/sandstone'; // Assuming these components are being used

//const Playlist = () => {
  //const [isListAdditionOpen, setIsListAdditionOpen] = useState(false);
  //const [title, setTitle] = useState(''); // State for the playlist title

  //const userId = getUserId();

export  const createPlaylist = async (title) => {
    const userId = getUserId();


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
