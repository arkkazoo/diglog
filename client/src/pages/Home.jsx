import Dig from '../components/Dig.jsx';
import Menu from '../components/DigFormWrapper.jsx';
import { useState, useEffect } from 'react';

function Home() {
    
    const [digs, setDigs] = useState(null);
    // digsをfetchする
    useEffect(() => {
        const url = import.meta.env.VITE_API_ORIGIN;
        const fetchData = async () => {
            const response = await fetch(`${url}/api/dig`);
            const data = await response.json();
            setDigs(data);
        };
        fetchData();
    }, []);
    return (
        <div>
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
                < Menu />
        </div>
    );
}

export default Home;