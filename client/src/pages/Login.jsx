import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export function Login() {
    const navigateTo = useNavigate();
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        const url = import.meta.env.VITE_API_ORIGIN;
        e.preventDefault();
        if (formData.username === '') {
            alert('ユーザーIDを入力してください');
            return;
        }
        // emailでログインする場合
        if (validateEmail(formData.email) === true) {
            const response = await fetch(`${url}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                Cookies.set('jwtToken', data.token, { expires: 7});
                navigateTo('/');
            } else {
                alert(json.message);
            }
            return;
        }
        // usernameでログインする場合
        const response = await fetch(`${url}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
            if (response.ok) {
                Cookies.set('jwtToken', data.token, { expires: 7});
                navigateTo('/');
        }
        else {
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
                                ユーザーIDまたはメールアドレス
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="ユーザーIDまたはメールアドレスを入力してください"
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