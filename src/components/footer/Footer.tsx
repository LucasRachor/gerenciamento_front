const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} DogTV. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    )
}

export default Footer;