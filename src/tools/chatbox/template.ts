const sendIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 448 448">
        <path d="M438.731,209.463l-416-192c-6.624-3.008-14.528-1.216-19.136,4.48c-4.64,5.696-4.8,13.792-0.384,19.648l136.8,182.4    l-136.8,182.4c-4.416,5.856-4.256,13.984,0.352,19.648c3.104,3.872,7.744,5.952,12.448,5.952c2.272,0,4.544-0.48,6.688-1.472    l416-192c5.696-2.624,9.312-8.288,9.312-14.528S444.395,212.087,438.731,209.463z"/>
    </svg>
`

const maleUserIcon = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
        <circle style="fill:#ECEFF1;" cx="256" cy="256" r="256"/>
        <path style="fill:#455A64;" d="M442.272,405.696c-11.136-8.8-24.704-15.136-39.424-18.208l-70.176-14.08
            c-7.36-1.408-12.672-8-12.672-15.68v-16.096c4.512-6.336,8.768-14.752,13.216-23.552c3.456-6.816,8.672-17.088,11.264-19.744
            c14.208-14.272,27.936-30.304,32.192-50.976c3.968-19.392,0.064-29.568-4.512-37.76c0-20.448-0.64-46.048-5.472-64.672
            c-0.576-25.216-5.152-39.392-16.672-51.808c-8.128-8.8-20.096-10.848-29.728-12.48c-3.776-0.64-8.992-1.536-10.912-2.56
            c-17.056-9.216-33.92-13.728-54.048-14.08c-42.144,1.728-93.952,28.544-111.296,76.352c-5.376,14.56-4.832,38.464-4.384,57.664
            l-0.416,11.552c-4.128,8.064-8.192,18.304-4.192,37.76c4.224,20.704,17.952,36.768,32.416,51.232
            c2.368,2.432,7.712,12.8,11.232,19.648c4.512,8.768,8.8,17.152,13.312,23.456v16.096c0,7.648-5.344,14.24-12.736,15.68l-70.24,14.08
            c-14.624,3.104-28.192,9.376-39.296,18.176c-3.456,2.784-5.632,6.848-5.984,11.264s1.12,8.736,4.096,12.032
            C115.648,481.728,184.224,512,256,512s140.384-30.24,188.16-83.008c2.976-3.296,4.48-7.648,4.096-12.064
            C447.904,412.512,445.728,408.448,442.272,405.696z"
        />
    </svg>
`

const femaleUserIcon = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
        <circle style="fill:#ECEFF1;" cx="256" cy="256" r="256"/>
        <path style="fill:#455A64;" d="M442.272,405.728c-11.136-8.8-24.704-15.136-39.424-18.208l-70.176-14.08
            C325.312,372,320,365.408,320,357.76v-18.24c69.92-6.688,80-20.96,80-35.52c0-43.04-28.608-142.976-33.312-159.232
            c-0.608-25.12-5.184-39.232-16.672-51.616c-8.128-8.8-20.096-10.848-29.728-12.48c-3.776-0.672-8.992-1.536-10.912-2.592
            c-17.056-9.216-33.92-13.696-54.048-14.08c-42.144,1.728-93.952,28.544-111.68,77.568C142.368,146.144,112,254.368,112,304
            c0,20.704,23.392,31.616,80,36.608v17.152c0,7.648-5.344,14.24-12.736,15.68l-70.24,14.08c-14.624,3.104-28.192,9.376-39.296,18.176
            c-3.456,2.784-5.632,6.848-5.984,11.264s1.12,8.736,4.096,12.032C115.648,481.76,184.224,512,256,512s140.384-30.24,188.16-83.008
            c2.976-3.296,4.48-7.648,4.096-12.064C447.904,412.544,445.728,408.48,442.272,405.728z"
        />
    </svg>
`

export const template = `<div class="center">
    <div class="chat">
        <div class="contact bar">
            <div class="pic male">${maleUserIcon}</div>
            <div class="pic female">${femaleUserIcon}</div>
            <div class="name">
                Mr. Anonymous
            </div>
            <div class="seen">
                Last seen at 13:56
            </div>
        </div>
        <div class="chatBody">
            <div class="time">
                Today at 13:56
            </div>
            <div class="messages">
                <!--

                <div class="message party">
                    Hello, how are you.
                </div>
                <div class="message counterparty">
                    I'm fine. What about you?
                </div>
                <div class="message party">
                    I'm great. Did you see that ludicrous display last night?
                </div>
                <div class="message party">
                    I couldn't believe it.
                </div>
                <div class="message counterparty">
                    Yes, it was absolutely unexpected.
                </div>
                <div class="message counterparty">
                    <div class="typing typing-1"></div>
                    <div class="typing typing-2"></div>
                    <div class="typing typing-3"></div>
                </div>

                -->
            </div>
        </div>
        <div class="input">
            <i class="fas fa-camera"></i>
            <i class="far fa-laugh-beam"></i>
            <input placeholder="Type your message here!" type="text" class="chatTextInput" />
            <!--
            <i class="fas fa-microphone"></i>
            -->
            <div class="sendIcon">
                ${sendIcon}
            </div>
        </div>
    </div>
</div>`

export const styles = `

    @import url("https://fonts.googleapis.com/css?family=Red+Hat+Display:400,500,900&display=formula");
    /*
    body, html {
        font-family: Red hat Display, sans-serif;
        font-weight: 400;
        line-height: 1.25em;
        letter-spacing: 0.025em;
        color: #333;
        background: #F7F7F7;
    }
    */

    .center {
        position: absolute;
        bottom: 0px;
        right: 8px

        /*
        top: 50%;
        left: calc(50% + 12rem);
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        */
    }

    .pic {
        width: 4rem;
        height: 4rem;
        background-size: cover;
        background-position: center;
        border-radius: 50%;
    }

    .contact {
        position: relative;
        margin-bottom: 1rem;
        padding-left: 5rem;
        height: 4.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .contact .pic {
        position: absolute;
        left: 0;
    }
    .contact .name {
        font-weight: 500;
        margin-bottom: 0.125rem;
    }
    .contact .message, .contact .seen {
        font-size: 0.9rem;
        color: #999;
    }
    .contact .badge {
        box-sizing: border-box;
        position: absolute;
        width: 1.5rem;
        height: 1.5rem;
        text-align: center;
        font-size: 0.9rem;
        padding-top: 0.125rem;
        border-radius: 1rem;
        top: 0;
        left: 2.5rem;
        background: #333;
        color: white;
    }

    .contacts {
        position: absolute;
        top: 50%;
        left: 0;
        -webkit-transform: translate(-6rem, -50%);
                        transform: translate(-6rem, -50%);
        width: 24rem;
        height: 32rem;
        padding: 1rem 2rem 1rem 1rem;
        box-sizing: border-box;
        border-radius: 1rem 0 0 1rem;
        cursor: pointer;
        background: white;
        box-shadow: 0 0 8rem 0 rgba(0, 0, 0, 0.1), 2rem 2rem 4rem -3rem rgba(0, 0, 0, 0.5);
        transition: -webkit-transform 500ms;
        transition: transform 500ms;
        transition: transform 500ms, -webkit-transform 500ms;
    }
    .contacts h2 {
        margin: 0.5rem 0 1.5rem 5rem;
    }
    .contacts .fa-bars {
        position: absolute;
        left: 2.25rem;
        color: #999;
        transition: color 200ms;
    }
    .contacts .fa-bars:hover {
        color: #666;
    }
    .contacts .contact:last-child {
        margin: 0;
    }
    .contacts:hover {
        -webkit-transform: translate(-23rem, -50%);
        transform: translate(-23rem, -50%);
    }

    .chat {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 24rem;
        height: 38rem;
        z-index: 2;
        box-sizing: border-box;
        border-radius: 1rem;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        background: white;
        box-shadow: 0 0 25px 0 rgb(0 0 0 / 10%), 0 5px 15px 0px rgb(0 0 0 / 50%);
    }
    .chat .contact.bar {
        flex-basis: 3.5rem;
        flex-shrink: 0;
        margin: 1rem;
        box-sizing: border-box;
    }
    .chat .chatBody {
        padding: 1rem;
        background: #F7F7F7;
        flex-shrink: 2;
        overflow-y: auto;
        box-shadow: inset 0 2rem 2rem -2rem rgba(0, 0, 0, 0.05), inset 0 -2rem 2rem -2rem rgba(0, 0, 0, 0.05);
        min-height: calc(100% - 184px);
    }
    .chat .chatBody .time {
        font-size: 0.8rem;
        background: #EEE;
        padding: 0.25rem 1rem;
        border-radius: 2rem;
        color: #999;
        width: -webkit-fit-content;
        width: -moz-fit-content;
        width: fit-content;
        margin: 0 auto;
    }
    .chat .chatBody .messages .message {
        box-sizing: border-box;
        padding: 0.5rem 1rem;
        min-height: 2.25rem;
        width: -webkit-fit-content;
        width: -moz-fit-content;
        width: fit-content;
        max-width: 66%;
        box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075), 0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);
        word-break: break-word;
    }
    .chat .chatBody .messages .message.party {
        margin: 1rem;
        border-radius: 1.125rem 1.125rem 1.125rem 0;
        background: #FFF;
    }
    .chat .chatBody .messages .message.counterparty {
        margin: 1rem 1rem 1rem auto;
        border-radius: 1.125rem 1.125rem 0 1.125rem;
        background: #333;
        color: white;
    }
    .chat .chatBody .messages .message .typing {
        display: inline-block;
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0rem;
        box-sizing: border-box;
        background: #ccc;
        border-radius: 50%;
    }
    .chat .chatBody .messages .message .typing.typing-1 {
        -webkit-animation: typing 3s infinite;
        animation: typing 3s infinite;
    }
    .chat .chatBody .messages .message .typing.typing-2 {
        -webkit-animation: typing 3s 250ms infinite;
        animation: typing 3s 250ms infinite;
    }
    .chat .chatBody .messages .message .typing.typing-3 {
        -webkit-animation: typing 3s 500ms infinite;
        animation: typing 3s 500ms infinite;
    }
    .chat .input .sendIcon {
        margin-right: 0.5rem;
        width: 24px;
        height: 24px;
        fill: #666;
    }
    .chat .input .sendIcon:hover {
        fill: #006cff;
        cursor: pointer;
    }
    .chat .input {
        box-sizing: border-box;
        flex-basis: 4rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 0 0.5rem 0 1.5rem;
    }
    .chat .input i {
        font-size: 1.5rem;
        margin-right: 1rem;
        color: #666;
        cursor: pointer;
        transition: color 200ms;
    }
    .chat .input i:hover {
        color: #333;
    }
    .chat .input input {
        border: none;
        background-image: none;
        background-color: white;
        padding: 0.5rem 1rem;
        margin-right: 1rem;
        border-radius: 1.125rem;
        flex-grow: 2;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1), 0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.2);
        font-family: Red hat Display, sans-serif;
        font-weight: 400;
        letter-spacing: 0.025em;
    }
    .chat .input input:placeholder {
        color: #999;
    }

    @-webkit-keyframes typing {
        0%, 75%, 100% {
            -webkit-transform: translate(0, 0.25rem) scale(0.9);
            transform: translate(0, 0.25rem) scale(0.9);
            opacity: 0.5;
        }
        25% {
            -webkit-transform: translate(0, -0.25rem) scale(1);
            transform: translate(0, -0.25rem) scale(1);
            opacity: 1;
        }
    }

    @keyframes typing {
        0%, 75%, 100% {
            -webkit-transform: translate(0, 0.25rem) scale(0.9);
            transform: translate(0, 0.25rem) scale(0.9);
            opacity: 0.5;
        }
        25% {
            -webkit-transform: translate(0, -0.25rem) scale(1);
            transform: translate(0, -0.25rem) scale(1);
            opacity: 1;
        }
    }
`
