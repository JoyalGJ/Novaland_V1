import { useState } from "react";
import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import Footer from "./components/Footer";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropertyInfo from "./pages/PropertyInfo";
import Explore from "./pages/Explore.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import SignInComponent from "./components/SignInComponent";
import MakeOffer from "./components/MakeOffer.jsx";
import Chatpage from "./pages/Chatpage.jsx";
import Home2 from "./pages/Home2"
function App() {
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const disconnect = useDisconnect();

    return (
        <Router>
            <div>
                <Header />
                {address ? (
                    <div>
                        <p>Connected as {address}</p>
                        <button onClick={disconnect}>Disconnect</button>
                    </div>
                ) : (
                    <button onClick={connectWithMetamask}>Connect with MetaMask</button>
                )}

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignInComponent />} />

                    {/* Protected Routes - Clerk manages authentication */}
                    <Route path="/explore" element={
                        <SignedIn>
                            <Explore />
                        </SignedIn>
                    } />
                    <Route path="/property/:id" element={
                        <SignedIn>
                            <PropertyInfo />
                        </SignedIn>
                    } />
                    <Route path="/dashboard" element={
                        <SignedIn>
                            <Dashboard />
                        </SignedIn>
                    } />
                    <Route path="/profile" element={
                        <SignedIn>
                            <UserProfile />
                        </SignedIn>
                    } />

                    {/* Fallback Route for SignedOut Users */}
                    <Route path="*" element={
                        <SignedOut>
                            <Navigate to="/signin" replace />
                        </SignedOut>
                    } />
                    <Route path="/make-offer" element={
                        <SignedIn>
                            <MakeOffer />
                        </SignedIn>
                    } />
                    <Route path="/Chat" element={
                        <SignedIn>
                            <Chatpage />
                        </SignedIn>
                    } />

                    {/*For Testing Purpose*/}
                    <Route path="/test" element={<Home2 />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;