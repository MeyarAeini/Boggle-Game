'use client';

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from "next/link";

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathName = usePathname();
    const params = useSearchParams();
    const currentPage = Number(params.get('page')) || 1;

    const getUrl = (pageno: number) => {
        const searchParams = new URLSearchParams(params);
        searchParams.set('page', pageno.toString());
        return `${pathName}?${searchParams.toString()}`;
    }
    return (
        <div className="inline-flex">
            <PaginationArrow
                direction="left"
                href={getUrl(currentPage - 1)}
                isDisabled={currentPage <= 1}
            />

            <PaginationArrow
                direction="right"
                href={getUrl(currentPage + 1)}
                isDisabled={currentPage >= totalPages}
            />
        </div>
    );
}

function PaginationArrow({
    href,
    direction,
    isDisabled,
}: {
    href: string;
    direction: 'left' | 'right';
    isDisabled?: boolean;
}) {
    const className = clsx(
        'flex h-10 w-10 items-center justify-center rounded-md border',
        {
            'pointer-events-none text-gray-300': isDisabled,
            'hover:bg-gray-100': !isDisabled,
            'mr-2 md:mr-4': direction === 'left',
            'ml-2 md:ml-4': direction === 'right',
        },
    );

    const icon =
        direction === 'left' ? (
            <ArrowLeftIcon className="w-4" />
        ) : (
            <ArrowRightIcon className="w-4" />
        );

    return isDisabled ? (
        <div className={className}>{icon}</div>
    ) : (
        <Link className={className} href={href}>
            {icon}
        </Link>
    );
}