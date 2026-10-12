import MenuList from "../components/MenuList";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { isDemoMenu, menuUrl } from "../services/menuApi";

function MenuPage() {
    const [query, setQuery] = useState("");
    const debounced = useDebounce(query, 400);
    const { data: dishes, isLoading, error } = useFetch(menuUrl);

    if (isLoading) {
        return <p>Loading menu...</p>;
    }
    if (error) {
        return <p>Could not load menu: {error}</p>;
    }

    const filtered = dishes.filter((dish) =>
        dish.name.toLowerCase().includes(debounced.toLowerCase())
    );

    return (
        <div>
            <h1>CampusEats Dashboard</h1>
            {isDemoMenu && <p role="status">Sample menu — live menu coming soon.</p>}

            <input
                type="text"
                placeholder="Search dishes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <MenuList dishes={filtered} />
        </div>
    );
}

export default MenuPage;
