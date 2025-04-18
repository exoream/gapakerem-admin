const Loading = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-[#FFC100] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default Loading;
