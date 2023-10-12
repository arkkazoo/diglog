import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import DigForm from './DigForm';

const Menu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const parentRef = useRef(null);
    const childRef = useRef(null);

    useEffect(() => {
        const childHeight = childRef.current.offsetHeight;
        {
            isMenuOpen
                ? parentRef.current.style.transform = `translateY(0px)`
                : parentRef.current.style.transform = `translateY(${childHeight}px)`
        }
    }, [isMenuOpen]
    );

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <div ref={parentRef} className={`fixed bottom-0 w-full transition-transform translate-y-full`}>
            <div className=''>
                <div className={`flex justify-center`}>
                    <button
                        className={`bg-gray-700 text-white px-4 py-2 rounded-t-xl w-1/6`}
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? 'Close' : 'Make Your Dig'}
                    </button>
                </div>

                <div className='flex justify-center' ref={childRef}>
                    <div className='w-3/5'>
                        <div className="bg-gray-100 p-4 shadow-md rounded-t-3xl">
                            <DigForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;