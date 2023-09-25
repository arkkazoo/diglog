//投稿用フォームを表示するためのボタン。画面中央下部に固定で表示される

import React from 'react';
import { Link } from 'react-router-dom';

export const MakeDig = () => {
    return (
        <div className="fixed bottom-0 center-x">
            <Link to="/make-dig">
                <button className="px-2 py-1 bg-blue-500 text-white rounded-md">Make Dig</button>
            </Link>
        </div>
    );
}