import React, { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import MyContext from '../MyContext';

const AddToPlaylistModal = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const { toggleReload, setToggleReload } = useContext(MyContext);
    const [playlists, setPlaylists] = useState([]);

    const [formData, setFormData] = useState({
        playlist_id: null,
        dig_id: props.data.dig_id,
    });

    const fetchPlaylists = async () => {
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const response = await fetch(`${APIOrigin}/api/playlist?userId=${cookies.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            const data = await response.json();
            setPlaylists(data);
        } else {
            alert('プレイリストの取得に失敗しました');
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const jwtToken = cookies.jwtToken;

        const response = await fetch(`${APIOrigin}/api/playlist/digs/`, {
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
        }
    };

    return (
        <>

            <div className="fixed inset-0 flex items-center justify-center z-10">
                <div className="modal-container bg-white w-1/3 rounded-lg p-4 shadow-lg border-2">
                    <form onSubmit={handleSubmit} className=" px-8 pt-6 pb-8 mb-4">
                        <div>
                            <label className="block text-gray-700 text-xl font-bold text-center">
                                add to playlist
                            </label>
                            <div className="mt-5 block text-gray-700 text-center">
                                {props.data.artist} - {props.data.title}
                            </div>
                            <select
                                className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setFormData({ ...formData, playlist_id: e.target.value })}
                            >
                                <option>select</option>
                                {playlists.map((playlist) => (
                                    <option value={playlist.playlist_id}>{playlist.playlist_name}</option>
                                ))}
                            </select>
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

export default AddToPlaylistModal;