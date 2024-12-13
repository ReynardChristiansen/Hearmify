import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transposedChords, setTransposedChords] = useState(null);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await fetch(
          `https://api-hearmify.vercel.app/api/songs/getSongById/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch song details");
        }
        const data = await response.json();
        setSong(data);
        setTransposedChords(data.chords);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [id]);

  const transposeChords = (chords, direction) => {
    const majorChords = [
      "A",
      "A#",
      "B",
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
    ];
    const minorChords = [
      "Am",
      "A#m",
      "Bm",
      "Cm",
      "C#m",
      "Dm",
      "D#m",
      "Em",
      "Fm",
      "F#m",
      "Gm",
      "G#m",
    ];

    const transpose = (chord, direction) => {
      let chordSet = majorChords;
      let isMinor = false;

      if (chord.endsWith("m")) {
        chordSet = minorChords;
        isMinor = true;
      }

      const index = chordSet.indexOf(chord);
      if (index === -1) return chord;

      let newIndex = index + (direction === 1 ? 1 : -1);
      if (newIndex < 0) newIndex = chordSet.length - 1;
      if (newIndex >= chordSet.length) newIndex = 0;

      return chordSet[newIndex];
    };

    const chordString = chords.join(" ");

    const chordParts = chordString.split(/\s+/);

    const transposedChords = chordParts.map((chord) =>
      transpose(chord, direction)
    );

    let result = [];
    let currentLine = "";

    let chordIndex = 0;
    for (let i = 0; i < chords.length; i++) {
      let originalLine = chords[i];
      let parts = originalLine.split(/\s+/);

      for (let j = 0; j < parts.length; j++) {
        const originalChord = parts[j];
        if (originalChord) {
          currentLine += transposedChords[chordIndex++];
        }

        if (j < parts.length - 1) {
          const spaceCount = Math.max(
            0,
            originalLine.indexOf(parts[j + 1]) -
              originalLine.indexOf(parts[j]) -
              parts[j].length
          );
          currentLine += " ".repeat(spaceCount);
        }
      }

      result.push(currentLine);
      currentLine = "";
    }

    return result;
  };

  const handleTransposeUp = async () => {
    if (song) {
      const newChords = transposeChords(transposedChords, 1);
      setTransposedChords(newChords);
    }
  };

  const handleTransposeDown = async () => {
    if (song) {
      const newChords = transposeChords(transposedChords, 0);
      setTransposedChords(newChords);
    }
  };

  const formatLyricsAndChords = (lyrics, chords) => {
    if (!lyrics || !chords || lyrics.length !== chords.length) {
      return (
        <p className="text-center text-gray-500">
          Lyrics and chords are not available in the expected format
        </p>
      );
    }

    return lyrics.map((line, index) => (
      <div key={index} className="mb-4">
        <div className="font-semibold text-sm text-gray-700">
          <span className="whitespace-pre font-bold">{chords[index]}</span>
        </div>
        <div className="text-sm text-gray-700">{line}</div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <ClipLoader color="#4cabe6" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {song ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
                {song.title}
              </h1>

              <div className="flex justify-center mb-6 space-x-4">
                <button
                  onClick={handleTransposeUp}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg"
                >
                  Transpose Up
                </button>
                <button
                  onClick={handleTransposeDown}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg"
                >
                  Transpose Down
                </button>
              </div>

              <div className="text-sm text-gray-700 mb-4">
                {formatLyricsAndChords(
                  song.lyrics,
                  transposedChords || song.chords
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">
            No details available for this song
          </p>
        )}
      </div>
    </div>
  );
};

export default SongDetails;
