
import { useState, useRef, useEffect, useContext } from "react";
import MyContext from "../MyContext";
import { useCookies } from "react-cookie";
import DigEditModal from "./DigEditModal";
import PlaylistDeleteModal from "./PlaylistDeleteModal";
import { Link } from 'react-router-dom';

import { shuffleArray } from "../util";

import Dig from "./Dig";

const Playlist = (props) => {

    const { playlist_id, playlist_name, user_id, digs } = props.data;
    const [cookies] = useCookies();
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const { toggleReload, setToggleReload } = useContext(MyContext);
    const { playingTrack, setPlayingTrack } = useContext(MyContext);
    const { queuedTracks, setQueuedTracks } = useContext(MyContext);

    const { loopTargetTracks, setLoopTargetTracks } = useContext(MyContext);
    const { isShuffleEnabled, setIsShuffleEnabled } = useContext(MyContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPlaylistDeleteModalOpen, setIsPlaylistDeleteModalOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickToggle = () => {
        setIsPlaylistOpen(!isPlaylistOpen);
    };

    useEffect(() => {
        function handleOutsideClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        if (isMenuOpen) {
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
            }, 100);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }

        return () => {
            if (isMenuOpen) {
                document.removeEventListener('click', handleOutsideClick);
            }
        };
    }, [isMenuOpen, isPlaylistOpen]);

    const handlePlayPlaylist = () => {
        setPlayingTrack(digs[0]);
        const newQueuedTracks = digs.slice(1);
        setQueuedTracks([...newQueuedTracks, ...queuedTracks]);
        setLoopTargetTracks(digs);
    };

    const handlePlayShuffle = () => {
        setIsShuffleEnabled(true);
        setLoopTargetTracks(digs);
        const copyOfDigs = [...digs];
        const shuffledDigs = shuffleArray(copyOfDigs);
        // 新しいオブジェクトを作って渡すことでplayingTrackとshuffledDigs[0]が同じでもplayingTrackトリガーのuseEffectが発火する
        setPlayingTrack({...shuffledDigs[0]});
        setQueuedTracks(shuffledDigs.slice(1));
    }

    const handleOpenMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDelete = () => {
        setIsPlaylistDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const apiOrigin = import.meta.env.VITE_API_ORIGIN;
        const response = await fetch(apiOrigin + `/api/playlist/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${cookies.jwtToken}`
            },
            body: JSON.stringify({ playlist_id: playlist_id }),
        })
        const data = await response.json();
        setIsPlaylistDeleteModalOpen(false);
        setToggleReload(!toggleReload);
    };

    return (
        <div className="flex flex-col w-full mx-auto">
            <div className="flex w-full mx-auto h-16">
                <div className="container flex border rounded-md mb-1">
                    <button onClick={handleClickToggle} className="flex-col px-4 border-r text-lg flex justify-center">
                        {isPlaylistOpen ? (<span>▼</span>) : (<span>▷</span>)}
                    </button>
                    <div className="flex-col px-4 border-r text-lg 1/2 md:w-2/5 flex justify-center lg:w-1/4">{playlist_name}</div>

                    <div className="flex ml-auto">
                        <div className="ml-auto px-4 flex justify-center items-center">
                            <div onClick={handlePlayPlaylist} className="rounded-md border-2 border-gray-300 p-1 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                play
                            </div>
                        </div><div className="ml-auto pr-4 flex justify-center items-center">
                            <div onClick={handlePlayShuffle} className="rounded-md border-2 border-gray-300 p-1 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                shuffle
                            </div>
                        </div>
                        {cookies.userId === user_id && !isMenuOpen && (
                            <>
                                <div className="ml-auto pr-4 flex justify-center items-center" onClick={handleOpenMenu}>
                                    <div className="rounded-md border-2 border-gray-300 py-1 px-3 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                        ...
                                    </div>
                                </div>
                            </>
                        )}
                        {cookies.userId === user_id && isMenuOpen && (
                            <div className="relative group" ref={menuRef}>
                                <div className="ml-auto pr-4 flex justify-center items-center">
                                    <div className="rounded-md border-2 border-gray-300 py-1 px-3 font-bold">
                                        ...
                                    </div>
                                </div>
                                <div className="absolute left-0 bottom-0 w-16 flex flex-col justify-center items-center bg-white border border-gray-300 shadow-md rounded-lg" >
                                    <Link to={`/myplaylists/edit/${playlist_id}`} className="w-full hover:bg-gray-100">
                                        <button className="block py-2 w-full">edit</button>
                                    </Link>
                                    <button className="block py-2 w-full hover:bg-gray-100 text-red-500"
                                        onClick={handleDelete}>
                                        delete
                                    </button>
                                </div>
                            </div>
                        )}
                        {cookies.userId !== user_id && (
                            <>
                                <div className="ml-auto pr-4 flex justify-center items-center">
                                    <div className="rounded-md border-2 border-gray-300 py-1 px-3 bg-gray-100 cursor-default">
                                        ...
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>

            </div >
            {isPlaylistOpen && (
                <div className="w-11/12 ml-auto">
                    {digs.map((dig, index) => {
                        return (
                            <Dig key={index} data={dig} />
                        );
                    })
                    }
                </div>
            )}
            {isPlaylistDeleteModalOpen && (
                <PlaylistDeleteModal
                    data={props.data}
                    onCancel={() => setIsPlaylistDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )
            }
        </div>
    );
}

export default Playlist;