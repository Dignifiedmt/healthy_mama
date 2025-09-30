import {Search} from "lucide-react";

// Reusable search bar.
const SearchBar = ({value, onChange}) => {
    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Bincika labarai..."
                className="w-full p-2 pl-10 border rounded"
            />
            <Search size={20} className="absolute left-2 top-2.5 text-gray-400" />
        </div>
    );
};

export default SearchBar;
