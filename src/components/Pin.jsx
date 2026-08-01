import { useState } from "react";
import "./Pin.css";

function Pin({ photo }) {

    const [saved, setSaved] = useState(false);

    function savePhoto() {

        let savedPhotos = JSON.parse(localStorage.getItem("saved")) || [];

        if (savedPhotos.includes(photo.id)) {

            savedPhotos = savedPhotos.filter((id) => id !== photo.id);

            setSaved(false);

        }

        else {

            savedPhotos.push(photo.id);

            setSaved(true);

        }

        localStorage.setItem("saved", JSON.stringify(savedPhotos));

    }

    return (

        <div className="Pin">

            <img
                src={photo.image}
                alt=""
            />

            <div className="overlay">

                <button
                    className="save"
                    onClick={savePhoto}
                >

                    {saved ? "Saved" : "Save"}

                </button>

                <button className="menu">

                    ⋮

                </button>

            </div>

        </div>

    );

}

export default Pin;