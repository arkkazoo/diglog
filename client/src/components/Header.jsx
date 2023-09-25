function Header() {
    return (
        <header className='border-b'>
            <div className='container flex mx-auto p-5 flex-col md:flex-row items-center'>
                <a href='#' className='font-medium mb-4 md:mb-0'>
                    <span className='text-xl font-black ml-3'>diglog</span>
                </a>
                <nav className='md:ml-auto text-base'>
                    <a href='#search' className='mr-5 hover:text-red-500 duration-150'>search</a>
                    <a href='#register' className='mr-5 hover:text-red-500 duration-150'>register</a>
                    <a href='#login' className='hover:text-red-500 duration-150'>login</a>
                </nav>
            </div>
        </header>
    )
}

export default Header;