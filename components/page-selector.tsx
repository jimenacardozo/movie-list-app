type PageSelectorProps = {
    totalPages: number,
    currentPage: number
}

export default function PageSelector({ totalPages, currentPage }: PageSelectorProps) {
    return (<div className="page-selector" id="page-selector">
        <button className="page-change-button"
            id="previous-page-button"
            disabled={currentPage === 1}
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
        >
            Next &gt; 
        </button>
    </div>)
}
