const PlaylistDeleteModal = (props) => {
    const { data, onConfirm, onCancel } = props;
    const { playlist_name } = data;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="modal-container bg-white w-1/3 rounded-xl border-2  p-4 shadow-lg">
                <div className=" px-8 pt-6 pb-6 mb-4">
                    <div className="text-xl font-bold text-center">delete</div>
                    <div className="mt-5 font-bold text-xl text-center">
                        {playlist_name}
                    </div>
                    <div className="flex  flex-col items-center justify-center mt-5">
                        <button
                            onClick={onConfirm}
                            type="submit"
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            delete
                        </button>
                        <button
                            onClick={onCancel}
                            type="button"
                            className="mt-3 border-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            cancel
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaylistDeleteModal;