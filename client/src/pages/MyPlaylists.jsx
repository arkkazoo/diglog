import Dig from '../components/Dig.jsx';
import { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import Playlist from '../components/Playlist.jsx';
import NewPlaylistModal from '../components/NewPlaylistModal.jsx';
import MyContext from '../MyContext';
import PageIndexer from '../components/PageIndexer.jsx';

function MyPlaylists() {

    const [playlists, setPlaylists] = useState(null);
    const [page, setPage] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const { toggleReload, setToggleReload } = useContext(MyContext);

    const fetchPlaylists = async (offset) => {
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const response = await fetch(`${APIOrigin}/api/playlist/digs?userId=${cookies.userId}&limit=20&offset=${offset * 20}`);
        const data = await response.json();
        setPlaylists(data);
        console.log(data)
    };

    useEffect(() => {
        if (cookies) {
            fetchPlaylists(page);
        }
    }, [page, toggleReload]);

    const handleClickNew = (e) => {
        setIsPlaylistModalOpen(true);
    };

    

    const ClosePlaylistModal = () => {
        setIsPlaylistModalOpen(false);
    };

    const handlePrev = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        setPage(page + 1);
    };

    return (
        <>
            {isPlaylistModalOpen && (
                <NewPlaylistModal
                    onClose={ClosePlaylistModal}
                />
            )}
            <div className='flex flex-col w-4/5 mx-auto mb-20'>
                <div className='flex justify-center items-center pt-5'>
                    <div className='font-bold text-3xl'>
                        playlists
                    </div>
                </div>
                <button
                    onClick={handleClickNew}
                    className='font-bold mx-auto mt-5 mb-5 px-4 py-2 rounded-lg hover:text-red-500 duration-150 border-2'>
                    new playlist
                </button>
                {playlists == null ? (
                    <div className='flex justify-center items-center'>
                        <div>
                            loading...
                        </div>
                    </div>
                ) : (
                    playlists.map((playlist) => (
                        <Playlist key={playlist.playlist_id} data={playlist} />
                    ))
                )}
                <PageIndexer page={page} pagePrev={handlePrev} pageNext={handleNext} />
            </div>
        </>

    );
}

export default MyPlaylists;