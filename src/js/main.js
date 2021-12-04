// Shell Navigation Functionality
var prevCommands = [];
var commandIndex = -1;
var commandHistory = document.getElementById("command-history");
var commandLine = document.getElementById("command-line");
var prevCommandTemplate = document.getElementById("prev-command-template");
var asciiIndex = -1;

function Command(command, output) {
    this.command = command;
    this.output = output;
};

// Handles command line actions
commandLine.addEventListener("keyup", function(event) {
    event.preventDefault();
    // On enter: reads and handles command line value
    if (event.key === "Enter") {
        var input = document.getElementById("command-line").value;
        event.currentTarget.value = "";
        var c = handleCommand(input);
        if (c === "clear") {
            var parent = commandHistory;
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
        else if (c != null) {
            prevCommands.push(c);
            commandIndex += 1;
            var clone = prevCommandTemplate.content.cloneNode(true);
            clone.querySelector(".prev-command-text").innerText = c.command;
            clone.querySelector(".prev-command-output-text").innerText = c.output;
            commandHistory.appendChild(clone);
        commandIndex = prevCommands.length-1;
        }
    // Handles up and down navigation of command line history
    } else if (event.key === "ArrowUp") {
        if (commandIndex > -1) {
            event.currentTarget.value = prevCommands[commandIndex].command;
            commandIndex -= 1;
        }
    } else if (event.key === "ArrowDown") {
        if (commandIndex == prevCommands.length-1) {
            event.currentTarget.value = "";
        } else if ((commandIndex >= -1) && (commandIndex < prevCommands.length)) {
            commandIndex += 1;
            event.currentTarget.value = prevCommands[commandIndex].command;
        }
    }
});

// Parses and handles CLI input
function handleCommand(input) {
    var tokens = input.split(" ");
    var output;
    if (input === "") {
        return null;
    }
    switch (tokens[0]) {
        case "--help":
            output = helpMessage;
            break;
        case "clear":
            return "clear";
        case "pwd":
            output = document.location.href.match(/[^\/]+$/)[0];
            break;
        case "ls":
            output = ls[document.location.href.match(/[^\/]+$/)[0]];
            break;
        case "hello":
            asciiIndex = (asciiIndex >= ascii.length-1) ? 0 : (asciiIndex + 1);
            output = ascii[asciiIndex]
            break;
        case "cd":
            if ((tokens.length > 1) && (tokens[1] in cd)) {
                output = "Redirecting ...";
                window.location = cd[tokens[1]];
            } else if (!(tokens[1] in cd)){
                output = `cd: ${tokens[1]}: No such page.`;
            } else {
                output = "";
            }
            break;
        default:
            output = `${tokens[0]}: command not found. Type --help to see commands.`;
    }
    return new Command(input, output)
}

// Constants
const ascii = [
    `
    |￣￣￣￣￣￣￣￣￣￣￣|
   Thanks for stopping by!
    |＿＿＿＿＿＿＿＿＿＿＿|
   ⠀⠀⠀⠀⠀⠀(\\__/) ||
   ⠀⠀⠀⠀⠀ ⠀(•ㅅ•) ||
   ⠀⠀⠀⠀⠀⠀/ 　 づ

   `,
   `
   __
   (___()'\`; woof
   /,\u00A0\u00A0\u00A0\u00A0\u00A0/\`
   \\\\'--\\\\

   `,
   `
    {\\__/} ･ ·̩\u00A0\u00A0｡\u00A0\u00A0☆
    ( •ω•) ＊ ｡*\u00A0\u00A0+ ･ ｡
    /つ 🍪 nice one! \u00A0･

    `
]

const helpMessage = `
Hi! Welcome to the Tiny Terminal, an alternate way to navigate my website.

This mini shell supports basic Linux navigation commands. See the supported list below.

--help\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0View this list.
clear\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Clear shell output.
pwd\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0View current location.
ls\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0View linked pages.
cd [arg]\u00A0\u00A0\u00A0\u00A0Navigate to page.
hello\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0?

Up and down arrow keys can be used to navigate through command history.

`
const tab = "\u00A0\u00A0\u00A0\u00A0";
const ls = {
    "index.html": `about${tab}projects${tab}resume`,
    "projects.html": `about${tab}projects${tab}resume
    bombardiers${tab}foldable-scooter${tab}looma-education`
}
const cd = {
    "home": "index.html",
    "about": "about.html",
    "projects": "projects.html",
    "resume": "resume.html",
    "bombardiers": "bombardiers.html",
    "foldable-scooter": "scooter.html",
    "looma-education": "looma.html"
}