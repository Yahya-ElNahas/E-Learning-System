import { Navbar, NavbarContent, NavbarItem, Link, Button, NavbarBrand } from "@nextui-org/react";
import '@/styles/globals.css';

export default function NavbarComponent({ index = false, studentName = null, instructor = false, admin = false}) {
    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-sans text-2xl font-bold text-teal-600">E-Learning System</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {studentName && (
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            <h1 className="font-sans text-2xl font-bold text-teal-600">{studentName}</h1>
                        </Link>
                    </NavbarItem>
                )}
            </NavbarContent>
            <NavbarContent justify="end">
                {index && (
                    <>
                        <NavbarItem className="hidden lg:flex">
                            <Link href="/login">Login</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button as={Link} color="primary" href="/register" variant="flat">
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </>
                )}
                {!index && (
                    <NavbarItem>
                        <Button as={Link} color="primary" href="/account" variant="flat">
                            Account
                        </Button>
                    </NavbarItem>
                )}
            </NavbarContent>
        </Navbar>
    );
}
