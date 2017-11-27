import React from 'react';
import { Alert } from 'react-bootstrap';
import { observer } from 'mobx-react';
import globalStore from '../stores/GlobalStore';

@observer
class Alerts2 extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    handleAlertDismiss = () => {
        globalStore.alertMsg = Object.assign(globalStore.alertMsg, { message: '', alertVisible: false });
    };

    render() {
        if (globalStore.alertMsg.alertVisible) {
            return (
                <div className="container ssc-alert">
                    <Alert bsStyle={globalStore.alertMsg.type} onDismiss={this.handleAlertDismiss}>
                        <p title={globalStore.alertMsg.message} className="alert-tip">
                            {globalStore.alertMsg.message}
                        </p>
                    </Alert>
                </div>
            );
        }
        return (<div />);
    }
}
export default Alerts2;
