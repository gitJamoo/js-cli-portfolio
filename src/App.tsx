// Usage in your component
import React, { useState, useEffect } from "react";
import "./App.css";

const generateRandomLightColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  // Ensure the color is light
  return `rgb(${Math.min(r + 200, 255)}, ${Math.min(g + 200, 255)}, ${Math.min(
    b + 200,
    255
  )})`;
};

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("#D3D3D3");
  const [textColor, setTextColor] = useState<string>("#333333");
  const [rainbowMode, setRainbowMode] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>("Type a command");

  // Descriptions for commands
  const commands: Record<string, string> = {
    hello: "greets user",
    help: "lists commands",
    clear: "clears screen",
    secret: "???",
    rainbow: "find out",
    whois: "james smith info",
  };

  const validCommands = Object.keys(commands);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (rainbowMode) {
      intervalId = setInterval(() => {
        const randomColor1 = `#${Math.floor(Math.random() * 0xffffff).toString(
          16
        )}`;
        const randomColor2 = `#${Math.floor(Math.random() * 0xffffff).toString(
          16
        )}`;
        setBgColor(randomColor1);
        setTextColor(randomColor2);
      }, 100); // Change colors every 100 milliseconds
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [rainbowMode]);

  useEffect(() => {
    const placeholders = [
      "Type a command",
      "Type a command.",
      "Type a command..",
      "Type a command...",
    ];
    let index = 0;
    const placeholderInterval = setInterval(() => {
      setPlaceholder(placeholders[index]);
      index = (index + 1) % placeholders.length;
    }, 500); // Change placeholder every 500 milliseconds

    return () => clearInterval(placeholderInterval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setOutput("");
      setShowMenu(false); // Hide menu when input is cleared
    } else {
      const filteredCommands = validCommands.filter((command) =>
        command.startsWith(value.toLowerCase())
      );

      setSuggestions(filteredCommands);

      if (filteredCommands.length === 0) {
        setOutput(`Command '${value}' not recognized.`);
      } else if (
        filteredCommands.length === 1 &&
        filteredCommands[0] === value.toLowerCase()
      ) {
        switch (filteredCommands[0]) {
          case "hello":
            setOutput("Hi there, welcome to the CLI!");
            break;
          case "help":
            setOutput(
              "Available commands: hello, help, clear, secret, rainbow, asdasdasd, asdasdasd"
            );
            break;
          case "secret":
            setShowMenu(true);
            setOutput("");
            break;
          case "clear":
            setOutput("");
            setInput("");
            setSuggestions([]);
            setShowMenu(false); // Hide menu on clear command
            break;
          case "rainbow":
            setShowModal(true); // Show modal when "rainbow" command is executed
            setOutput("");
            break;
          case "whois":
            setOutput("whois");
            break;
          default:
            setOutput("");
            break;
        }
      } else {
        setOutput("");
        setShowMenu(value.toLowerCase() === "secret"); // Show menu only if text is "secret"
      }
    }
  };

  const handleSuggestionClick = (command: string) => {
    setInput(command);
    setSuggestions([]);
    handleChange({
      target: { value: command },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  const handleModalConfirm = () => {
    setRainbowMode(true);
    setShowModal(false);
    setOutput("Rainbow mode activated.");
  };

  const handleModalClose = () => {
    setShowModal(false);
    setRainbowMode(false);
    setOutput("Rainbow mode canceled.");
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgColor(e.target.value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  return (
    <div className="App" style={{ backgroundColor: bgColor, color: textColor }}>
      <header className="App-header">
        <h1>James Smith</h1>
        <h4>Software Developer | Student Athlete</h4>
        <p>
          <a href="mailto:james.smith@example.com">Email</a> | Resume (
          <a href="/path/to/resume.pdf" download="James_Smith_Resume.pdf">
            download
          </a>{" "}
          -{" "}
          <a
            href="/path/to/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            view
          </a>
          ) |{" "}
          <a
            href="https://www.linkedin.com/in/jamessmith"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>{" "}
          |{" "}
          <a
            href="https://www.linkedin.com/in/jamessmith"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>{" "}
        </p>
        <p></p>
      </header>
      <main>
        <div className="cli-container">
          <div className="cli-output">
            <pre>{output}</pre>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder={placeholder}
              autoFocus
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((command, index) => (
                <li key={index} onClick={() => handleSuggestionClick(command)}>
                  {command} - {commands[`${command}`]}
                </li>
              ))}
            </ul>
          )}
          {showMenu && (
            <div className="menu">
              <h2>Change CSS Values</h2>
              <div>
                <label>
                  Background Color:
                  <input
                    type="color"
                    value={bgColor}
                    onChange={handleBgColorChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  Text Color:
                  <input
                    type="color"
                    value={textColor}
                    onChange={handleTextColorChange}
                  />
                </label>
              </div>
            </div>
          )}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Sensitivity Warning</h2>
                <p>
                  Rainbow mode can cause visual discomfort. Please use with
                  caution.
                </p>
                <button onClick={handleModalConfirm}>Okay</button>
                <button onClick={handleModalClose}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="footer">
        <p>
          © 2024 James Smith. All rights reserved.{" "}
          <a href="" target="_blank" rel="noopener noreferrer">
            Source Code
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default App;
