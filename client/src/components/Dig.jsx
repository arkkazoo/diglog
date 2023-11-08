import DomainIcon from "./DomainIcon";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../MyContext";
import { useCookies } from "react-cookie";
import DigEditModal from "./DigEditModal";
import DigDeleteModal from "./DigDeleteModal";
import AddToPlaylistModal from "./AddToPlaylistModal";

const Dig = (props) => {
    const apiOrigin = import.meta.env.VITE_API_ORIGIN;
    const { dig_id, user_id, url, domain, artist, title, tags } = props.data;
    const { trackData, setTrackData } = useContext(MyContext);
    const [cookies] = useCookies();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDigDeleteModalOpen, setIsDigDeleteModalOpen] = useState(false);
    const [isDigEditModalOpen, setIsDigEditModalOpen] = useState(false);
    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
    const menuRef = useRef(null);
    const { queuedTracks, setQueuedTracks } = useContext(MyContext);
    const { toggleReload, setToggleReload } = useContext(MyContext);
    const { isNeedResetPageIndex, setIsNeedResetPageIndex } = useContext(MyContext);
    const { searchToggle, setSearchToggle } = useContext(MyContext);
    const navigateTo = useNavigate();

    useEffect(() => {
        function handleOutsideClick(event) {
            console.log(menuRef + ',' + event)
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
    }, [isMenuOpen]);

    const handlePlay = () => {
        setTrackData({ url, domain, artist, title });
    };

    const handleAddCue = () => {
        const newQueuedTracks = [...queuedTracks];
        newQueuedTracks.push({ url, domain, artist, title });
        setQueuedTracks(newQueuedTracks);
    };

    const handleAddNext = () => {
        const newQueuedTracks = [...queuedTracks];
        newQueuedTracks.unshift({ url, domain, artist, title });
        setQueuedTracks(newQueuedTracks);
    };

    const handleOpenMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDelete = () => {
        console.log('handleDelete');
        const newIsDigDeleteModalOpen = !isDigDeleteModalOpen;
        setIsDigDeleteModalOpen(newIsDigDeleteModalOpen);
        setTimeout(() => {
            console.log(isDigDeleteModalOpen);
        }, 1000);
    };

    const handleDeleteConfirm = async () => {
        const response = await fetch(apiOrigin + `/api/dig/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${cookies.jwtToken}`
            },
            body: JSON.stringify({ dig_id: dig_id }),
        })
        const data = await response.json();
        alert(data.message);
        setIsDigDeleteModalOpen(false);
        setToggleReload(!toggleReload);
    };

    const handleDeleteCancel = () => {
        setIsDigDeleteModalOpen(false);
    };

    const handleEdit = () => {
        setIsDigEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsDigEditModalOpen(false);
    };

    const handleAddToPlaylist = () => {
        setIsAddToPlaylistModalOpen(true);
    };

    const handleClickTag = (tagName) => {
        // 検索画面に並ぶdigのタグをクリックした時にも検索が発火するようにトグルを用意している
        // Search.jsxのuseEffectでfetchが多重に発火するのを防ぐために変数を2つ用意している。汚いので改善案募集。
        setIsNeedResetPageIndex(true);
        setSearchToggle(!searchToggle);
        navigateTo(`/search?q=%23${tagName}`);
    }


    return (
        <div className="flex w-full h-16">
            <div className="container flex border rounded-md mb-1">
                <div className="flex-col px-4 border-r text-lg 1/2 md:w-2/5 flex justify-center lg:w-1/6">{artist}</div>
                <div className="flex-col px-4 border-r text-lg 1/2 md:w-2/5 flex justify-center lg:w-1/4">
                    <span onClick={handlePlay} className="cursor-pointer hover:underline">{title}</span>
                </div>

                {(tags && tags[0]) && (
                    <div className="px-4 flex  items-center md:w-2/5  lg:w-1/4 overflow-auto">
                        {tags.map((tagName, index) => {
                            return (
                                <button onClick={() => { handleClickTag(tagName) }} key={index} className="p-1 text-twitter hover:underline">
                                    #{tagName}
                                </button>
                            );
                        })}
                    </div>
                )}
                {isDigDeleteModalOpen && (
                    <DigDeleteModal data={props.data} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />
                )}
                {isDigEditModalOpen && (
                    <DigEditModal data={props.data} onClose={closeEditModal} fetchDigs={props.fetchDigs} />
                )}
                {isAddToPlaylistModalOpen && (
                    <AddToPlaylistModal data={props.data} onClose={() => setIsAddToPlaylistModalOpen(false)} />
                )}

                <div className="flex ml-auto">
                    <div className="px-4 border-r flex justify-center items-center">
                        <a href={url} target="_blank">
                            <DomainIcon domain={domain} />
                        </a>
                    </div>
                    {domain !== "spotify" ? (
                        <>
                            <div className="ml-auto px-4 flex justify-center items-center" onClick={handlePlay}>
                                <div className="rounded-md border-2 border-gray-300 p-1 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                    play
                                </div>
                            </div>
                            <div className="ml-auto pr-4 flex justify-center items-center" >
                                <div onClick={handleAddCue} className="rounded-l-md border-2 border-r-0 border-gray-300 p-1 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                    queue
                                </div>
                                <div onClick={handleAddNext} className="rounded-r-md border-2 border-l-0 border-gray-300 p-1 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                    next
                                </div>
                            </div>
                            <div className="ml-auto pr-4 flex justify-center items-center" onClick={handleAddToPlaylist}>
                                <div className="rounded-md border-2 border-gray-300 py-1 px-2 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                    +
                                </div>
                            </div>
                        </>

                    ) : (
                        <>
                            <div className="ml-auto px-4 flex justify-center items-center">
                                <div className="rounded-md border-2 border-gray-300 p-1 font-bold bg-gray-100 text-gray-400 cursor-default">
                                    play
                                </div>
                            </div>
                            <div className="ml-auto pr-4 flex justify-center items-center" >
                                <div className="rounded-l-md border-2 border-r-0 border-gray-300 p-1 font-bold bg-gray-100 text-gray-400 cursor-default">
                                    queue
                                </div>
                                <div className="rounded-r-md border-2 border-l-0 border-gray-300 p-1 font-bold bg-gray-100 text-gray-400 cursor-default">
                                    next
                                </div>
                            </div>
                            <div className="ml-auto pr-4 flex justify-center items-center">
                                <div className="rounded-md border-2 border-gray-300 py-1 px-2 font-bold bg-gray-100 text-gray-400 cursor-default">
                                    +
                                </div>
                            </div>
                        </>
                    )}

                    {cookies.userId === user_id && isMenuOpen && (
                        <div className="relative group" ref={menuRef}>
                            <div className="ml-auto pr-4 flex justify-center items-center">
                                <div className="rounded-md border-2 border-gray-300 px-3 py-1 font-bold text-gray-600 ">
                                    ...
                                </div>
                            </div>
                            <div className="absolute left-0 bottom-0 w-16 flex flex-col justify-center items-center bg-white border border-gray-300 shadow-md rounded-lg" >
                                <button className="block py-2 w-full hover:bg-gray-100"
                                    onClick={handleEdit}>
                                    edit
                                </button>
                                <button className="block py-2 w-full hover:bg-gray-100 text-red-500"
                                    onClick={handleDelete}>
                                    delete
                                </button>
                            </div>
                        </div>
                    )}
                    {cookies.userId === user_id && !isMenuOpen && (
                        <>
                            <div className="ml-auto pr-4 flex justify-center items-center" onClick={handleOpenMenu}>
                                <div className="rounded-md border-2 border-gray-300 px-3 py-1 font-bold text-gray-600 duration-100 hover:ease-in hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer">
                                    ...
                                </div>
                            </div>
                        </>
                    )}
                    {cookies.userId !== user_id && (
                        <>
                            <div className="ml-auto pr-4 flex justify-center items-center">
                                <div className="rounded-md border-2 border-gray-300 py-1 px-3 bg-gray-100 cursor-default text-gray-400">
                                    ...
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div >
    );
}

export default Dig;