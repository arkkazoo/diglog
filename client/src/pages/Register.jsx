import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const validatePassword = (password) => {
    if (password.length < 8) {
        return "パスワードは8文字以上で入力してください";
    }
    if (password.length > 100) {
        return "パスワードは100文字以下で入力してください";
    }
    if (password.search(/[a-z]/) < 0) {
        return "パスワードには英小文字を含めてください";
    }
    if (password.search(/[A-Z]/) < 0) {
        return "パスワードには英大文字を含めてください";
    }
    if (password.search(/[0-9]/) < 0) {
        return "パスワードには数字を含めてください";
    }
    return true;
};

export function Register() {
    const APIOrigin = import.meta.env.VITE_API_ORIGIN;
    const navigateTo = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirmation: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.username === '') {
            alert('ユーザーIDを入力してください');
            return;
        }
        if (validatePassword(formData.password) !== true) {
            alert(`${validatePassword(formData.password)}`);
            return;
        }
        if (formData.password !== formData.passwordConfirmation) {
            alert('パスワードが一致しません');
            return;
        }
        
        const res = await fetch(APIOrigin + "/api/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.status === 'success') {
            navigateTo('/login');
        } else {
            alert(data.message);
            setFormData({
                ...formData,
                password: '',
                passwordConfirmation: '',
            });
        }
    }

    return (
        <div>
            <div className='flex justify-center items-center pt-8'>
                <div className=" px-10 pt-8 pb-12 w-3/4 sm:w-5/12 lg:w-2/5 border-gray-300 border-2 rounded-xl max-w-lg">
                    <div>
                        <h1 className="text-center text-3xl font-md mb-12">register</h1>
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
                                パスワード（半角英数字8文字以上）
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
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor='passwordConfirmation'>
                                パスワード（確認用）
                            </label>
                            <input
                                type="password"
                                id="passwordConfirmation"
                                name="passwordConfirmation"
                                value={formData.passwordConfirmation}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="パスワードを再度入力してください"
                            />
                        </div>
                        <div className="mt-8 flex items-center justify-center">
                            <button className="bg-gray-700 w-1/2 py-2 rounded-lg text-white hover:bg-gray-900">
                                登録
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}