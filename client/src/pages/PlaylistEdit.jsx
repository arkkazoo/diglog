
import { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import MyContext from '../MyContext';

import DomainIcon from '../components/DomainIcon';

function PlaylistEdit() {
    const id = useParams().id;
    const [cookies, setCookie, removeCookie] = useCookies();
    const { toggleReload, setToggleReload } = useContext(MyContext);
    const [playlist, setPlaylist] = useState(null);
    const [formData, setFormData] = useState({
        playlist_id: id,
        playlist_name: '',
        dig_ids: [],
    });

    const fetchPlaylist = async () => {
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const response = await fetch(`${APIOrigin}/api/playlist/digs?playlistId=${id}`);
        const data = await response.json();
        setPlaylist(data[0]);
        setFormData({
            ...formData,
            playlist_name: data[0].playlist_name,
            dig_ids: data[0].digs.map((dig) => dig.dig_id),
        });
    };

    useEffect(() => {
        if (cookies) {
            fetchPlaylist();
        }
    }, [toggleReload]);

    const moveToPrev = (index) => {
        const digs = playlist.digs;
        const dig = digs[index];
        const newDigs = digs.filter((d) => d !== dig);
        newDigs.splice(index - 1, 0, dig);
        setPlaylist({
            ...playlist,
            digs: newDigs,
        });
        setFormData({
            ...formData,
            dig_ids: newDigs.map((dig) => dig.dig_id),
        });
    };

    const moveToNext = (index) => {
        const digs = playlist.digs;
        const dig = digs[index];
        const newDigs = digs.filter((d) => d !== dig);
        newDigs.splice(index + 1, 0, dig);
        setPlaylist({
            ...playlist,
            digs: newDigs,
        });
        setFormData({
            ...formData,
            dig_ids: newDigs.map((dig) => dig.dig_id),
        });
    };

    const handleConfirm = async () => {
        console.log(formData);
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const response = await fetch(`${APIOrigin}/api/playlist`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${cookies.jwtToken}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        setToggleReload(!toggleReload);
    };

    return (
        <>
            <div className='flex flex-col w-4/5 mx-auto mb-20'>
                <div className='flex justify-center items-center pt-5'>
                    <div className='font-bold text-3xl'>
                        edit playlist
                    </div>
                </div>
                <div className='flex justify-center items-center mt-5'>
                    <button onClick={handleConfirm} className='font-bold px-4 py-2 rounded-lg hover:text-red-500 duration-150 border-2'>
                        confirm
                    </button>
                </div>
                <div className='flex items-center'>
                    <form>
                        <input
                            className='font-bold text-3xl border-2 border-gray-300 rounded-md ml-5 px-2 py-1'
                            type='text'
                            value={formData.playlist_name}
                            onChange={(e) => setFormData({ ...formData, playlist_name: e.target.value })}
                        />
                    </form>
                </div>
                <div className='mt-5'>
                    {playlist?.digs.map((dig, index) => (
                        <div className="flex w-full h-16" key={index}>
                            <div className="container flex border rounded-md mb-1">
                                <div className="flex-col px-4 border-r text-lg flex justify-center">{index + 1}</div>
                                <div className="flex-col px-4 border-r text-lg 1/2 md:w-2/5 flex justify-center lg:w-1/6">{dig.artist}</div>
                                <div className="flex-col px-4 border-r text-lg 1/2 md:w-2/5 flex justify-center lg:w-1/4">
                                    <span>{dig.title}</span>
                                </div>

                                {(dig.tags && dig.tags[0]) && (
                                    <div className="px-4 flex  items-center md:w-2/5  lg:w-1/4 overflow-auto">
                                        {dig.tags.map((tag, index) => {
                                            return (
                                                <button key={index} className="p-1 text-twitter hover:underline">
                                                    #{tag}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                <div className="flex ml-auto">
                                    <div className="px-4 border-r flex justify-center items-center">
                                        <a href={dig.url} target="_blank">
                                            <DomainIcon domain={dig.domain} />
                                        </a>
                                    </div>
                                    <>
                                        {index === 0 ? (
                                            <div className="ml-auto px-4 flex justify-center items-center">
                                                <div className="rounded-md border-2 border-gray-300 p-1 font-bold bg-gray-100 text-gray-400 cursor-default">
                                                    ↑
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="ml-auto px-4 flex justify-center items-center">
                                                <div onClick={() => moveToPrev(index)} className="rounded-md border-2 border-gray-300 p-1 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                                    ↑
                                                </div>
                                            </div>
                                        )}
                                        {index + 1 === playlist.digs.length ? (
                                            <div className="ml-auto pr-4 flex justify-center items-center">
                                                <div className="rounded-md border-2 border-gray-300 p-1 font-bold bg-gray-100 text-gray-400 cursor-default">
                                                    ↓
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="ml-auto pr-4 flex justify-center items-center">
                                                <div onClick={() => moveToNext(index)} className="rounded-md border-2 border-gray-300 p-1 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                                    ↓
                                                </div>
                                            </div>
                                        )}
                                    </>
                                </div>
                            </div>
                        </div >
                    ))}
                </div>
            </div>

        </>

    );
}

export default PlaylistEdit;