async function searchPhotos(word) {

    let results = [];

    for (let i = 1; i <= 50; i++) {

        const res = await fetch(`/data/photos${i}.json`);
        const photos = await res.json();

        for (let photo of photos) {

            if (photo.tags.join(" ").toLowerCase().includes(word.toLowerCase())) {

                results.push(photo);

            }

        }

    }

    return results;

}

export default searchPhotos;