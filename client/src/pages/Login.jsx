import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MyProvider from '../MyContext';

export function Login() {
    const { isLogin, setIsLogin }= useContext(MyProvider);
    const navigateTo = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        if (formData.username === '') {
            alert('ユーザーIDを入力してください');
            return;
        }

        let request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
            }),
        };

        const response = await fetch(`${APIOrigin}/api/login`, request);
        const data = await response.json();
        if (response.ok) {
            Cookies.set('jwtToken', data.token, { expires: 7});
            Cookies.set('username', data.username, { expires: 7});
            Cookies.set('userId', data.userId, { expires: 7});
            setIsLogin(true);
            navigateTo('/');
        } else {
            alert(json.message);
        }
    }

    return (
        <div>
            <div className='flex justify-center items-center pt-8'>
                <div className=" px-10 pt-8 pb-12 w-3/4 sm:w-5/12 lg:w-2/5 border-gray-300 border-2 rounded-xl max-w-lg">

                    <div>
                        <h1 className="text-center text-3xl font-md mb-12">login</h1>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                ユーザーID
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="ユーザーIDを入力してください"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                パスワード
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="パスワードを入力してください"
                            />
                        </div>

                        <div className="mt-8 flex items-center justify-center">
                            <button className="bg-gray-700 w-1/2 py-2 rounded-lg text-white hover:bg-gray-900">
                                ログイン
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}