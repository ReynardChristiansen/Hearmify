import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const UpdateSong = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    lyrics: [''],  // Ensure there's at least one empty lyric initially
    chords: ['']   // Ensure there's at least one empty chord initially
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchSongDetails = async () => {
      try {
        const response = await fetch(`https://api-hearmify.vercel.app/api/songs/getSongById/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch song details');
        }

        const song = await response.json();
        setFormData({
          title: song.title,
          lyrics: song.lyrics.length > 0 ? song.lyrics : [''], // Ensure there's at least one lyric
          chords: song.chords.length > 0 ? song.chords : ['']  // Ensure there's at least one chord
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [id]);

  const handleInputChange = (e, index, type) => {
    const { value } = e.target;
  
    if (type === 'title') {
      setFormData({
        ...formData,
        title: value
      });
    } else {
      const updatedArray = [...formData[type]];
      updatedArray[index] = value;
      setFormData({
        ...formData,
        [type]: updatedArray
      });
    }
  };

  const handleAddPairBelow = (index) => {
    const newLyrics = [...formData.lyrics];
    const newChords = [...formData.chords];

    // Insert new empty lyric and chord after the specified index
    newLyrics.splice(index + 1, 0, '');
    newChords.splice(index + 1, 0, '');

    setFormData({
      ...formData,
      lyrics: newLyrics,
      chords: newChords
    });
  };

  const handleRemovePair = (index) => {
    const updatedLyrics = formData.lyrics.filter((_, i) => i !== index);
    const updatedChords = formData.chords.filter((_, i) => i !== index);

    // Ensure at least one pair remains
    if (updatedLyrics.length === 0) {
      updatedLyrics.push('');
      updatedChords.push('');
    }

    setFormData({
      ...formData,
      lyrics: updatedLyrics,
      chords: updatedChords
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!formData.title || formData.lyrics.some(lyric => !lyric.trim()) || formData.chords.some(chord => !chord.trim())) {
        alert('All fields are required');
        setLoading(false);
        return;
      }

    try {
      const response = await fetch(`https://api-hearmify.vercel.app/api/songs/updateSong/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          lyrics: formData.lyrics,
          chords: formData.chords
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update song');
      }

      navigate(`/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4cabe6" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Update Song</h1>
      <form onSubmit={handleSubmit} className="w-[90%] md:w-[50%] flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block font-semibold mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => handleInputChange(e, 0, 'title')}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {formData.lyrics.map((_, index) => (
            <div
              key={index}
              className={`mb-4`}
            >
              <div className="flex flex-col gap-2">
                <div>
                  <label htmlFor={`chords-${index}`} className="block font-semibold mb-2">Chords {index + 1}</label>
                  <input
                    type="text"
                    id={`chords-${index}`}
                    value={formData.chords[index]}
                    onChange={(e) => handleInputChange(e, index, 'chords')}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label htmlFor={`lyrics-${index}`} className="block font-semibold mb-2">Lyrics {index + 1}</label>
                  <textarea
                    id={`lyrics-${index}`}
                    value={formData.lyrics[index]}
                    onChange={(e) => handleInputChange(e, index, 'lyrics')}
                    rows={4}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePair(index)}
                  className="text-red-500 mt-2"
                >
                  Remove this pair
                </button>

                {/* Add more button below each pair */}
                <button
                  type="button"
                  onClick={() => handleAddPairBelow(index)}
                  className="text-blue-500 mt-2"
                >
                  Add More Lyrics & Chords Below
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateSong;
