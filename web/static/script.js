async function getCaption() {
    const reelLink = document.getElementById("reelLink").value;
    if (!reelLink) {
        alert("Please enter a valid Instagram reel link");
        return;
    }

    try {
        const response = await fetch('/get-caption', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: reelLink }),
        });

        const data = await response.json();
        if (data.caption) {
            document.getElementById("result").style.display = 'block';
            document.getElementById("result").innerText = data.caption;
        } else {
            alert("Could not fetch caption. Please check the link or try again.");
        }
    } catch (error) {
        console.error("Error fetching the caption:", error);
        alert("An error occurred. Please try again later.");
    }
}