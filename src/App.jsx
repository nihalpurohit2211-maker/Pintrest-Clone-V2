import "./Navbar.css";
import "./Gallery.css";
import logoImage from "./assets/logo.png";

import { useState, useEffect } from "react";

import Pin from "./components/Pin.jsx";
import InfoMatrixCard from "./components/InfoMatrixCard.jsx";
import searchPhotos, { getSavedPhotos } from "./search.js";

function App() {
    const [photos, setPhotos] = useState([]);
    const [visible, setVisible] = useState(10);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    
    // Track active tab: "home" or "saved"
    const [activeTab, setActiveTab] = useState("home");
    
    // --- NEW: Theme State ---
    const [theme, setTheme] = useState("light");

    // Apply the theme class to the body tag whenever it changes
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    // -------------------------
    // Load Random Feed
    // -------------------------
    function loadFeed() {
        const random = Math.floor(Math.random() * 50) + 1;
        setIsLoading(true);
        setPhotos([]);

        fetch(`/data/photos${random}.json`)
            .then((res) => res.json())
            .then((data) => {
                setPhotos(data);
                setVisible(20);
                window.scrollTo(0, 0);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    // -------------------------
    // Load Saved Pins Section
    // -------------------------
    async function loadSavedSection() {
        setActiveTab("saved");
        setIsLoading(true);
        setPhotos([]);
        window.scrollTo(0, 0);

        const savedIds = JSON.parse(localStorage.getItem("saved")) || [];
        const savedData = await getSavedPhotos(savedIds);
        
        setPhotos(savedData);
        setVisible(20);
        setIsLoading(false);
    }

    // Load home feed on initial mount
    useEffect(() => {
        loadFeed();
    }, []);

    // Infinite Scroll
    useEffect(() => {
        function handleScroll() {
            const bottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 300;

            if (bottom) {
                if (visible < photos.length) {
                    setVisible((old) => old + 20);
                }
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [visible, photos]);

    // -------------------------
    // Search
    // -------------------------
    async function startSearch() {
        if (search.trim() === "") {
            if (activeTab === "saved") {
                loadSavedSection();
            } else {
                loadFeed();
            }
            return;
        }

        setActiveTab("home");
        setPhotos([]);
        setVisible(20);
        setIsLoading(true);
        window.scrollTo(0, 0);

        await searchPhotos(search, (newBatch) => {
            setPhotos((prev) => [...prev, ...newBatch]);
            setIsLoading(false);
        });

        setIsLoading(false);
    }

    return (
        <>
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo"> 
                    <img src={logoImage} alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                </div>

                <button 
                    className={activeTab === "home" ? "active-nav" : ""} 
                    onClick={() => {
                        setActiveTab("home");
                        loadFeed();
                    }}
                    title="Home"
                >
                    <svg width="24" height="24" fill={activeTab === "home" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </button>

                <button 
                    className={activeTab === "saved" ? "active-nav" : ""} 
                    onClick={loadSavedSection}
                    title="Saved"
                >
                    <svg width="24" height="24" fill={activeTab === "saved" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                </button>

                <button title="Create">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>

                <button title="Messages">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>

                <div className="bottom">
                    {/* --- NEW: Theme Toggle Button --- */}
                    <button 
                        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    >
                        {theme === "light" ? (
                            /* Moon Icon */
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        ) : (
                            /* Sun Icon */
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        )}
                    </button>

                    <button title="Settings">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                </div>
            </div>

            {/* Navbar */}
            <div className="navbar">
                <input
                    type="text"
                    placeholder={activeTab === "saved" ? "Search within saved..." : "Search"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            startSearch();
                        }
                    }}
                />
            </div>

            {/* Header for Saved Section */}
            {activeTab === "saved" && (
                <div style={{ marginLeft: "90px", padding: "20px 30px 0 30px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Saved Pins</h1>
                    <p className="saved-desc" style={{ color: "#666", marginTop: "5px" }}>
                        All your saved items in one place
                    </p>
                </div>
            )}

            {/* Gallery */}
            <div className="gallery">
                {photos.slice(0, visible).map((photo) => (
                    <Pin
                        key={photo.id}
                        photo={photo}
                        onPinClick={(p) => setSelectedPhoto(p)}
                    />
                ))}

                {/* Skeletons */}
                {isLoading &&
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={`skeleton-${i}`} className="skeleton-pin"></div>
                    ))}
            </div>

            {/* Empty State for Saved Section */}
            {activeTab === "saved" && !isLoading && photos.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px", marginLeft: "90px" }}>
                    <h2>No saved pins yet!</h2>
                    <p className="saved-desc" style={{ color: "#777", marginTop: "10px" }}>
                        Click the "Save" button on any image to add it here.
                    </p>
                </div>
            )}

            {/* Pinterest InfoMatrix Card Modal */}
            {selectedPhoto && (
                <InfoMatrixCard
                    photo={selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                />
            )}

            {/* End */}
            {!isLoading && visible >= photos.length && photos.length > 0 && (
                <h3 style={{ textAlign: "center", padding: "30px" }}>
                    End of Feed
                </h3>
            )}
        </>
    );
}

export default App;