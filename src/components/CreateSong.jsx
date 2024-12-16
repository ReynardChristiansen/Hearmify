import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const CreateSong = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    lyrics: '',
    chords: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.lyrics || !formData.chords) {
      alert('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api-hearmify.vercel.app/api/songs/createSong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          lyrics: formData.lyrics.split('\n'),
          chords: formData.chords.split(',').map(chord => chord.trim())
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create song');
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#4cabe6" loading={loading} size={50} />
        </div>
      ) : (
        <div className="w-[90%] md:w-[50%] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Create New Song</h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div>
              <label htmlFor="title" className="block font-semibold mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <label htmlFor="lyrics" className="block font-semibold mb-2">Lyrics</label>
              <textarea
                id="lyrics"
                name="lyrics"
                value={formData.lyrics}
                onChange={handleInputChange}
                rows={8}
                className="w-full border border-gray-300 rounded p-2"
              ></textarea>
            </div>

            <div>
              <label htmlFor="chords" className="block font-semibold mb-2">Chords</label>
              <input
                type="text"
                id="chords"
                name="chords"
                value={formData.chords}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
            >
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateSong;
