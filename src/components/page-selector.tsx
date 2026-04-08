type PageSelectorProps = {
    totalPages: number,
    currentPage: number,
    handlePreviousPage: () => void,
    handleNextPage: () => void,
}

export default function PageSelector({ totalPages, currentPage, handlePreviousPage, handleNextPage }: PageSelectorProps) {
    return (<div className="page-selector" id="page-selector">
        <button className="page-change-button"
            id="previous-page-button"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
        >
            &lt; Previous
        </button>
        <span className={currentPage === totalPages ? "page-selector" : "page-selector selector-selected"}
            id="page-selector-previous-page"
        >
            {currentPage}
        </span>
        <span className={currentPage === totalPages ? "page-selector selector-selected" : "page-selector"}
            id="page-selector-next-page"
        >
            {Math.min(currentPage + 1, totalPages)}
        </span>
        <button className="page-change-button"
            id="next-page-button"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
        >
            Next &gt; 
        </button>
    </div>)
}
