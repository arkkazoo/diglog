import Dig from '../components/Dig.jsx';
import { MyProvider } from '../MyContext';
import MusicPlayer from '../components/MusicPlayer.jsx';
import { useState, useEffect } from 'react';

function Home() {

    const [digs, setDigs] = useState(null);
    const [trackData, setTrackData] = useState('');
    // digsをfetchする
    // useEffect(() => {
    //     const url = import.meta.env.VITE_API_ORIGIN;
    //     const fetchData = async () => {
    //         const response = await fetch(`${url}/api/dig`);
    //         const data = await response.json();
    //         setDigs(data);
    //     };
    //     fetchData();
    // }, []);

    // 最新20件のdigを取得する
    useEffect(() => {
        const url = import.meta.env.VITE_API_ORIGIN;
        const fetchData = async () => {
            const response = await fetch(`${url}/api/dig?limit=20`);
            const data = await response.json();
            setDigs(data);
        };
        fetchData();
    }, []);


    return (
        <MyProvider value={{ trackData, setTrackData }}>
            <div className='mb-20'>
                <div className='flex justify-center items-center py-5'>
                    <div>
                        All Digs
                    </div>
                </div>
                {digs == null ? (
                    <div className='flex justify-center items-center'>
                        <div>
                            Loading...
                        </div>
                    </div>
                ) : (
                    digs.map((dig) => (
                        <Dig key={dig.dig_id} data={dig} />
                    ))
                )}
                {/* < Menu /> */}
                <MusicPlayer />
            </div>
        </MyProvider>
    );
}

export default Home;