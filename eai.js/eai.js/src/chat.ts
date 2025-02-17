interface Message {
    content: string;
    timestamp: Date;
    type: number;
}

const messages: Message[] = [];

const chatContainer = document.createElement('div');
chatContainer.className = 'chat-container';

const messageList = document.createElement('div');
messageList.className = 'message-list';

const chatForm = document.createElement('form');
chatForm.className = 'chat-form';

const messageInput = document.createElement('input');
messageInput.type = 'text';
messageInput.placeholder = 'Enter message...';
messageInput.required = true;

const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Send';

chatForm.appendChild(messageInput);
chatForm.appendChild(submitButton);

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const messageContent = messageInput.value.trim();
    const messageType = 1;
    if (messageContent) {
        const newMessage: Message = {
            content: messageContent,
            timestamp: new Date(),
            type: messageType,
        };
        messages.push(newMessage);
        displayMessages();
        messageInput.value = '';
    }
});

function displayMessages() {
    messageList.innerHTML = '';
    messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';

        if (message.type === 1) {
            messageElement.classList.add('right');
        } else if (message.type === 2) {
            messageElement.classList.add('left');
        } else {
            messageElement.classList.add('center');
        }

        messageElement.textContent = `${message.timestamp.toLocaleTimeString()}: ${message.content}`;
        messageList.appendChild(messageElement);
    });
}

chatContainer.appendChild(messageList);
chatContainer.appendChild(chatForm);

export function setupChat(element: HTMLButtonElement) {
    element.appendChild(chatContainer);
}


const style = document.createElement('style');
style.textContent = `
    .chat-container {
        width: 400px;
        margin: 20px auto;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
    }

    .message-list {
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 10px;
    }

    .message {
        padding: 5px;
        border-bottom: 1px solid #eee;
    }
    
    .left {
        text-align: left;
    }

    .right {
        text-align: right;
    }

    .center {
        text-align: center;
    }

    .chat-form {
        display: flex;
    }

    .chat-form input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .chat-form button {
        padding: 10px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
`;
document.head.appendChild(style);