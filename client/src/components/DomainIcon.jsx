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
            return "bg-red-500"
        }
        if (domain === "soundcloud") {
            return "bg-orange-500"
        }
        if (domain === "spotify") {
            return "bg-green-500"
        }
    }

    return (
        <div className={`rounded-md ${Color(props.domain)} text-white p-1`}>
            {Acronym(props.domain)}
        </div>
    );
}

export default DomainIcon;