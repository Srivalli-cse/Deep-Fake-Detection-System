function Header() {
    return (
        <header className="header">
            <div className="logo">
                <div className="logo-icon">AI</div>

                <h2>
                    Deep<span>Detect</span>
                </h2>
            </div>

            <nav>
                <a href="#home">Home</a>
                <a href="#detector">Detector</a>
            </nav>
        </header>
    );
}

export default Header;