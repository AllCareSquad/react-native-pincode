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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinStatus = void 0;
const delay_1 = __importDefault(require("./delay"));
const colors_1 = require("./design/colors");
const grid_1 = require("./design/grid");
const d3_ease_1 = require("d3-ease");
const _ = __importStar(require("lodash"));
const React = __importStar(require("react"));
const Animate_1 = __importDefault(require("react-move/Animate"));
const react_native_1 = require("react-native");
const react_native_easy_grid_1 = require("react-native-easy-grid");
const MaterialIcons_1 = __importDefault(require("react-native-vector-icons/MaterialIcons"));
var PinStatus;
(function (PinStatus) {
    PinStatus["choose"] = "choose";
    PinStatus["confirm"] = "confirm";
    PinStatus["enter"] = "enter";
})(PinStatus = exports.PinStatus || (exports.PinStatus = {}));
class PinCode extends React.PureComponent {
    static defaultProps = {
        alphabetCharsVisible: false,
        styleButtonCircle: null,
        colorCircleButtons: "rgb(242, 245, 251)",
        styleDeleteButtonColorHideUnderlay: "rgb(211, 213, 218)",
        numbersButtonOverlayColor: colors_1.colors.turquoise,
        styleDeleteButtonColorShowUnderlay: colors_1.colors.turquoise,
        styleTextButton: null,
        styleColorButtonTitleSelected: colors_1.colors.white,
        styleColorButtonTitle: colors_1.colors.grey,
        colorPasswordError: colors_1.colors.alert,
        colorPassword: colors_1.colors.turquoise,
        styleCircleHiddenPassword: null,
        styleColumnDeleteButton: null,
        styleDeleteButtonIcon: "backspace",
        styleDeleteButtonSize: 30,
        styleDeleteButtonText: null,
        buttonDeleteText: "delete",
        styleTextTitle: null,
        styleTextSubtitle: null,
        styleContainer: null,
        styleColorTitle: colors_1.colors.grey,
        styleColorSubtitle: colors_1.colors.grey,
        styleColorTitleError: colors_1.colors.alert,
        styleColorSubtitleError: colors_1.colors.alert,
        styleViewTitle: null,
        styleRowButtons: null,
        styleColumnButtons: null,
        styleEmptyColumn: null,
        textPasswordVisibleFamily: "system font",
        textPasswordVisibleSize: 22,
        vibrationEnabled: true,
        delayBetweenAttempts: 3000,
    };
    _circleSizeEmpty;
    _circleSizeFull;
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            moveData: { x: 0, y: 0 },
            showError: false,
            textButtonSelected: "",
            colorDelete: this.props.styleDeleteButtonColorHideUnderlay,
            attemptFailed: false,
            changeScreen: false
        };
        this._circleSizeEmpty = this.props.styleCircleSizeEmpty || 4;
        this._circleSizeFull =
            this.props.styleCircleSizeFull || (this.props.pinCodeVisible ? 6 : 8);
    }
    componentDidMount() {
        if (this.props.getCurrentLength)
            this.props.getCurrentLength(0);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.pinCodeStatus !== "failure" &&
            this.props.pinCodeStatus === "failure") {
            this.failedAttempt();
        }
        if (prevProps.pinCodeStatus !== "locked" &&
            this.props.pinCodeStatus === "locked") {
            this.setState({ password: "" });
        }
    }
    failedAttempt = async () => {
        await (0, delay_1.default)(300);
        this.setState({
            showError: true,
            attemptFailed: true,
            changeScreen: false
        });
        this.doShake();
        await (0, delay_1.default)(this.props.delayBetweenAttempts);
        this.newAttempt();
    };
    newAttempt = async () => {
        this.setState({ changeScreen: true });
        await (0, delay_1.default)(200);
        this.setState({
            changeScreen: false,
            showError: false,
            attemptFailed: false,
            password: ""
        });
    };
    onPressButtonNumber = async (text) => {
        const currentPassword = this.state.password + text;
        this.setState({ password: currentPassword });
        if (this.props.getCurrentLength)
            this.props.getCurrentLength(currentPassword.length);
        if (currentPassword.length === this.props.passwordLength) {
            switch (this.props.status) {
                case PinStatus.choose:
                    if (this.props.validationRegex &&
                        this.props.validationRegex.test(currentPassword)) {
                        this.showError(true);
                    }
                    else {
                        this.endProcess(currentPassword);
                    }
                    break;
                case PinStatus.confirm:
                    if (currentPassword !== this.props.previousPin) {
                        this.showError();
                    }
                    else {
                        this.endProcess(currentPassword);
                    }
                    break;
                case PinStatus.enter:
                    this.props.endProcess(currentPassword);
                    await (0, delay_1.default)(300);
                    break;
                default:
                    break;
            }
        }
    };
    renderButtonNumber = (text) => {
        let alphanumericMap = new Map([
            ["1", " "],
            ["2", "ABC"],
            ["3", "DEF"],
            ["4", "GHI"],
            ["5", "JKL"],
            ["6", "MNO"],
            ["7", "PQRS"],
            ["8", "TUV"],
            ["9", "WXYZ"],
            ["0", " "]
        ]);
        const disabled = (this.state.password.length === this.props.passwordLength ||
            this.state.showError) &&
            !this.state.attemptFailed;
        return (<Animate_1.default show={true} start={{
                opacity: 1
            }} update={{
                opacity: [
                    this.state.showError && !this.state.attemptFailed ? 0.5 : 1
                ],
                timing: { duration: 200, ease: d3_ease_1.easeLinear }
            }}>
        {({ opacity }) => (<react_native_1.TouchableHighlight style={[
                    styles.buttonCircle,
                    { backgroundColor: this.props.colorCircleButtons },
                    this.props.styleButtonCircle,
                ]} underlayColor={this.props.numbersButtonOverlayColor} disabled={disabled} onShowUnderlay={() => this.setState({ textButtonSelected: text })} onHideUnderlay={() => this.setState({ textButtonSelected: "" })} onPress={() => {
                    this.onPressButtonNumber(text);
                }} accessible accessibilityLabel={text}>
            <react_native_1.View>
            <react_native_1.Text style={[
                    styles.text,
                    this.props.styleTextButton,
                    {
                        opacity: opacity,
                        color: this.state.textButtonSelected === text
                            ? this.props.styleColorButtonTitleSelected
                            : this.props.styleColorButtonTitle
                    }
                ]}>
              {text}
            </react_native_1.Text>
            {((this.props.alphabetCharsVisible) &&
                    <react_native_1.Text style={[
                            styles.tinytext,
                            this.props.styleAlphabet,
                            {
                                opacity: opacity,
                                color: this.state.textButtonSelected === text
                                    ? this.props.styleColorButtonTitleSelected
                                    : this.props.styleColorButtonTitle
                            }
                        ]}>
                {alphanumericMap.get(text)}
              </react_native_1.Text>)}
            </react_native_1.View>
          </react_native_1.TouchableHighlight>)}
      </Animate_1.default>);
    };
    endProcess = (pwd) => {
        setTimeout(() => {
            this.setState({ changeScreen: true });
            setTimeout(() => {
                this.props.endProcess(pwd);
            }, 500);
        }, 400);
    };
    async doShake() {
        const duration = 70;
        if (this.props.vibrationEnabled)
            react_native_1.Vibration.vibrate(500, false);
        const length = react_native_1.Dimensions.get("window").width / 3;
        await (0, delay_1.default)(duration);
        this.setState({ moveData: { x: length, y: 0 } });
        await (0, delay_1.default)(duration);
        this.setState({ moveData: { x: -length, y: 0 } });
        await (0, delay_1.default)(duration);
        this.setState({ moveData: { x: length / 2, y: 0 } });
        await (0, delay_1.default)(duration);
        this.setState({ moveData: { x: -length / 2, y: 0 } });
        await (0, delay_1.default)(duration);
        this.setState({ moveData: { x: length / 4, y: 0 } });
        await (0, delay_1.default)(duration);
        this.setState({ moveData: { x: -length / 4, y: 0 } });
        await (0, delay_1.default)(duration);
        this.setState({ moveData: { x: 0, y: 0 } });
        if (this.props.getCurrentLength)
            this.props.getCurrentLength(0);
    }
    async showError(isErrorValidation = false) {
        this.setState({ changeScreen: true });
        await (0, delay_1.default)(300);
        this.setState({ showError: true, changeScreen: false });
        this.doShake();
        await (0, delay_1.default)(3000);
        this.setState({ changeScreen: true });
        await (0, delay_1.default)(200);
        this.setState({ showError: false, password: "" });
        await (0, delay_1.default)(200);
        this.props.endProcess(this.state.password, isErrorValidation);
        if (isErrorValidation)
            this.setState({ changeScreen: false });
    }
    renderCirclePassword = () => {
        const { password, moveData, showError, changeScreen, attemptFailed } = this.state;
        const colorPwdErr = this.props.colorPasswordError;
        const colorPwd = this.props.colorPassword;
        const colorPwdEmp = this.props.colorPasswordEmpty || colorPwd;
        return (<react_native_1.View style={[styles.topViewCirclePassword, this.props.styleCircleHiddenPassword]}>
        {_.range(this.props.passwordLength).map((val) => {
                const lengthSup = ((password.length >= val + 1 && !changeScreen) || showError) &&
                    !attemptFailed;
                return (<Animate_1.default key={val} show={true} start={{
                        opacity: 0.5,
                        height: this._circleSizeEmpty,
                        width: this._circleSizeEmpty,
                        borderRadius: this._circleSizeEmpty / 2,
                        color: colorPwdEmp,
                        marginRight: 10,
                        marginLeft: 10,
                        x: 0,
                        y: 0
                    }} update={{
                        x: [moveData.x],
                        opacity: [lengthSup ? 1 : 0.5],
                        height: [
                            lengthSup ? this._circleSizeFull : this._circleSizeEmpty
                        ],
                        width: [
                            lengthSup ? this._circleSizeFull : this._circleSizeEmpty
                        ],
                        color: [
                            showError
                                ? colorPwdErr
                                : (lengthSup && password.length > 0)
                                    ? colorPwd
                                    : colorPwdEmp
                        ],
                        borderRadius: [
                            lengthSup
                                ? this._circleSizeFull / 2
                                : this._circleSizeEmpty / 2
                        ],
                        marginRight: [
                            lengthSup
                                ? 10 - (this._circleSizeFull - this._circleSizeEmpty) / 2
                                : 10
                        ],
                        marginLeft: [
                            lengthSup
                                ? 10 - (this._circleSizeFull - this._circleSizeEmpty) / 2
                                : 10
                        ],
                        y: [moveData.y],
                        timing: { duration: 200, ease: d3_ease_1.easeLinear }
                    }}>
              {({ opacity, x, height, width, color, borderRadius, marginRight, marginLeft }) => (<react_native_1.View style={styles.viewCircles}>
                    {((!this.props.pinCodeVisible ||
                            (this.props.pinCodeVisible && !lengthSup)) && (<react_native_1.View style={[{
                                    left: x,
                                    height: height,
                                    width: width,
                                    opacity: opacity,
                                    borderRadius: borderRadius,
                                    marginLeft: marginLeft,
                                    marginRight: marginRight,
                                    backgroundColor: color
                                }, this.props.stylePinCodeCircle]}/>)) || (<react_native_1.View style={{
                                left: x,
                                opacity: opacity,
                                marginLeft: marginLeft,
                                marginRight: marginRight
                            }}>
                          <react_native_1.Text style={{
                                color: color,
                                fontFamily: this.props.textPasswordVisibleFamily,
                                fontSize: this.props.textPasswordVisibleSize
                            }}>
                            {this.state.password[val]}
                          </react_native_1.Text>
                        </react_native_1.View>)}
                  </react_native_1.View>)}
            </Animate_1.default>);
            })}
      </react_native_1.View>);
    };
    renderButtonDelete = (opacity) => {
        return (<react_native_1.TouchableHighlight activeOpacity={1} disabled={this.state.password.length === 0} underlayColor="transparent" onHideUnderlay={() => this.setState({
                colorDelete: this.props.styleDeleteButtonColorHideUnderlay
            })} onShowUnderlay={() => this.setState({
                colorDelete: this.props.styleDeleteButtonColorShowUnderlay
            })} onPress={() => {
                if (this.state.password.length > 0) {
                    const newPass = this.state.password.slice(0, -1);
                    this.setState({ password: newPass });
                    if (this.props.getCurrentLength)
                        this.props.getCurrentLength(newPass.length);
                }
            }} accessible accessibilityLabel={this.props.buttonDeleteText}>
        <react_native_1.View style={[styles.colIcon, this.props.styleColumnDeleteButton]}>
          {this.props.customBackSpaceIcon ?
                this.props.customBackSpaceIcon({ colorDelete: this.state.colorDelete, opacity })
                :
                    <>
              {!this.props.iconButtonDeleteDisabled && (<MaterialIcons_1.default name={this.props.styleDeleteButtonIcon} size={this.props.styleDeleteButtonSize} color={this.state.colorDelete} style={{ opacity: opacity }}/>)}
              <react_native_1.Text style={[
                            styles.textDeleteButton,
                            this.props.styleDeleteButtonText,
                            { color: this.state.colorDelete, opacity: opacity }
                        ]}>
                {this.props.buttonDeleteText}
              </react_native_1.Text>
            </>}
        </react_native_1.View>
      </react_native_1.TouchableHighlight>);
    };
    renderTitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
        return (<react_native_1.Text style={[
                styles.textTitle,
                this.props.styleTextTitle,
                { color: colorTitle, opacity: opacityTitle }
            ]}>
        {(attemptFailed && this.props.titleAttemptFailed) ||
                (showError && this.props.titleConfirmFailed) ||
                (showError && this.props.titleValidationFailed) ||
                this.props.sentenceTitle}
      </react_native_1.Text>);
    };
    renderSubtitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
        return (<react_native_1.Text style={[
                styles.textSubtitle,
                this.props.styleTextSubtitle,
                { color: colorTitle, opacity: opacityTitle }
            ]}>
        {attemptFailed || showError
                ? this.props.subtitleError
                : this.props.subtitle}
      </react_native_1.Text>);
    };
    render() {
        const { password, showError, attemptFailed, changeScreen } = this.state;
        return (<react_native_1.View style={[
                styles.container,
                this.props.styleContainer
            ]}>
        <Animate_1.default show={true} start={{
                opacity: 0,
                colorTitle: this.props.styleColorTitle,
                colorSubtitle: this.props.styleColorSubtitle,
                opacityTitle: 1
            }} enter={{
                opacity: [1],
                colorTitle: [
                    this.props.styleColorTitle
                ],
                colorSubtitle: [
                    this.props.styleColorSubtitle
                ],
                opacityTitle: [1],
                timing: { duration: 200, ease: d3_ease_1.easeLinear }
            }} update={{
                opacity: [changeScreen ? 0 : 1],
                colorTitle: [
                    showError || attemptFailed
                        ? this.props.styleColorTitleError
                        : this.props.styleColorTitle
                ],
                colorSubtitle: [
                    showError || attemptFailed
                        ? this.props.styleColorSubtitleError
                        : this.props.styleColorSubtitle
                ],
                opacityTitle: [showError || attemptFailed ? grid_1.grid.highOpacity : 1],
                timing: { duration: 200, ease: d3_ease_1.easeLinear }
            }}>
          {({ opacity, colorTitle, colorSubtitle, opacityTitle }) => (<react_native_1.View style={[
                    styles.viewTitle,
                    this.props.styleViewTitle,
                    { opacity: opacity }
                ]}>
              {this.props.titleComponent
                    ? this.props.titleComponent()
                    : this.renderTitle(colorTitle, opacityTitle, attemptFailed, showError)}
              {this.props.subtitleComponent
                    ? this.props.subtitleComponent()
                    : this.renderSubtitle(colorSubtitle, opacityTitle, attemptFailed, showError)}
            </react_native_1.View>)}
        </Animate_1.default>
        <react_native_1.View style={styles.flexCirclePassword}>
          {this.props.passwordComponent
                ? this.props.passwordComponent()
                : this.renderCirclePassword()}
        </react_native_1.View>
        <react_native_easy_grid_1.Grid style={styles.grid}>
          <react_native_easy_grid_1.Row style={[
                styles.row,
                this.props.styleRowButtons
            ]}>
            {_.range(1, 4).map((i) => {
                return (<react_native_easy_grid_1.Col key={i} style={[
                        styles.colButtonCircle,
                        this.props.styleColumnButtons
                    ]}>
                  {this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())}
                </react_native_easy_grid_1.Col>);
            })}
          </react_native_easy_grid_1.Row>
          <react_native_easy_grid_1.Row style={[
                styles.row,
                this.props.styleRowButtons
            ]}>
            {_.range(4, 7).map((i) => {
                return (<react_native_easy_grid_1.Col key={i} style={[
                        styles.colButtonCircle,
                        this.props.styleColumnButtons
                    ]}>
                  {this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())}
                </react_native_easy_grid_1.Col>);
            })}
          </react_native_easy_grid_1.Row>
          <react_native_easy_grid_1.Row style={[
                styles.row,
                this.props.styleRowButtons
            ]}>
            {_.range(7, 10).map((i) => {
                return (<react_native_easy_grid_1.Col key={i} style={[
                        styles.colButtonCircle,
                        this.props.styleColumnButtons
                    ]}>
                  {this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())}
                </react_native_easy_grid_1.Col>);
            })}
          </react_native_easy_grid_1.Row>
          <react_native_easy_grid_1.Row style={[
                styles.row,
                styles.rowWithEmpty,
                this.props.styleRowButtons
            ]}>
            <react_native_easy_grid_1.Col style={[
                styles.colEmpty,
                this.props.styleEmptyColumn
            ]}>
              {this.props.emptyColumnComponent
                ? this.props.emptyColumnComponent(this.props.launchTouchID)
                : null}
            </react_native_easy_grid_1.Col>
            <react_native_easy_grid_1.Col style={[
                styles.colButtonCircle,
                this.props.styleColumnButtons
            ]}>
              {this.props.buttonNumberComponent
                ? this.props.buttonNumberComponent("0", this.onPressButtonNumber)
                : this.renderButtonNumber("0")}
            </react_native_easy_grid_1.Col>
            <react_native_easy_grid_1.Col style={[
                styles.colButtonCircle,
                this.props.styleColumnButtons
            ]}>
              <Animate_1.default show={true} start={{
                opacity: 0.5
            }} update={{
                opacity: [
                    password.length === 0 ||
                        password.length === this.props.passwordLength
                        ? 0.5
                        : 1
                ],
                timing: { duration: 400, ease: d3_ease_1.easeLinear }
            }}>
                {({ opacity }) => this.props.buttonDeleteComponent
                ? this.props.buttonDeleteComponent(() => {
                    if (this.state.password.length > 0) {
                        const newPass = this.state.password.slice(0, -1);
                        this.setState({ password: newPass });
                        if (this.props.getCurrentLength)
                            this.props.getCurrentLength(newPass.length);
                    }
                })
                : this.renderButtonDelete(opacity)}
              </Animate_1.default>
            </react_native_easy_grid_1.Col>
          </react_native_easy_grid_1.Row>
        </react_native_easy_grid_1.Grid>
      </react_native_1.View>);
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    viewTitle: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 2
    },
    row: {
        flex: 0,
        flexShrink: 1,
        alignItems: "center",
        height: grid_1.grid.unit * 5.5
    },
    rowWithEmpty: {
        flexShrink: 0,
        justifyContent: 'flex-end',
    },
    colButtonCircle: {
        flex: 0,
        marginLeft: grid_1.grid.unit / 2,
        marginRight: grid_1.grid.unit / 2,
        alignItems: "center",
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4
    },
    colEmpty: {
        flex: 0,
        marginLeft: grid_1.grid.unit / 2,
        marginRight: grid_1.grid.unit / 2,
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4
    },
    colIcon: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    text: {
        fontSize: grid_1.grid.unit * 2,
        fontWeight: "200"
    },
    tinytext: {
        fontSize: grid_1.grid.unit / 2,
        fontWeight: "300"
    },
    buttonCircle: {
        alignItems: "center",
        justifyContent: "center",
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4,
        backgroundColor: "rgb(242, 245, 251)",
        borderRadius: grid_1.grid.unit * 2
    },
    textTitle: {
        fontSize: 20,
        fontWeight: "200",
        lineHeight: grid_1.grid.unit * 2.5
    },
    textSubtitle: {
        fontSize: grid_1.grid.unit,
        fontWeight: "200",
        textAlign: "center"
    },
    flexCirclePassword: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    topViewCirclePassword: {
        flexDirection: "row",
        height: "auto",
        justifyContent: "center",
        alignItems: "center"
    },
    viewCircles: {
        justifyContent: "center",
        alignItems: "center"
    },
    textDeleteButton: {
        fontWeight: "200",
        marginTop: 5
    },
    grid: {
        justifyContent: 'flex-start',
        width: "100%",
        flex: 7
    }
});
exports.default = PinCode;
