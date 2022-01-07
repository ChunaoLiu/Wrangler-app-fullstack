import "./Post.scss"
import { url } from "../globalConfig";

export default function Post() {

    // Removing all messages in the message box and prepare for refreshing

    function removeAllList() {
        var msgBoard = document.getElementById("messageBox");
        if (msgBoard.firstChild == null) return;
        while (msgBoard.firstChild) {
            msgBoard.removeChild(msgBoard.firstChild);
        }
    }

    // using fetch to send a HTTP GET request for all messages, 
    // and dynamically create HTML elements to display these messages

    function getMessage() {
        removeAllList();
        const local_url = url;
        console.log(local_url);
        fetch(local_url, {
            method: 'GET',
        }).then (response => response.json())
        .then (data => {
            data.forEach( data => {
                // If this is a large project, the message element should be written as a react component for future
                // extendability and maintenance. Since this assignment isn't that large, 
                // I decide to use the native HTML5 way to do it.
                var message = document.createElement("div");
                var title = document.createElement("h2");
                var username = document.createElement("h3");
                var content = document.createElement("textarea");
                message.className = "message";
                title.className = "title";
                username.className = "username";
                content.className = "content";
                title.innerHTML = "Title: " + data["title"];
                username.innerHTML = "Post user: " + data["username"];
                content.innerHTML = data["content"];
                message.appendChild(title);
                message.appendChild(username);
                message.appendChild(content);
                document.getElementById("messageBox").appendChild(message);
            })
        })
    }

    // This function will read the content in the input boxes and send a HTTP POST request 
    // to the backend worker instance and the info of a new post should be stored into the
    // cloud CV storage. 

    function postMessage() {
        const title = document.getElementById("title").value;
        const username = document.getElementById("username").value;
        const content = document.getElementById("content").value;

        var fetch_header = new Headers();

        var fetch_body = JSON.stringify({
            "title": title,
            "content": content,
            "user": username
        });

        var requestOptions = {
            method: 'POST',
            headers: fetch_header,
            body: fetch_body,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result[0] != 0) {
                switch (result[0]) {
                    case -1:
                        alert("Error: Please provide a title!");
                        break;
                    case -2:
                        alert("Error: Please provide content!");
                        break;
                    case -3:
                        alert("Error: Please provide your user name!");
                        break;
                }
            } else {
                alert("post successful!");
                getMessage();
            }
        })

        title.innerHTML = "";
        username.innerHTML = "";
        content.innerHTML = "";
    }

    // This is the actual HTML elements
    return (
        <div className="Post">
            <div className="left">
                <h1 className="left-title">Post box</h1>
                <div id="messageBox" className="messageBox">

                </div>
                <div className="controlPanel">
                    <button onClick={() => getMessage()}>Refresh Messages</button>
                </div>
            </div>
            <div className="right">
                <h1 className="PostPwees">Maybe...Post a message?</h1>
                <input type="text" id="username" placeholder="Your username"/>
                <input type="text" id="title" placeholder="Title"/>
                <textarea type="text" id="content" placeholder="What a wonderful day~"/>
                <button id = "button_submit" type="submit" onClick={() => postMessage()}>Send</button>
            </div>
        </div>
    )
}
