import Dig from '../components/Dig.jsx';
import { DigInput } from '../components/DigInput.jsx';
import { MakeDig } from '../components/MakeDig.jsx';
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
            <DigInput />
            <MakeDig />
        </div>
    );
}

export default Home;