export default function Pagination() {
    return (
        <div className="page-selector" id="page-selector">
            <button className="page-change-button" id="previous-page-button">
                &lt; Previous
            </button>
            <span className="page-selector" id="page-selector-previous-page"></span>
            <span className="page-selector" id="page-selector-next-page"></span>
            <button className="page-change-button" id="next-page-button">
                Next &gt;
            </button>
        </div>
    );
}
