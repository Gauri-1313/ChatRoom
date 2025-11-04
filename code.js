(function(){
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    // Join chat
    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        let username = app.querySelector(".join-screen #username").value.trim();
        if(username.length === 0) return;
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Send message
    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector(".chat-screen #message-input").value.trim();
        if(message.length === 0) return;
        renderMessage("my", { username: uname, text: message });
        socket.emit("chat", { username: uname, text: message });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    // Exit chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    // Receive updates
    socket.on("update", function(message){
        renderMessage("update", message);
    });

    // Receive chat messages
    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    // Render message
    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(!messageContainer) return;

        if(type === "my"){
            let el = document.createElement("div");
            el.className = "message my-message";
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if(type === "other"){
            let el = document.createElement("div");
            el.className = "message other-message";
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if(type === "update"){
            let el = document.createElement("div");
            el.className = "update";
            el.innerText = message;
            messageContainer.appendChild(el);
        }

        // Scroll to bottom
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
})();
