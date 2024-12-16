import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams, useNavigate, Link } from "react-router-dom";
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

      if (chord.endsWith("m")) {
        chordSet = minorChords;
      }

      const index = chordSet.indexOf(chord);
      if (index === -1) return chord;

      let newIndex = index + direction;
      if (newIndex < 0) newIndex = chordSet.length - 1;
      if (newIndex >= chordSet.length) newIndex = 0;

      return chordSet[newIndex];
    };

    return chords.map((line) => {
      const parts = line.split(/(\s+)/);
      return parts
        .map((part) => (part.trim() ? transpose(part.trim(), direction) : part))
        .join("");
    });
  };

  const handleTransposeUp = async () => {
    if (song) {
      const newChords = transposeChords(transposedChords, 1);
      setTransposedChords(newChords);
    }
  };

  const handleTransposeDown = async () => {
    if (song) {
      const newChords = transposeChords(transposedChords, -1);
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
      <div className="flex justify-center items-center h-screen ">
        <ClipLoader color="#4cabe6" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-6">
          <Link
            to={`/update/${id}`}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Update
          </Link>
        </div>
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
