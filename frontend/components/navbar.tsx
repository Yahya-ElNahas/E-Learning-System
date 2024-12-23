'use client'

import { useState, useEffect } from "react"
import { Navbar, NavbarContent, NavbarItem, Link, Button, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react"
import { motion } from "framer-motion"
import '@/styles/globals.css'
import './NavbarComponent.css'

export default function NavbarComponent({ courses = false }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [scrolled])

    const menuItems = [
        "Home",
        ...(courses ? ["Courses"] : []),
        "About",
        "Contact"
    ]

    const MotionNavbarItem = motion(NavbarItem)

    return (
        <Navbar 
            onMenuOpenChange={setIsMenuOpen} 
            className={`transition-all duration-300 ${
                scrolled ? "bg-black/90 backdrop-blur-md shadow-lg shadow-blue-900/30" : "bg-transparent"
            }`}
            maxWidth="full"
            position={scrolled ? "sticky" : "static"}
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden text-white"
                />
                <NavbarBrand>
                    <motion.p 
                        className="font-sans text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        E-Learning System
                    </motion.p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {menuItems.map((item, index) => (
                    <MotionNavbarItem
                        key={item}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Link href="#" className="text-lg font-semibold text-gray-300 hover:text-blue-400 transition-colors duration-300">
                            {item}
                        </Link>
                    </MotionNavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                <MotionNavbarItem 
                    className="hidden lg:flex"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link href="/login" className="text-lg font-semibold text-gray-300 hover:text-red-400 transition-colors duration-300">Login</Link>
                </MotionNavbarItem>
                <MotionNavbarItem
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Button 
                        as={Link} 
                        href="/register" 
                        className="bg-gradient-to-r from-blue-700 to-red-700 text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-blue-800 hover:to-red-800"
                    >
                        Sign Up
                    </Button>
                </MotionNavbarItem>
            </NavbarContent>

            <NavbarMenu className="bg-black/95 backdrop-blur-md">
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Link
                                className="w-full text-lg font-semibold text-gray-300 hover:text-blue-400 transition-colors duration-300"
                                href="#"
                                size="lg"
                            >
                                {item}
                            </Link>
                        </motion.div>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )}
    
