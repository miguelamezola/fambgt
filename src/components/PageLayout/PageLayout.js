import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "../SignInButton/SignInButton";
import { SignOutButton } from "../SignOutButton/SignOutButton";

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <Navbar bg="primary" variant="dark">
                <div className="container">
                    <a className="navbar-brand" href="/">fambgt</a>
                    { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
                </div>
            </Navbar>
            {props.children}
        </>
    );
};