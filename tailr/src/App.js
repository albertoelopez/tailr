import React from "react";
import './App.css';
// Python server
import Upload from "./components/upload.js"
// NodeJS server
import DataForm from "./components/home.js"

function App() {
    return (
        <>
            <div className="App">
                <header className="App-header">
                    <p>
                        TAILR
                    </p>
                    <DataForm />
                </header>
            </div>
        </>
    )
}

export default App;
