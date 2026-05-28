import { useState } from "react";
import { Search } from "lucide-react";
import type { SearchParams } from "../pages/FeedPage";

interface SearchBarProps {
    onSearch: (searchParams: SearchParams) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState<SearchParams>({
        city: "",
        type: "",
        property: "",
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
                <div className='flex-1 relative'>
                    <input
                        type='text'
                        name='city'
                        placeholder='City...'
                        value={query.city}
                        className='w-full h-10 pl-3 pr-2 bg-background border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm'
                        onChange={handleChange}
                    />
                </div>

                <select
                    name="type"
                    value={query.type}
                    className='h-10 px-2 bg-background border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer text-sm w-[80px] md:w-auto'
                    onChange={handleChange}
                >
                    <option value="">All</option>
                    <option value="sale">Buy</option>
                    <option value="rent">Rent</option>
                </select>

                <select
                    name="property"
                    value={query.property}
                    className='hidden md:block h-10 px-2 bg-background border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer text-sm'
                    onChange={handleChange}
                >
                    <option value="">Any property</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="villa">Villa</option>
                    <option value="duplex">Duplex</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="land">Land</option>
                </select>

                <input
                    type="number"
                    name="minPrice"
                    min="0"
                    placeholder="Min"
                    value={query.minPrice}
                    className='hidden lg:block h-10 w-24 px-2 bg-background border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm'
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="maxPrice"
                    min="0"
                    placeholder="Max"
                    value={query.maxPrice}
                    className='hidden lg:block h-10 w-24 px-2 bg-background border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm'
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="bedroom"
                    min="1"
                    placeholder="Beds"
                    value={query.bedroom}
                    className='hidden lg:block h-10 w-20 px-2 bg-background border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm'
                    onChange={handleChange}
                />

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
