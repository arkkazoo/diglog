import DomainIcon from "./DomainIcon";

const Dig = (props) => {
    const { userId, url, domain, artist, title, comment } = props.data;

    return (
        <div className="flex w-4/5 mx-auto h-16">
            <div className="container flex border rounded-md mb-1">
                <div className="px-4 border-r flex justify-center items-center">{userId}</div>
                <div className="flex-col px-4 border-r 1/2 md:w-2/5 flex justify-center lg:w-1/4">
                    <div className="text-sm  text-gray-400">{artist}</div>
                    <div className="">{title}</div>
                </div>
                <div className="px-4 border-r flex justify-center items-center">
                    <a href={url} target="_blank">
                        <DomainIcon domain={domain} />
                    </a>
                </div>
                <div className="px-4 flex justify-center items-center">{comment}</div>
            </div>
        </div>
    );
}

export default Dig;