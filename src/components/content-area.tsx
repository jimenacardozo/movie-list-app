import FiltersContainer from "./filter-container"
import PageSelector from './page-selector';

export default function ContentArea() {
    return <div>
        <p>Content area component</p>
        <FiltersContainer />
        <PageSelector />
    </div>
}