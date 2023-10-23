import React, { useState, useContext } from "react";
import { useCookies } from "react-cookie";
import MyContext from "../MyContext";

const NormaModal = (props) => {
    const [cookies] = useCookies();
    const [formData, setFormData] = useState(props.data);
    const {toggleReload, setToggleReload} = useContext(MyContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const res = await fetch(APIOrigin + "/api/norma", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${cookies.jwtToken}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
            setToggleReload(!toggleReload);
            props.onClose();
        } else {
            alert(data.message);
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    }

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-10">
                <div className="modal-container bg-white w-1/3 rounded-xl shadow-lg border-2">

                    <form onSubmit={handleSubmit} className=" my-8 mx-12">
                        <div className="flex justify-center items-center">
                            <div className="text-xl font-bold">
                                set norma
                            </div>
                        </div>
                        <div className="mt-5 flex items-center justify-center">
                            <div className="flex-1 mx-2 flex flex-col justify-center items-center">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="url">
                                    daily
                                </label>
                                <input
                                    type="number"
                                    id="daily_norma"
                                    name="daily_norma"
                                    value={formData.daily_norma}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex-1 mx-2 flex flex-col justify-center items-center">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="url">
                                    weekly
                                </label>
                                <input
                                    type="number"
                                    id="weekly_norma"
                                    name="weekly_norma"
                                    value={formData.weekly_norma}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex-1 mx-2 flex flex-col justify-center items-center">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="url">
                                    monthly
                                </label>
                                <input
                                    type="number"
                                    id="monthly_norma"
                                    name="monthly_norma"
                                    value={formData.monthly_norma}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={props.onClose}
                                className="bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-auto"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                決定
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
};

export default NormaModal;