'use client';

import React, { useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import styled from 'styled-components';

const UploadButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { audioRef } = useAudio(); // useAudio gives us audioRef

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !audioRef.current) return;

    const objectUrl = URL.createObjectURL(file);
    audioRef.current.src = objectUrl;
    audioRef.current.load();
    audioRef.current.play(); // optional: auto play after upload
  };

  return (
    <StyledWrapper>
      <button onClick={handleUploadClick} className="button">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 18V5l12-2v13"
          />
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <span className="text">Upload</span>
      </button>
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    width: 10em;
    height: 3em;
    border-radius: 8px;
    border: 0.15em solid rgb(162, 63, 255);
    color: rgb(162, 63, 255);
    background-color: transparent;
    transition: all 0.8s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    font-weight: bold;
    position: relative;
    overflow: hidden;
  }

  .text {
    display: none;
    font-size: 1rem;
  }

  .button svg {
    width: 1.5em;
    height: 1.5em;
  }

  .button:hover > .text {
    display: block;
  }

  .button:hover > svg {
    display: none;
  }

  .button:hover {
    background-color: rgb(162, 63, 255);
    color: #ffffff;
  }
`;

export default UploadButton;
