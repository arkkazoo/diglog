import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import MyContext from '../MyContext';

import { useState, useEffect, useContext } from 'react';
import DigModal from './DigModal';

function Header() {
    const APIOrigin = import.meta.env.VITE_API_ORIGIN;
    const { isLogin, setIsLogin } = useContext(MyContext);
    const [userName, setUserName] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isDigModalOpen, setIsDigModalOpen] = useState(false);
    const {playingTrack, setPlayingTrack} = useContext(MyContext);

    useEffect(() => {
        if (cookies.jwtToken) {
            let data = getUserName();
            data.then((result) => {
                if (result) {
                    setIsLogin(true);
                    setUserName(result);
                } else {
                    setIsLogin(false);
                }
            });
        }
    }, [isLogin]);

    const getUserName = async () => {
        const response = await fetch(`${APIOrigin}/api/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${cookies.jwtToken}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            alert(data.message);
        }
    }

    const handleClickMakeDig = () => {
        setIsDigModalOpen(true);
    }

    const closeDigModal = () => {
        setIsDigModalOpen(false);
    }

    const handlePlayRandom = async () => {
        const data = await fetch(`${APIOrigin}/api/dig/random`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${cookies.jwtToken}`,
            },
        });
        const response = await data.json();
        if (data.ok) {
            setPlayingTrack(response);
        } else {
            alert(response.message);
        }
    }


    return (
        <>
            <header className='border-b sticky top-0 w-full bg-white'>
                <div className='container flex mx-auto p-2 flex-row items-center'>
                    <Link to='/' className='font-medium mb-0'>
                        <span className='text-xl font-black ml-3'>diglog</span>
                    </Link>
                    {isLogin ? (
                        <nav className='mx-auto text-base'>
                            <Link to='/mydigs' className='font-bold px-4 py-2 hover:text-red-500 duration-150 border-r'>dig</Link>
                            <Link to='/myplaylists' className='font-bold px-4 py-2 hover:text-red-500 duration-150 border-r'>playlist</Link>
                            <Link to='/search' className='font-bold px-4 py-2 hover:text-red-500 duration-150 border-r'>search</Link>
                            <Link to='/mypage' className='font-bold mr-5 pl-4 py-2 hover:text-red-500 duration-150'>mypage</Link>
                            <button
                                onClick={handlePlayRandom}
                                className='font-bold mr-5 px-4 py-2 rounded-lg hover:text-red-500 duration-150 border-2'>
                                random
                            </button>
                            <button
                                onClick={handleClickMakeDig}
                                className='font-bold mr-5 px-4 py-2 bg-gray-700 rounded-lg hover:text-red-500 duration-150 text-white'>
                                new dig
                            </button>
                        </nav>
                    ) : (
                        <nav className='mx-auto text-base'>
                            <button
                                onClick={handlePlayRandom}
                                className='mr-5 px-4 py-2 rounded-lg hover:text-red-500 duration-150 border-2'>
                                random
                            </button>
                            <Link to='/search' className='font-bold mr-5 hover:text-red-500 duration-150'>search</Link>
                            <Link to='/register' className='font-bold mr-5 hover:text-red-500 duration-150'>register</Link>
                            <Link to='/login' className='font-bold hover:text-red-500 duration-150'>login</Link>
                        </nav>
                    )
                    }
                </div>
            </header>
            {isDigModalOpen && (
                <DigModal onClose={closeDigModal} />
            )}
        </>

    )
}

export default Header;