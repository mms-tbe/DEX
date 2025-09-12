function TokenModal(props) {
    return (
        <div className="modal d-block mt-5" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Select token</h5>
                <button onClick={props.closeModal}  type="button" className="close btn p-1" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" className='h4'>&times;</span>
                </button>
            </div>
            <div style={{padding: '0'}} className="modal-body">
                <div style={{ overflow: "auto", height: "500px" }} id="token_list">
                    { !props.tokens
                    ? null
                    : Object.keys(props.tokens).map((token, index) => (
                        <div onClick={() => { props.setToken(props.tokens[token]); props.closeModal() }} className="token-row" key={index}>
                            <img className="token-list-img" src={props.tokens[token].logoURI} />
                            <span className="ms-2 token-list-text">{props.tokens[token].name}</span>
                        </div>
                    ))
                    }
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}



export default TokenModal