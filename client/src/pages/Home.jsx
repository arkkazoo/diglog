import Dig from '../components/Dig.jsx';
import Menu from '../components/DigFormWrapper.jsx';
import { digs } from './sample-digs.js';

function Home() {
    return (
        <div>
            <div className='flex justify-center items-center py-5'>
                <div>
                    All Digs
                </div>
            </div>
            {digs.map((dig) => (
                <Dig key={dig.digId} data={dig} />
            ))}
            <Menu />
        </div>
    );
}

export default Home;