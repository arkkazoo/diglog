import React, { useState, useContext } from 'react'
import { useEffect } from 'react'
import Dig from '../components/Dig.jsx'
import PageIndexer from '../components/PageIndexer'
import MyContext from '../MyContext'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Search = () => {
    const { search } = useLocation()
    const query = new URLSearchParams(search);
    const [q, setQ] = useState(query.get('q') || '')
    // const navigateTo = useNavigate()
    const [digs, setDigs] = useState([])
    const [formData, setFormData] = useState('')
    const [page, setPage] = useState(0)
    const { toggeleReload, setToggleReload } = useContext(MyContext)

    const handleChange = (e) => {
        setFormData(e.target.value)
    }

    const handlePrev = () => {
        if (page > 0) {
            setPage(page - 1)
        }
    }

    const handleNext = () => {
        setPage(page + 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // (" ", "#") -> ("+", "%23")
        let newQuery = formData.replace(/\s+/g, '+').replace(/#/g, '%23')
        fetchDigs(newQuery)
    }

    const fetchDigs = async (query) => {
        const APIOrigin = import.meta.env.VITE_API_ORIGIN;
        const response = await fetch(`${APIOrigin}/api/search/dig?q=${query}&limit=20&offset=${page * 20}`);
        const data = await response.json();
        setDigs(data);
    };

    useEffect(() => {
        // console.log('useEffect')
        if (query.get('q')) {
            setFormData(query.get('q'))
            fetchDigs(query.get('q'))
        }
    }, [q, page, toggeleReload])

    return (
        <>
            <div className="w-4/5 flex flex-col justify-center items-center mx-auto">
                <div className='flex justify-center items-center pt-5'>
                    <div className='font-bold text-3xl'>
                        search
                    </div>
                </div>
                <div className="mt-5 flex justify-center items-center w-1/2">
                    <form className="w-full flex justify-center items-center">
                        <div className="flex items-center border-gray-300 rounded-md border py-2">
                            <input onChange={handleChange} type="text" className="w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
                        </div>
                        <div className="ml-3">
                            <button onClick={handleSubmit} className="bg-gray-700 hover:text-red-500 duration-100 text-white font-bold py-2 px-4 rounded-md m-auto">
                                search
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='flex flex-col w-4/5 mx-auto'>
                <div className='mt-5'>
                    {digs.length > 0 &&
                        (<>
                            {digs.map((dig, index) => (
                                <Dig key={index} data={dig} />
                            ))}
                            <PageIndexer page={page} pagePrev={handlePrev} pageNext={handleNext} fetchDigs={() => {}}/>
                        </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Search