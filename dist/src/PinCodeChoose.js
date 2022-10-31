"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const PinCode_1 = __importStar(require("./PinCode"));
const utils_1 = require("./utils");
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const Keychain = __importStar(require("react-native-keychain"));
class PinCodeChoose extends React.PureComponent {
    static defaultProps = {
        styleContainer: null
    };
    constructor(props) {
        super(props);
        this.state = { status: PinCode_1.PinStatus.choose, pinCode: '' };
        this.endProcessCreation = this.endProcessCreation.bind(this);
        this.endProcessConfirm = this.endProcessConfirm.bind(this);
    }
    endProcessCreation = (pinCode, isErrorValidation) => {
        this.setState({
            pinCode: isErrorValidation ? '' : pinCode,
            status: isErrorValidation ? PinCode_1.PinStatus.choose : PinCode_1.PinStatus.confirm
        });
    };
    endProcessConfirm = async (pinCode) => {
        if (pinCode === this.state.pinCode) {
            if (this.props.storePin) {
                this.props.storePin(pinCode);
            }
            else {
                await Keychain.setInternetCredentials(this.props.pinCodeKeychainName, this.props.pinCodeKeychainName, pinCode, utils_1.noBiometricsConfig);
            }
            if (!!this.props.finishProcess)
                this.props.finishProcess(pinCode);
        }
        else {
            this.setState({ status: PinCode_1.PinStatus.choose });
        }
    };
    cancelConfirm = () => {
        this.setState({ status: PinCode_1.PinStatus.choose });
    };
    render() {
        return (<react_native_1.View style={[
                styles.container,
                this.props.styleContainer
            ]}>
        {this.state.status === PinCode_1.PinStatus.choose && (<PinCode_1.default alphabetCharsVisible={this.props.alphabetCharsVisible} buttonDeleteComponent={this.props.buttonDeleteComponent || null} buttonDeleteText={this.props.buttonDeleteText} buttonNumberComponent={this.props.buttonNumberComponent || null} colorCircleButtons={this.props.colorCircleButtons} colorPassword={this.props.colorPassword || undefined} colorPasswordEmpty={this.props.colorPasswordEmpty} colorPasswordError={this.props.colorPasswordError || undefined} customBackSpaceIcon={this.props.customBackSpaceIcon} emptyColumnComponent={this.props.emptyColumnComponent} endProcess={this.endProcessCreation} getCurrentLength={this.props.getCurrentLength} iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled} numbersButtonOverlayColor={this.props.numbersButtonOverlayColor || undefined} passwordComponent={this.props.passwordComponent || null} passwordLength={this.props.passwordLength || 4} pinCodeVisible={this.props.pinCodeVisible} sentenceTitle={this.props.titleChoose} status={PinCode_1.PinStatus.choose} styleAlphabet={this.props.styleAlphabet} styleButtonCircle={this.props.styleButtonCircle} styleCircleHiddenPassword={this.props.styleCircleHiddenPassword} styleCircleSizeEmpty={this.props.styleCircleSizeEmpty} styleCircleSizeFull={this.props.styleCircleSizeFull} styleColorButtonTitle={this.props.styleColorButtonTitle} styleColorButtonTitleSelected={this.props.styleColorButtonTitleSelected} styleColorSubtitle={this.props.styleColorSubtitle} styleColorSubtitleError={this.props.styleColorSubtitleError} styleColorTitle={this.props.styleColorTitle} styleColorTitleError={this.props.styleColorTitleError} styleColumnButtons={this.props.styleColumnButtons} styleColumnDeleteButton={this.props.styleColumnDeleteButton} styleContainer={this.props.styleContainerPinCode} styleDeleteButtonColorHideUnderlay={this.props.styleDeleteButtonColorHideUnderlay} styleDeleteButtonColorShowUnderlay={this.props.styleDeleteButtonColorShowUnderlay} styleDeleteButtonIcon={this.props.styleDeleteButtonIcon} styleDeleteButtonSize={this.props.styleDeleteButtonSize} styleDeleteButtonText={this.props.styleDeleteButtonText} styleEmptyColumn={this.props.styleEmptyColumn} stylePinCodeCircle={this.props.stylePinCodeCircle} styleRowButtons={this.props.styleRowButtons} styleTextButton={this.props.styleTextButton} styleTextSubtitle={this.props.styleTextSubtitle} styleTextTitle={this.props.styleTextTitle} styleViewTitle={this.props.styleViewTitle} subtitle={this.props.subtitleChoose} subtitleComponent={this.props.subtitleComponent || null} subtitleError={this.props.subtitleError || 'Please try again'} textPasswordVisibleFamily={this.props.textPasswordVisibleFamily} textPasswordVisibleSize={this.props.textPasswordVisibleSize} titleComponent={this.props.titleComponent || null} titleValidationFailed={this.props.titleValidationFailed || 'PIN code unsafe'} validationRegex={this.props.validationRegex} vibrationEnabled={this.props.vibrationEnabled}/>)}
        {this.state.status === PinCode_1.PinStatus.confirm && (<PinCode_1.default alphabetCharsVisible={this.props.alphabetCharsVisible} buttonDeleteComponent={this.props.buttonDeleteComponent || null} buttonDeleteText={this.props.buttonDeleteText} buttonNumberComponent={this.props.buttonNumberComponent || null} cancelFunction={this.cancelConfirm} colorCircleButtons={this.props.colorCircleButtons} colorPassword={this.props.colorPassword || undefined} colorPasswordEmpty={this.props.colorPasswordEmpty} colorPasswordError={this.props.colorPasswordError || undefined} customBackSpaceIcon={this.props.customBackSpaceIcon} emptyColumnComponent={this.props.emptyColumnComponent} endProcess={this.endProcessConfirm} getCurrentLength={this.props.getCurrentLength} iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled} numbersButtonOverlayColor={this.props.numbersButtonOverlayColor || undefined} passwordComponent={this.props.passwordComponent || null} passwordLength={this.props.passwordLength || 4} pinCodeVisible={this.props.pinCodeVisible} previousPin={this.state.pinCode} sentenceTitle={this.props.titleConfirm} status={PinCode_1.PinStatus.confirm} subtitle={this.props.subtitleConfirm} subtitleComponent={this.props.subtitleComponent || null} subtitleError={this.props.subtitleError || 'Please try again'} textPasswordVisibleFamily={this.props.textPasswordVisibleFamily} textPasswordVisibleSize={this.props.textPasswordVisibleSize} titleAttemptFailed={this.props.titleAttemptFailed || 'Incorrect PIN Code'} titleComponent={this.props.titleComponent || null} titleConfirmFailed={this.props.titleConfirmFailed || 'Your entries did not match'} styleAlphabet={this.props.styleAlphabet} styleButtonCircle={this.props.styleButtonCircle} styleCircleHiddenPassword={this.props.styleCircleHiddenPassword} styleCircleSizeEmpty={this.props.styleCircleSizeEmpty} styleCircleSizeFull={this.props.styleCircleSizeFull} styleColorButtonTitle={this.props.styleColorButtonTitle} styleColorButtonTitleSelected={this.props.styleColorButtonTitleSelected} styleColorSubtitle={this.props.styleColorSubtitle} styleColorSubtitleError={this.props.styleColorSubtitleError} styleColorTitle={this.props.styleColorTitle} styleColorTitleError={this.props.styleColorTitleError} styleColumnButtons={this.props.styleColumnButtons} styleColumnDeleteButton={this.props.styleColumnDeleteButton} styleContainer={this.props.styleContainerPinCode} styleDeleteButtonColorHideUnderlay={this.props.styleDeleteButtonColorHideUnderlay} styleDeleteButtonColorShowUnderlay={this.props.styleDeleteButtonColorShowUnderlay} styleDeleteButtonIcon={this.props.styleDeleteButtonIcon} styleDeleteButtonSize={this.props.styleDeleteButtonSize} styleDeleteButtonText={this.props.styleDeleteButtonText} styleEmptyColumn={this.props.styleEmptyColumn} stylePinCodeCircle={this.props.stylePinCodeCircle} styleRowButtons={this.props.styleRowButtons} styleTextButton={this.props.styleTextButton} styleTextSubtitle={this.props.styleTextSubtitle} styleTextTitle={this.props.styleTextTitle} styleViewTitle={this.props.styleViewTitle} vibrationEnabled={this.props.vibrationEnabled} delayBetweenAttempts={this.props.delayBetweenAttempts}/>)}
      </react_native_1.View>);
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
exports.default = PinCodeChoose;
