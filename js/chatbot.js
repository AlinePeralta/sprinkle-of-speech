const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
let sessionId = ""; // Variable to store session ID
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent;
    if (className === "outgoing") {
        chatContent = `<p></p>`;
    } else {
        chatContent = `<span class="fa fa-user"></span><p></p>`;
    }
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const createDotsAnimation = () => {
    const dotsDiv = document.createElement("div");
    dotsDiv.classList.add("dots");
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dotsDiv.appendChild(dot);
    }
    return dotsDiv;
}

const generateResponse = (chatElement) => {
    const API_URL = "https://jlypfjxz61.execute-api.us-east-1.amazonaws.com/default/chatbot";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userMessage, sessionId: sessionId })
    }

    // Send POST request to API, get response and set the response as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        const parsedBody = JSON.parse(data.body); // Parse the body property of the response
        if (parsedBody && parsedBody.answer) {
            messageElement.textContent = parsedBody.answer.trim();
            sessionId = parsedBody.sessionId; // Update the sessionId with the response
        } else {
            messageElement.textContent = "Received an unexpected response from the server.";
        }
    }).catch(error => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display animated dots while waiting for the response
        const incomingChatLi = createChatLi("", "incoming");
        const dotsAnimation = createDotsAnimation();
        incomingChatLi.querySelector("p").appendChild(dotsAnimation);
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key, handle the chat
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
