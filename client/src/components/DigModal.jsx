import React, { useState } from 'react';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import validateTags from '../util';
import MyContext from '../MyContext';

const DigModal = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
    const { toggleReload, setToggleReload } = useContext(MyContext);
    const [formData, setFormData] = useState({
        url: '',
        artist: '',
        title: '',
        tags: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangeTags = (e) => {
        const { name, value } = e.target;
        const tags = value.split(' ');
        setFormData({
            ...formData,
            [name]: tags,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateTags(formData.tags)) {
            alert('タグは英数字とアンダーバーのみ使用できます');
            return;
        }

        const url = import.meta.env.VITE_API_ORIGIN;
        const jwtToken = cookies.jwtToken;

        const response = await fetch(`${url}/api/dig`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${jwtToken}`,
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            setToggleReload(!toggleReload);
            props.onClose();
        } else {
            console.log(response);
            alert('投稿に失敗しました');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="modal-container bg-white w-1/3 rounded-lg p-4 shadow-lg border-2">
                <form onSubmit={handleSubmit} className=" px-8 pt-6 pb-8 mb-4">
                    <div>
                        <div className="text-xl font-bold text-center">new dig</div>
                    </div>
                    <div className='mt-5'>
                        <label className="block text-gray-700 font-bold" htmlFor="url">
                            URL
                        </label>
                        <input
                            type="text"
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="URLを入力してください（必須）"
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-gray-700 font-bold" htmlFor="artist">
                            artist
                        </label>
                        <input
                            type="text"
                            id="artist"
                            name="artist"
                            value={formData.artist}
                            onChange={handleChange}
                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="アーティスト名を入力してください"
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-gray-700 font-bold" htmlFor="title">
                            title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="曲名を入力してください"
                        />
                    </div>

                    <div className="mt-3">
                        <label className="block text-gray-700 font-bold" htmlFor="tags">
                            tags
                        </label>
                        <input
                            id="tags"
                            name="tags"
                            value={formData.tags.join(' ')}
                            onChange={handleChangeTags}
                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="example: pops rock (英数字のみ・半角スペース区切り)"
                        />
                    </div>
                    <div className="mt-5 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={props.onClose}
                            className="bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-auto"
                        >
                            cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DigModal;