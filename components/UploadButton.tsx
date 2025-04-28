'use client';

import React, { useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import styled from 'styled-components';

const UploadButton = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { loadAudio, play } = useAudio();

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            loadAudio(file);
            play();
        }
    };

    return (
        <StyledWrapper>
            <button onClick={handleUploadClick} className="button">
                <svg className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" strokeLinejoin="round" strokeLinecap="round" />
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
