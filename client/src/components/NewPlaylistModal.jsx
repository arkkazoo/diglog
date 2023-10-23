import React, { useState } from 'react';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import MyContext from '../MyContext';

const NewPlaylistModal = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
    const { toggleReload, setToggleReload } = useContext(MyContext);
    const [formData, setFormData] = useState({
        playlist_name: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = import.meta.env.VITE_API_ORIGIN;
        // CookieからJWTを取得
        const jwtToken = cookies.jwtToken;
        // JWTを使ってAPIを叩く
        const response = await fetch(`${url}/api/playlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${jwtToken}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
            setToggleReload(!toggleReload);
            props.onClose();
        } else {
            console.log(response);
            alert('投稿に失敗しました');
        }
    };

    return (
        <>
        
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="modal-container bg-white w-1/3 rounded-xl border-2 p-4 shadow-lg">
                <form onSubmit={handleSubmit} className=" px-8 pt-6 pb-8 mb-4">
                    <div>
                        <label className="block text-gray-700 text-xl text-center font-bold" htmlFor="url">
                            new playlist
                        </label>
                        <input
                            type="text"
                            id="playlist_name"
                            name="playlist_name"
                            value={formData.playlist_name}
                            onChange={handleChange}
                            className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="input playlist name"
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
        </>
        
    );
};

export default NewPlaylistModal;