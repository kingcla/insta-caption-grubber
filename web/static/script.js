async function getCaption() {
    const reelLink = document.getElementById("reelLink").value;
    const errorBox = document.getElementById("errorBox");
    const resultBox = document.getElementById("result");
    const captionText = document.getElementById("captionText");

    // Clear previous errors and results
    errorBox.style.display = 'none';
    resultBox.style.display = 'none';

    if (!reelLink) {
        showError("Please enter a valid Instagram reel link");
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
            resultBox.style.display = 'block';
            captionText.innerText = data.caption;
        } else if (data.error) {
            showError(data.error);
        } else {
            showError("Could not fetch the caption. Please check the link or try again.");
        }
    } catch (error) {
        console.error("Error fetching the caption:", error);
        showError("An error occurred. Please try again later.");
    }
}

// Show an error message in the error box
function showError(message) {
    const errorBox = document.getElementById("errorBox");
    errorBox.innerText = message;
    errorBox.style.display = 'block';
}

// Copy the caption to the clipboard using the Navigator Clipboard API
async function copyCaption() {
    const captionText = document.getElementById("captionText").innerText;
    const copyButton = document.getElementById("copyButton");

    try {
        await navigator.clipboard.writeText(captionText);

        // Show feedback in the button
        copyButton.innerText = "Copied!";
        copyButton.disabled = true;

        // Reset the button text after 2 seconds
        setTimeout(() => {
            copyButton.innerText = "Copy";
            copyButton.disabled = false;
        }, 2000);
    } catch (err) {
        console.error("Failed to copy text: ", err);
        showError("Failed to copy the caption. Please try again.");
    }
}