import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (searchParams: any) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState({
        city: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        bedroom: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className='sticky top-14 z-30 w-full bg-background/95 backdrop-blur-sm py-2 mb-4 border-b border-primary/10 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-lg md:border md:shadow-sm transition-all duration-300'>
            <form
                onSubmit={handleSubmit}
                className='flex items-center gap-2 w-full max-w-4xl mx-auto'
            >
                {/* City Input - Flex-1 to take available space */}
                <div className='flex-1 relative'>
                    <input
                        type='text'
                        name='city'
                        placeholder='City...'
                        className='w-full h-10 pl-3 pr-2 bg-background border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm'
                        onChange={handleChange}
                    />
                </div>

                {/* Type Dropdown - Compact */}
                <select
                    name="type"
                    className='h-10 px-2 bg-background border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer text-sm w-[80px] md:w-auto'
                    onChange={handleChange}
                >
                    <option value="">All</option>
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                </select>

                {/* Search Button - Icon Only */}
                <button
                    type='submit'
                    className='h-10 w-10 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center flex-shrink-0'
                >
                    <Search className='w-4 h-4' />
                </button>
            </form>
        </div>
    );
};
