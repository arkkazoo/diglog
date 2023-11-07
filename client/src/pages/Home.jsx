import Dig from '../components/Dig.jsx';
import { useState, useEffect, useContext } from 'react';
import MyContext from '../MyContext';
import PageIndexer from '../components/PageIndexer.jsx';

function Home() {

    const [digs, setDigs] = useState(null);
    const [page, setPage] = useState(0);
    const { toggleReload, setToggleReload } = useContext(MyContext);

    const fetchDigs = async (offset) => {
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const response = await fetch(`${APIOrigin}/api/dig?limit=20&offset=${offset * 20}`);
        const data = await response.json();
        setDigs(data);
    };

    useEffect(() => {
        fetchDigs(page);
    }, [page, toggleReload]);

    const handlePrev = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        setPage(page + 1);
    };

    return (
        <div className='mb-20'>

            <div className='flex justify-center items-center py-5'>
                <div className='font-bold text-3xl'>
                    digs
                </div>
            </div>

            <div className='flex flex-col w-4/5 mx-auto'>
                {digs == null ? (
                    <div className='flex justify-center items-center'>
                        <div>
                            loading...
                        </div>
                    </div>
                ) : (
                    digs.map((dig) => (
                        <Dig key={dig.dig_id} data={dig} fetchDigs={fetchDigs} />
                    ))
                )}
            </div>

            <PageIndexer page={page} pagePrev={handlePrev} pageNext={handleNext} />
        </div>
    );
}

export default Home;