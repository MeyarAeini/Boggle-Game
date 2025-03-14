import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    My Board Game
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/game" className="hover:text-gray-400">
                                Game
                            </Link>
                        </li>
                        <li>
                            <Link href="/history" className="hover:text-gray-400">
                                History
                            </Link>
                        </li>
                        <li>
                            <Link href="/account" className="hover:text-gray-400">
                                Account
                            </Link>
                        </li>
                        <li>
                            <Link href="/settings" className="hover:text-gray-400">
                                Settings
                            </Link>
                        </li>
                        <li>
                            <Link href="/sign-out" className="hover:text-gray-400">
                                Sign Out
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};