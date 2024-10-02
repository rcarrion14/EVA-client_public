const Footer = () => {
  return (
    <div className="footer">
      <img className="nav-logo" src="./logoEverValue.png" />
      <div className="textoFooter">
        <span>Copyright © 2024. All rights reserved</span>
        <span>
          <span
            className="link"
            onClick={() => {
              window.open("https://evervaluecoin.com/privacy-policy/");
            }}
          >
            Privacy Policy
          </span>{" "}
          -{" "}
          <span
            className="link"
            onClick={() => {
              window.open("https://evervaluecoin.com/terms-of-use/");
            }}
          >
            Terms of Use
          </span>
        </span>
      </div>
      <div className="iconsFooter-container">
        <img
          onClick={() => {
            window.open("https://t.me/evervaluecoin");
          }}
          className="icon"
          src="./iconTelegram.png"
        />
        <img
          onClick={() => {
            window.open("https://twitter.com/evervaluecoin");
          }}
          className="icon"
          src="./iconTwitter.png"
        />
      </div>
    </div>
  );
};

export default Footer;
