const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const urlForm = $("#url-form");
const urlInput = $("#url-input");
const resultContainer = $("#result");
const resultJobId = $("#jobId");
const resultUrl = $("#resultUrl");
const message = $("#message");

const YOUTUBE_URL_REGEX =
	/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
const API_ENDPOINT = "/analyze";

urlForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const url = urlInput.value.trim();

	if (!YOUTUBE_URL_REGEX.test(url)) {
		alert("Please enter a valid YouTube URL.");
		console.error("Invalid YouTube URL.");
		return;
	}

	resultContainer.classList.remove("show");
	message.classList = [];

	fetch(API_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ url: url }),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log("Response:", data);
			if (data.success) {
				const { jobId } = data;
				resultJobId.textContent = jobId;
				resultUrl.href = `/result/${jobId}`;
				resultContainer.classList.add("show");
			} else {
				console.error("Error:", data.error);
				message.textContent = "An error occurred: " + data.error;
				message.classList.add("error");
			}
		});
	// urlInput.value = ""; // Clear the input after submission
});
