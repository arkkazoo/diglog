import { useCookies } from 'react-cookie';
import { useEffect, useState, useContext } from 'react';
import MyContext from '../MyContext';
import NormaModal from '../components/NormaModal';

const MyPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const { setIsLogin } = useContext(MyContext);
    const { toggleReload, setToggleReload } = useContext(MyContext);
    const [normaData, setNormaData] = useState([]);
    const [isNormaModalOpen, setIsNormaModalOpen] = useState(false);

    const fetchNorma = async () => {
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${cookies.jwtToken}`,
            },
        };
        const response = await fetch(`${APIOrigin}/api/norma`, request);
        const data = await response.json();
        if (response.ok) {
            setNormaData(data);
        } else {
            alert(data.message);
        }
    };

    useEffect(() => {
        fetchNorma();
    }, [toggleReload]);

    const handleLogout = () => {
        removeCookie('username');
        removeCookie('userId');
        removeCookie('jwtToken');
        setIsLogin(false);
        window.location.href = '/';
    }

    return (
        <>
            {isNormaModalOpen && <NormaModal data={normaData} onClose={() => setIsNormaModalOpen(false)} />}
            <div className="w-full flex flex-col justify-center items-center mx-auto">
                <div className='flex justify-center items-center pt-5'>
                    <div className='font-bold text-3xl'>
                        norma
                    </div>
                </div>
                <button onClick={() => setIsNormaModalOpen(true)} className='mt-5 font-bold mx-auto px-4 py-2 rounded-lg hover:text-red-500 duration-150 border-2'>
                    set norma
                </button>

                <div className="flex w-1/2 mt-5">
                    <div className="flex-1">
                        <div className=" border-gray-200 border-2 rounded-lg p-5 mx-2 flex flex-col justify-center items-center">
                            <div className="text-xl font-bold">daily</div>
                            <div className="mt-4 text-3xl font-bold">{normaData.daily_dig_count} / {normaData.daily_norma}</div>

                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="border-gray-200 border-2 rounded-lg p-5 mx-2 mb-auto flex flex-col justify-center items-center">
                            <div className="text-xl font-bold">weekly</div>
                            <div className="mt-4 text-3xl font-bold">{normaData.weekly_dig_count} / {normaData.weekly_norma}</div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="border-gray-200 border-2 rounded-lg p-5 mx-2 flex flex-col justify-center items-center">
                            <div className="text-xl font-bold">monthly</div>
                            <div className="mt-4 text-3xl font-bold">{normaData.monthly_dig_count} / {normaData.monthly_norma}</div>
                        </div>
                    </div>
                </div>

                <button onClick={handleLogout} className='mt-10 font-bold px-4 py-2 rounded-lg hover:bg-gray-700 hover:border-gray-700 hover:text-white duration-150 border-2'>
                    logout
                </button>
            </div>
        </>
    );
};

export default MyPage;