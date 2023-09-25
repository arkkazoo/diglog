import React, { useState } from "react";

export const DigInput = (props) => {
    const [url, setUrl] = useState("");
    const [artist, setArtist] = useState("");
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        props.addDig(url, artist, title, comment);
        setUrl("");
        setArtist("");
        setTitle("");
        setComment("");
    }

    return (
        <div className="flex w-4/5 mx-auto h-16">
            <div className="container flex border rounded-md mb-1">
                <form onSubmit={handleSubmit} className="flex w-full">
                    <div className="px-6 border-r flex justify-center items-center">
                        <input
                            type="text"
                            placeholder="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full px-2 py-1"
                        />
                    </div>
                    <div className="flex-col px-6 border-r w-1/2 flex justify-center md:w-1/4">
                        <input
                            type="text"
                            placeholder="artist"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            className="w-full px-2 py-1"
                        />
                        <input
                            type="text"
                            placeholder="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-2 py-1"
                        />
                    </div>
                    <div className="px-6 border-r flex justify-center items-center">
                        <input
                            type="text"
                            placeholder="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-2 py-1"
                        />
                    </div>
                    <div className="px-6 flex justify-center items-center">
                        <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded-md">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
