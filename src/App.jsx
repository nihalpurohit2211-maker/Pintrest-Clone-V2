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

    // -------------------------
    // Load Random Feed
    // -------------------------
    function loadFeed() {
        const random = 43;
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

    // -------------------------
    // Infinite Scroll
    // -------------------------
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

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
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
                <div className="logo"> <img src={logoImage} alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} /></div>

                <button 
                    className={activeTab === "home" ? "active-nav" : ""} 
                    onClick={() => {
                        setActiveTab("home");
                        loadFeed();
                    }}
                >
                    Home
                </button>
                <button 
                    className={activeTab === "saved" ? "active-nav" : ""} 
                    onClick={loadSavedSection}
                >
                    Saved
                </button>
                <button>Create</button>
                <button>Message</button>
                <div className="bottom">
                    <button>Settings</button>
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
                {/* <div className="nav-right">
                    <button>🔔</button>
                </div> */}
            </div>

            {/* Header for Saved Section */}
            {activeTab === "saved" && (
                <div style={{ marginLeft: "90px", padding: "20px 30px 0 30px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Saved Pins</h1>
                    <p style={{ color: "#666", marginTop: "5px" }}>
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
                    <p style={{ color: "#777", marginTop: "10px" }}>
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