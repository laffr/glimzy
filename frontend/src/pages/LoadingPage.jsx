const LoadingPage = () => {
    return (
        <div className="fixed inset-0 bg-[#16171D] flex items-center justify-center z-9999">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#7ae932] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">Ładowanie...</p>
            </div>
        </div>
    );
};

export default LoadingPage;