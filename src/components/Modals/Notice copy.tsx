interface IProps {
  setIsModalOpen: any;
}

const Notice: React.FC<IProps> = ({ setIsModalOpen }) => {
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

          <div className="notice-text">
            We are pleased to inform you that we are currently developing our
            application, which will be available soon. We appreciate your
            patience and understanding as we finalize the last details to
            provide the best possible experience.
          </div>
          <div className="notice-text">
            To stay informed about the project's progress and receive updates
            firsthand, we invite you to join our{" "}
            <span
              onClick={() => {
                window.open("https://t.me/evervaluecoin");
              }}
              className="linkNaranja"
            >
              Telegram channel.
            </span>{" "}
            Join us and be part of our community!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
