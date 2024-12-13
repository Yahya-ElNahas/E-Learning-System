import { Navbar, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import '@/styles/globals.css'; 

export default function NavbarComponent({ courses = true, }) {
    return (
        <Navbar>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {courses && (
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Courses
                        </Link>
                    </NavbarItem>
                )}
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="/login">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="/register" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
