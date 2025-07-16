// components/Watch.jsx
import React from 'react';

const Watch = ({ movieId, onClose }) => {
  if (!movieId) {
    return <p>No movie selected for watching.</p>;
  }

  // Construct the Vidsrc URL using the TMDb movie ID
  const vidsrcUrl = `https://vidsrc.icu/embed/movie/${movieId}`;

  return (
    <div className="watch-player-container">
      <button onClick={onClose} className="close-button absolute top-4 right-4 text-white text-2xl bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 z-10"
        aria-label="Close Player"> ✖ </button>
      <iframe
        src={vidsrcUrl}
        width="100%"
        height="500px" // Adjust height as needed for your UI
        allowFullScreen
        title={`Watch Movie ${movieId}`}
      ></iframe>
      <p>If the player doesn't load, it might be due to content restrictions or network issues.</p>
    </div>
  );
};

export default Watch;