import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

const DigForm = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
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

    const handleSubmit = async (e) => {
        const url = import.meta.env.VITE_API_ORIGIN;
        e.preventDefault();
        // CookieからJWTを取得
        const jwtToken = cookies.jwtToken;
        // JWTを使ってAPIを叩く
        const response = await fetch(`${url}/api/dig`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${jwtToken}`,
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert('投稿しました');
            setFormData({
                url: '',
                artist: '',
                song: '',
                comment: '',
            });
        } else {
            alert('投稿に失敗しました');
        }
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            曲名
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
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