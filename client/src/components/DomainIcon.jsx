const DomainIcon =  (props) => {
    const Acronym = (domain) => {
        if (domain === "youtube") {
            return "YT"
        }
        if (domain === "soundcloud") {
            return "SC"
        }
        if (domain === "spotify") {
            return "SP"
        }
    }

    const Color = (domain) => {
        if (domain === "youtube") {
            return "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
        }
        if (domain === "soundcloud") {
            return "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
        }
        if (domain === "spotify") {
            return "border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
        }
    }

    return (
        <div className={`rounded-md font-bold border-2 transition duration-150 hover:ease-in-out ${Color(props.domain)} p-1`}>
            {Acronym(props.domain)}
        </div>
    );
}

export default DomainIcon;