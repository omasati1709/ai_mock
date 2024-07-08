"use client";
import { UserButton, SignInButton, SignOutButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// Modal component
const Modal = ({ isVisible, onClose, onConfirm }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
                <p className="mb-4">Are you sure you want to sign out?</p>
                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-all"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all"
                        onClick={onConfirm}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

const Header = () => {
    const path = usePathname();
    const { isSignedIn } = useAuth();
    const [isModalVisible, setModalVisible] = useState(false);

    const handleSignOut = () => {
        setModalVisible(true);
    };

    const confirmSignOut = () => {
        setModalVisible(false);
        SignOutButton().props.onClick();
    };

    useEffect(() => {
        console.log(path);
    }, [path]);

    return (
        <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
            <Image src={'/logo.jpg'} width={160} height={100} alt='logo' />
            <ul className='hidden md:flex gap-6'>
                <Link href="/dashboard">
                    <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard' && 'text-primary font-bold'}`}>
                        Dashboard
                    </li>
                </Link>
                {path === '/' && (
                    <Link href="#how-it-works">
                        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard/how' && 'text-primary font-bold'}`}>
                            How it Works?
                        </li>
                    </Link>
                )}
            </ul>
            <div className='flex items-center gap-4'>
                {isSignedIn ? (
                    <>
                        <button
                            onClick={handleSignOut}
                            className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all'
                        >
                            Sign Out
                        </button>
                        <Modal
                            isVisible={isModalVisible}
                            onClose={() => setModalVisible(false)}
                            onConfirm={confirmSignOut}
                        />
                    </>
                ) : (
                    <button className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all'>
                        <SignInButton />
                    </button>
                )}
                <UserButton />
            </div>
        </div>
    );
};

export default Header;
