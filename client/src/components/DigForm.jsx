import React, { useState } from 'react';

const DigForm = () => {
    const [formData, setFormData] = useState({
        url: '',
        artist: '',
        song: '',
        comment: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="mx-auto">
            <form onSubmit={handleSubmit} className=" px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
                        URL
                    </label>
                    <input
                        type="text"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="URLを入力してください（必須）"
                    />
                </div>
                <div className='flex w-full'>
                <div className="mb-4 mr-2 grow">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artist">
                        アーティスト名
                    </label>
                    <input
                        type="text"
                        id="artist"
                        name="artist"
                        value={formData.artist}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="アーティスト名を入力してください"
                    />
                </div>
                <div className="mb-4 grow">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="song">
                        曲名
                    </label>
                    <input
                        type="text"
                        id="song"
                        name="song"
                        value={formData.song}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="曲名を入力してください"
                    />
                </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                        コメント
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-16 resize-none"
                        placeholder="ひとこと"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        決定
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DigForm;