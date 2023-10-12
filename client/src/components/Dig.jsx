import DomainIcon from "./DomainIcon";
import { useContext } from "react";
import MyContext from "../MyContext";

const Dig = (props) => {
    const { url, domain, artist, title, comment } = props.data;
    const { setTrackData } = useContext(MyContext);

    const handlePlay = () => {
        //コメント以外の曲の情報をjsonで渡す
        setTrackData({ url, domain, artist, title });
    };

    const handleAddCue = () => {
    };

    return (
        <div className="flex w-4/5 mx-auto h-16">
            <div className="container flex border rounded-md mb-1">
                <div className="flex-col px-4 border-r text-lg 1/2 md:w-2/5 flex justify-center lg:w-1/6">{artist}</div>
                <div className="flex-col px-4 border-r text-lg 1/2 md:w-2/5 flex justify-center lg:w-1/4">{title}</div>
                <div className="px-4 border-r flex justify-center items-center">
                    <a href={url} target="_blank">
                        <DomainIcon domain={domain} />
                    </a>
                </div>
                <div className="px-4 flex justify-center items-center" onClick={handlePlay}>
                    <div className="rounded-md border-2 border-gray-300 p-1">
                        再生
                    </div>
                </div>
                <div className="pr-4 border-r flex justify-center items-center" onClick={handleAddCue}>
                    <div className="rounded-md border-2 border-gray-300 p-1">
                        キューに追加
                    </div>
                </div>
                <div className="px-4 flex justify-center items-center">{comment}</div>
            </div>
        </div >
    );
}

export default Dig;