export default function Pagination({currentPage, totalPages, onPageChange}: {currentPage: number, totalPages: number, onPageChange: (page: number) => void}) {
    const isLast: boolean = currentPage === totalPages;
    const isFirst: boolean = currentPage === 1;
    const nextPage = Math.min(currentPage + 1, totalPages);
    return (
        <div className="page-selector" id="page-selector">
            <button
            className="page-change-button"
            disabled={isFirst}
            id="previous-page-button"
            onClick={() => onPageChange(currentPage - 1)}>
                &lt; Previous
            </button>
            <span className={`page-selector${isLast ? '' : ' selector-selected'}`}>
                {currentPage}
            </span>
            <span className={`page-selector${isLast ? ' selector-selected' : ''}`}>
                {nextPage}
            </span>
            <button
            className="page-change-button"
            id="next-page-button"
            disabled={isLast}
            onClick={() => onPageChange(nextPage)}>
                Next &gt;
            </button>
        </div>
    );
}
