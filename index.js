import React, {
    Component,
  } from 'react';
  
  import {
    FlatList,
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    ActivityIndicator,
    Image
  } from 'react-native';
  
  import { Icon } from "native-base";
  import PropTypes from 'prop-types';
  
  const TOUCHABLE_ELEMENTS = [
    'TouchableHighlight',
    'TouchableOpacity',
    'TouchableWithoutFeedback',
    'TouchableNativeFeedback'
  ];
  
  export default class PickerWIcon extends Component {
    static propTypes = {
      disabled: PropTypes.bool,
      scrollEnabled: PropTypes.bool,
      defaultIndex: PropTypes.number,
      defaultValue: PropTypes.string,
      options: PropTypes.array,
  
      accessible: PropTypes.bool,
      animated: PropTypes.bool,
      localImage: PropTypes.bool,
      showItemSeparator: PropTypes.bool,
      showsVerticalScrollIndicator: PropTypes.bool,
      showsVerticalScrollIndicator: PropTypes.bool,
      keyboardShouldPersistTaps: PropTypes.string,
  
      style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
      textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
      dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
      iconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
      dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
      dropdownTextHighlightStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  
      adjustFrame: PropTypes.func,
      renderRow: PropTypes.func,
      renderSeparator: PropTypes.func,
      renderButtonText: PropTypes.func,
  
      onDropdownWillShow: PropTypes.func,
      onDropdownWillHide: PropTypes.func,
      onSelect: PropTypes.func
    };
  
    static defaultProps = {
      disabled: false,
      scrollEnabled: true,
      defaultIndex: -1,
      defaultValue: 'Please select...',
      options: null,
      animated: true,
      localImage: true,
      showItemSeparator: false,
      showsVerticalScrollIndicator: false,
      keyboardShouldPersistTaps: 'never'
    };
  
    constructor(props) {
      super(props);
  
      this._button = null;
      this._buttonFrame = null;
      this._nextValue = null;
      this._nextIndex = null;
  
      this.state = {
        accessible: !!props.accessible,
        loading: !props.options,
        showDropdown: false,
        buttonText: props.defaultValue,
        selectedIndex: props.defaultIndex,
        selectedObject: props.defaultValue
      };
    }
  
    componentWillReceiveProps(nextProps) {
      let {buttonText, selectedIndex} = this.state;
      const {defaultIndex, defaultValue, options} = nextProps;
      buttonText = this._nextValue == null ? buttonText : this._nextValue;
      selectedIndex = this._nextIndex == null ? selectedIndex : this._nextIndex;
      if (selectedIndex < 0) {
        selectedIndex = defaultIndex;
        if (selectedIndex < 0) {
          buttonText = defaultValue;
        }
      }
      this._nextValue = null;
      this._nextIndex = null;
  
      this.setState({
        loading: !options,
        buttonText,
        selectedIndex
      });
    }
  
    render () {
      return (
        <View {...this.props}>
          {this._renderButton()}
          {this._renderModal()}
        </View>
      );
    }
  
    _updatePosition(callback) {
      if (this._button && this._button.measure) {
        this._button.measure((fx, fy, width, height, px, py) => {
          this._buttonFrame = {x: px, y: py, w: width, h: height};
          callback && callback();
        });
      }
    }
  
    show() {
      this._updatePosition(() => {
        this.setState({
          showDropdown: true
        });
      });
    }
  
    hide() {
      this.setState({
        showDropdown: false
      });
    }
  
    select(idx) {
      const {defaultValue, options, defaultIndex, renderButtonText} = this.props;
  
      let value = defaultValue;
      if (idx == null || !options || idx >= options.length) {
        idx = defaultIndex;
      }
  
      if (idx >= 0) {
        value = renderButtonText ? renderButtonText(options[idx]) : options[idx].toString();
      }
  
      this._nextValue = value;
      this._nextIndex = idx;
  
      this.setState({
        buttonText: value,
        selectedIndex: idx
      });
    }
  
    _renderButton() {
      const {localImage, disabled, accessible, children, textStyle, dropDownIcon, labelKey, iconKey, labelPrefix, pickerIconStyle, iconStyle} = this.props;
      const {buttonText, selectedObject} = this.state;

      return (
        <TouchableOpacity ref={button => this._button = button}
          disabled={disabled}
          accessible={accessible}
          onPress={this._onButtonPress}
        >
          {
            children ||
            (
              <View style={styles.button}>
                <Image
                  source={localImage ? selectedObject[iconKey] : { uri: selectedObject[iconKey] }}
                  style={[styles.iconStyle, iconStyle]}
                />
                <Text style={[styles.buttonText, textStyle]} numberOfLines={1}>
                  {labelPrefix}{selectedObject[labelKey]}
                </Text>
                {
                  dropDownIcon || 
                  <Icon
                    name="md-caret-down"
                    style={pickerIconStyle || styles.pickerIcon}
                  />
                }
              </View>
            )
          }
        </TouchableOpacity>
      );
    }
  
    _onButtonPress = () => {
      const {onDropdownWillShow} = this.props;
      if (!onDropdownWillShow ||
        onDropdownWillShow() !== false) {
        this.show();
      }
    };
  
    _renderModal() {
      const {animated, accessible, dropdownStyle} = this.props;
      const {showDropdown, loading} = this.state;
      if (showDropdown && this._buttonFrame) {
        const frameStyle = this._calcPosition();
        const animationType = animated ? 'fade' : 'none';
        return (
          <Modal
            animationType={animationType}
            visible
            transparent
            onRequestClose={this._onRequestClose}
            supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
          >
            <TouchableWithoutFeedback accessible={accessible}
              disabled={!showDropdown}
              onPress={this._onModalPress}
            >
              <View style={styles.modal}>
                <View style={[styles.dropdown, dropdownStyle, frameStyle]}>
                  {loading ? this._renderLoading() : this._renderDropdown()}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        );
      }
    }
  
    _calcPosition() {
      const {dropdownStyle, style, adjustFrame} = this.props;
  
      const dimensions = Dimensions.get('window');
      const windowWidth = dimensions.width;
      const windowHeight = dimensions.height;
  
      const dropdownHeight = (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
        StyleSheet.flatten(styles.dropdown).height;
  
      const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
      const rightSpace = windowWidth - this._buttonFrame.x;
      const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
      const showInLeft = rightSpace >= this._buttonFrame.x;
  
      const positionStyle = {
        height: dropdownHeight,
        top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
      };
  
      if (showInLeft) {
        positionStyle.left = this._buttonFrame.x;
      } else {
        const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
          (style && StyleSheet.flatten(style).width) || -1;
        if (dropdownWidth !== -1) {
          positionStyle.width = dropdownWidth;
        }
        positionStyle.right = rightSpace - this._buttonFrame.w;
      }
  
      return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
    }
  
    _onRequestClose = () => {
      const {onDropdownWillHide} = this.props;
      if (!onDropdownWillHide ||
        onDropdownWillHide() !== false) {
        this.hide();
      }
    };
  
    _onModalPress = () => {
      const {onDropdownWillHide} = this.props;
      if (!onDropdownWillHide ||
        onDropdownWillHide() !== false) {
        this.hide();
      }
    };
  
    _renderLoading() {
      return (
        <ActivityIndicator size='small'/>
      );
    }
  
    _renderDropdown() {
      const {scrollEnabled, showsVerticalScrollIndicator, keyboardShouldPersistTaps, options, showItemSeparator} = this.props;
      const Separator = <View style={styles.separator} />
      return (
        <FlatList
          scrollEnabled={scrollEnabled}
          style={styles.list}
          // dataSource={this._dataSource}
          ItemSeparatorComponent={ showItemSeparator ? this._renderSeparator : null}
          data={options}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderRow}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        />
      );
    }
  
    _keyExtractor = (item, index) => `${index}`
  
    _renderRow = ({item: rowData, index: rowID, separators}) => {
      const {renderRow, dropdownTextStyle, dropdownTextHighlightStyle, accessible} = this.props;
      const {selectedIndex} = this.state;
      const key = `row_${rowID}`;
      const highlighted = rowID == selectedIndex;
      const row = !renderRow ?
        (<Text style={[
          styles.rowText,
          dropdownTextStyle,
          highlighted && styles.highlightedRowText,
          highlighted && dropdownTextHighlightStyle
        ]}
        >
          {rowData}
        </Text>) :
        renderRow(rowData, rowID, highlighted);
      const preservedProps = {
        key,
        accessible,
        onPress: () => this._onRowPress(rowData, rowID),
      };
      if (TOUCHABLE_ELEMENTS.find(name => name == row.type.displayName)) {
        const props = {...row.props};
        props.key = preservedProps.key;
        props.onPress = preservedProps.onPress;
        const {children} = row.props;
        switch (row.type.displayName) {
          case 'TouchableHighlight': {
            return (
              <TouchableHighlight {...props}>
                {children}
              </TouchableHighlight>
            );
          }
          case 'TouchableOpacity': {
            return (
              <TouchableOpacity {...props}>
                {children}
              </TouchableOpacity>
            );
          }
          case 'TouchableWithoutFeedback': {
            return (
              <TouchableWithoutFeedback {...props}>
                {children}
              </TouchableWithoutFeedback>
            );
          }
          case 'TouchableNativeFeedback': {
            return (
              <TouchableNativeFeedback {...props}>
                {children}
              </TouchableNativeFeedback>
            );
          }
          default:
            break;
        }
      }
      return (
        <TouchableHighlight {...preservedProps}>
          {row}
        </TouchableHighlight>
      );
    };
  
    _onRowPress(rowData, rowID) {
      const {onSelect, renderButtonText, onDropdownWillHide} = this.props;
      if (!onSelect || onSelect(rowID, rowData) !== false) {
        const value = renderButtonText && renderButtonText(rowData) || rowData;
        this._nextValue = value;
        this._nextIndex = rowID;
        this._nextObject = {};
        this.setState({
          selectedObject: value,
          selectedIndex: rowID
        });
      }
      if (!onDropdownWillHide || onDropdownWillHide() !== false) {
        this.setState({
          showDropdown: false
        });
      }
    }
  
    _renderSeparator = () => {
      return <View style={styles.separator} />
    };
  }
  
  const styles = StyleSheet.create({
    pickerIcon: {
      color: 'grey',
      width: 23,
      height: 28
    },
    iconStyle: {
      width: 30,
      height: 30
    },
    button: {
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexDirection: 'row',
      height: 50
    },
    buttonText: {
      fontSize: 16,
      color: 'white'
    },
    modal: {
      flexGrow: 1
    },
    dropdown: {
      position: 'absolute',
      borderWidth: StyleSheet.hairlineWidth,
    },
    loading: {
      alignSelf: 'center'
    },
    list: {
      //flexGrow: 1,
    },
    rowText: {
      paddingHorizontal: 6,
      paddingVertical: 10,
      fontSize: 11,
      color: 'gray',
      backgroundColor: 'blue',
      textAlignVertical: 'center'
    },
    highlightedRowText: {
      color: 'black'
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: 'lightgray'
    }
  });