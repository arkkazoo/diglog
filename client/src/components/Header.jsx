// Cookieに保存されているユーザー情報を取得するために、useCookiesをインポート
import { useCookies } from 'react-cookie';

// ログイン状態を管理するために、useStateをインポート
import { useState, useEffect } from 'react';

function Header() {
    // ログイン状態を管理するための変数を定義
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState('');
    // Cookieに保存されているユーザー情報を取得するために、useCookiesをインポート
    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
    // Cookieにユーザー情報が保存されているかどうかを確認
    useEffect(() => {
        if (cookies.jwtToken) {
            // ユーザー情報が保存されている場合は、ログイン状態をtrueにする
            setIsLogin(true);
            // ユーザー名を取得するためのAPIを叩く
            getUserName().then((data) => {
                setUserName(data);
            }
            );
        }
    }, []);

    // ユーザー名を取得するためのAPIを定義
    const url = import.meta.env.VITE_API_ORIGIN;
    const getUserName = async () => {
        const response = await fetch(`${url}/api/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${cookies.jwtToken}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            alert(data.message);
        }
    }

    return (
        <header className='border-b'>
            <div className='container flex mx-auto p-5 flex-row items-center'>
                <a href='/' className='font-medium mb-0'>
                    <span className='text-xl font-black ml-3'>diglog</span>
                </a>
                {isLogin ? (
                    <nav className='ml-auto text-base'>
                        <a href='/search' className='mr-5 hover:text-red-500 duration-150'>search</a>
                        {userName ? (
                            <a href='/user' className='hover:text-red-500 duration-150'>{userName}</a>
                        ) : (
                            <a href='/user' className='hover:text-red-500 duration-150'>user</a>
                        )}
                    </nav>
                ) : (
                    <nav className='ml-auto text-base'>
                        <a href='/search' className='mr-5 hover:text-red-500 duration-150'>search</a>
                        <a href='/register' className='mr-5 hover:text-red-500 duration-150'>register</a>
                        <a href='/login' className='hover:text-red-500 duration-150'>login</a>
                    </nav>
                )
                }
            </div>
        </header>
    )
}

export default Header;