import Identicon from "identicon.js";

const styles = {
  container: {
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid #ebebeb",
  },
};

export default function AccountModal(props) {
  return (
    <div className="modal d-block mt-5" tabIndex="-1" role="dialog">
      <div className="modal-dialog" style={{ width: "400px" }} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Account</h5>
            <button
              onClick={props.closeModal}
              type="button"
              className="close btn p-1"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true" className="h4">
                &times;
              </span>
            </button>
          </div>
          <div className="modal-body">
            <div style={styles.container} className="rounded px-3 py-2">
              <div className="mb-2">
                <img
                  className="mx-2 rounded"
                  width="30"
                  height="30"
                  src={`data:image/png;base64,${new Identicon(
                    props.userData.address,
                    30
                  ).toString()}`}
                  alt=""
                />
                <span style={{ fontSize: "18px" }}>
                  {props.formatter(props.userData.address)}
                </span>
                <a href="#">
                  <i
                    class="fa fa-clipboard mx-2"
                    style={{ fontSize: "22px" }}
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
              <div className="px-3 my-1">
                <a
                  style={{ textDecoration: "none" }}
                  href={
                    "https://etherscan.io//address/" +
                    props.userData.address.toString()
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <i
                    style={{ fontSize: "12px" }}
                    class="fa fa-external-link mx-1"
                    aria-hidden="true"
                  ></i>
                  <span style={{ fontSize: "14px" }}>View on Explorer</span>
                </a>
              </div>
            </div>
            <button
              className="btn btn-danger w-100 mt-3"
              onClick={props.loggout}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
