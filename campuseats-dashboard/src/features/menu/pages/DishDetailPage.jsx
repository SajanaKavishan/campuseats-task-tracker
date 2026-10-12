import { Link, useParams } from "react-router-dom";

function DishDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Dish Details</h1>

      <p>Showing details for dish #{id}</p>

      <Link to="/">← Back to Menu</Link>
    </div>
  );
}

export default DishDetailPage;