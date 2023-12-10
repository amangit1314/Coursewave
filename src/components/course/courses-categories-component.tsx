import { category } from "@prisma/client";

interface CategorysComponentProps {
    activeCategory: number;
    setActiveCategory: (index: number) => void;
    categories: category[];
    loading: boolean;
}

export default function CategoriesComponent({ activeCategory, setActiveCategory, categories, loading }: CategorysComponentProps) {
    return <>
        <ul className="flex flex-wrap justify-center py-4 text-sm font-medium text-center mx-auto text-gray-500 dark:text-gray-400">
            {loading ? (
                'Categories Loading ...'
            ) : (categories.map((category, index) => (
                <li key={index} className="mr-2">
                    <a
                        href="#"
                        onClick={() => setActiveCategory(index)}
                        className={`inline-block px-6 py-2 rounded-full hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white ${activeCategory === index ? 'text-white bg-blue-600' : 'text-gray-500'
                            }`}
                    >
                        {category.categoryName}
                    </a>
                </li>
            )))}
        </ul>
    </>
}