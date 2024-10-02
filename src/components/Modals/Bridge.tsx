interface IProps {
  setIsModalOpen: any;
}

const Bridge: React.FC<IProps> = ({ setIsModalOpen }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="container-notice">
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className="closeX_notice"
          >
            &times;
          </div>
          <div className="notice-title">Important Notice:</div>

          <img className="Bridge" src="./Bridge with text.png" alt="" />

          <div className="notice-text">
            Do you want to interact with the EVA token but don't have enough
            funds on the Arbitrum network? No worries! We make it easy to buy
            EVA or other Arbitrum tokens quickly and securely.
          </div>
          <div className="notice-text">
            Our team provides a real-time, fair quote and sends the tokens
            directly to you.
          </div>

          <img
            onClick={() => {
              window.open("https://t.me/EverValueTeam");
            }}
            className="botonTG"
            src="./Botón TG.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Bridge;
