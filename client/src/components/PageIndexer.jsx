const PageIndexer = (props) => {

    return (
        <div className='flex justify-center items-center py-5'>
            <div className='flex items-center'>
                <button onClick={props.pagePrev}
                    className='border-2 hover:text-red-500 duration-100 ease-in text-gray-600 font-bold py-2 px-4 rounded-l-xl'>
                    prev
                </button>
                <div className='px-2'>
                    {props.page + 1}
                </div>
                <button onClick={props.pageNext}
                    className='border-2 hover:text-red-500 duration-100 ease-in text-gray-600 font-bold py-2 px-4 rounded-r-xl'>
                    next
                </button>
            </div>
        </div>
    );
}

export default PageIndexer;